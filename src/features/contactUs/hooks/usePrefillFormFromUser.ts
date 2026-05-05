// shared/hooks/usePrefillFormFromUser.ts

import { useEffect, useRef } from 'react';

interface PrefillConfig<T> {
  currentUser: any;
  setForm: React.Dispatch<React.SetStateAction<T>>;
  mapUserToForm: (user: any) => Partial<T>;
  shouldPrefill?: (form: T) => boolean; // optional override
}

export function usePrefillFormFromUser<T>({
  currentUser,
  setForm,
  mapUserToForm,
  shouldPrefill,
}: PrefillConfig<T>) {
  const hasPrefilled = useRef(false);

  useEffect(() => {
    if (!currentUser || hasPrefilled.current) return;

    setForm((prev) => {
      const canPrefill = shouldPrefill
        ? shouldPrefill(prev)
        : Object.values(prev as any).every((v) => !v); // default: only if empty

      if (!canPrefill) return prev;

      hasPrefilled.current = true;

      return {
        ...prev,
        ...mapUserToForm(currentUser),
      };
    });
  }, [currentUser, setForm, mapUserToForm, shouldPrefill]);
}
