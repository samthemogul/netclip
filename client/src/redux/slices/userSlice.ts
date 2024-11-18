import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    id: "",
    firstname: "",
    lastname: "",
    accessToken: "",
    email: "",
    photoUrl: "",
  },
  reducers: {
    login(state, action){
        const credentials = action.payload
        state.accessToken = credentials.token;
        state.id = credentials.userId
    },
    setUser(state, action) {
        const user = action.payload;
        state.firstname = user.firstname;
        state.lastname = user.lastname;
        state.email = user.email;
        state.photoUrl = user.photoUrl
    },
    logout(state){
        state.firstname = "";
        state.lastname = "";
        state.email = "";
        state.photoUrl = "";
        state.accessToken = ""
    },
  },
});

export const userActions = userSlice.actions;

export default userSlice.reducer;
