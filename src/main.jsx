import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { store, persistor } from "./store/store.js";
import { PersistGate } from "redux-persist/integration/react";
import { HashRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <HashRouter>
        <App />
      </HashRouter>
    </PersistGate>
  </Provider>
);
