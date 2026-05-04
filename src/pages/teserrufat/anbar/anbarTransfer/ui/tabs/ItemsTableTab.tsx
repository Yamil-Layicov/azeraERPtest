import React from "react";
import styles from "../AnbarTransfer.module.css";
import {  CustomSelect, FormInput } from "@/shared/ui";
import { HiOutlineTrash, HiOutlinePlus } from "react-icons/hi";
import type { AnbarTransferItem } from "../../model/types";

interface ItemsTableTabProps {
  items: AnbarTransferItem[];
  setItems: React.Dispatch<React.SetStateAction<AnbarTransferItem[]>>;
}

const ItemsTableTab: React.FC<ItemsTableTabProps> = ({ items, setItems }) => {
  const handleAddItem = () => {
    const newItem: AnbarTransferItem = {
      id: Math.random().toString(36).substr(2, 9),
      nomenklatura: null,
      systemQuantity: 0,
      transferQuantity: 0,
      price: 0,
      amount: 0,
    };
    setItems([...items, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleItemChange = (id: string, field: keyof AnbarTransferItem, value: any) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          
          if (field === "nomenklatura" && value) {
             updatedItem.systemQuantity = Math.floor(Math.random() * 100);
             updatedItem.price = Number((Math.random() * 50 + 10).toFixed(2));
          }

          if (field === "transferQuantity" || field === "nomenklatura") {
             updatedItem.amount = Number((updatedItem.transferQuantity * updatedItem.price).toFixed(2));
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
            <th style={{ width: "30%" }}>Nomenklatura</th>
            <th style={{ width: "15%" }}>Mövcud miqdar</th>
            <th style={{ width: "15%" }}>Transfer miqdarı</th>
            <th style={{ width: "15%" }}>Qiymət</th>
            <th style={{ width: "15%" }}>Məbləğ</th>
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
                  id={`system-${item.id}`}
                  label="Mövcud miqdar"
                  value={item.systemQuantity.toString()}
                  readOnly
                  disabled
                  placeholder=""
                />
              </td>
              <td>
                <FormInput
                  type="number"
                  id={`transfer-${item.id}`}
                  label="Transfer miqdarı"
                  value={item.transferQuantity.toString()}
                  onChange={(val) => handleItemChange(item.id, "transferQuantity", Number(val))}
                  placeholder="0"
                />
              </td>
              <td>
                <FormInput
                  type="number"
                  id={`price-${item.id}`}
                  label="Qiymət"
                  value={item.price.toString()}
                  readOnly
                  disabled
                  placeholder="0.00"
                />
              </td>
              <td>
                <FormInput
                  type="number"
                  id={`amount-${item.id}`}
                  label="Məbləğ"
                  value={item.amount.toString()}
                  readOnly
                  disabled
                  placeholder="0.00"
                />
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
