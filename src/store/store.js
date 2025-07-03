import { configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";

import dsaReducer from "../slice/startDsaSlice";
import dsaFormReducer from "../slice/dsaFormSlice";
import datasetReducer from "../slice/dataSetSlice";
import containerReducer from "../slice/containerSlice";

const persistConfig = {
  key: "root",
  storage,
};

const rootReducer = combineReducers({
  dsa: dsaReducer,
  dsaForm: dsaFormReducer,
  dataset: datasetReducer,
  container: containerReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

// ✅ No need to import getDefaultMiddleware — just use it inside configureStore
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
