import { useState, useCallback } from "react";
import type { EmployeeFormData } from "../../employee-shared/model/types";

export const useEmployeeFormData = () => {
  const [formData, setFormData] = useState<EmployeeFormData>({
    firstName: "",
    birthDate: null,
    lastName: "",
    gender: null,
    fatherName: "",
    fin: "",
    username: "",
    isActive: true,
    group: [],
    password: "",
    company: null,
    position: null,
    experienceType: null,
    isLeader: false,
  });

  const handleInputChange = useCallback((field: keyof EmployeeFormData, value: EmployeeFormData[keyof EmployeeFormData]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const resetFormData = useCallback(() => {
    setFormData({
      firstName: "",
      birthDate: null,
      lastName: "",
      gender: null,
      fatherName: "",
      fin: "",
      username: "",
      isActive: true,
      group: [],
      password: "",
      company: null,
      position: null,
      experienceType: null,
      isLeader: false,
    });
  }, []);

  return {
    formData,
    setFormData,
    handleInputChange,
    resetFormData,
  };
};

