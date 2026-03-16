import { useState, useRef, useEffect } from 'react'
import styles from './Header.module.css'

type Props = {
  onUploadClick?: () => void
}

export function Header({ onUploadClick }: Props) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    if (menuOpen) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [menuOpen])

  return (
    <header className={styles.header}>
      <div className={styles.wrap}>
        <div className={styles.brand}>
          <span className={styles.cross} aria-hidden>✝</span>
          <h1 className={styles.title}>Distrital Analytics</h1>
        </div>
        {onUploadClick && (
          <div className={styles.menuWrap} ref={menuRef}>
            <button
              type="button"
              className={styles.menuBtn}
              onClick={() => setMenuOpen((o) => !o)}
              aria-expanded={menuOpen}
              aria-haspopup="true"
              aria-label="Abrir menu"
            >
              <span className={styles.menuIcon} aria-hidden>☰</span>
            </button>
            {menuOpen && (
              <div className={styles.dropdown}>
                <button
                  type="button"
                  className={styles.dropdownItem}
                  onClick={() => {
                    onUploadClick()
                    setMenuOpen(false)
                  }}
                >
                  📄 Enviar planilha
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
