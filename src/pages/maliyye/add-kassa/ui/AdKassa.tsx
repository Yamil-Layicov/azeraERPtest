import styles from "./AddKassa.module.css";
import {
  RadioSwitch,
  Button,
  SuccessModal,
  ErrorModal,
  PageHeader,
} from "@/shared/ui";
import ConfirmModal from "@/shared/ui/modal/confirm/ConfirmModal";
import AddOptionModal from "@/shared/ui/modal/add-option/AddOptionModal";
import { useAddKassaPage } from "../model/useAddKassaPage";

import TransferForm from "./forms/TransferForm";
import IncomeForm from "./forms/IncomeForm";
import ExpenseForm from "./forms/ExpenseForm";

function AddKassaPage() {
  const pageProps = useAddKassaPage();
  const {
    formData,
    updateField,
    handleSubmit,
    handleClear,
    isAddModalOpen,
    activeAddTarget,
    handleCloseAddModal,
    handleSaveNewOption,
    hideSuccess,
    hideError,
    errorMessage,
    isPending,
    isEditMode,
    isFetchingExisting,
    isRejectConfirmModalOpen,
    handleConfirmReject,
    hideConfirmModal,
  } = pageProps;

  if (isFetchingExisting) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        Məlumatlar yüklənir...
      </div>
    );
  }

  return (
    <div className={styles.formContainer}>
      <PageHeader
        title={isEditMode ? "Əməliyyata Düzəliş" : "Kassa Əməliyyatı"}
        className={styles.customHeader}
      >
        <RadioSwitch
          label=""
          name="transactionType"
          value={formData.transactionType}
          onChange={(value) => {
            updateField("transactionType", value);
          }}
          options={[
            { value: "mədaxil", label: "Mədaxil" },
            { value: "kocurme", label: "Köçürmə" },
            { value: "məxaric", label: "Məxaric" },
          ]}
          disabled={isEditMode} 
        />
      </PageHeader>

      <form className={styles.form} onSubmit={handleSubmit}>
        {formData.transactionType === "kocurme" && (
          <TransferForm props={pageProps} />
        )}
        {formData.transactionType === "mədaxil" && (
          <IncomeForm props={pageProps} />
        )}
        {formData.transactionType === "məxaric" && (
          <ExpenseForm props={pageProps} />
        )}
        <div className={styles.buttonGroupContainer}>
          {isEditMode && pageProps.creatorInfo && (
            <div className={styles.creatorInfo}>
              <span>
                <b>Yaradib:</b> {pageProps.creatorInfo.creatorName || "-"}
              </span>
              <span>
                <b>Tarix:</b>{" "}
                {pageProps.creatorInfo.createdDate
                  ? new Date(pageProps.creatorInfo.createdDate).toLocaleString(
                      "az-AZ",
                    )
                  : "-"}
              </span>
            </div>
          )}
          <div className={styles.buttonGroup}>
            <Button type="submit" variant="primary" disabled={isPending}>
              {isPending
                ? "Gözləyin..."
                : isEditMode
                  ? "Yadda Saxla"
                  : "Əlavə et"}
            </Button>
            {isEditMode && (
              <Button
                type="button"
                variant="danger-ghost"
                onClick={pageProps.handleCancel}
              >
                İmtina et
              </Button>
            )}
            {!isEditMode && (
              <Button type="button" variant="clear" onClick={handleClear}>
                Təmizlə
              </Button>
            )}
          </div>
        </div>
      </form>

      <AddOptionModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        onSave={handleSaveNewOption}
        title={
          activeAddTarget === "counterparty"
            ? "Yeni Kontragent"
            : activeAddTarget === "business"
              ? "Yeni Biznes"
              : "Yeni Təyinat"
        }
      />

      <SuccessModal
        isOpen={formData.showSuccessModal}
        onClose={hideSuccess}
        title="Uğurlu Əməliyyat"
        text="Əməliyyat uğurla başa çatdı"
        primaryButtonText="Çap et"
        secondaryButtonText="Bağla"
        onPrimaryAction={() => {}} // Çap et funksionallığı hələlik yoxdur
        onSecondaryAction={hideSuccess}
      />
      <ErrorModal
        isOpen={formData.showErrorModal}
        onClose={hideError}
        text={errorMessage}
      />

      <ConfirmModal
        isOpen={isRejectConfirmModalOpen}
        onClose={hideConfirmModal}
        onConfirm={handleConfirmReject}
        title="Əməliyyatdan imtina"
        message="Bu əməliyyatdan imtina etmək istədiyinizə əminsiniz?"
        confirmText="Bəli"
        cancelText="Xeyr"
        variant="danger"
        isLoading={isPending}
      />
    </div>
  );
}

export default AddKassaPage;
