/**
 * Tarihi yerel zaman dilimine göre YYYY-MM-DD formatında döner.
 * toISOString() kullanımındaki '1 gün geri kayma' (timezone offset) bug'ını engeller.
 * @param date - Formatlanacak Date objesi, null veya undefined
 * @returns YYYY-MM-DD formatında string veya null
 */
export const formatDateToYMD = (date: Date | null | undefined): string | null => {
  if (!date) return null;
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return null;

  // toLocaleDateString("en-CA") yerel saati bozmadan YYYY-MM-DD formatını (ISO-like) verir.
  // Bu yöntem UTC dönüşümü yapmadığı için timezone kaynaklı gün kaymalarını önler.
  return d.toLocaleDateString("en-CA");
};

/**
 * UI-da tarixləri dd.mm.yyyy (nöqtə ilə) göstərir (məs. 10.01.2025).
 * Yerel tarix komponentləri istifadə olunur; UTC sürüşməsi yoxdur.
 */
export const formatDateDisplayDDMMYYYY = (date: Date | null | undefined): string => {
  if (!date) return "-";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "-";
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}.${month}.${year}`;
};
