import { useState } from "react";
import { toast } from "react-hot-toast";
import styles from "./PrivilegesTab.module.css";
import { PrivilegesForm } from "./form";
import { PrivilegesTable } from "./table";
import type { PrivilegeItem } from "./types";

export const PrivilegesTab = () => {
    const [list, setList] = useState<PrivilegeItem[]>([]);

    const handleAdd = (newItem: PrivilegeItem) => {
        setList((prev) => [...prev, newItem]);
        toast.success("Əlavə edildi");
    };

    const handleDelete = (id: string) => {
        setList((prev) => prev.filter((item) => item.id !== id));
        toast.success("Silindi");
    };

    return (
        <div className={styles.container}>
            <PrivilegesForm onSubmit={handleAdd} />
            <PrivilegesTable data={list} onDelete={handleDelete} />
        </div>
    );
};
