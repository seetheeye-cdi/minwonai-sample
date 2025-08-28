export function isEmptyStringOrNil(
  value: unknown
): value is "" | null | undefined {
  return value == null || value === "";
}
