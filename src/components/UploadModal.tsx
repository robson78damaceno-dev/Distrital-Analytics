import { useState, useCallback } from 'react'
import { UploadZone } from './UploadZone'
import type { DataRow } from '../types'
import styles from './UploadModal.module.css'

const UPLOAD_PASSWORD = 'Admin123456**'

type Props = {
  open: boolean
  onClose: () => void
  onFileLoaded: (rows: DataRow[], columns: string[]) => void
}

export function UploadModal({ open, onClose, onFileLoaded }: Props) {
  const [step, setStep] = useState<'password' | 'upload'>('password')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmitPassword = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      setError('')
      if (password === UPLOAD_PASSWORD) {
        setStep('upload')
        setPassword('')
      } else {
        setError('Senha incorreta.')
      }
    },
    [password],
  )

  const handleFileLoaded = useCallback(
    (rows: DataRow[], columns: string[]) => {
      onFileLoaded(rows, columns)
      onClose()
      setStep('password')
    },
    [onFileLoaded, onClose],
  )

  const handleClose = useCallback(() => {
    onClose()
    setStep('password')
    setPassword('')
    setError('')
  }, [onClose])

  if (!open) return null

  return (
    <div className={styles.overlay} onClick={handleClose} role="dialog" aria-modal="true" aria-labelledby="upload-modal-title">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 id="upload-modal-title" className={styles.title}>
            {step === 'password' ? 'Acesso restrito' : 'Enviar planilha'}
          </h2>
          <button type="button" className={styles.closeBtn} onClick={handleClose} aria-label="Fechar">
            ×
          </button>
        </div>
        <div className={styles.body}>
          {step === 'password' ? (
            <form onSubmit={handleSubmitPassword} className={styles.form}>
              <label htmlFor="upload-password" className={styles.label}>
                Senha
              </label>
              <div className={styles.passwordWrap}>
                <input
                  id="upload-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.input}
                  placeholder="Digite a senha"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className={styles.togglePassword}
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  title={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? '🙈' : '👁'}
                </button>
              </div>
              {error && <p className={styles.error}>{error}</p>}
              <button type="submit" className={styles.submitBtn}>
                Acessar
              </button>
            </form>
          ) : (
            <UploadZone onFileLoaded={handleFileLoaded} />
          )}
        </div>
      </div>
    </div>
  )
}
