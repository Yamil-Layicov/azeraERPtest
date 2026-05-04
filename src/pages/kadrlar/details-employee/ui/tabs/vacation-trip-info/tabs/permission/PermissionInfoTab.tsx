
import { useState } from "react";
import { toast } from "react-hot-toast";
import styles from "./PermissionInfoTab.module.css";
import { PermissionForm } from "./form";
import { PermissionTable } from "./table";
import type { PermissionItem } from "./types";

export const PermissionInfoTab = () => {
    const [list, setList] = useState<PermissionItem[]>([]);

    const handleAdd = (newItem: PermissionItem) => {
        setList([...list, newItem]);
        toast.success("İcazə əlavə edildi");
    };

    const handleDelete = (id: string) => {
        setList(list.filter(item => item.id !== id));
        toast.success("Silindi");
    };

    return (
        <div className={styles.container}>
            <PermissionForm onSubmit={handleAdd} />
            <PermissionTable 
                data={list} 
                onDelete={handleDelete} 
            />
        </div>
    );
};
