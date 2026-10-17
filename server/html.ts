const ENTITIES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}

/** Escape text for use in HTML element content and quoted attribute values. */
export const escapeHtml = (value: string): string => value.replace(/[&<>"']/g, (ch) => ENTITIES[ch] ?? ch)
