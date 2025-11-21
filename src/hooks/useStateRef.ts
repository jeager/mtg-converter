import { useEffect, useRef, useState } from "react";

/**
 * Custom hook that combines useState with a ref that stays in sync
 * Useful for accessing the latest state value in callbacks without dependencies
 *
 * @param initialValue - The initial value for both state and ref
 * @returns A tuple of [value, setValue, ref] where ref.current always has the latest value
 */
export const useStateRef = <T>(initialValue: T) => {
  const [value, setValue] = useState<T>(initialValue);
  const ref = useRef<T>(initialValue);

  // Keep ref in sync with state
  useEffect(() => {
    ref.current = value;
  }, [value]);

  // Update state when initialValue changes
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return [value, setValue, ref] as const;
};
