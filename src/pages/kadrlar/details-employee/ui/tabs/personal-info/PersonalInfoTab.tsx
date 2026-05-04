import { useState, useRef, type ChangeEvent } from "react";
import AvatarUploader from "../../../../employee-shared/ui/avatar-uploader/AvatarUploader";
import { DocumentInfoSection } from "../../../../employee-shared/ui/document-info";
import type {
  EmployeeDocument,
  NewDocumentState,
  NewProgramUserState,
  NewSocialMediaState,
  ProgramUserItem,
  SocialMediaItem,
} from "../../../../employee-shared/model/types";
import type { Option } from "@/shared/types";
import type { Contact, NewContactState } from "../../../../employee-shared/model/types";
import { AddressInfoSection } from "./components/address-info/AddressInfoSection";
import { PersonalMainInfoSection } from "./components/main-info/PersonalMainInfoSection";
import { ContactInfoSection } from "../../../../employee-shared/ui/contact-info";
import { SocialMediaSection } from "../../../../employee-shared/ui/social-media";
import { ProgramUserInfoSection } from "../../../../employee-shared/ui/program-user-info";
import styles from "./PersonalInfoTab.module.css";

type PersonalInfoFormData = {
  fin: string;
  sirket: Option | null;
  vetendasliq: Option | null;
  ad: string;
  dogumTarixi: Date | null;
  dogumOlkesi: Option | null;
  soyad: string;
  cinsi: Option | null;
  dogumSeheri: string;
  ataAdi: string;
  aileVeziyyeti: Option | null;
  tovsiyeEden: string;
  unvan: string;
  elaqeNomresi: string;
  faktikiSeher: string;
  faktikiUnvan: string;
  qeydiyyatEynidir: boolean;
  qeydiyyatOlke: Option | null;
  qeydiyyatSeher: string;
  qeydiyyatUnvan: string;
};

type PersonalInfoStringField = {
  [K in keyof PersonalInfoFormData]: PersonalInfoFormData[K] extends string ? K : never;
}[keyof PersonalInfoFormData];

export const PersonalInfoTab = () => {
  const [formData, setFormData] = useState<PersonalInfoFormData>({
    fin: "",
    sirket: null,
    vetendasliq: null,
    ad: "",
    dogumTarixi: null,
    dogumOlkesi: null,
    soyad: "",
    cinsi: null,
    dogumSeheri: "",
    ataAdi: "",
    aileVeziyyeti: null,
    tovsiyeEden: "",
    unvan: "",
    elaqeNomresi: "",
    faktikiSeher: "",
    faktikiUnvan: "",
    qeydiyyatEynidir: true,
    qeydiyyatOlke: null,
    qeydiyyatSeher: "",
    qeydiyyatUnvan: "",
  });

  const handleChange = (field: PersonalInfoStringField, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleQeydiyyatEynidirChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, qeydiyyatEynidir: checked }));
  };

  const handleRegistrationCountryChange = (val: Option | null) => {
    setFormData((prev) => ({ ...prev, qeydiyyatOlke: val, qeydiyyatSeher: "" }));
  };

  // --- AVATAR STATE ---
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearAvatar = () => {
    setAvatarPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleAvatarClick = () => fileInputRef.current?.click();

  // --- DOCUMENT STATE (Local) ---
  const [newDocument, setNewDocument] = useState<NewDocumentState>({
    type: null,
    series: "",
    number: "",
    issueDate: null,
    expiryDate: null,
  });
  const [addedDocuments, setAddedDocuments] = useState<EmployeeDocument[]>([]);

  const handleNewDocumentChange = (
    field: keyof NewDocumentState,
    value: Option | null | string | Date | null
  ) => {
    setNewDocument((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddDocument = () => {
    if (!newDocument.type || !newDocument.number.trim()) return;

    const nextId = Date.now();
    setAddedDocuments((prev) => [
      ...prev,
      {
        id: nextId,
        type: newDocument.type,
        series: newDocument.series,
        number: newDocument.number,
        issueDate: newDocument.issueDate,
        expiryDate: newDocument.expiryDate,
      },
    ]);

    setNewDocument({
      type: null,
      series: "",
      number: "",
      issueDate: null,
      expiryDate: null,
    });
  };

  const handleRemoveDocument = (id: number) => {
    setAddedDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  const handleListDocumentChange = (
    id: number,
    field: keyof EmployeeDocument,
    value: Option | null | string | Date | null | undefined
  ) => {
    setAddedDocuments((prev) =>
      prev.map((d) => (d.id === id ? ({ ...d, [field]: value } as EmployeeDocument) : d))
    );
  };

  const handleFinClear = () => {
    setFormData((prev) => ({ ...prev, fin: "" }));
  };

  const handleFinSearch = () => {
    // TODO: implement FIN search for details flow
  };

  // --- CONTACT STATE (Local) ---
  const [newContact, setNewContact] = useState<NewContactState>({
    type: null,
    value: "",
    isPrimary: false,
  });
  const [addedContacts, setAddedContacts] = useState<Contact[]>([]);

  const handleNewContactChange = (field: "type" | "value", data: Option | null | string) => {
    setNewContact((prev) => {
      if (field === "type") {
        return { ...prev, type: (data as Option | null) };
      }
      return { ...prev, value: String(data) };
    });
  };

  const handleNewContactPrimaryChange = (checked: boolean) => {
    setNewContact((prev) => ({ ...prev, isPrimary: checked }));
  };

  const handleAddContact = () => {
    if (!newContact.type || !newContact.value.trim()) return;
    const nextId = Date.now();
    setAddedContacts((prev) => [
      ...prev,
      { id: nextId, type: newContact.type, value: String(newContact.value), isPrimary: newContact.isPrimary },
    ]);
    setNewContact({ type: null, value: "", isPrimary: false });
  };

  const handleRemoveContact = (id: number) => {
    setAddedContacts((prev) => prev.filter((c) => c.id !== id));
  };

  const handleListContactChange = (id: number, field: "type" | "value", data: Option | null | string) => {
    setAddedContacts((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        if (field === "type") return { ...c, type: data as Option | null };
        return { ...c, value: String(data) };
      })
    );
  };

  const handleListContactPrimaryToggle = (id: number, isChecked: boolean) => {
    setAddedContacts((prev) =>
      prev.map((c) => (c.id === id ? ({ ...c, isPrimary: isChecked } as Contact) : c))
    );
  };

  // --- SOCIAL MEDIA STATE (Local) ---
  const [newSocialMedia, setNewSocialMedia] = useState<NewSocialMediaState>({
    type: null,
    value: "",
  });
  const [addedSocialMedia, setAddedSocialMedia] = useState<SocialMediaItem[]>([]);

  const handleNewSocialMediaChange = (field: "type" | "value", data: Option | null | string) => {
    setNewSocialMedia((prev) => {
      if (field === "type") {
        return { ...prev, type: data as Option | null };
      }
      return { ...prev, value: String(data) };
    });
  };

  const handleAddSocialMedia = () => {
    if (!newSocialMedia.type || !newSocialMedia.value.trim()) return;
    const nextId = Date.now();
    setAddedSocialMedia((prev) => [
      ...prev,
      { id: nextId, type: newSocialMedia.type, value: String(newSocialMedia.value) },
    ]);
    setNewSocialMedia({ type: null, value: "" });
  };

  const handleRemoveSocialMedia = (id: number) => {
    setAddedSocialMedia((prev) => prev.filter((x) => x.id !== id));
  };

  const handleListSocialMediaChange = (id: number, field: "type" | "value", data: Option | null | string) => {
    setAddedSocialMedia((prev) =>
      prev.map((x) => {
        if (x.id !== id) return x;
        if (field === "type") return { ...x, type: data as Option | null };
        return { ...x, value: String(data) };
      })
    );
  };

  // --- PROGRAM USER INFO STATE (Local) ---
  const [newProgramUser, setNewProgramUser] = useState<NewProgramUserState>({
    type: null,
    value: "",
  });
  const [addedProgramUsers, setAddedProgramUsers] = useState<ProgramUserItem[]>([]);

  const handleNewProgramUserChange = (field: "type" | "value", data: Option | null | string) => {
    setNewProgramUser((prev) => {
      if (field === "type") {
        return { ...prev, type: data as Option | null };
      }
      return { ...prev, value: String(data) };
    });
  };

  const handleAddProgramUser = () => {
    if (!newProgramUser.type || !newProgramUser.value.trim()) return;
    const nextId = Date.now();
    setAddedProgramUsers((prev) => [
      ...prev,
      { id: nextId, type: newProgramUser.type, value: String(newProgramUser.value) },
    ]);
    setNewProgramUser({ type: null, value: "" });
  };

  const handleRemoveProgramUser = (id: number) => {
    setAddedProgramUsers((prev) => prev.filter((x) => x.id !== id));
  };

  const handleListProgramUserChange = (id: number, field: "type" | "value", data: Option | null | string) => {
    setAddedProgramUsers((prev) =>
      prev.map((x) => {
        if (x.id !== id) return x;
        if (field === "type") return { ...x, type: data as Option | null };
        return { ...x, value: String(data) };
      })
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.topSection}>
        <PersonalMainInfoSection
          value={{
            fin: formData.fin,
            sirket: formData.sirket,
            vetendasliq: formData.vetendasliq,
            ad: formData.ad,
            dogumTarixi: formData.dogumTarixi,
            dogumOlkesi: formData.dogumOlkesi,
            soyad: formData.soyad,
            cinsi: formData.cinsi,
            dogumSeheri: formData.dogumSeheri,
            ataAdi: formData.ataAdi,
            aileVeziyyeti: formData.aileVeziyyeti,
            tovsiyeEden: formData.tovsiyeEden,
          }}
          onFieldChange={(field, value) => handleChange(field, value)}
          onCompanyChange={(val) => setFormData((prev) => ({ ...prev, sirket: val }))}
          onCitizenshipChange={(val) => setFormData((prev) => ({ ...prev, vetendasliq: val }))}
          onBirthDateChange={(date) => setFormData((prev) => ({ ...prev, dogumTarixi: date }))}
          onBirthCountryChange={(val) => setFormData((prev) => ({ ...prev, dogumOlkesi: val }))}
          onGenderChange={(val) => setFormData((prev) => ({ ...prev, cinsi: val }))}
          onMaritalStatusChange={(val) => setFormData((prev) => ({ ...prev, aileVeziyyeti: val }))}
          onFinClear={handleFinClear}
          onFinSearch={handleFinSearch}
        />
        {/* SAĞ TƏRƏF: AVATAR */}
        <div className={styles.avatarSide}>
          <AvatarUploader 
            preview={avatarPreview}
            onFileChange={handleFileChange}
            onClear={handleClearAvatar}
            onClick={handleAvatarClick}
            fileInputRef={fileInputRef}
            className={styles.avatarOverride}
          />
        </div>
      </div>

      <div className={styles.bottomSection}>
      <AddressInfoSection
          actualCity={formData.faktikiSeher}
          actualAddress={formData.faktikiUnvan}
          registrationSameAsActual={formData.qeydiyyatEynidir}
          registrationCountry={formData.qeydiyyatOlke}
          registrationCity={formData.qeydiyyatSeher}
          registrationAddress={formData.qeydiyyatUnvan}
          onActualCityChange={(val) => handleChange("faktikiSeher", val)}
          onActualAddressChange={(val) => handleChange("faktikiUnvan", val)}
          onRegistrationSameAsActualChange={handleQeydiyyatEynidirChange}
          onRegistrationCountryChange={handleRegistrationCountryChange}
          onRegistrationCityChange={(val) => handleChange("qeydiyyatSeher", val)}
          onRegistrationAddressChange={(val) => handleChange("qeydiyyatUnvan", val)}
        />
        
        <div className={styles.documentInfoWrapper}>
          <DocumentInfoSection
            newDocument={newDocument}
            addedDocuments={addedDocuments}
            onNewDocumentChange={handleNewDocumentChange}
            onAddDocument={handleAddDocument}
            onRemoveDocument={handleRemoveDocument}
            onListDocumentChange={handleListDocumentChange}
            title="Sənəd məlumatları"
            disableListedDocuments={true}
          />
        </div>

        <div className={styles.contactAndSocialRow}>
          <div className={styles.halfColumn}>
            <ContactInfoSection
              newContact={newContact}
              addedContacts={addedContacts}
              onNewContactChange={handleNewContactChange}
              onNewContactPrimaryChange={handleNewContactPrimaryChange}
              onAddContact={handleAddContact}
              onRemoveContact={handleRemoveContact}
              onListContactChange={handleListContactChange}
              onListContactPrimaryToggle={handleListContactPrimaryToggle}
              title="Əlaqə məlumatları"
              disableListedContacts={true}
            />
          </div>

          <div className={styles.halfColumn}>
            <SocialMediaSection
              newSocialMedia={newSocialMedia}
              addedSocialMedia={addedSocialMedia}
              onNewSocialMediaChange={handleNewSocialMediaChange}
              onAddSocialMedia={handleAddSocialMedia}
              onRemoveSocialMedia={handleRemoveSocialMedia}
              onListSocialMediaChange={handleListSocialMediaChange}
              title="Sosial media"
              disableListedSocialMedia={true}
            />
          </div>
        </div>

        <div className={styles.programUserInfoWrapper}>
          <ProgramUserInfoSection
            newProgramUser={newProgramUser}
            addedProgramUsers={addedProgramUsers}
            onNewProgramUserChange={handleNewProgramUserChange}
            onAddProgramUser={handleAddProgramUser}
            onRemoveProgramUser={handleRemoveProgramUser}
            onListProgramUserChange={handleListProgramUserChange}
            title="Proqram istifadəçi məlumatları"
            disableListedProgramUsers={true}
          />
        </div>
      </div>

    </div>
  );
};