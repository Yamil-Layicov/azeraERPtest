/**
 * Metni belirtilen karakter limitine göre kısaltır ve "..." ekler
 * En yakın tam kelimeyi gösterir (kelimeyi yarıda kesmez)
 * @param text - Kısaltılacak metin
 * @param maxLength - Maksimum karakter uzunluğu (varsayılan: 30)
 * @returns Kısaltılmış metin veya orijinal metin
 */
export function truncateText(text: string, maxLength: number = 30): string {
  if (!text || text.length <= maxLength) {
    return text;
  }

  // İlk maxLength karakteri al
  let truncated = text.substring(0, maxLength);
  
  // Eğer son karakter bir boşluk veya ayırıcı değilse, en yakın boşluk/ayırıcıyı bul
  const lastChar = truncated[truncated.length - 1];
  const separators: readonly string[] = [' ', '/', '-', '_', '.', ',', '(', ')'];
  
  // Son karakter bir ayırıcı değilse, geriye doğru en yakın ayırıcıyı bul
  if (lastChar !== undefined && !separators.includes(lastChar)) {
    let lastSeparatorIndex = -1;
    
    // Geriye doğru ayırıcı ara
    for (let i = truncated.length - 1; i >= 0; i--) {
      const char = truncated[i];
      if (char !== undefined && separators.includes(char)) {
        lastSeparatorIndex = i;
        break;
      }
    }
    
    // Eğer ayırıcı bulunduysa, o noktaya kadar kes
    if (lastSeparatorIndex > 0) {
      truncated = truncated.substring(0, lastSeparatorIndex + 1);
    }
    // Ayırıcı bulunamazsa, maxLength'e kadar kes (kelimeyi yarıda keser ama en azından limiti aşmaz)
  }
  
  return truncated.trim() + "...";
}
