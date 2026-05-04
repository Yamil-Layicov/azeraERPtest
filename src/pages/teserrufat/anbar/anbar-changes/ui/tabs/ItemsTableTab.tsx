import React from "react";
import styles from "../AnbarChanges.module.css";
import { CustomSelect, FormInput,  } from "@/shared/ui";
import { HiOutlineTrash, HiOutlinePlus } from "react-icons/hi";
import type { AnbarChangeItem } from "../../model/types";

interface ItemsTableTabProps {
  items: AnbarChangeItem[];
  setItems: React.Dispatch<React.SetStateAction<AnbarChangeItem[]>>;
}

const ItemsTableTab: React.FC<ItemsTableTabProps> = ({ items, setItems }) => {
  const handleAddItem = () => {
    const newItem: AnbarChangeItem = {
      id: Math.random().toString(36).substr(2, 9),
      nomenklatura: null,
      systemQuantity: 0,
      actualQuantity: 0,
      difference: 0,
    };
    setItems([...items, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleItemChange = (id: string, field: keyof AnbarChangeItem, value: any) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          
          if (field === "nomenklatura" && value) {
             updatedItem.systemQuantity = Math.floor(Math.random() * 100);
          }
          if (field === "actualQuantity" || field === "nomenklatura") {
            updatedItem.difference = updatedItem.systemQuantity - updatedItem.actualQuantity;
          }
           
          return updatedItem;
        }
        return item;
      })
    );
  };

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th style={{ width: "40%" }}>Nomenklatura</th>
            <th style={{ width: "15%" }}>Sistem Miqdarı</th>
            <th style={{ width: "15%" }}>Faktiki Sayım</th>
            <th style={{ width: "15%" }}>Fərq</th>
            <th style={{ width: "10%", textAlign: "center" }}>Əməliyyat</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>
                <label className={styles.label}>Nomenklatura</label>
                <CustomSelect
                  options={[{ label: "Mal 1", id: "1" }]} 
                  value={item.nomenklatura}
                  onChange={(val) => handleItemChange(item.id, "nomenklatura", val)}
                  defaultText="Mal seçin"
                  isSearchable
                />
              </td>
              <td>
                <FormInput
                  type="number"
                  id={item.id}
                  label="Sistem Miqdarı"
                  value={item.systemQuantity.toString()}
                  readOnly
                  disabled
                  placeholder=""
                />
              </td>
              <td>
                <FormInput
                  type="number"
                  id={item.id}
                  label="Faktiki Sayım"
                  value={item.actualQuantity.toString()}
                  onChange={(e) => handleItemChange(item.id, "actualQuantity", Number(e))}
                  placeholder="0"
                />
              </td>
              <td style={{ }}>
                <span className={item.difference > 0 ? styles.diffNegative : item.difference < 0 ? styles.diffPositive : ""}>
                  {item.difference > 0 ? `${item.difference} (Əskiklik)` : item.difference < 0 ? `${item.difference} (Artıqlıq)` : "0"}
                </span>
              </td>
              <td style={{ textAlign: "center" }}>
                <div className={styles.actionsCell}>
                 
                  <div className={styles.deleteBtn} onClick={() => handleRemoveItem(item.id)} title="Sətri sil">
                    <HiOutlineTrash size={20} />
                  </div>
                   <div className={styles.addBtn} onClick={handleAddItem} title="Yeni sətir əlavə et">
                    <HiOutlinePlus size={20} />
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ItemsTableTab;
