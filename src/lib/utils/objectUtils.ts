/**
 * ============================================================================
 * OBJECT UTILITIES
 * ============================================================================
 *
 * Helper functions for object manipulation
 *
 * ============================================================================
 */

/**
 * Remove all undefined values from an object
 *
 * This ensures fields are COMPLETELY EXCLUDED from the payload,
 * not sent as "undefined"
 *
 * BEFORE:
 * { name: "John", age: undefined, city: undefined }
 *
 * AFTER:
 * { name: "John" }
 *
 * @param obj - Object to clean
 * @returns New object with undefined values removed
 */
export function stripUndefined<T extends Record<string, any>>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => value !== undefined),
  ) as Partial<T>;
}

/**
 * Remove all falsy values from an object
 *
 * Removes: undefined, null, "", 0, false, NaN
 *
 * @param obj - Object to clean
 * @returns New object with falsy values removed
 */
export function stripFalsy<T extends Record<string, any>>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => Boolean(value)),
  ) as Partial<T>;
}

/**
 * Check if object has any defined values
 *
 * @param obj - Object to check
 * @returns true if object has at least one defined value
 */
export function hasDefinedValues(obj: Record<string, any>): boolean {
  return Object.values(obj).some((value) => value !== undefined);
}

/**
 * Get only the changed fields between two objects
 *
 * @param current - Current state
 * @param initial - Initial state
 * @returns Object with only changed fields
 */
export function getChangedFields<T extends Record<string, any>>(
  current: T,
  initial: T,
): Partial<T> {
  const changes: Partial<T> = {};

  for (const key in current) {
    if (current[key] !== initial[key]) {
      changes[key] = current[key];
    }
  }

  return changes;
}
