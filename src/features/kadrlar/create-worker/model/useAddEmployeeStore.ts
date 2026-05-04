import { create } from "zustand";

interface AddEmployeeState {
  currentStep: number;
  maxReachedStep: number;
  personId: string | null;
  employeeId: string | null;
  /** 1-ci addımda seçilən şirkət — `employee/complete` üçün */
  rootCompanyId: string | null;
  photoId: string | null;
  pinSearchRawData: any | null;
  globalResetCounter: number;
  completedSteps: number[];
  usernameCreateRequested: boolean;
  usernameCreateNote: string | null;
  hasPendingWorkExperienceApproval: boolean;

  // Actions
  setCurrentStep: (step: number) => void;
  setMaxReachedStep: (step: number) => void;
  setPersonId: (id: string | null) => void;
  setEmployeeId: (id: string | null) => void;
  setRootCompanyId: (id: string | null) => void;
  setPhotoId: (id: string | null) => void;
  setPinSearchRawData: (data: any | null) => void;
  setStepCompleted: (step: number) => void;
  isStepCompleted: (step: number) => boolean;
  nextStep: () => void;
  prevStep: () => void;
  resetStore: () => void;
  triggerGlobalReset: () => void;
  setUsernameCreateOptions: (requested: boolean, note: string | null) => void;
  setHasPendingWorkExperienceApproval: (value: boolean) => void;
}

export const useAddEmployeeStore = create<AddEmployeeState>((set, get) => ({
  currentStep: 1,
  maxReachedStep: 1,
  personId: null,
  employeeId: null,
  rootCompanyId: null,
  photoId: null,
  pinSearchRawData: null,
  globalResetCounter: 0,
  completedSteps: [],
  usernameCreateRequested: false,
  usernameCreateNote: null,
  hasPendingWorkExperienceApproval: false,

  setCurrentStep: (step) => set({ currentStep: step }),
  
  setMaxReachedStep: (step) => set((state) => ({ 
    maxReachedStep: Math.max(state.maxReachedStep, step) 
  })),

  setPersonId: (id) => set({ personId: id }),
  setEmployeeId: (id) => set({ employeeId: id }),

  setRootCompanyId: (id) => set({ rootCompanyId: id }),

  setPhotoId: (id) => set({ photoId: id }),

  setPinSearchRawData: (data) => set({ pinSearchRawData: data }),

  setStepCompleted: (step) => set((state) => ({
    completedSteps: state.completedSteps.includes(step) 
      ? state.completedSteps 
      : [...state.completedSteps, step]
  })),

  isStepCompleted: (step) => get().completedSteps.includes(step),

  nextStep: () => set((state) => {
    const next = state.currentStep + 1;
    return {
      currentStep: next,
      maxReachedStep: Math.max(state.maxReachedStep, next)
    };
  }),

  prevStep: () => set((state) => ({
    currentStep: Math.max(1, state.currentStep - 1)
  })),

  setUsernameCreateOptions: (requested, note) =>
    set({
      usernameCreateRequested: requested,
      usernameCreateNote: note,
    }),
  setHasPendingWorkExperienceApproval: (value) =>
    set({ hasPendingWorkExperienceApproval: value }),

  resetStore: () => set({
    currentStep: 1,
    maxReachedStep: 1,
    personId: null,
    employeeId: null,
    rootCompanyId: null,
    photoId: null,
    pinSearchRawData: null,
    globalResetCounter: 0,
    completedSteps: [],
    usernameCreateRequested: false,
    usernameCreateNote: null,
    hasPendingWorkExperienceApproval: false,
  }),

  triggerGlobalReset: () => set((state) => ({ 
    globalResetCounter: state.globalResetCounter + 1,
    currentStep: 1,
    maxReachedStep: 1,
    personId: null,
    employeeId: null,
    rootCompanyId: null,
    photoId: null,
    pinSearchRawData: null,
    completedSteps: [],
    usernameCreateRequested: false,
    usernameCreateNote: null,
    hasPendingWorkExperienceApproval: false,
  }))
}));
