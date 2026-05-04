import styles from "./Partners.module.css";
export const PartnerTab = () => {
  return (
    <div className={styles.partnerTab}>
      <h2 style={{ marginBottom: "1rem" }}>Tərəfdaşlar</h2>
      <p style={{ color: "var(--text-secondary)" }}>
        Loyallıq proqramı ilə bağlı əsas göstəricilər və tənzimləmələr burada əks olunacaq.
      </p>
    </div>
  );
};
