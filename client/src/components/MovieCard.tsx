"use client";

// REACT/NEXT LIBS
import Image from "next/image";

// COMPONENTS

// MISC
import { IMovie } from "@/types";
import styles from "@/styles/components/moviecard.module.css";

interface MovieCardProps {
  movie: IMovie;
}

const MovieCard = ({ movie }: MovieCardProps) => {
  return (
    <div className={styles.movieCardContainer}>
      <div className={styles.movieCardImageContainer}>
        <Image
          src={movie.image}
          alt={movie.title}
          width={200}
          height={300}
          className={styles.movieCardImage}
        />
      </div>
      <div className={styles.movieCardDetails}>
        <p className={styles.movieCardYear}>{movie.year}</p>
        <h3 className={styles.movieCardTitle}>{movie.title}</h3>
        <p className={styles.movieCardDescription}>{movie.description}</p>
        <div className={styles.movieCardRating}>
          <div className={styles.imdbLogo}>
            <p className={styles.imdbLogoText}>IMDb</p>
          </div>
          <p className={styles.ratingText}>{movie.rating} / 10.0</p>
        </div>
        <p className={styles.movieCardGenres}>{movie.genre.join(", ")}</p>
      </div>
    </div>
  );
};

export default MovieCard;
