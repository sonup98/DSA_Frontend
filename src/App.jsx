import React from "react";
import DataSharingAgreementForm from "./pages/DataSharingAgreementForm.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StartDsa from "./pages/StartDsa.jsx";
import Filters from "./pages/Filters.jsx";
import ContainerListSelector from "./pages/ContainerListSelector";
import ConfirmationPage from "./pages/ConfirmationPage.jsx";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <Router>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<StartDsa />} />
        <Route path="/create-dsa" element={<DataSharingAgreementForm />} />
        <Route path="/filters" element={<Filters />} />
        <Route path="/selectContainers" element={<ContainerListSelector />} />
        <Route path="/confirmation" element={<ConfirmationPage />} />
      </Routes>
    </Router>
  );
}

export default App;
