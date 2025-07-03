// redux/slices/containerSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  dataOptions: [], // this is where your array will go
};

const containerSlice = createSlice({
  name: "container",
  initialState,
  reducers: {
    setContainerDataOptions: (state, action) => {
      state.dataOptions = action.payload;
    },
    clearContainerDataOptions: (state) => {
      state.dataOptions = [];
    },
  },
});

export const { setContainerDataOptions, clearContainerDataOptions } =
  containerSlice.actions;

export default containerSlice.reducer;
