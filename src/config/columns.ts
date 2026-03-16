/**
 * Colunas da planilha de submissions (inscrições).
 */
export const COLUMN_NAMES: string[] = [
  'Submitted At',
  'Email',
  'Convidado Por Nome',
  'Convidado Por Sobrenome',
  'Igreja',
  'Nome',
  'Subject',
  'Telefone',
]

/** Colunas numéricas (esta planilha não tem; usamos contagem por data). */
export const NUMERIC_COLUMN_KEYS: string[] = []

/** Coluna de data para gráfico de evolução (inscrições por dia). */
export const DATE_COLUMN_KEY: string | null = 'Submitted At'

/** Coluna com nome da igreja (para indicador metodista / outras). */
export const IGREJA_COLUMN_KEY: string = 'Igreja'

/** Coluna com nome da pessoa (para indicador homens/mulheres). */
export const NOME_COLUMN_KEY: string = 'Nome'
