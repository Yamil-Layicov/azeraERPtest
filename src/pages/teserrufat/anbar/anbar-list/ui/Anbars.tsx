import { useState, useMemo } from "react";
import { 
  Button, 
  PageHeader, 
  Table, 
  TableControls, 
  TableToolbar, 
  TableActionGroup,
  Pagination,
  Modal,
} from "@/shared/ui";
import { rowCountOptions, operationOptions } from "@/shared/config/tableOptions";
import { MOCK_WAREHOUSES } from "../models/mockData";
import { useWarehouseColumns } from "../models/useWarehouseColumns";
import { AddAnbarModal } from "./components/modal/AddAnbarModal";
import type { Option } from "@/shared/types";
import styles from "./Anbars.module.css";

const Anbars = () => {
  const columns = useWarehouseColumns();

  // Pagination & Toolbar States
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRowCount, setSelectedRowCount] = useState<Option | null>(
    rowCountOptions[0] || null,
  );
  const [searchQuery] = useState("");
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedOperation, setSelectedOperation] = useState<Option | null>(null);

  const itemsPerPage = Number(selectedRowCount?.id) || 10;

  const filteredData = useMemo(() => {
    if (!searchQuery) return MOCK_WAREHOUSES;
    const q = searchQuery.toLowerCase();
    return MOCK_WAREHOUSES.filter(
      (w) =>
        w.name.toLowerCase().includes(q) ||
        w.company.toLowerCase().includes(q) ||
        w.manager.toLowerCase().includes(q) ||
        w.location.toLowerCase().includes(q),
    );
  }, [searchQuery]);

  const totalCount = filteredData.length;
  const totalPages = Math.ceil(totalCount / itemsPerPage) || 1;

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRowCountChange = (value: Option | null) => {
    setSelectedRowCount(value);
    setCurrentPage(1);
  };

  const handleRefresh = () => {
    // Yeniləmə funksionallığı burada həyata keçiriləcək
  };

  const handleOpenSearchModal = () => {
    setIsSearchModalOpen(true);
  };

  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
  };

  const handleSaveAnbar = () => {
    // Yeni anbar yadda saxlama funksionallığı burada həyata keçiriləcək
    // Here you would typically call an API
  };

  const handleOperationChange = (op: Option) => {
    setSelectedOperation(op);
    if (op.id === "export_excel") {
      console.log("Exporting to Excel...");
    } else if (op.id === "export_pdf") {
      console.log("Exporting to PDF...");
    } else if (op.id === "print") {
      window.print();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <PageHeader title="Anbarlar" />
        <Button
          variant="primary"
          onClick={handleOpenAddModal}
          className={styles.createButton}
        >
          + Yeni
        </Button>
      </div>

      <div className={styles.content}>
        <TableToolbar>
          <TableControls
            selectedRowCount={selectedRowCount}
            onRowCountChange={handleRowCountChange}
            totalCount={totalCount}
          />

          <TableActionGroup
            onRefresh={handleRefresh}
            onSearch={handleOpenSearchModal}
            onOperationChange={handleOperationChange}
            operationOptions={operationOptions}
            selectedOperation={selectedOperation}
          />
        </TableToolbar>

        <div className={styles.tableCard}>
          <Table columns={columns} data={paginatedData} />
        </div>

        <div className={styles.pagination}>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            showFirstLast={true}
            maxVisiblePages={5}
          />
        </div>
      </div>

      <AddAnbarModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveAnbar}
      />

      <Modal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        title="Ətraflı Axtarış"
        size="md"
      >
        <div style={{ padding: "20px", textAlign: "center" }}>
          <p style={{ color: "#64748b", fontSize: "14px" }}>
            Bu hissədə gələcəkdə xüsusi filterlər (məsələn: anbar növü, status
            və s.) tətbiq olunacaq.
          </p>
          <Button
            variant="primary"
            onClick={() => setIsSearchModalOpen(false)}
            style={{ marginTop: "20px" }}
          >
            Anladım
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Anbars;
