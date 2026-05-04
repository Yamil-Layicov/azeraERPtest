import React from "react";
import { FaBriefcase, FaBuilding, FaUserTie, FaUserNurse } from "react-icons/fa6";
import styles from "./EmploymentTypeCards.module.css";

interface ExperienceValue {
  year: number;
  month: number;
  day: number;
}

interface SummaryData {
  totalExperienceYears: ExperienceValue;
  holdingExperienceYears: ExperienceValue;
  lastJobExperienceYears: ExperienceValue;
  medicalExperienceYears: ExperienceValue;
}

interface EmploymentTypeCardsProps {
  data?: SummaryData;
}

const formatExperience = (val?: ExperienceValue): string => {
  if (!val) return "0 gün";
  const parts: string[] = [];
  if (val.year > 0) parts.push(`${val.year} il`);
  if (val.month > 0) parts.push(`${val.month} ay`);
  if (val.day > 0 || parts.length === 0) parts.push(`${val.day} gün`);
  return parts.join(" ");
};

export const EmploymentTypeCards: React.FC<EmploymentTypeCardsProps> = ({ data }) => {
  const cards = [
    {
      id: "total",
      title: "Ümumi iş stajı",
      description: formatExperience(data?.totalExperienceYears),
      icon: <FaBriefcase />,
    },
    {
      id: "holding",
      title: "Holdingdə/BV-də iş stajı",
      description: formatExperience(data?.holdingExperienceYears),
      icon: <FaBuilding />,
    },
    {
      id: "lastJob",
      title: "Son iş yerində iş stajı",
      description: formatExperience(data?.lastJobExperienceYears),
      icon: <FaUserTie />,
    },
    {
      id: "medical",
      title: "Tibbi staj",
      description: formatExperience(data?.medicalExperienceYears),
      icon: <FaUserNurse />,
    },
  ];

  return (
    <div className={styles.row}>
      {cards.map((item) => (
        <div key={item.id} className={styles.card}>
          <div className={styles.cardContent}>
            <h4 className={styles.cardTitle}>{item.title}</h4>
            <p className={styles.cardDescription}>{item.description}</p>
          </div>
          <div className={styles.cardIcon}>{item.icon}</div>
        </div>
      ))}
    </div>
  );
};
