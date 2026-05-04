import React, { useState, useMemo } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import styles from "./BusinessUnitsTab.module.css";
import { mockBusinessUnits } from "../../model/mockData";
import type { BusinessUnit } from "../../model/mockData";
import {
  Table,
  Pagination,
  TableControls,
  StatusBadge,
  Modal,
  FormInput,
  CustomSelect,
  Button,
  TableActionGroup,
  TableToolbar,
} from "@/shared/ui";
import type { Option, ColumnDef } from "@/shared/types";
import {
  rowCountOptions,
  operationOptions,
} from "@/shared/config/tableOptions";
import AddBusinessUnitModal from "./AddBusinessUnitModal";
import BusinessUnitEditModal from "./BussinesDomainEditModal";

const BusinessUnitsTab: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRowCount, setSelectedRowCount] = useState<Option | null>(
    () => rowCountOptions[0] ?? null
  );
  const [selectedOperation, setSelectedOperation] = useState<Option | null>(
    null
  );

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<BusinessUnit | null>(null);
  const [editData, setEditData] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", isActive: true });

  const handleEditData = (unit: BusinessUnit) => {
    setSelectedUnit(unit);
    setEditForm({ name: unit.name, isActive: unit.isActive });
    setEditData(true);
  };

  const handleDomainClick = (unit: BusinessUnit) => {
    setSelectedUnit(unit);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUnit(null);
  };
  const handleRefresh = () => {
    // Refresh logic here
    console.log("Refreshing data...");
  };

  const handleSearchClick = () => {
    // Search logic here
    console.log("Search clicked");
  };

  const handleOperationChange = (option: Option | null) => {
    setSelectedOperation(option);
    // Operation logic here
    console.log("Operation selected:", option);
  };

  const activeOptions = [
    { id: "true", label: "Bəli" },
    { id: "false", label: "Xeyr" },
  ];

  const pageSize = Number(selectedRowCount?.id) || 10;
  const totalCount = mockBusinessUnits.length;
  const totalPages = Math.ceil(totalCount / pageSize);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return mockBusinessUnits.slice(start, start + pageSize);
  }, [currentPage, pageSize]);

  const columns: ColumnDef<BusinessUnit>[] = useMemo(
    () => [
      {
        header: "#",
        accessor: "id",
        width: "50px",
        render: (_, index) => (currentPage - 1) * pageSize + (index ?? 0) + 1,
      },
      {
        header: "Ad",
        accessor: "name",
        sortable: true,
        render: (unit) => <span className={styles.unitName}>{unit.name}</span>,
      },
      {
        header: "Company",
        accessor: "company",
        render: (unit) => unit.company || "-",
      },
      {
        header: "Domein",
        accessor: "domain",
        render: (unit) => (
          <span
            onClick={() => handleDomainClick(unit)}
            className={styles.domainLink}
          >
            {unit.domain || "-"}
          </span>
        ),
      },
      {
        header: "Aktiv",
        accessor: "isActive",
        width: "100px",
        render: (unit) => (
          <StatusBadge
            label={unit.isActive ? "Bəli" : "Xeyr"}
            variant={unit.isActive ? "success" : "danger"}
          />
        ),
      },
      {
        header: "Əməliyyat",
        accessor: "id",
        width: "120px",
        render: (unit) => (
          <div className={styles.operationSelect}>
            <Button
              variant="outline"
              onClick={() => handleEditData(unit)}
              className={styles.tableActionBtn}
              type="button"
            >
              <EditIcon className={styles.editBtnIcon} />
            </Button>
            <Button
              variant="outline"
              onClick={() => {}}
              className={styles.tableActionBtn}
              type="button"
            >
              <DeleteIcon className={styles.deleteBtnIcon} />
            </Button>
          </div>
        ),
      },
    ],
    [currentPage, pageSize]
  );

  return (
    <div>
      <div className={styles.headerActions}>
        <div className={styles.filterTitle}>Biznes vahidləri</div>

        <div className={styles.buttonGroup}>
          <TableToolbar>
            <TableActionGroup
              onRefresh={handleRefresh}
              onSearch={handleSearchClick}
              onOperationChange={handleOperationChange}
              operationOptions={operationOptions}
              selectedOperation={selectedOperation}
            />
          </TableToolbar>
          <Button
            variant="outline"
            className={styles.addNewButton}
            type="button"
            onClick={() => setIsAddModalOpen(true)}
          >
            <AddIcon className={styles.addBtnIcon} fontSize="small" />
            Yeni
          </Button>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <Table<BusinessUnit> data={paginatedData} columns={columns} />

        <div className={styles.tableFooter}>
          <TableControls
            selectedRowCount={selectedRowCount}
            onRowCountChange={setSelectedRowCount}
            totalCount={totalCount}
            totalCountLabel="Cəmi"
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      <BusinessUnitEditModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        unit={selectedUnit}
      />

      <AddBusinessUnitModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <Modal
        isOpen={editData}
        onClose={() => setEditData(false)}
        title="Biznes Vahidini Dəyişdir"
        size="sm"
      >
        <div className={styles.formContainer}>
          <div className={styles.formRow}>
            <div className={styles.formField}>
              <FormInput
                label="Ad"
                id="name"
                type="text"
                placeholder="Ad daxil edin"
                value={editForm.name}
                onChange={(val) => setEditForm({ ...editForm, name: val })}
              />
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formField}>
              <span className={styles.activeLabel}>AKTİV</span>
              <CustomSelect
                defaultText=""
                options={activeOptions}
                value={
                  activeOptions.find(
                    (opt) => opt.id === String(editForm.isActive)
                  ) || null
                }
                onChange={(opt) =>
                  setEditForm({ ...editForm, isActive: opt?.id === "true" })
                }
                isClearable={false}
              />
            </div>
          </div>

          <div className={styles.modalFooter}>
            <Button variant="outline" onClick={() => setEditData(false)}>
              Ləğv et
            </Button>
            <Button
              variant="default"
              onClick={() => {
                console.log("Saving business unit data:", editForm);
                setEditData(false);
              }}
            >
              <div className={styles.saveBtnContent}>
                <SaveIcon className={styles.saveIcon} />
                Yadda Saxla
              </div>
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BusinessUnitsTab;
