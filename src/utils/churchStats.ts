import type { DataRow } from '../types'

/**
 * Corrige texto que foi lido com encoding errado (UTF-8 interpretado como Latin-1).
 * Ex: "CeilÃ¢ndia" → "Ceilândia"
 */
export function fixUtf8Mojibake(str: string): string {
  if (typeof str !== 'string' || !str) return str
  try {
    const bytes = new Uint8Array([...str].map((c) => c.charCodeAt(0) & 0xff))
    const decoded = new TextDecoder('utf-8').decode(bytes)
    if (decoded.includes('\uFFFD')) return str
    return decoded
  } catch {
    return str
  }
}

function normalizeToken(value: string): string {
  return fixUtf8Mojibake(String(value ?? ''))
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

/** Considera metodista se a string da igreja contém "metodista" (case insensitive). */
export function isMetodista(igreja: string | number): boolean {
  const s = normalizeToken(String(igreja ?? ''))
  if (!s) return false
  return s.includes('metodista')
}

/**
 * Normaliza o nome da igreja para a região/unidade: Taguatinga Norte, Fazenda Velha, Sol Nascente, etc.
 * Todas são Igreja Metodista; o que muda é a região (Taguatinga Norte, Fazenda Velha, Sol Nascente...).
 */
export function normalizarRegiaoIgreja(igreja: string | number): string {
  const raw = fixUtf8Mojibake(String(igreja ?? '').trim())
  const s = normalizeToken(raw)
  if (!s) return '(em branco)'
  if (s.includes('taguatinga norte')) return 'Taguatinga Norte'
  if (s.includes('fazenda velha')) return 'Fazenda Velha'
  if (s.includes('sol nascente')) return 'Sol Nascente'
  // Ceilândia Norte / Cei Norte (qualquer coisa que tenha "ceilandia" e "norte")
  if ((s.includes('ceilandia') || s.includes('cei')) && s.includes('norte')) {
    return 'Ceilândia Norte'
  }
  // Ceilândia Sul / Cei Sul (qualquer coisa que tenha "ceilandia" e "sul")
  if ((s.includes('ceilandia') || s.includes('cei')) && s.includes('sul')) {
    return 'Ceilândia Sul'
  }
  if (s.includes('alphaville')) return 'Alphaville'
  if (s.includes('samambaia')) return 'Samambaia'
  if (s.includes('setor o')) return 'Setor O'
  if (s.includes('taguatinga centro')) return 'Taguatinga Centro'
  if (s.includes('nenhuma') || s.includes('visitante')) return 'Nenhuma / Visitante'
  if (s.includes('familia da fe')) return 'Família da Fé'
  if (s === 'icr') return 'ICR'
  return raw || '(em branco)'
}

/** Primeiros nomes comuns no Brasil para inferir gênero. Quem não estiver na lista fica "Não identificado". */
const NOMES_FEMININOS = new Set([
  'ana', 'maria', 'luiza', 'luisa', 'isabela', 'julia', 'júlia', 'beatriz', 'mariana', 'gabriela',
  'laura', 'fernanda', 'camilly', 'camilly', 'nicoly', 'iandra', 'milena', 'mirella', 'cecília', 'cecilia',
  'sinthya', 'anna', 'lorrany', 'isadora', 'isabelle', 'catia', 'cátia', 'ana lívia',
  'nicoly', 'iandra', 'milena', 'mirella', 'cecília', 'sinthya', 'anna isabel', 'anna vitoria', 'ana heloísa',
  'ana heloisa', 'ana júlia', 'ana julia',
])

const NOMES_MASCULINOS = new Set([
  'gustavo', 'andre', 'andré', 'paulo', 'marcos', 'davi', 'cleber', 'hugo', 'arthur', 'julio', 'júlio',
  'theo', 'william', 'guguinha',
])

export type Genero = 'M' | 'F' | null

export function inferirGeneroPeloNome(nomeCompleto: string | number): Genero {
  const s = String(nomeCompleto ?? '').trim()
  if (!s) return null
  const primeiro = s.split(/\s+/)[0]?.toLowerCase().normalize('NFD').replace(/\u0300/g, '') ?? ''
  if (NOMES_FEMININOS.has(primeiro)) return 'F'
  if (NOMES_MASCULINOS.has(primeiro)) return 'M'
  return null
}

export function getPeakDay(data: DataRow[], dateKey: string): { date: string; count: number } | null {
  const byDate: Record<string, number> = {}
  for (const row of data) {
    const val = row[dateKey]
    const s = String(val ?? '')
    const dateStr = /^\d{4}-\d{2}-\d{2}/.test(s) ? s.slice(0, 10) : s
    if (!dateStr) continue
    byDate[dateStr] = (byDate[dateStr] ?? 0) + 1
  }
  let maxCount = 0
  let peakDate: string | null = null
  for (const [date, count] of Object.entries(byDate)) {
    if (count > maxCount) {
      maxCount = count
      peakDate = date
    }
  }
  if (!peakDate) return null
  return { date: peakDate, count: maxCount }
}

/** Formata data para exibição: dia/mês/ano (dd/mm/yyyy). Aceita ISO (yyyy-mm-dd) ou já dd/mm/yyyy. */
export function formatarDataExibicao(dateStr: string): string {
  const s = String(dateStr ?? '').trim()
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) {
    const [y, m, d] = s.slice(0, 10).split('-')
    if (d && m && y) return `${d}/${m}/${y}`
  }
  if (/^\d{1,2}\/\d{1,2}\/\d{4}/.test(s)) return s
  return s
}
