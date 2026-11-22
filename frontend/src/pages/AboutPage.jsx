import styles from "./AboutPage.module.css";

// A static page that describes the app
export default function AboutPage() {
  return (
    <section className={`panel surface ${styles.about}`}>
      <h2 className="section-title">About CarLog</h2>
      <p>
        CarLog keeps track of the deadlines and services of your cars: ITP, RCA
        insurance, road tax and service work. It shows what expires next and what
        is already done, built step by step during the semester for the Web
        Technologies project.
      </p>
      <p>Stack: React, Vite, React Router, json-server (later Node.js, Express, MariaDB, Docker).</p>
    </section>
  );
}
