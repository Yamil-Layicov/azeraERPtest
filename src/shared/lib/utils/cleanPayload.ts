export function cleanPayload<T>(obj: T): T {
  if (Array.isArray(obj)) {
    return obj.map(cleanPayload) as any;
  }
  
  if (obj !== null && typeof obj === "object" && !(obj instanceof Date)) {
    const entries = Object.entries(obj).map(([key, value]) => [
      key,
      cleanPayload(value),
    ]);
    return Object.fromEntries(entries) as any;
  }
  
  return (obj === "" || obj === undefined ? null : obj) as any;
}
