import { useState } from "react";
import { toast } from "react-hot-toast";
import styles from "./SickLeaveTab.module.css";
import { SickLeaveForm } from "./form";
import { SickLeaveTable } from "./table";
import type { SickLeaveItem } from "./types";

export const SickLeaveTab = () => {
    const [list, setList] = useState<SickLeaveItem[]>([]);

    const handleAdd = (newItem: SickLeaveItem) => {
        setList((prev) => [...prev, newItem]);
        toast.success("Əlavə edildi");
    };

    const handleDelete = (id: string) => {
        setList((prev) => prev.filter((item) => item.id !== id));
        toast.success("Silindi");
    };

    return (
        <div className={styles.container}>
            <SickLeaveForm onSubmit={handleAdd} />
            <SickLeaveTable data={list} onDelete={handleDelete} />
        </div>
    );
};
