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
    let user = null;
    let error = null;
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

export const getLatestMovies = async () => {
  try {
    let movies = null;
    let error = null;
    const res = await fetch("http://localhost:4000/api/movies/latest", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(res)
  } catch (error: any) {
    error = new Error(error.message);
    return { movies: null, error };
  }
};
