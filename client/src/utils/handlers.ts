import { TopMovie, SearchedMovie, IUser, IMovie } from "@/types";
interface IMovieBody {
  title: string;
  description: string;
  image: string;
  year: string;
  imdbId: string;
  genres: string[];
  rating: string;
}

export const authenticateUser = async () => {
  try {
    let user = null;
    let error = null;
    const res = await fetch("https://netclip-server.onrender.com/api/auth/google", {
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
    const res = await fetch(`https://netclip-server.onrender.com/api/users/${id}`, {
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
    const res = await fetch("https://netclip-server.onrender.com/api/movies/top", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await res.json();
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

    const res = await fetch(`https://netclip-server.onrender.com/api/movies/${imdbId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await res.json();
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
};

export const searchMovies = async (accessToken: string, query: string) => {
  try {
    let movies: SearchedMovie[] | null = null;
    let error: Error | null = null;

    const res = await fetch(
      `https://netclip-server.onrender.com/api/movies/search/${query}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const data = await res.json();
    if (res.status == 200) {
      movies = data.results;
      return { movies, error };
    }
    error = new Error(data.message);
    return { movies, error };
  } catch (error: any) {
    return { movies: null, error };
  }
};

export const getMovieRecommendations = async (
  userId: string,
  accessToken: string
) => {
  try {
    let recommendations: IMovie[] | null = null;
    let error: Error | null = null;

    const res = await fetch(
      `https://netclip-server.onrender.com/api/movies/recommendations/${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const data = await res.json();
    if (res.status == 200) {
      recommendations = data.recommendations;
      return { recommendations, error };
    }
    error = new Error(data.message);
    return { recommendations, error };
  } catch (error: any) {
    return { recommendations: null, error };
  }
};

export const addMovieToWatchList = async (
  userId: string,
  accessToken: string,
  moviedata: IMovieBody
) => {
  try {
    let watchlist: IMovie[] | null = []
    let error: Error | null = null;
    const res = await fetch(
      `https://netclip-server.onrender.com/api/watchlist/new/${userId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(moviedata),
      }
    );
    const data = await res.json();
    if (res.status == 201) {
      watchlist = data.watchlist as IMovie[];
      return { watchlist, error };
    }
    error = new Error(data.message);
    return { watchlist, error };
  } catch (error: any) {
    return { watchlist: null, error };
  }
};

export const getWatchListMovies = async (userId: string, accessToken: string) => {
  try {
    let watchlist: IMovie[] | null = null;
    let error: Error | null = null;

    const res = await fetch(`https://netclip-server.onrender.com/api/watchlist/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await res.json();
    if (res.status == 200) {
      watchlist = data.watchlist.movies;
      return { watchlist, error };
    }
    error = new Error(data.message);
    return { watchlist, error };
  } catch (error: any) {
    return { watchlist: null, error };
  }
}

export const getHistoryMovies = async (
  userId: string,
  accessToken: string
) => {
  try {
    let history: IMovie[] | null = null;
    let error: Error | null = null;

    const res = await fetch(`https://netclip-server.onrender.com/api/history/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await res.json();
    if (res.status == 200) {
      history = data.history.movies;
      return { history, error };
    }
    error = new Error(data.message);
    return { history, error };
  } catch (error: any) {
    return { history: null, error };
  }
}

export const logoutUser = async (accessToken: string) => {
  try {
    const res = await fetch("https://netclip-server.onrender.com/api/auth/logout", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await res.json();
    if (res.status == 200) {
      throw new Error(data.message);
    }
    return
  } catch (error: any) {
    return
  }
}

export const getStreak = async (userId: string, accessToken: string) => {
  try {
    let streak: number | null = null;
    let error: Error | null = null;

    const res = await fetch(`https://netclip-server.onrender.com/api/users/${userId}/streak`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await res.json();
    if (res.status == 200) {
      streak = data.streak;
      return { streak, error };
    }
    error = new Error(data.message);
    return { streak, error };
  } catch (error: any) {
    return { streak: null, error };
  }
}
