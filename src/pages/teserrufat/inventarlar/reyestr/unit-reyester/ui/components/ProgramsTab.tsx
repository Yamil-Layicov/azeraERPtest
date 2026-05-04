import React, { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FolderIcon from "@mui/icons-material/Folder";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import styles from "./ProgramsTab.module.css";
import { mockBusinessUnits } from "../../model/mockData";
import type { BusinessUnit } from "../../model/mockData";
import { CustomSelect, Button } from "@/shared/ui";
import AddProgramModal from "./AddProgramModal";

interface ProgramsTabProps {
  filter: string;
  setFilter: (value: string) => void;
}

const ProgramsTab: React.FC<ProgramsTabProps> = ({ filter, setFilter }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const unitOptions = [
    { id: "all", label: "Biznes vahidi (hamısı)" },
    ...mockBusinessUnits.map((unit) => ({ id: unit.id, label: unit.name })),
  ];

  const departmentOptions = mockBusinessUnits.map((unit) => ({
    id: unit.id,
    label: unit.name,
  }));

  return (
    <>
      <div className={styles.filterSection}>
        <div className={styles.filterTitle}>Proqramlar</div>
        <div className={styles.filterControls}>
          <div className={styles.filterSelect}>
            <CustomSelect
              options={unitOptions}
              value={unitOptions.find((opt) => opt.id === filter) || null}
              onChange={(opt) => setFilter(opt?.id ? String(opt.id) : "all")}
              isClearable={false}
              defaultText="Biznes vahidi seçin"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setIsAddModalOpen(true)}
            className={styles.addProgramBtn}
            type="button"
          >
            <AddIcon className={styles.addBtnIcon} />
            Add
          </Button>
        </div>
      </div>

      <div className={styles.accordionList}>
        {mockBusinessUnits
          .filter((unit) => filter === "all" || unit.id === filter)
          .map((unit: BusinessUnit) => (
            <Accordion
              key={unit.id}
              className={styles.unitAccordion}
              elevation={0}
              disableGutters
            >
              <AccordionSummary
                expandIcon={
                  <ExpandMoreIcon className={styles.unitExpandIcon} />
                }
                className={styles.unitAccordionSummary}
              >
                <div className={styles.unitHeader}>
                  <div className={styles.unitHeaderContent}>
                    <span className={styles.unitNameTag}>{unit.name}</span>
                    <span className={styles.unitTitle}>Proqramlar</span>
                  </div>
                  <span className={styles.countBadge}>
                    {unit.programs.length}
                  </span>
                </div>
              </AccordionSummary>
              <AccordionDetails className={styles.unitAccordionDetails}>
                {unit.programs.length > 0 ? (
                  unit.programs.map((program) => (
                    <Accordion
                      key={program.id}
                      className={styles.programAccordion}
                      elevation={0}
                      disableGutters
                    >
                      <AccordionSummary
                        expandIcon={
                          <ExpandMoreIcon className={styles.programExpandIcon} />
                        }
                        className={styles.programSummary}
                      >
                        <div className={styles.programHeader}>
                          <FolderIcon
                            className={styles.programIcon}
                            fontSize="small"
                          />
                          <span className={styles.programName}>
                            {program.name}
                          </span>
                        </div>
                      </AccordionSummary>
                      <AccordionDetails
                        className={styles.programDetailsContainer}
                      >
                        <div className={styles.programContentGrid}>
                          <div className={styles.programTextSection}>
                            <div className={styles.programInfoGroup}>
                              <span className={styles.programInfoLabel}>
                                <InfoOutlinedIcon sx={{ fontSize: 16 }} />
                                TƏYİNATI
                              </span>
                              <p className={styles.programDescription}>
                                {program.description ||
                                  "Bu proqram üçün hələ ki, təyinat məlumatı əlavə edilməyib."}
                              </p>
                            </div>

                            {program.features &&
                              program.features.length > 0 && (
                                <div className={styles.programInfoGroup}>
                                  <span className={styles.programInfoLabel}>
                                    <CheckCircleOutlineIcon
                                      sx={{ fontSize: 16 }}
                                    />
                                    FUNKSİONALLIQLAR
                                  </span>
                                  <div className={styles.programFeaturesList}>
                                    {program.features.map((feature, i) => (
                                      <div
                                        key={i}
                                        className={styles.programFeatureItem}
                                      >
                                        <div className={styles.featureDot} />
                                        {feature}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                          </div>

                          {/* Sağ tərəf - Şəkil */}
                          <div className={styles.programImageSection}>
                            <div className={styles.programImageWrapper}>
                              {program.image ? (
                                <img
                                  src={program.image}
                                  alt={program.name}
                                  className={styles.programImage}
                                />
                              ) : (
                                <div className={styles.noVisualData}>
                                  <FolderIcon className={styles.noVisualIcon} />
                                  <span className={styles.noVisualText}>
                                    Vizual Məlumat Yoxdur
                                  </span>
                                </div>
                              )}
                            </div>
                            <span className={styles.programImageHint}>
                              Şəkilə klikləyərək tam ölçüdə baxa bilərsiniz.
                            </span>
                          </div>
                        </div>

                        <div className={styles.programActions}>
                          <Button
                            variant="outline"
                            className={styles.editBtn}
                            type="button"
                          >
                            <EditIcon className={styles.editBtnIcon} fontSize="small" />
                            Düzəliş et
                          </Button>
                          <Button
                            variant="outline"
                            className={styles.deleteBtn}
                            type="button"
                          >
                            <DeleteIcon className={styles.deleteBtnIcon} fontSize="small" />
                            Məlumatı sil
                          </Button>
                        </div>
                      </AccordionDetails>
                    </Accordion>
                  ))
                ) : (
                  <div className={styles.noDataFound}>
                    Məlumat tapılmadı
                  </div>
                )}
              </AccordionDetails>
            </Accordion>
          ))}
      </div>

      <AddProgramModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        departmentOptions={departmentOptions}
      />
    </>
  );
};

export default ProgramsTab;
