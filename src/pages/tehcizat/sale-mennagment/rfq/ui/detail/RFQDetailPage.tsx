import React, { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeftIcon,
  TrashIcon,
  PlusIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import {
  PageHeader,
  Button,
  StatusBadge,
  Table,
  SuccessModal,
  CustomSelect,
  FormInput,
} from "@/shared/ui";
import { ROUTES } from "@/app/routes/consts";
import { mockActiveRFQs, mockVendors } from "../../model/mockData";
import type { VendorBid } from "../../model/types";
import type { Option } from "@/shared/types";
import ComparisonModal from "./components/ComparisonModal";
import styles from "./RFQDetailPage.module.css";

const RFQDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const rfq = useMemo(() => mockActiveRFQs.find((r) => r.id === id), [id]);

  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const [selectedBids, setSelectedBids] = useState<VendorBid[]>(
    rfq?.vendorBids || [],
  );
  const [selectedVendorOpt, setSelectedVendorOpt] = useState<Option | null>(
    null,
  );

  const vendorOptions: Option[] = useMemo(
    () =>
      mockVendors
        .filter((v) => !selectedBids.some((bid) => bid.vendorId === v.id))
        .map((v) => ({ id: v.id, fullName: v.name })),
    [selectedBids],
  );

  if (!rfq) {
    return (
      <div className={styles.container}>
        <PageHeader
          title="Xəta"
          description="Axtarışa uyğun sorğu tapılmadı."
        />
        <Button
          variant="secondary"
          className={styles.backButton}
          onClick={() => navigate(ROUTES.SATINALMA.RFQ.LIST.LINK)}
        >
          Geri Qayıt
        </Button>
      </div>
    );
  }


  const handleAddVendor = () => {
    if (!selectedVendorOpt) return;

    const newBid: VendorBid = {
      id: `new-${Date.now()}`,
      vendorId: selectedVendorOpt.id.toString(),
      vendorName: selectedVendorOpt.fullName || "",
      status: "submitted",
      currency: "AZN",
      amount: 0,
    };

    setSelectedBids((prev) => [...prev, newBid]);
    setSelectedVendorOpt(null);
  };

  const handleRemoveVendor = (bidId: string) => {
    setSelectedBids((prev) => prev.filter((b) => b.id !== bidId));
  };

  const handleAmountChange = (bidId: string, amount: string) => {
    setSelectedBids((prev) =>
      prev.map((b) =>
        b.id === bidId ? { ...b, amount: Number(amount) || 0 } : b,
      ),
    );
  };

  const handleSaveBids = () => {
    setSuccessMsg("Təklif məbləğləri uğurla yadda saxlanıldı.");
    setIsSuccessOpen(true);
  };

  const columns = [
    {
      header: "Təchizatçı",
      accessor: "vendorName",
      render: (bid: any) => (
        <span style={{ fontWeight: 600 }}>{bid.vendorName}</span>
      ),
    },
    {
      header: "Təklif Məbləği",
      accessor: "amount",
      render: (bid: any) => (
        <div className={styles.bidInputWrapper}>
          <FormInput
            id={`bid-${bid.id}`}
            label=""
            type="number"
            value={bid.amount || ""}
            onChange={(val) => handleAmountChange(bid.id, val)}
            placeholder="0.00"
            className={styles.inlineInput}
          />
          <span className={styles.currencyLabel}>{bid.currency || "AZN"}</span>
        </div>
      ),
    },
    {
      header: "",
      accessor: "id",
      render: (bid: any) => (
        <Button
          variant="clear"
          onClick={() => handleRemoveVendor(bid.id)}
          className={styles.deleteBtn}
        >
          <TrashIcon width={18} />
        </Button>
      ),
    },
  ];

  const handleSelectWinner = (bidId: string) => {
    const winnerBid = selectedBids.find((b) => b.id === bidId);
    if (winnerBid) {
      setSuccessMsg(
        `${winnerBid.vendorName} qalib olaraq seçildi və bildiriş göndərildi.`,
      );
      setIsComparisonOpen(false);
      setIsSuccessOpen(true);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerSection}>
        <div className={styles.backButtonWrapper}>
          <Button
            variant="clear"
            onClick={() => navigate(ROUTES.SATINALMA.RFQ.LIST.LINK)}
            className={styles.backButton}
          >
            <ArrowLeftIcon width={16} style={{ marginRight: "6px" }} />
            Siyahıya Qayıt
          </Button>
        </div>
        <PageHeader
          title={`${rfq.rfqNo} - ${rfq.title}`}
          description="Təklif sorğusunun detalları və şirkətlərin vəziyyəti."
        />
      </div>

      <div className={styles.card}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Ümumi Məlumatlar</h2>
          <StatusBadge
            label={
              rfq.status === "published"
                ? "Yayımlanıb"
                : rfq.status === "closed"
                  ? "Bağlanıb"
                  : "Qaralama"
            }
            variant={
              rfq.status === "published"
                ? "info"
                : rfq.status === "closed"
                  ? "success"
                  : "neutral"
            }
          />
        </div>
        <div className={styles.summaryGrid}>
          <div className={styles.infoBlock}>
            <span className={styles.label}>Son Tarix (Deadline)</span>
            <span className={styles.value}>
              {new Date(rfq.deadline).toLocaleString("az-AZ", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          <div className={styles.infoBlock}>
            <span className={styles.label}>Çatdırılma Şərtləri</span>
            <span className={styles.value}>
              {rfq.deliveryTerms || "Qeyd edilməyib"}
            </span>
          </div>
          <div className={styles.infoBlock}>
            <span className={styles.label}>Sığorta / Zəmanət</span>
            <span className={styles.value}>
              {rfq.warranty || "Qeyd edilməyib"}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.tableCard}>
        <div className={styles.tableHeaderRow}>
          <h2 className={styles.tableTitle}>Dəvət Olunan Şirkətlər</h2>
          <div className={styles.vendorToolbar}>
            <div className={styles.selectWrapper}>
              <CustomSelect
                id="vendor-select"
                options={vendorOptions}
                value={selectedVendorOpt}
                onChange={(val) => setSelectedVendorOpt(val as Option)}
                defaultText="Şirkət seçin..."
              />
            </div>
            <Button
              variant="primary"
              onClick={handleAddVendor}
              disabled={!selectedVendorOpt}
              className={styles.addBtn}
            >
              <PlusIcon
                width={16}
                strokeWidth={2.5}
                style={{ marginRight: "4px" }}
              />
              Əlavə et
            </Button>
            {selectedBids.length > 0 && (
              <Button
                variant="outline"
                onClick={handleSaveBids}
                className={styles.saveBidsBtn}
              >
                <CheckIcon
                  width={16}
                  strokeWidth={2.5}
                  style={{ marginRight: "4px" }}
                />
                Qiymətləri Yadda Saxla
              </Button>
            )}
          </div>
        </div>
        <Table columns={columns} data={selectedBids} />
      </div>

      {rfq.notes && (
        <div className={styles.card}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Təsvir / Qeydlər</h2>
          </div>
          <div className={styles.notesContent}>{rfq.notes}</div>
        </div>
      )}

      <div className={styles.actionsBar}>
        <Button variant="danger" className={styles.cancelBtn}>
          Sorğunu Ləğv Et
        </Button>

        <Button variant="primary" onClick={() => setIsComparisonOpen(true)}>
          Müqayisə cədvəlini aç və qalibi seç
        </Button>
      </div>

      <ComparisonModal
        isOpen={isComparisonOpen}
        onClose={() => setIsComparisonOpen(false)}
        bids={selectedBids}
        rfqTitle={rfq.title}
        onSelectWinner={handleSelectWinner}
      />

      <SuccessModal
        isOpen={isSuccessOpen}
        onClose={() => setIsSuccessOpen(false)}
        title="Uğurlu Seçim"
        text={successMsg}
      />
    </div>
  );
};

export default RFQDetailPage;
