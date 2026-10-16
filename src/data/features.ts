import arrow from '../assets/arrow.png';
import barBrightness from '../assets/bar-brightness.png';
import barContrast from '../assets/bar-contrast.png';
import filePreview from '../assets/file-preview.png';
import iconAdvancedFilters from '../assets/icon-advanced-filters.svg';
import iconBatchScanning from '../assets/icon-batch-scanning.svg';
import iconDocumentScanner from '../assets/icon-document-scanner.svg';
import iconExportShare from '../assets/icon-export-share.svg';
import iconSignStamp from '../assets/icon-sign-stamp.svg';
import fileJpg from '../assets/jpg.png';
import mobileAdvancedFilters from '../assets/mobile-advaned-filters.png';
import mobileBatchScanning from '../assets/mobile-batch-scanning.png';
import mobileDocumentScanner from '../assets/mobile-document-scanner.png';
import mobileExportShare from '../assets/mobile-export-share.png';
import mobileSignatureStamp from '../assets/mobile-signature-stamp.png';
import filePdf from '../assets/pdf.png';
import signature from '../assets/signature.png';
import stamp from '../assets/stamp.png';
import fileTxt from '../assets/txt.png';

/**
 * Artwork placed over the phone, animated in one by one after the phone has
 * risen. Measured in px of the 366×483 phone artwork, it scales with the phone.
 * The image covers its box, cropping like `object-fit: cover`.
 */
export interface Overlay {
  image: string;
  x: number;
  y: number;
  width: number;
  height: number;
  /** Flies in from the phone's bottom centre (default) or fades in in place */
  effect?: 'fly' | 'fade';
  /** Soft shadow for artwork exported without one */
  shadow?: boolean;
  /**
   * Rises straight into this box first, then scales down into its own place.
   * Same aspect ratio as the overlay; takes two animation steps.
   */
  via?: { x: number; y: number; width: number };
}

export interface Feature {
  id: string;
  /** Tab label */
  label: string;
  /** Single-colour SVG, recoloured via CSS mask */
  icon: string;
  image: string;
  imageAlt: string;
  /** Rendered uppercase */
  eyebrow: string;
  title: string;
  description: string;
  link: string;
  /** In animation order */
  overlays?: Overlay[];
}

export const features: Feature[] = [
  {
    id: 'document-scanner',
    label: 'Document Scanner',
    icon: iconDocumentScanner,
    image: mobileDocumentScanner,
    imageAlt: 'Document scanner',
    eyebrow: 'Document Scanner',
    title: 'Scan with Ease',
    description:
      'Scan any document instantly with your mobile device by just a few steps. Save as PDF,JPG,ZIP,TXT and Word format.',
    link: '#',
  },
  {
    id: 'sign-stamp',
    label: 'Sign & Stamp',
    icon: iconSignStamp,
    image: mobileSignatureStamp,
    imageAlt: 'Signature and stamp',
    eyebrow: 'Sign & Stamp',
    title: 'One-Tap Focus',
    description:
      'Draw, scan or import your signature and stamp with a simple touch. Sign and stamp any document with just a single tap!',
    link: '#',
    overlays: [
      {
        image: signature,
        x: -100,
        y: 247,
        width: 222,
        height: 147,
        effect: 'fade',
      },
      {
        image: stamp,
        x: 233,
        y: 138,
        width: 221,
        height: 185,
        effect: 'fade',
      },
    ],
  },
  {
    id: 'batch-scanning',
    label: 'Batch Scanning',
    icon: iconBatchScanning,
    image: mobileBatchScanning,
    imageAlt: 'Batch scanning',
    eyebrow: 'Batch Scanning',
    title: 'Multiple Page Scan',
    description:
      'Scan multiple pages or documents in multiple-scanning mode. Batch all scans as a single document.',
    link: '#',
    // Pages back to front, each lands on top of the previous one. Heights keep
    // the 291×342 artwork's shape, which ends at the bottom of the phone.
    overlays: [
      {
        image: filePreview,
        x: 60.5,
        y: 116.5,
        width: 246.5,
        height: 289.7,
        shadow: true,
        // Arrives as the front page, then moves back
        via: { x: 38.5, y: 142, width: 290 },
      },
      {
        image: filePreview,
        x: 47.5,
        y: 128,
        width: 273,
        height: 320.8,
        shadow: true,
      },
      {
        image: filePreview,
        x: 38.5,
        y: 142,
        width: 290,
        height: 340.8,
        shadow: true,
      },
    ],
  },
  {
    id: 'advanced-filters',
    label: 'Advanced Filters',
    icon: iconAdvancedFilters,
    image: mobileAdvancedFilters,
    imageAlt: 'Advanced filters',
    eyebrow: 'Advanced Filters',
    title: 'Unique Filters',
    description:
      'Apply advanced filters and enhance quality with various custom made filters. Manually edit brightness and contrast by your own choice on the custom filters.',
    link: '#',
    overlays: [
      {
        image: barBrightness,
        x: -29,
        y: 109,
        width: 43,
        height: 360,
        effect: 'fade',
      },
      {
        image: barContrast,
        x: 349.5,
        y: 109,
        width: 43,
        height: 360,
        effect: 'fade',
      },
    ],
  },
  {
    id: 'export-share',
    label: 'Export & Share',
    icon: iconExportShare,
    image: mobileExportShare,
    imageAlt: 'Export and share',
    eyebrow: 'Export & Share',
    title: 'All-Round Conversion',
    description: 'Export your scans as PDF,JPG,ZIP,TXT and Word.',
    link: '#',
    overlays: [
      { image: arrow, x: -31, y: 413, width: 24, height: 34 },
      { image: filePdf, x: -27, y: 291, width: 160, height: 181 },
      { image: fileJpg, x: 113, y: 278, width: 130, height: 156 },
      { image: fileTxt, x: 237, y: 291, width: 159, height: 186 },
    ],
  },
];
