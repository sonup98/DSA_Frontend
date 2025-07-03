import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  textspace: "",
};

const dsaSlice = createSlice({
  name: "dsa",
  initialState,
  reducers: {
    setTextspace: (state, action) => {
      state.textspace = action.payload;
    },
  },
});

export const { setTextspace } = dsaSlice.actions;

export default dsaSlice.reducer;
