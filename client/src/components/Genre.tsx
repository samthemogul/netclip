import styles from "@/styles/components/genre.module.css";

const Genre = ({ genre }: { genre: string }) => {
  return (
    <div className={styles.genreWrapper}>
      <div className={styles.genreContainer}>
        <p className={styles.genreText}>{genre}</p>
      </div>
    </div>
  );
};

export default Genre;
