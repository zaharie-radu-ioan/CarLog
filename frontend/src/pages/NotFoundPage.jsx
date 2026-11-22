import { Link } from "react-router-dom";
import styles from "./NotFoundPage.module.css";

// Any address that matched no other route ends up here (path="*")
export default function NotFoundPage() {
  return (
    <section className={`panel surface ${styles.notFound}`} data-testid="not-found">
      <p className={styles.code}>404</p>
      <h2 className="section-title">This page does not exist</h2>
      <p className={styles.text}>The address you opened does not lead anywhere.</p>
      <Link to="/">Back to my deadlines</Link>
    </section>
  );
}
