import styles from './DetailsTab.module.css';

export default function ListsTab({userLists}) {

return(
    <div className={styles.Tab}>
        <div className={styles.userFavorites}>
            <div className={styles.vertical_list}>
                <h2 className={styles.favoriteTitle}>User Lists</h2>
                <ul>
                    {userLists.map((list) => (
                        <li className={styles.clickable}>{list}</li>
                    ))}
                </ul>
            </div>
        </div>
    </div>
    )
}