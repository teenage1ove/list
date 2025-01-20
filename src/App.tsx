import  List from './components/List/List'
import styles from './App.module.css'

export const App = function () {
	return <div className={styles.app}>
    <h1 className={styles.app__title}>Список репозиториев</h1>
    <List />
  </div>
}
