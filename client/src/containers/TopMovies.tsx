"use client"

// REACT/NEXT LIBS
import { useEffect } from "react"


// COMPONENTS
import MovieCard from "@/components/MovieCard"
import CardCarousel from "./CardCarousel"

// MISC
import { IMovie, TopMovie } from "@/types"




interface TopMoviesProp {
    movies: TopMovie[] | any[]
}

const TopMovies = ({ movies } : TopMoviesProp) => {
    // useEffect(() => {
    //     console.log(movies)
    // }, [])
    return (
        <div>
            <CardCarousel>
                {movies.map((movie: any) => {
                    const formatMovie = {
                        description: movie.description,
                        title: movie.title,
                        image: movie.image,
                        rating: movie.rating,
                        year: movie.year,
                        imdbId: movie.imdbid || movie.imdbId,
                        genre: movie.genre,
                        imdb_link: movie.imdb_link
                    }
                    return <MovieCard key={movie.id} movie={formatMovie} />
})}
            </CardCarousel>
        </div>
    )
}

export default TopMovies