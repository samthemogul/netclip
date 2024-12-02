import { TopMovie, SearchedMovie, IUser } from "@/types";

export const authenticateUser = async () => {
  try {
    let user = null;
    let error = null;
    const res = await fetch("http://localhost:4000/api/auth/google", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    if (res.ok) {
      user = data;
      return { user, error };
    }
    error = new Error(data.message);
    return { user, error };
  } catch (error: any) {
    error = new Error(error.message);
    return { user: null, error };
  }
};

export const fetchUser = async (id: string, accessToken: string) => {
  try {
    let user: IUser | null = null;
    let error: Error | null = null;
    const res = await fetch(`http://localhost:4000/api/users/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await res.json();
    if (res.status == 200) {
      user = data.data;
      return { user, error };
    }
    error = new Error(data.message);
    return { user, error };
  } catch (error: any) {
    error = new Error(error.message);
    return { user: null, error };
  }
};

export const getTopMovies = async (accessToken: string) => {
  try {
    let movies: TopMovie[] | null = null;
    let error: Error | null = null;
    const res = await fetch("http://localhost:4000/api/movies/top", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,

      },
    });
    const data = await res.json()
    if (res.status == 200) {
      movies = data.movies;
      return { movies, error };
    }
    error = new Error(data.message);
    return { movies, error };
  } catch (error: any) {
    error = new Error(error.message);
    return { movies: null, error };
  }
};

export const getMovie = async (accessToken: string, imdbId: string) => {
  try {
    let movie = null;
    let error: Error | null = null;

    const res = await fetch(`http://localhost:4000/api/movies/${imdbId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,

      },
    });
    const data = await res.json()
    console.log(data)
    if (res.status == 200) {
      movie = data.movie;
      return { movie, error };
    }
    error = new Error(data.message);
    return { movie, error };    
  } catch (error: any) {
    error = new Error(error.message);
    return { movie: null, error };
  }
}

export const searchMovies = async (accessToken: string, query: string) => {
  try {
    let movies: SearchedMovie[] | null = null;
    let error: Error | null = null;

    const res = await fetch(`http://localhost:4000/api/movies/search/${query}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,

      },
    });
    const data = await res.json()
    if (res.status == 200) {
      movies = data.results;
      return { movies, error };
    }
    error = new Error(data.message);
    return { movies, error };
  } catch (error: any) {
    return { movies: null, error };
  }
}
