import { useState, useImperativeHandle, forwardRef, useEffect, useCallback, useRef } from "react";
import { ContactInfoSection } from "../../../../employee-shared/ui/contact-info";
import { SocialMediaSection } from "../../../../employee-shared/ui/social-media";
import { ProgramUserInfoSection } from "../../../../employee-shared/ui/program-user-info";
import { useAddEmployeeStore } from "@/features/kadrlar/create-worker/model/useAddEmployeeStore";
import { createWorkerService } from "@/features/kadrlar/create-worker/api/createWorkerService";
import { useQuery } from "@tanstack/react-query";
import { useEnumItemsByCode } from "@/features/lookups/hooks";
import type { Option } from "@/shared/types";
import toast from "react-hot-toast";
import { ConfirmModal } from "@/shared/ui";
import styles from "./ContactInfoTab.module.css";
import type { ContactEntry, ExternalEntry, SocialEntry } from "./types";
import { useContactEntries } from "./hooks/useContactEntries";
import { useSocialEntries } from "./hooks/useSocialEntries";
import { useExternalEntries } from "./hooks/useExternalEntries";
import { createListChangeHandler } from "./utils/createListChangeHandler";

interface ContactInfoApiEntry {
  id: string;
  type: string;
  value: string;
}

interface ContactApiEntry extends ContactInfoApiEntry {
  isCorporate: boolean;
}

interface ContactInfoApiResult {
  contactList: ContactApiEntry[];
  socialAccountList: ContactInfoApiEntry[];
  externalAccountList: ContactInfoApiEntry[];
}

export interface ContactInfoTabHandle {
  submit: () => void;
  isDirty: () => boolean;
}

export interface ContactInfoTabProps {
  onDirtyChange?: (isDirty: boolean) => void;
}

export const ContactInfoTab = forwardRef<ContactInfoTabHandle, ContactInfoTabProps>(({ onDirtyChange }, ref) => {
  const { nextStep, setStepCompleted, personId, currentStep } = useAddEmployeeStore();
  const [hasChanges, setHasChanges] = useState(false);
  const markChanged = useCallback(() => setHasChanges(true), []);

  useEffect(() => {
    onDirtyChange?.(hasChanges);
  }, [hasChanges, onDirtyChange]);

  // --- Lookups ---
  const { options: otherProgramOptions } = useEnumItemsByCode("OtherProgram", true);
  const { options: contactTypeOptions } = useEnumItemsByCode("ContactTypes", true);
  const { options: socialMediaOptions } = useEnumItemsByCode("SocialMediaTypes", true);

  const contactEntries = useContactEntries({ personId, onChanged: markChanged });
  const socialEntries = useSocialEntries({ personId, onChanged: markChanged });
  const externalEntries = useExternalEntries({ personId, onChanged: markChanged });
  const lastResetPersonIdRef = useRef<string | null | undefined>(undefined);

  const { data: contactData } = useQuery({
    queryKey: ["contact-info", personId],
    queryFn: () => createWorkerService.getContactInfoByPersonId(personId!),
    enabled: !!personId && currentStep === 2,
    staleTime: 0, 
  });

  const resolveLabel = useCallback((id: string, options: Option[]) => {
    const found = options.find((opt) => String(opt.id) === String(id));
    return found ? found.fullName : id;
  }, []);

  const handleListContactChange = useCallback(
    createListChangeHandler(contactEntries.updateEntry, markChanged),
    [contactEntries.updateEntry, markChanged],
  );
  const handleListSocialChange = useCallback(
    createListChangeHandler(socialEntries.updateEntry, markChanged),
    [socialEntries.updateEntry, markChanged],
  );
  const handleListExternalChange = useCallback(
    createListChangeHandler(externalEntries.updateEntry, markChanged),
    [externalEntries.updateEntry, markChanged],
  );
  const handleListContactPrimaryToggle = useCallback(
    (id: string | number, val: boolean) => {
      contactEntries.updateEntry(String(id), (prev) => ({ ...prev, isPrimary: val }));
      markChanged();
    },
    [contactEntries.updateEntry, markChanged],
  );

  useEffect(() => {
    if (lastResetPersonIdRef.current === personId) return;
    lastResetPersonIdRef.current = personId;

    contactEntries.resetNewEntry();
    socialEntries.resetNewEntry();
    externalEntries.resetNewEntry();
    contactEntries.replaceEntries([]);
    socialEntries.replaceEntries([]);
    externalEntries.replaceEntries([]);
    setHasChanges(false);
  }, [
    personId,
    contactEntries.resetNewEntry,
    socialEntries.resetNewEntry,
    externalEntries.resetNewEntry,
    contactEntries.replaceEntries,
    socialEntries.replaceEntries,
    externalEntries.replaceEntries,
  ]);

  useEffect(() => {
    if (contactData?.isSuccess && contactData.result) {
      const res = contactData.result as ContactInfoApiResult;
      const contactList = res.contactList ?? [];
      const socialAccountList = res.socialAccountList ?? [];
      const externalAccountList = res.externalAccountList ?? [];

      const mappedContacts: ContactEntry[] = contactList
        .filter((item) => item && item.id && item.type)
        .map((item: ContactApiEntry) => ({
          id: String(item.id),
          type: { id: item.type, fullName: resolveLabel(item.type, contactTypeOptions) },
          value: String(item.value ?? ""),
          isPrimary: !!item.isCorporate,
        }));
      contactEntries.replaceEntries(mappedContacts);

      const mappedSocial: SocialEntry[] = socialAccountList
        .filter((item) => item && item.id && item.type)
        .map((item: ContactInfoApiEntry) => ({
          id: String(item.id),
          type: { id: item.type, fullName: resolveLabel(item.type, socialMediaOptions) },
          value: String(item.value ?? ""),
        }));
      socialEntries.replaceEntries(mappedSocial);

      const mappedProgram: ExternalEntry[] = externalAccountList
        .filter((item) => item && item.id && item.type)
        .map((item: ContactInfoApiEntry) => ({
          id: String(item.id),
          type: { id: item.type, fullName: resolveLabel(item.type, otherProgramOptions) },
          value: String(item.value ?? ""),
        }));
      externalEntries.replaceEntries(mappedProgram);
      
      setHasChanges(false); 
    }
  }, [
    contactData,
    otherProgramOptions,
    contactTypeOptions,
    socialMediaOptions,
    resolveLabel,
    contactEntries.replaceEntries,
    socialEntries.replaceEntries,
    externalEntries.replaceEntries,
  ]);

  useImperativeHandle(ref, () => ({
    isDirty: () => hasChanges,
    submit: () => {
      if (contactEntries.entries.length === 0) {
        toast.error("Ən azı bir əlaqə məlumatı əlavə edilməlidir");
        return;
      }
      setStepCompleted(2);
      nextStep();
    },
  }));

  return (
    <div className={styles.container}>
      <div className={styles.fullWidthRow}>
        <ContactInfoSection
          newContact={contactEntries.newEntry}
          addedContacts={contactEntries.entries}
          onNewContactChange={(field, val) =>
            contactEntries.setNewEntry((prev) => ({ ...prev, [field]: val }))}
          onNewContactPrimaryChange={(val) =>
            contactEntries.setNewEntry((prev) => ({ ...prev, isPrimary: val }))}
          onAddContact={() => void contactEntries.addEntry()}
          onRemoveContact={contactEntries.askRemoveEntry}
          onListContactChange={handleListContactChange}
          onListContactPrimaryToggle={handleListContactPrimaryToggle}
          title="Əlaqə məlumatları"
        />
      </div>

      <div className={styles.sectionRow}>
        <div className={styles.halfColumn}>
          <SocialMediaSection
            newSocialMedia={socialEntries.newEntry}
            addedSocialMedia={socialEntries.entries}
            onNewSocialMediaChange={(field, val) =>
              socialEntries.setNewEntry((prev) => ({ ...prev, [field]: val }))}
            onAddSocialMedia={() => void socialEntries.addEntry()}
            onRemoveSocialMedia={socialEntries.askRemoveEntry}
            onListSocialMediaChange={handleListSocialChange}
            title="Sosial media"
          />
        </div>

        <div className={styles.halfColumn}>
          <ProgramUserInfoSection
            newProgramUser={externalEntries.newEntry}
            addedProgramUsers={externalEntries.entries}
            onNewProgramUserChange={(field, val) =>
              externalEntries.setNewEntry((prev) => ({ ...prev, [field]: val }))}
            onAddProgramUser={() => void externalEntries.addEntry()}
            onRemoveProgramUser={externalEntries.askRemoveEntry}
            onListProgramUserChange={handleListExternalChange}
            title="Proqram istifadəçi məlumatları"
            enumCode="OtherProgram"
          />
        </div>
      </div>

      <ConfirmModal
        isOpen={contactEntries.deleteConfirm.isDeleteOpen}
        onClose={contactEntries.deleteConfirm.closeDelete}
        onConfirm={() => void contactEntries.confirmRemoveEntry()}
        title="Silmək istədiyinizə əminsiniz?"
        description="Bu məlumatı sildikdə geri qaytara bilməyəcəksiniz."
        confirmText="Sil"
        cancelText="Ləğv et"
        variant="danger"
      />

      <ConfirmModal
        isOpen={socialEntries.deleteConfirm.isDeleteOpen}
        onClose={socialEntries.deleteConfirm.closeDelete}
        onConfirm={() => void socialEntries.confirmRemoveEntry()}
        title="Sosial media hesabını silmək istədiyinizə əminsiniz?"
        description="Bu məlumatı sildikdə geri qaytara bilməyəcəksiniz."
        confirmText="Sil"
        cancelText="Ləğv et"
        variant="danger"
      />

      <ConfirmModal
        isOpen={externalEntries.deleteConfirm.isDeleteOpen}
        onClose={externalEntries.deleteConfirm.closeDelete}
        onConfirm={() => void externalEntries.confirmRemoveEntry()}
        title="Proqram istifadəçi məlumatını silmək istədiyinizə əminsiniz?"
        description="Bu məlumatı sildikdə geri qaytara bilməyəcəksiniz."
        confirmText="Sil"
        cancelText="Ləğv et"
        variant="danger"
      />
    </div>
  );
});

ContactInfoTab.displayName = "ContactInfoTab";
