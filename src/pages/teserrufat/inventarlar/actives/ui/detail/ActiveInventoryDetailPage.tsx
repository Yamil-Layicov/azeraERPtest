import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, PageHeader } from "@/shared/ui";
import { activeInventoriesMockData } from "../../models/Mockdata";
import type { Option } from "@/shared/types";
import styles from "./ActiveInventoryDetailPage.module.css";
import { IoMdArrowBack } from "react-icons/io";
import InventoryMainInfoForm from "./companents/InventoryMainInfoForm";
import PurchaseInfoForm from "./companents/PurchaseInfoForm";
import StructureInfoForm from "./companents/StructureInfoForm";
import AssignmentInfoForm from "./companents/AssignmentInfoForm";
import TransportationExpensesTable from "./companents/TransportationExpensesTable";

export default function ActiveInventoryDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const item = useMemo(
    () => activeInventoriesMockData.find((x) => x.id === id),
    [id],
  );

  const statusOptions = useMemo(
    () => [
      { id: "1", label: "Aktiv" },
      { id: "2", label: "Deaktiv" },
    ],
    [],
  );

  const categoryOptions = useMemo(
    () => [
      { id: "1", label: "Digər (ümumi)" },
      { id: "2", label: "Mebel" },
      { id: "3", label: "Təhlükəsizlik" },
    ],
    [],
  );

  const subCategoryOptions = useMemo(
    () => [
      { id: "1", label: "Akvarium" },
      { id: "2", label: "İş masası" },
      { id: "3", label: "CCTV kamera" },
      { id: "4", label: "Portret, Şəkil" },
    ],
    [],
  );

  const companyOptions = useMemo(
    () => [
      { id: "1", label: "Azera Holding" },
      { id: "2", label: "Construction LLC" },
    ],
    [],
  );

  const departmentOptions = useMemo(
    () => [
      {
        id: "1",
        label: "İnformasiya Texnologiyaları Departamenti",
      },
      { id: "2", label: "Komendant" },
    ],
    [],
  );

  const locationOptions = useMemo(
    () => [
      { id: "1", label: "2-ci mərtəbə otaq 31" },
      {
        id: "2",
        label: "2-ci mərtəbə 5-ci otaq",
      },
      { id: "3", label: "—" },
    ],
    [],
  );
  const [activeName, setActiveName] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [status, setStatus] = useState<Option | null>(null);
  const [category, setCategory] = useState<Option | null>(null);
  const [subCategory, setSubCategory] = useState<Option | null>(null);
  const [company, setCompany] = useState<Option | null>(null);
  const [department, setDepartment] = useState<Option | null>(null);
  const [location, setLocation] = useState<Option | null>(null);
  const [responsiblePerson, setResponsiblePerson] = useState("");
  const [responsibleFin, setResponsibleFin] = useState("");
  const [deliveryDate, setDeliveryDate] = useState<Date | null>(null);

  useEffect(() => {
    if (!item) return;

    setActiveName(item.activeName);
    setSerialNumber(item.serialNumber);
    setResponsiblePerson(item.responsiblePerson);
    setResponsibleFin(item.responsibleFin);
    setDeliveryDate(item.deliveryDate ? new Date(item.deliveryDate) : null);

    setStatus(
      statusOptions.find((x) => x.label === item.status) ?? {
        id: "custom-status",
        label: item.status,
      },
    );
    setCategory(
      categoryOptions.find((x) => x.label === item.category) ?? {
        id: "custom-category",
        label: item.category,
      },
    );
    setSubCategory(
      subCategoryOptions.find((x) => x.label === item.subCategory) ?? {
        id: "custom-subcategory",
        label: item.subCategory,
      },
    );
    setCompany(
      companyOptions.find((x) => x.label === item.company) ?? {
        id: "custom-company",
        label: item.company,
      },
    );
    setDepartment(
      departmentOptions.find((x) => x.label === item.department) ?? {
        id: "custom-department",
        label: item.department,
      },
    );
    setLocation(
      locationOptions.find((x) => x.label === item.location) ?? {
        id: "custom-location",
        label: item.location,
      },
    );
  }, [
    item,
    categoryOptions,
    companyOptions,
    departmentOptions,
    locationOptions,
    statusOptions,
    subCategoryOptions,
  ]);
  const type = item?.type || "";
  if (!item) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <PageHeader title="Aktivlərin detalli məlumatları " />
          </div>
          <div className={styles.headerActions}>
            <Button variant="default" onClick={() => navigate(-1)}>
              Geri
            </Button>
          </div>
        </div>
        <div className={styles.formContent}>
          <div className={styles.section}>
            <div style={{ fontSize: "14px" }}>Məlumat tapılmadı.</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <PageHeader title="Aktivlərin detalli məlumatları " />
        </div>
        <div className={styles.headerActions}>
          <Button
            className={styles.backButton}
            variant="default"
            onClick={() => navigate(-1)}
          >
            <IoMdArrowBack size={12} />
            Geri
          </Button>
        </div>
      </div>

      <div className={styles.formContent}>
        <div className={styles.mainGrid}>
          <div className={styles.column}>
            <InventoryMainInfoForm
              activeName={activeName}
              setActiveName={setActiveName}
              category={category}
              setCategory={setCategory}
              categoryOptions={categoryOptions}
              subCategory={subCategory}
              setSubCategory={setSubCategory}
              subCategoryOptions={subCategoryOptions}
              status={status}
              setStatus={setStatus}
              statusOptions={statusOptions}
              serialNumber={serialNumber}
              setSerialNumber={setSerialNumber}
            />
            <PurchaseInfoForm
              purchaseDate={null}
              setPurchaseDate={() => {}}
              purchaseAmount={""}
              setPurchaseAmount={() => {}}
            />
          </div>

          <div className={styles.column}>
            <StructureInfoForm
              company={company}
              setCompany={setCompany}
              companyOptions={companyOptions}
              department={department}
              setDepartment={setDepartment}
              departmentOptions={departmentOptions}
              location={location}
              setLocation={setLocation}
              locationOptions={locationOptions}
            />
            <AssignmentInfoForm
              responsiblePerson={responsiblePerson}
              setResponsiblePerson={setResponsiblePerson}
              responsibleFin={responsibleFin}
              setResponsibleFin={setResponsibleFin}
              deliveryDate={deliveryDate}
              setDeliveryDate={setDeliveryDate}
              company={company}
              department={department}
            />
          </div>
        </div>
        <div className={styles.secondaryGrid}></div>
        {type === "Neqliyyat" && (
          <div className={styles.secondaryGrid}>
            <TransportationExpensesTable />
          </div>
        )}
        <div className={styles.footer}>
          <Button variant="primary" onClick={() => console.log("Saved")}>
            Yadda saxla
          </Button>
        </div>
      </div>
    </div>
  );
}
