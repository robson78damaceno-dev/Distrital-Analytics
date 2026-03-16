import styles from './RotateScreen.module.css'

export function RotateScreen() {
  return (
    <div className={styles.overlay} aria-hidden>
      <div className={styles.content}>
        <div className={styles.icon} aria-hidden>
          <img src="/celular-rotate.png" alt="" className={styles.iconImage} />
        </div>
        <p className={styles.text}>Gire o celular para o modo paisagem</p>
        <p className={styles.hint}>O dashboard funciona melhor com a tela na horizontal</p>
      </div>
    </div>
  )
}
