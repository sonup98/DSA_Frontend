import React, { useState, useEffect } from "react";
const username = import.meta.env.VITE_COLLIBRA_USERNAME;
const password = import.meta.env.VITE_COLLIBRA_PASSWORD;
import MDEditor from "@uiw/react-md-editor";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";

import { getAreaCodeByAssetId } from "../hook/useAssetWithAreaCode";
import toast from "react-hot-toast";

import { fetchAllAssets, searchAssetByName } from "../api/assets";
import {
  setFormField,
  setPurpose,
  toggleDatasetId,
  setDateRange,
  setAllAssets,
} from "../slice/dsaFormSlice"; // Adjust the import path as needed

// Sample data for dropdowns and datasets - replace with your actual data
const consumerOptions = [
  { id: "2", name: "Amadeus Revenue Forecasting Team" },
  { id: "3", name: "Amadeus Traffic Analytics" },
];

const macroPhaseOptions = [
  { id: "phase1", name: "TST" },
  { id: "phase2", name: "PRD" },
];

function DataSharingAgreementForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { form, purpose } = useSelector((state) => state.dsaForm);

  const [dtproducer, setDtProducer] = useState([]);

  useEffect(() => {
    const loginAndFetchAssets = async () => {
      try {
        const loginRes = await fetch(
          "https://amadeus-dev.collibra.com/rest/2.0/auth/sessions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: username,
              password: password,
            }),
            credentials: "include", // must include to store session cookie
          }
        );

        const loginData = await loginRes.json();
        console.log("Login Response:", loginData);
        localStorage.setItem("csrfToken", loginData.csrfToken);

        // Proceed to fetch assets only after successful login
        const assetsRes = await fetchAllAssets();

        setDtProducer(assetsRes.results);
        dispatch(setAllAssets(assetsRes.results));
      } catch (err) {
        console.error("Error during login or fetching assets:", err);
      }
    };

    loginAndFetchAssets();
  }, []);

  useEffect(() => {
    const today = new Date();
    const oneYearLater = new Date(today);
    oneYearLater.setFullYear(today.getFullYear() + 1);

    const formatDate = (date) => new Date(date).toISOString().slice(0, 16); // yyyy-MM-ddTHH:mm

    // setForm((f) => ({
    //   ...f,
    //   startDate: formatDate(today),
    //   endDate: formatDate(oneYearLater),
    // }));
    dispatch(
      setDateRange({
        startDate: formatDate(today),
        endDate: formatDate(oneYearLater),
      })
    );
  }, []);
  const selectOptions = dtproducer.map((asset) => ({
    value: asset.id,
    label: asset.name,
  }));

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(setFormField({ name, value }));
    // setForm((prevForm) => ({
    //   ...prevForm,
    //   [name]: value,
    // }));
  };
  const handlePurpose = (value) => {
    // setPurpose(value);
    dispatch(setPurpose(value));
  };
  const handleDatasetSelect = (datasetId) => {
    // setForm((prevForm) => {
    //   const newDatasetIds = prevForm.datasetIds.includes(datasetId)
    //     ? prevForm.datasetIds.filter((id) => id !== datasetId)
    //     : [...prevForm.datasetIds, datasetId];
    //   return { ...prevForm, datasetIds: newDatasetIds };
    // });
    dispatch(toggleDatasetId(datasetId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const start = new Date(form.startDate).getTime();
    const end = new Date(form.endDate).getTime();

    // Required field validation
    if (
      !form.dataProductConsumer ||
      !form.dataProductProvider ||
      !form.containerMacroPhase ||
      !purpose
    ) {
      toast.error("Please fill in all required fields.");
      //alert("Please fill in all required fields.");
      return;
    }

    // Check if provider and consumer are the same
    if (form.dataProductProvider === form.dataProductConsumer) {
      toast.error("Data Product Provider and Consumer cannot be the same.");

      return;
    }

    // Date validations
    if (isNaN(start) || isNaN(end)) {
      toast.error("Invalid dates selected.");
      return;
    }

    if (start >= end) {
      toast.error("End date must be greater than start date.");
      return;
    }

    if (start === end) {
      toast.error("Start and end date cannot be the same.");
      return;
    }

    const payload = {
      ...form,
      startDate: start, // Unix timestamp in ms
      endDate: end,
      purpose: purpose,
    };
    // ✅ Fetch area code here
    const areaCode = await getAreaCodeByAssetId(form.dataProductProvider);
    if (!areaCode) {
      toast.error("Could not resolve area code for the provider.");
      return;
    }

    const providerName =
      dtproducer.find((item) => item.id === form.dataProductProvider)?.name ||
      "";
    const consumerName =
      dtproducer.find((item) => item.id === form.dataProductConsumer)?.name ||
      "";

    const variableCheck = `DSA_${(areaCode || "").toUpperCase()}_${
      form.containerMacroPhase
    }_${providerName}_${consumerName}_V1`;
    console.log("Variable Check:", variableCheck);

    const result = await searchAssetByName(variableCheck);
    if (result?.total > 0) {
      toast.error(
        "Data Sharing Agreement " + variableCheck + " already exists."
      );
      return;
    }

    // const providerName =
    //   dtproducer.find((item) => item.id === form.dataProductProvider)?.name ||
    //   "";
    // const consumerName =
    //   dtproducer.find((item) => item.id === form.dataProductConsumer)?.name ||
    //   "";

    // const result = await searchAssetByName(variableCheck);
    // console.log("Search Result:", result);

    // if (result.total > 0) {
    //   toast.error("Data Set already exists.");
    //   return;
    // }

    // console.log("Submitting payload with Unix timestamps:", payload);
    toast.success("Data Sharing Agreement Started");
    navigate("/filters");
  };

  // Tailwind classes for inputs, select, and textarea
  const inputBaseClass =
    "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2";
  const labelBaseClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="p-6 bg-gray-50 min-h-screen flex flex-col items-center">
      <div className="max-w-2xl w-full bg-white p-8 shadow-xl rounded-lg">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Data Sharing Agreement
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="dataProductProvider" className={labelBaseClass}>
              Data Product Provider <span className="text-red-500">*</span>
            </label>
            <Select
              options={selectOptions}
              value={selectOptions.find(
                (opt) => opt.value === form.dataProductProvider
              )}
              onChange={(selectedOption) =>
                handleChange({
                  target: {
                    name: "dataProductProvider",
                    value: selectedOption.value,
                  },
                })
              }
              placeholder="Select or search for a provider"
              className="mt-1"
            />
          </div>

          <div>
            <label htmlFor="dataProductConsumer" className={labelBaseClass}>
              Data Product Consumer <span className="text-red-500">*</span>
            </label>
            <Select
              options={selectOptions}
              value={selectOptions.find(
                (opt) => opt.value === form.dataProductConsumer
              )}
              onChange={(selectedOption) =>
                handleChange({
                  target: {
                    name: "dataProductConsumer",
                    value: selectedOption.value,
                  },
                })
              }
              placeholder="Select or search for a consumer"
              className="mt-1"
            />
          </div>

          <div>
            <label htmlFor="containerMacroPhase" className={labelBaseClass}>
              Select the Container Macro Phase{" "}
              <span className="text-red-500">*</span>
            </label>
            <select
              name="containerMacroPhase"
              id="containerMacroPhase"
              value={form.containerMacroPhase}
              onChange={handleChange}
              className={`${inputBaseClass} ${
                form.containerMacroPhase === "" ? "text-gray-400" : ""
              }`}
            >
              <option value="" disabled>
                Select a phase
              </option>
              {macroPhaseOptions.map((option) => (
                <option
                  key={option.id}
                  value={option.name}
                  className="text-gray-900"
                >
                  {option.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="startDate" className={labelBaseClass}>
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                name="startDate"
                id="startDate"
                value={form.startDate}
                onChange={handleChange}
                className={inputBaseClass}
              />
            </div>
            <div>
              <label htmlFor="endDate" className={labelBaseClass}>
                End Date <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                name="endDate"
                id="endDate"
                value={form.endDate}
                onChange={handleChange}
                className={inputBaseClass}
              />
            </div>
          </div>

          <div data-color-mode="light">
            <label htmlFor="purpose" className={labelBaseClass}>
              Purpose <span className="text-red-500">*</span>
            </label>
            {/* <textarea
              name="purpose"
              id="purpose"
              rows="4"
              value={form.purpose}
              onChange={handleChange}
              placeholder="Describe the purpose of data sharing"
              className={inputBaseClass}
            /> */}
            <MDEditor
              value={purpose}
              onChange={handlePurpose}
              id="purpose"
              name="purpose"
              preview="edit"
              className={inputBaseClass}
              height={300}
              textareaProps={{
                placeholder: "Describe the purpose of data sharing",
              }}
              previewOptions={{
                disallowedElements: ["style"],
              }}
            />
          </div>

          <div className="flex md:grid-cols-2 gap-6">
            <button
              onClick={() => navigate("/")}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out"
            >
              Submit DSA
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DataSharingAgreementForm;
