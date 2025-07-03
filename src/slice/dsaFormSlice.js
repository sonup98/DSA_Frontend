import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  form: {
    dataProductProvider: "",
    dataProductConsumer: "",
    containerMacroPhase: "",
    startDate: "",
    endDate: "",
    datasetIds: [],
  },
  purpose: "",
  allAssets: [],
};

const dsaFormSlice = createSlice({
  name: "dsaForm",
  initialState,
  reducers: {
    setFormField: (state, action) => {
      const { name, value } = action.payload;
      state.form[name] = value;
    },
    setPurpose: (state, action) => {
      state.purpose = action.payload;
    },
    toggleDatasetId: (state, action) => {
      const id = action.payload;
      const idx = state.form.datasetIds.indexOf(id);
      if (idx > -1) {
        state.form.datasetIds.splice(idx, 1);
      } else {
        state.form.datasetIds.push(id);
      }
    },
    resetForm: () => initialState,
    setDateRange: (state, action) => {
      state.form.startDate = action.payload.startDate;
      state.form.endDate = action.payload.endDate;
    },
    setAllAssets: (state, action) => {
      state.allAssets = action.payload;
    },
  },
});

export const {
  setFormField,
  setPurpose,
  toggleDatasetId,
  resetForm,
  setDateRange,
  setAllAssets,
} = dsaFormSlice.actions;

export default dsaFormSlice.reducer;
