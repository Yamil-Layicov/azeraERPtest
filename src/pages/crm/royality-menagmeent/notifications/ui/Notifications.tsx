import { useState } from "react";
import {
  PageHeader,
  Button,
  Table,
  TableControls,
  TableToolbar,
  Pagination,
  TableActionGroup,
} from "@/shared/ui";
import styles from "./Notifications.module.css";
// import { mockNotifications, type Notification } from "../models";
import {
  operationOptions,
  rowCountOptions,
} from "@/shared/config/tableOptions";
import type { Option } from "@/shared/types";
import { useExcelExport } from "@/shared/lib/hooks";
import { NotificationDetail, NotificationModal } from "../companents";
import { useNotificationColumns } from "@/pages/settings/notifications/models/useNotificationColumns";
import { mockNotifications, type Notification } from "@/pages/settings/notifications/models";

const NotificationsWeb = () => {
  const { exportToExcel } = useExcelExport<Notification>();
  const [notifications, setNotifications] =
    useState<Notification[]>(mockNotifications);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(mockNotifications[0] || null);
  const [editingNotification, setEditingNotification] =
    useState<Notification | null>(null);
  const [, setSelectedOperation] = useState<Option | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRowCount, setSelectedRowCount] = useState<Option | null>(
    rowCountOptions[0] || null,
  );
  const itemsPerPage = Number(selectedRowCount?.id) || 10;
  const totalCount = notifications.length;
  const totalPages = Math.ceil(totalCount / itemsPerPage) || 1;

  const paginatedData = notifications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const parseDate = (dateStr: string | undefined) => {
    if (!dateStr) return null;
    const parts = dateStr.split(".");
    if (parts.length !== 3) return null;
    const [d, m, y] = parts.map(Number);
    if (d === undefined || m === undefined || y === undefined) return null;
    return new Date(y, m - 1, d);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return `${date.getDate().toString().padStart(2, "0")}.${(date.getMonth() + 1).toString().padStart(2, "0")}.${date.getFullYear()}`;
  };

  const handleRowCountChange = (value: Option | null) => {
    setSelectedRowCount(value);
    setCurrentPage(1);
  };

  const handleOpenModal = (notification?: Notification) => {
    setEditingNotification(notification || null);
    setIsModalOpen(true);
  };

  const handleSelectRow = (notification: Notification) => {
    setSelectedNotification(notification);
  };

  const handleSave = (formData: {
    title: string;
    description: string;
    startDate: Date | null;
    endDate: Date | null;
  }) => {
    const startStr = formatDate(formData.startDate);
    const endStr = formatDate(formData.endDate);

    if (editingNotification) {
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === editingNotification.id
            ? {
                ...n,
                title: formData.title,
                description: formData.description,
                startDate: startStr,
                endDate: endStr,
                date: startStr,
              }
            : n,
        ),
      );
    } else {
      const newNotification: Notification = {
        id:
          notifications.length > 0
            ? Math.max(...notifications.map((n) => n.id)) + 1
            : 1,
        title: formData.title,
        description: formData.description,
        startDate: startStr,
        endDate: endStr,
        date: startStr,
        isActive: true,
        type: "info",
        views: 0,
      };
      setNotifications((prev) => [newNotification, ...prev]);
    }
    setIsModalOpen(false);
  };

  const handleOperationChange = (value: Option | null) => {
    setSelectedOperation(value);
    if (value?.id === "export_excel") {
      exportToExcel({
        data: notifications,
        columns: columns.map((col) => ({
          header: col.header,
          accessor: col.accessor as string,
          render: col.render,
        })),
        fileName: "Yenilikler",
      });
    }
  };

  const toggleStatus = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isActive: !n.isActive } : n)),
    );
  };

  const columns = useNotificationColumns({
    onEdit: handleOpenModal,
    onToggleStatus: toggleStatus,
    onDetail: handleSelectRow,
  });

  return (
    <div className={styles.container}>
      <PageHeader title="Yeniliklər">
        <Button
          variant="primary"
          className={styles.submitBtn}
          onClick={() => handleOpenModal()}
        >
          <span>+ Yeni</span>
        </Button>
      </PageHeader>

      <div className={styles.contentWrapper}>
        <div className={styles.tableSection}>
          <div className={styles.tableWrapper}>
            <div className={styles.tableToolbarWrapper}>
              <TableToolbar>
                <TableControls
                  selectedRowCount={selectedRowCount}
                  onRowCountChange={handleRowCountChange}
                  totalCount={totalCount}
                />
              </TableToolbar>
              <TableActionGroup
                onRefresh={() => {}}
                onSearch={() => {}}
                onOperationChange={handleOperationChange}
                operationOptions={operationOptions}
                selectedOperation={null}
              />
            </div>

            <div className={styles.tableContainer}>
              <Table data={paginatedData} columns={columns} />
            </div>

            <div className={styles.paginationWrapper}>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
        </div>

        <div className={styles.divider} />

        <NotificationDetail selectedNotification={selectedNotification} />
      </div>

      <NotificationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        editingNotification={editingNotification}
        parseDate={parseDate}
      />
    </div>
  );
};

export default NotificationsWeb;
