export function parseBRL(value) {
  let text = String(value ?? '').trim().replace(/R\$/gi, '').replace(/\s/g, '');
  if (!text || !/^[\d.,]+$/.test(text)) return NaN;
  const comma = text.lastIndexOf(',');
  const dot = text.lastIndexOf('.');
  if (comma >= 0) {
    text = text.replace(/\./g, '').replace(',', '.');
  } else if (dot >= 0) {
    const parts = text.split('.');
    if (parts.length > 2 || (parts.length === 2 && parts[1].length === 3)) {
      text = text.replace(/\./g, '');
    }
  }
  const number = Number(text);
  return Number.isFinite(number) ? number : NaN;
}

export function formatBRL(value) {
  return Number(value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
