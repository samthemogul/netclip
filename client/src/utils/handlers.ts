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
    console.log(res)
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
