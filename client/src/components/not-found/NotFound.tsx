import styles from './NotFound.module.scss'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className={styles.wrapper}>
      <h1>Oops! You seem to be lost.</h1>
      <p>Here are some helpful links:</p>
      <div className={styles.links}>
        <Link to='/'>Home</Link>
        <Link to='/favorites'>Favorites</Link>
        <Link to='/products'>Products</Link>
      </div>
    </div>
  )
}

export default NotFound
