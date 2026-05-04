import styles from "./News.module.css";
export const NewsTab = () => {
  return (
    <div className={styles.newsTab}>
      <h2 style={{ marginBottom: "1rem" }}>Xəbərlər</h2>
      <p style={{ color: "var(--text-secondary)" }}>
        Loyallıq proqramı ilə bağlı əsas göstəricilər və tənzimləmələr burada əks olunacaq.
      </p>
    </div>
  );
};
