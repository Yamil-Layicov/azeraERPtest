import { useSearchParams } from "react-router-dom";

export const FORGOT_STEPS = {
  USERNAME: "1",
  CHANNEL: "2",
  CODE: "3",
  PASSWORD: "4",
} as const;

export type ForgotStep = (typeof FORGOT_STEPS)[keyof typeof FORGOT_STEPS];

export const useForgotSteps = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentStep = (searchParams.get("step") as ForgotStep) ?? FORGOT_STEPS.USERNAME;

  const goToStep = (step: ForgotStep) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("step", step);
    setSearchParams(nextParams);
  };

  return {
    currentStep,
    goToStep,
  };
};
