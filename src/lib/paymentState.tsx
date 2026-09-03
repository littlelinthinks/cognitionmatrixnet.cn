import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";

interface PaymentState {
  unlockedInsiderIds: string[];
  isVip: boolean;
  assessmentPaid: boolean;
  vipActivatedAt: string | null;
}

interface PaymentStateContextValue extends PaymentState {
  unlockInsider: (id: string) => void;
  activateVip: () => void;
  markAssessmentPaid: () => void;
  isInsiderUnlocked: (id: string) => boolean;
  resetAll: () => void;
}

const defaultState: PaymentState = {
  unlockedInsiderIds: [],
  isVip: false,
  assessmentPaid: false,
  vipActivatedAt: null,
};

const STORAGE_KEY = "mn_payment_state";

function loadState(): PaymentState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw);
    return {
      unlockedInsiderIds: Array.isArray(parsed.unlockedInsiderIds) ? parsed.unlockedInsiderIds : [],
      isVip: !!parsed.isVip,
      assessmentPaid: !!parsed.assessmentPaid,
      vipActivatedAt: parsed.vipActivatedAt || null,
    };
  } catch {
    return defaultState;
  }
}

function saveState(state: PaymentState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

const PaymentStateContext = createContext<PaymentStateContextValue>({
  ...defaultState,
  unlockInsider: () => {},
  activateVip: () => {},
  markAssessmentPaid: () => {},
  isInsiderUnlocked: () => false,
  resetAll: () => {},
});

export function PaymentStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PaymentState>(loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const unlockInsider = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      unlockedInsiderIds: prev.unlockedInsiderIds.includes(id)
        ? prev.unlockedInsiderIds
        : [...prev.unlockedInsiderIds, id],
    }));
  }, []);

  const activateVip = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isVip: true,
      vipActivatedAt: new Date().toISOString(),
    }));
  }, []);

  const markAssessmentPaid = useCallback(() => {
    setState((prev) => ({ ...prev, assessmentPaid: true }));
  }, []);

  const isInsiderUnlocked = useCallback(
    (id: string) => state.isVip || state.unlockedInsiderIds.includes(id),
    [state.isVip, state.unlockedInsiderIds]
  );

  const resetAll = useCallback(() => {
    setState(defaultState);
  }, []);

  return (
    <PaymentStateContext.Provider
      value={{ ...state, unlockInsider, activateVip, markAssessmentPaid, isInsiderUnlocked, resetAll }}
    >
      {children}
    </PaymentStateContext.Provider>
  );
}

export function usePaymentState() {
  return useContext(PaymentStateContext);
}
