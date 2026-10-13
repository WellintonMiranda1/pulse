export function normalizeUsername(value = '') {
  return String(value).trim().toLocaleLowerCase('pt-BR');
}

// Hash local simples para a versão demonstrativa. A versão com backend deverá usar
// autenticação server-side (ex.: Supabase/Auth) e nunca depender apenas do navegador.
export function hashPassword(value = '') {
  const text = String(value);
  let h1 = 0xdeadbeef ^ text.length;
  let h2 = 0x41c6ce57 ^ text.length;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return `${(h2 >>> 0).toString(16).padStart(8, '0')}${(h1 >>> 0).toString(16).padStart(8, '0')}`;
}

export const DEFAULT_DEMO_PASSWORD = '12345';
