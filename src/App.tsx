import styles from './App.module.scss';
import { FeatureShowcase } from './components/FeatureShowcase';

export function App() {
  return (
    <main className={styles.main}>
      <FeatureShowcase />
    </main>
  );
}
