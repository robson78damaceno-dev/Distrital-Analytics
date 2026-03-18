import * as XLSX from 'xlsx'
import type { DataRow } from '../types'

function parseValue(val: unknown): string | number {
  if (val == null || val === '') return ''
  if (typeof val === 'number' && !Number.isNaN(val)) return val
  if (typeof val === 'string') {
    const trimmed = val.trim()
    const num = Number(trimmed.replace(/\./g, '').replace(',', '.'))
    if (trimmed !== '' && !Number.isNaN(num)) return num
    return trimmed
  }
  return String(val)
}

/**
 * Parse planilha a partir de string (CSV ou conteúdo de arquivo).
 * Retorna { rows, columns } ou null se falhar.
 */
export function parseSpreadsheetFromString(content: string): { rows: DataRow[]; columns: string[] } | null {
  try {
    const wb = XLSX.read(content, { type: 'string' })
    const firstSheet = wb.SheetNames[0]
    if (!firstSheet) return null
    const sheet = wb.Sheets[firstSheet]
    const json = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as unknown[][]
    if (json.length < 2) return null
    const headers = (json[0] as unknown[]).map((h) => String(h ?? ''))
    const rows: DataRow[] = []
    for (let i = 1; i < json.length; i++) {
      const row = json[i] as unknown[]
      const obj: DataRow = {}
      headers.forEach((h, j) => {
        const key = h || `Col${j}`
        obj[key] = parseValue(row[j])
      })
      rows.push(obj)
    }
    return { rows, columns: headers.filter(Boolean) }
  } catch {
    return null
  }
}
