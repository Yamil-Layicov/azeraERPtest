import { useState, useCallback } from "react";
import { PageHeader } from "@/shared/ui";
import {
  NomenclatureTree,
  type NomenclatureNode,
} from "./components/tree/NomenclatureTree";
import { NomenclatureModal } from "./components/modal/NomenclatureModal";
import styles from "./Nomenclature.module.css";
import { MOCK_DATA } from "../models/mockData";

const Nomenclature = () => {
  const [treeData, setTreeData] = useState<NomenclatureNode[]>(MOCK_DATA);
  const [selectedId, setSelectedId] = useState<string | null>("1-1-1");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [editingNode, setEditingNode] = useState<NomenclatureNode | null>(null);
  const [parentNode, setParentNode] = useState<NomenclatureNode | null>(null);

  const handleSelect = (node: NomenclatureNode) => {
    setSelectedId(node.id);
  };

  const handleEdit = useCallback((node: NomenclatureNode) => {
    setModalMode("edit");
    setEditingNode(node);
    setParentNode(null);
    setIsModalOpen(true);
  }, []);

  const handleAddChild = useCallback((node: NomenclatureNode) => {
    setModalMode("add");
    setEditingNode(null);
    setParentNode(node);
    setIsModalOpen(true);
  }, []);

  const updateNodeInTree = useCallback(
    (
      data: NomenclatureNode[],
      id: string,
      updater: (node: NomenclatureNode) => NomenclatureNode,
    ): NomenclatureNode[] => {
      return data.map((node) => {
        if (node.id === id) {
          return updater(node);
        }
        if (node.children) {
          return {
            ...node,
            children: updateNodeInTree(node.children, id, updater),
          };
        }
        return node;
      });
    },
    [],
  );

  const addChildToTree = useCallback(
    (
      data: NomenclatureNode[],
      parentId: string,
      newNode: NomenclatureNode,
    ): NomenclatureNode[] => {
      return data.map((node) => {
        if (node.id === parentId) {
          return {
            ...node,
            children: [...(node.children || []), newNode],
          };
        }
        if (node.children) {
          return {
            ...node,
            children: addChildToTree(node.children, parentId, newNode),
          };
        }
        return node;
      });
    },
    [],
  );

  const handleToggleActive = useCallback(
    (node: NomenclatureNode) => {
      setTreeData((prev) =>
        updateNodeInTree(prev, node.id, (n) => ({
          ...n,
          isActive: !n.isActive,
        })),
      );
    },
    [updateNodeInTree],
  );

  const handleSave = (data: any) => {
    if (modalMode === "add") {
      const newNode: NomenclatureNode = {
        ...data,
        id: Math.random().toString(36).substr(2, 9),
        isActive: true,
        children: data.nodeType === "category" ? [] : undefined,
      };

      if (parentNode) {
        setTreeData((prev) => addChildToTree(prev, parentNode.id, newNode));
      } else {
        setTreeData((prev) => [...prev, newNode]);
      }
    } else if (editingNode) {
      setTreeData((prev) =>
        updateNodeInTree(prev, editingNode.id, (n) => ({
          ...n,
          ...data,
        })),
      );
    }
    setIsModalOpen(false);
  };

  return (
    <div className={styles.nomenclature}>
      <div className={styles.header}>
        <PageHeader title="Nomenklatura" />
      </div>
      <div className={styles.content}>
        <NomenclatureTree
          data={treeData}
          selectedId={selectedId}
          onSelect={handleSelect}
          onEdit={handleEdit}
          onAddChild={handleAddChild}
          onToggleActive={handleToggleActive}
        />
      </div>

      <NomenclatureModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        mode={modalMode}
        title={modalMode === "add" ? "Yeni əlavə et" : "Düzəliş et"}
        initialData={editingNode}
        parentName={parentNode?.name}
      />
    </div>
  );
};

export default Nomenclature;
