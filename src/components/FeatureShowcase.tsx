import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from 'react';

import { features, type Overlay } from '../data/features';
import styles from './FeatureShowcase.module.scss';

/** Must match `$fade-out-duration` in FeatureShowcase.module.scss */
const FADE_OUT_MS = 300;

/** Ring geometry in the 56×56 viewBox, stroke sits on the circle's border */
const RING_RADIUS = 27.25;
const RING_LENGTH = 2 * Math.PI * RING_RADIUS;

/**
 * Phone artwork size that overlay coordinates are measured against.
 * Must match `$phone-width` and `$phone-height` in FeatureShowcase.module.scss
 */
const PHONE_WIDTH = 366;
const PHONE_HEIGHT = 483;

const percent = (value: number) => `${value * 100}%`;

/** Shift (of the phone width) that centres the phone and its overlays together */
function centreShift(overlays: Overlay[]) {
  const left = Math.min(0, ...overlays.map((overlay) => overlay.x));
  const right = Math.max(
    PHONE_WIDTH,
    ...overlays.map((overlay) => overlay.x + overlay.width),
  );
  return percent((PHONE_WIDTH - left - right) / 2 / PHONE_WIDTH);
}

/** Animation length in `$overlay-duration` steps */
const overlaySteps = (overlay: Overlay) => (overlay.via ? 2 : 1);

/** Each overlay starts once the previous ones have finished */
function overlayStarts(overlays: Overlay[]) {
  let start = 0;
  return overlays.map((overlay) => {
    const current = start;
    start += overlaySteps(overlay);
    return current;
  });
}

/** Positions relative to the phone so overlays scale with it */
function overlayStyle(overlay: Overlay, start: number) {
  const { x, y, width, height, via } = overlay;

  return {
    left: percent(x / PHONE_WIDTH),
    top: percent(y / PHONE_HEIGHT),
    width: percent(width / PHONE_WIDTH),
    height: percent(height / PHONE_HEIGHT),
    // Starts centred on the phone, just below its bottom edge
    '--from-x': percent((PHONE_WIDTH / 2 - x - width / 2) / width),
    '--from-y': percent((PHONE_HEIGHT - y) / height),
    '--start': start,
    '--steps': overlaySteps(overlay),
    ...(via && {
      '--via-x': percent((via.x - x) / width),
      '--via-y': percent((via.y - y) / height),
      '--via-scale': via.width / width,
    }),
  } as CSSProperties;
}

export function FeatureShowcase() {
  // The tab switches immediately, the panel follows once the old content has faded out
  const [activeIndex, setActiveIndex] = useState(0);
  const [shownIndex, setShownIndex] = useState(0);
  const isLeaving = activeIndex !== shownIndex;

  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const id = useId();
  const panelId = `${id}-panel`;
  const tabId = (index: number) => `${id}-tab-${index}`;

  useEffect(() => {
    if (!isLeaving) return undefined;

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    const timer = window.setTimeout(
      () => setShownIndex(activeIndex),
      reduceMotion ? 0 : FADE_OUT_MS,
    );

    return () => window.clearTimeout(timer);
  }, [activeIndex, isLeaving]);

  const selectTab = (index: number) => {
    setActiveIndex(index);
    tabRefs.current[index]?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'nearest',
    });
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const lastIndex = features.length - 1;
    let nextIndex: number;

    switch (event.key) {
      case 'ArrowRight':
        nextIndex = activeIndex === lastIndex ? 0 : activeIndex + 1;
        break;
      case 'ArrowLeft':
        nextIndex = activeIndex === 0 ? lastIndex : activeIndex - 1;
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = lastIndex;
        break;
      default:
        return;
    }

    event.preventDefault();
    selectTab(nextIndex);
    tabRefs.current[nextIndex]?.focus();
  };

  const shown = features[shownIndex];
  const overlays = shown.overlays ?? [];
  const starts = overlayStarts(overlays);

  return (
    <section className={styles.showcase} aria-label="App features">
      <div className={styles.stage}>
        {/* Keyed so the entrance animations replay for every tab */}
        <div
          key={shown.id}
          id={panelId}
          role="tabpanel"
          aria-labelledby={tabId(shownIndex)}
          className={`${styles.panel} ${isLeaving ? styles.isLeaving : ''}`}
        >
          {/*
            Every tab's text shares one grid cell and only the shown one is
            visible, so the longest text sets the height and the phone and
            tabs below stay in place on every tab
          */}
          <div className={styles.content}>
            {features.map((feature, index) => {
              const isShown = index === shownIndex;

              return (
                <div
                  key={feature.id}
                  className={`${styles.contentItem} ${isShown ? '' : styles.isHidden}`}
                  aria-hidden={isShown ? undefined : true}
                >
                  <p className={styles.eyebrow}>{feature.eyebrow}</p>
                  <h2 className={styles.title}>{feature.title}</h2>
                  <p className={styles.description}>{feature.description}</p>
                  <a className={styles.btnLearn} href={feature.link}>
                    Learn More
                  </a>
                </div>
              );
            })}
          </div>

          <div
            className={styles.device}
            style={{ '--centre-shift': centreShift(overlays) } as CSSProperties}
          >
            <img
              className={styles.phone}
              src={shown.image}
              alt={shown.imageAlt}
            />
            {overlays.map((overlay, index) => (
              <span
                key={index}
                className={[
                  styles.overlay,
                  overlay.effect === 'fade' && styles.fades,
                  overlay.via && styles.settles,
                  overlay.shadow && styles.hasShadow,
                ]
                  .filter(Boolean)
                  .join(' ')}
                style={overlayStyle(overlay, starts[index])}
              >
                <img
                  className={styles.overlayImage}
                  src={overlay.image}
                  alt=""
                  width={overlay.width}
                  height={overlay.height}
                />
              </span>
            ))}
          </div>
        </div>
      </div>

      <div
        className={styles.tabs}
        role="tablist"
        aria-label="Features"
        onKeyDown={handleKeyDown}
      >
        {features.map((feature, index) => {
          const isActive = index === activeIndex;

          return (
            <button
              key={feature.id}
              ref={(element) => {
                tabRefs.current[index] = element;
              }}
              id={tabId(index)}
              className={`${styles.tab} ${isActive ? styles.isActive : ''}`}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={panelId}
              tabIndex={isActive ? 0 : -1}
              onClick={() => selectTab(index)}
            >
              <span className={styles.tabIcon}>
                {isActive && (
                  <svg
                    className={styles.ring}
                    viewBox="0 0 56 56"
                    aria-hidden="true"
                  >
                    <circle
                      cx="28"
                      cy="28"
                      r={RING_RADIUS}
                      strokeDasharray={RING_LENGTH}
                      strokeDashoffset={RING_LENGTH}
                    />
                  </svg>
                )}
                <span
                  className={styles.glyph}
                  style={{ '--icon': `url(${feature.icon})` } as CSSProperties}
                />
              </span>
              <span className={styles.tabLabel}>{feature.label}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
