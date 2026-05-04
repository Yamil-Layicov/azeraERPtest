import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { PageHeader, Modal, Button, Checkbox, FormTextarea } from "@/shared/ui";
import { StatusStepper } from "./components/status-stepper";
import { STEPS } from "./components/status-stepper/consts";
import {
  PersonalInfoTab,
  type PersonalInfoTabHandle,
} from "./tabs/personal-info/PersonalInfoTab";
import {
  ContactInfoTab,
  type ContactInfoTabHandle,
} from "./tabs/contact-info/ContactInfoTab";
import {
  EducationInfoTab,
  type EducationInfoTabHandle,
} from "./tabs/education-info/EducationInfoTab";
import {
  SalaryInfoTab,
  type SalaryInfoTabHandle,
} from "./tabs/salary-info/SalaryInfoTab";
import { EmployeeDetailsTabActions } from "./components/tab-actions";
import {
  WorkExperienceInfoTab,
  type WorkExperienceInfoTabHandle,
} from "./tabs/work-experience-info";
import {
  RelativesInfoTab,
  type RelativesInfoTabHandle,
} from "./tabs/relatives-info";
import { TrainingInfoTab } from "./tabs/training-info";
import {
  PerformanceIndicatorsTab,
  type PerformanceIndicatorsTabHandle,
} from "./tabs/performance-indicators";
import {
  VacationTripInfoTab,
  type VacationTripInfoTabHandle,
} from "./tabs/vacation-trip-info/VacationTripInfoTab";
import {
  MilitaryInfoTab,
  type MilitaryInfoTabHandle,
} from "./tabs/military-info/MilitaryInfoTab";
import { useAddEmployeeStore } from "@/features/kadrlar/create-worker/model/useAddEmployeeStore";
import { createWorkerService } from "@/features/kadrlar/create-worker/api/createWorkerService";
import { employeesService } from "@/features/kadrlar/employees/api/employeesService";
import { getBackendErrorMessage } from "@/shared/api";
import axios from "axios";
import toast from "react-hot-toast";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { MdOutlineWarningAmber } from "react-icons/md";
import styles from "./EmployeeDetailsPage.module.css";

const TOTAL_STEPS = STEPS.length;

interface EmployeeDetailsPageProps {
  allowDirectStepClick?: boolean;
  pageMode?: "add" | "details";
}

export const EmployeeDetailsPage = ({
  allowDirectStepClick = false,
  pageMode = "add",
}: EmployeeDetailsPageProps) => {
  const {
    currentStep,
    maxReachedStep,
    setCurrentStep,
    prevStep,
    nextStep,
    isStepCompleted,
    resetStore,
    triggerGlobalReset,
    setUsernameCreateOptions,
    setPersonId,
    setEmployeeId,
    setPinSearchRawData,
    setRootCompanyId,
    personId,
    employeeId,
    rootCompanyId,
    hasPendingWorkExperienceApproval,
  } = useAddEmployeeStore();
  const { id: employeeIdFromRoute } = useParams<{ id?: string }>();
  const [visitedSteps, setVisitedSteps] = useState<number[]>([currentStep]);
  const [isTabDirty, setIsTabDirty] = useState(false);
  const [isFinalConfirmOpen, setIsFinalConfirmOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [usernameCreateChecked, setUsernameCreateChecked] = useState(false);
  const [usernameCreateNote, setUsernameCreateNote] = useState("");
  const [isCompletingFinal, setIsCompletingFinal] = useState(false);
  const [isPageInitialized, setIsPageInitialized] = useState(false);
  const isFinalConfirmDisabled =
    currentStep === TOTAL_STEPS && !hasPendingWorkExperienceApproval;
  const isFinalConfirmHidden =
    currentStep === TOTAL_STEPS && !hasPendingWorkExperienceApproval;

  useEffect(() => {
    resetStore();
    setVisitedSteps([1]);
    setCurrentStep(1);
    setIsPageInitialized(true);
  }, [resetStore, setCurrentStep]);

  useEffect(() => {
    const loadEmployeeDetails = async () => {
      if (pageMode !== "details") return;
      if (!employeeIdFromRoute) return;

      try {
        const employee = await employeesService.getById(employeeIdFromRoute);
        const person = (employee as any)?.person ?? null;

        if (!person?.id) {
          toast.error("İşçi məlumatı tapılmadı");
          return;
        }

        setPersonId(String(person.id));
        setEmployeeId(String(employeeIdFromRoute));
        setRootCompanyId(
          (employee as any)?.rootCompanyId
            ? String((employee as any).rootCompanyId)
            : null,
        );
        setPinSearchRawData({
          result: {
            ...person,
            employmentId: employeeIdFromRoute,
            employees: person.employees || [],
            status: (employee as any)?.status ?? null,
            username: person.username ?? null,
            rootCompanyId: (employee as any)?.rootCompanyId ?? null,
            rootCompanyName: (employee as any)?.rootCompanyName ?? null,
            employmentTypeCode: (employee as any)?.employmentTypeCode ?? null,
            referrerName: (employee as any)?.referrerName ?? null,
            positionId: (employee as any)?.positionId ?? null,
            positionName: (employee as any)?.positionName ?? null,
            organizationUnitId: (employee as any)?.organizationUnitId ?? null,
            organizationUnit: null,
            organizationUnitName:
              (employee as any)?.organizationUnitName ?? null,
            staffCategoryCode: (employee as any)?.staffCategoryCode ?? null,
          },
        });
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          toast.error(getBackendErrorMessage(error));
        } else {
          toast.error("İşçi məlumatları yüklənə bilmədi");
        }
      }
    };

    void loadEmployeeDetails();
  }, [
    employeeIdFromRoute,
    pageMode,
    setEmployeeId,
    setPersonId,
    setPinSearchRawData,
    setRootCompanyId,
  ]);

  useEffect(() => {
    setVisitedSteps((prev) => {
      const allStepsUpToCurrent = Array.from(
        { length: currentStep },
        (_, i) => i + 1,
      );
      const uniqueSteps = Array.from(
        new Set([...prev, ...allStepsUpToCurrent]),
      );
      if (uniqueSteps.length === prev.length) return prev;
      return uniqueSteps;
    });
    setIsTabDirty(false);
  }, [currentStep]);

  const tabContentRef = useRef<HTMLDivElement | null>(null);

  const personalInfoRef = useRef<PersonalInfoTabHandle>(null);
  const contactInfoRef = useRef<ContactInfoTabHandle>(null);
  const educationInfoRef = useRef<EducationInfoTabHandle>(null);
  const salaryInfoRef = useRef<SalaryInfoTabHandle>(null);
  const workExperienceInfoRef = useRef<WorkExperienceInfoTabHandle>(null);
  const relativesInfoRef = useRef<RelativesInfoTabHandle>(null);
  const trainingInfoRef = useRef<any>(null);
  const performanceIndicatorsInfoRef =
    useRef<PerformanceIndicatorsTabHandle>(null);
  const vacationTripInfoRef = useRef<VacationTripInfoTabHandle>(null);
  const militaryInfoRef = useRef<MilitaryInfoTabHandle>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (tabContentRef.current) {
      tabContentRef.current.scrollTop = 0;
    }
  }, [currentStep]);

  const closeFinalConfirmModal = () => {
    setIsFinalConfirmOpen(false);
    setUsernameCreateChecked(false);
    setUsernameCreateNote("");
  };

  const handleSaveAndNext = () => {
    if (currentStep === TOTAL_STEPS) {
      setIsFinalConfirmOpen(true);
      return;
    }

    const tabRefs: Record<number, React.RefObject<any>> = {
      1: personalInfoRef,
      2: contactInfoRef,
      3: educationInfoRef,
      4: workExperienceInfoRef,
      5: salaryInfoRef,
      6: relativesInfoRef,
      7: trainingInfoRef,
      8: performanceIndicatorsInfoRef,
      9: vacationTripInfoRef,
      10: militaryInfoRef,
    };

    const currentTabRef = tabRefs[currentStep]?.current;

    // Optimization: Skip save if Step 1 is already completed and has no changes.
    const canSkipSave =
      currentStep === 1 &&
      isStepCompleted(currentStep) &&
      currentTabRef &&
      !currentTabRef.isDirty();

    if (canSkipSave) {
      nextStep();
      return;
    }

    if (currentTabRef) {
      currentTabRef.submit();
    } else if (isStepCompleted(currentStep)) {
      nextStep();
    }
  };

  const handleFinalConfirmSave = async () => {
    const noteTrimmed = usernameCreateNote.trim();
    /** Boş olduqda API-yə `null` gedir */
    const noteForApi: string | null = !usernameCreateChecked
      ? null
      : noteTrimmed === ""
        ? null
        : noteTrimmed;

    setUsernameCreateOptions(usernameCreateChecked, noteForApi);

    if (!personId) {
      toast.error("İşçi ID tapılmadı");
      return;
    }
    if (!employeeId) {
      toast.error("Employment ID tapılmadı");
      return;
    }
    if (!rootCompanyId) {
      toast.error("Şirkət seçilməyib");
      return;
    }

    setIsCompletingFinal(true);
    try {
      const response = (await createWorkerService.completeEmployee({
        personId,
        employeeId,
        rootCompanyId,
        isCreateUsername: usernameCreateChecked,
        note: noteForApi,
      })) as { isSuccess?: boolean; errorMessage?: string | null };

      if (response?.isSuccess === false) {
        toast.error(
          response?.errorMessage ?? "Təsdiqləmə zamanı xəta baş verdi",
        );
        return;
      }

      closeFinalConfirmModal();
      setIsSuccessModalOpen(true);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(getBackendErrorMessage(error));
      } else {
        toast.error("Təsdiqləmə zamanı xəta baş verdi");
      }
    } finally {
      setIsCompletingFinal(false);
    }
  };

  const handleSuccessContinue = () => {
    setIsSuccessModalOpen(false);
    triggerGlobalReset();
    setCurrentStep(1);
    setVisitedSteps([1]);
    setIsTabDirty(false);
  };

  const renderTabContent = () => {
    return (
      <>
        {visitedSteps.includes(1) && (
          <div style={{ display: currentStep === 1 ? "block" : "none" }}>
            <PersonalInfoTab
              ref={personalInfoRef}
              pageMode={pageMode}
              onDirtyChange={(dirty) => {
                if (currentStep === 1) setIsTabDirty(dirty);
              }}
            />
          </div>
        )}
        {visitedSteps.includes(2) && (
          <div style={{ display: currentStep === 2 ? "block" : "none" }}>
            <ContactInfoTab
              ref={contactInfoRef}
              onDirtyChange={(dirty) => {
                if (currentStep === 2) setIsTabDirty(dirty);
              }}
            />
          </div>
        )}
        {visitedSteps.includes(3) && (
          <div style={{ display: currentStep === 3 ? "block" : "none" }}>
            <EducationInfoTab ref={educationInfoRef} />
          </div>
        )}
        {visitedSteps.includes(4) && (
          <div style={{ display: currentStep === 4 ? "block" : "none" }}>
            <WorkExperienceInfoTab ref={workExperienceInfoRef} />
          </div>
        )}
        {visitedSteps.includes(5) && (
          <div style={{ display: currentStep === 5 ? "block" : "none" }}>
            <SalaryInfoTab ref={salaryInfoRef} />
          </div>
        )}
        {visitedSteps.includes(6) && (
          <div style={{ display: currentStep === 6 ? "block" : "none" }}>
            <RelativesInfoTab ref={relativesInfoRef} />
          </div>
        )}
        {visitedSteps.includes(7) && (
          <div style={{ display: currentStep === 7 ? "block" : "none" }}>
            <TrainingInfoTab ref={trainingInfoRef} />
          </div>
        )}
        {visitedSteps.includes(8) && (
          <div style={{ display: currentStep === 8 ? "block" : "none" }}>
            <PerformanceIndicatorsTab ref={performanceIndicatorsInfoRef} />
          </div>
        )}
        {visitedSteps.includes(9) && (
          <div style={{ display: currentStep === 9 ? "block" : "none" }}>
            <VacationTripInfoTab ref={vacationTripInfoRef} />
          </div>
        )}
        {visitedSteps.includes(10) && (
          <div style={{ display: currentStep === 10 ? "block" : "none" }}>
            <MilitaryInfoTab ref={militaryInfoRef} />
          </div>
        )}
      </>
    );
  };

  if (!isPageInitialized) {
    return (
      <div className={styles.container}>
        <PageHeader title="İşçi məlumatları" />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <PageHeader title="İşçi məlumatları">
        {hasPendingWorkExperienceApproval && (
          <div className={styles.pendingWarning}>
            <MdOutlineWarningAmber
              className={styles.pendingWarningIcon}
              aria-hidden="true"
            />
            <span>Təsdiq gözlənilir.</span>
          </div>
        )}
      </PageHeader>

      <div className={styles.stepperSection}>
        <StatusStepper
          currentStep={currentStep}
          maxReachedStep={maxReachedStep}
          onStepChange={setCurrentStep}
          maxClickableStep={allowDirectStepClick ? undefined : maxReachedStep}
        />
      </div>

      <div className={styles.content}>
        <div ref={tabContentRef} className={styles.tabContent}>
          {renderTabContent()}
        </div>
        <EmployeeDetailsTabActions
          currentStep={currentStep}
          totalSteps={TOTAL_STEPS}
          onPrev={prevStep}
          onSaveAndNext={handleSaveAndNext}
          isDirty={isTabDirty}
          nextLabel={currentStep === 7 ? "Növbəti" : undefined}
          disablePrimary={isFinalConfirmDisabled}
          hidePrimary={isFinalConfirmHidden}
        />
      </div>

      <>
        <Modal
          isOpen={isFinalConfirmOpen}
          onClose={closeFinalConfirmModal}
          title={
            <span className={styles.finalConfirmTitle}>Təsdiq edilsin?</span>
          }
          size="md"
          className={styles.finalConfirmModalContainer}
        >
          <div className={styles.finalConfirmModal}>
            <Checkbox
              id="final-confirm-username-create"
              checked={usernameCreateChecked}
              className={styles.finalConfirmCheckbox}
              onChange={(checked) => {
                setUsernameCreateChecked(checked);
                if (!checked) setUsernameCreateNote("");
              }}
              label="İstifadəçi adı yaratmaq istəyirsiniz?"
            />
            {usernameCreateChecked ? (
              <FormTextarea
                id="final-confirm-username-note"
                label=""
                placeholder="Qeyd yazın"
                value={usernameCreateNote}
                onChange={setUsernameCreateNote}
                rows={4}
              />
            ) : null}
            <div className={styles.finalConfirmActions}>
              <Button
                type="button"
                variant="outline"
                className={styles.modalBtn}
                onClick={() => void handleFinalConfirmSave()}
                disabled={isCompletingFinal}
              >
                Yadda saxla
              </Button>
            </div>
          </div>
        </Modal>

        <Modal
          isOpen={isSuccessModalOpen}
          onClose={() => setIsSuccessModalOpen(false)}
          title={
            <span className={styles.successModalTitle}>
              Əməliyyat uğurlu tamamlandı
            </span>
          }
          size="sm"
          className={styles.successModalContainer}
          showCloseButton={false}
        >
          <div className={styles.successModalBody}>
            <div className={styles.successIconWrap}>
              <CheckCircleIcon className={styles.successCheckIcon} />
            </div>
            <Button
              type="button"
              variant="secondary"
              className={styles.modalBtn}
              onClick={handleSuccessContinue}
            >
              Oldu
            </Button>
          </div>
        </Modal>
      </>
    </div>
  );
};
