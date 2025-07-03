// redux/datasetSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allDatasets: [],
};

const datasetSlice = createSlice({
  name: "dataset",
  initialState,
  reducers: {
    setAllDatasets: (state, action) => {
      state.allDatasets = action.payload;
    },
  },
});

export const { setAllDatasets } = datasetSlice.actions;
export default datasetSlice.reducer;
