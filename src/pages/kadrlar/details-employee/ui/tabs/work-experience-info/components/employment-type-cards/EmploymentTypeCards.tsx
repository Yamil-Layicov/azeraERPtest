import React from "react";
import {
  BriefcaseIcon,
  BuildingOffice2Icon,
  ChartBarIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import styles from "./EmploymentTypeCards.module.css";

export interface EmploymentTypeCardItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const defaultCards: EmploymentTypeCardItem[] = [
  {
    id: "1",
    title: "Ümumi iş stajı",
    description: "6 il 5 ay 9 gün",
    icon: <BriefcaseIcon />,
  },
  {
    id: "2",
    title: "Holdingdə/BV-də iş stajı",
    description: "2 il 1 ay 7 gün",
    icon: <BuildingOffice2Icon />,
  },
  {
    id: "3",
    title: "Son iş yerində iş stajı",
    description: "5 ay 15 gün",
    icon: <ChartBarIcon />,
  },
  {
    id: "4",
    title: "Tibbi staj",
    description: "0 gün",
    icon: <ClockIcon />,
  },
];

interface EmploymentTypeCardsProps {
  items?: EmploymentTypeCardItem[];
}

export const EmploymentTypeCards: React.FC<EmploymentTypeCardsProps> = ({
  items = defaultCards,
}) => {
  return (
    <div className={styles.row}>
      {items.map((item) => (
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
