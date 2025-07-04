import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import MDEditor from "@uiw/react-md-editor";
import { format } from "date-fns";
import { createAsset } from "../api/assets"; // Adjust the import path as needed
import { useAssetWithAreaCode } from "../hook/useAssetWithAreaCode";
import toast from "react-hot-toast";

// A simple icon component for the header
const CheckCircleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-12 w-12 text-green-500 mx-auto"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

// A reusable component for displaying key-value pairs
const DetailItem = ({ label, value }) => (
  <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
    <dt className="text-sm font-medium text-gray-600">{label}</dt>
    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
      {value}
    </dd>
  </div>
);

const ConfirmationPage = () => {
  const { form, purpose, allAssets } = useSelector((state) => state.dsaForm);
  const textspace = useSelector((state) => state.dsa?.textspace || "");

  const location = useLocation();
  const navigate = useNavigate();
  // Ensure datasetSearchInstances is always an array
  const { datasetSearchInstances = [] } = location.state || {};
  const { areaCode, loading, error } = useAssetWithAreaCode(
    form.dataProductProvider
  );

  const handleCreate = async () => {
    const instance = datasetSearchInstances[0]; // Or any specific instance

    const selectedDatasets = instance.selectedDatasets || [];

    let container = [];

    if (
      instance.activeCustomFilters &&
      instance.activeCustomFilters.length > 0
    ) {
      const containerFilter = instance.activeCustomFilters.find(
        (filter) => filter.label === "Container" || filter.type === "container"
      );

      if (containerFilter) {
        if (Array.isArray(containerFilter.value)) {
          const labelMap = new Map(
            (containerFilter.options || []).map((opt) => [opt.value, opt.label])
          );
          container = containerFilter.value.map(
            (val) => labelMap.get(val) || val
          );
        } else {
          container = [String(containerFilter.value)];
        }
      }
    }

    const newAsset = {
      name: `DSA_${areaCode}_${form.containerMacroPhase}_${
        allAssets.find((a) => a.id === form.dataProductProvider)?.name ||
        form.dataProductProvider
      }_${
        allAssets.find((a) => a.id === form.dataProductConsumer)?.name ||
        form.dataProductConsumer
      }_V1`,
      domainId: "0190df41-71d0-74c3-9537-ad77ad455eca",
      typeId: "00000000-0000-0000-0000-000000031231",
      statusId: "00000011-0000-0000-0000-000000009081",
      attributes: {
        Provider: form.dataProductProvider,
        Consumer: form.dataProductConsumer,
        MacroPhase: form.containerMacroPhase,
        StartDate: format(new Date(form.startDate), "yyyy-MM-dd"),
        EndDate: format(new Date(form.endDate), "yyyy-MM-dd"),
        Purpose: purpose,
      },
      relations: {
        selectedDatasets,
        container,
      },
    };
    console.log("Creating asset with data:", newAsset);

    try {
      const result = await createAsset(newAsset);
      console.log("Asset created:", result);
      toast.success("Data Product created successfully!");
    } catch (error) {
      console.error("Asset creation failed:", error);

      // Try to detect the duplicate case
      if (
        error?.response?.status === 400 &&
        error?.response?.data?.titleMessage === "Value not allowed"
      ) {
        toast.error("A Data Product with this name already exists.");
      } else {
        toast.error("A Data Product with this name already exists.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* --- Header --- */}
        <div className="text-center mb-8">
          <CheckCircleIcon />
          <h1 className="text-3xl font-bold text-gray-800 mt-4">
            Confirmation of Agreement
          </h1>
          <p className="text-md text-gray-500 mt-1">
            Please confirm the details below before finalizing your request.
          </p>
        </div>

        {/* --- Main Content Card --- */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 sm:p-8">
            {/* --- Data Sharing Agreement Details --- */}
            {form && (
              <div className="border-b border-gray-200 pb-6">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">
                  Data Sharing Agreement
                </h2>

                <dl>
                  <DetailItem
                    label="Provider"
                    value={
                      allAssets.find((a) => a.id === form.dataProductProvider)
                        ?.name || form.dataProductProvider
                    }
                  />
                  <DetailItem
                    label="Consumer"
                    value={
                      allAssets.find((a) => a.id === form.dataProductConsumer)
                        ?.name || form.dataProductConsumer
                    }
                  />
                  <DetailItem
                    label="Macro Phase"
                    value={form.containerMacroPhase}
                  />
                  <DetailItem
                    label="Start Date"
                    value={format(new Date(form.startDate), "dd MMMM yyyy")}
                  />
                  <DetailItem
                    label="End Date"
                    value={format(new Date(form.endDate), "dd MMMM yyyy")}
                  />
                  <DetailItem label="Purpose" value={purpose} />
                </dl>
              </div>
            )}

            {/* --- Dataset Groups Section --- */}
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Requested Datasets & Filters
              </h2>
              <div className="space-y-6">
                {datasetSearchInstances.map((instance, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-md p-4"
                  >
                    <div className="space-y-3">
                      <div>
                        <strong className="text-sm text-gray-600 block">
                          Selected Datasets:
                        </strong>
                        <ul className="list-disc list-inside text-sm text-gray-800 mt-1 pl-2">
                          {instance.selectedDatasets &&
                            instance.selectedDatasets.map((ds) => (
                              <li key={ds}>{ds}</li>
                            ))}
                        </ul>
                      </div>

                      {instance.activeCustomFilters &&
                        instance.activeCustomFilters.length > 0 && (
                          <div>
                            <strong className="text-sm text-gray-600 block mt-3">
                              Applied Filters:
                            </strong>
                            <ul className="mt-1 space-y-1">
                              {instance.activeCustomFilters
                                .filter((filter) => {
                                  // Exclude empty, "Select", or no-value filters
                                  if (Array.isArray(filter.value)) {
                                    return filter.value.length > 0;
                                  }
                                  return (
                                    filter.value && filter.value !== "Select"
                                  );
                                })
                                .map((filter) => {
                                  let displayValue = "";
                                  if (Array.isArray(filter.value)) {
                                    const labelMap = new Map(
                                      (filter.options || []).map((opt) => [
                                        opt.value,
                                        opt.label,
                                      ])
                                    );
                                    displayValue = filter.value
                                      .map((val) => labelMap.get(val) || val)
                                      .join(", ");
                                  } else {
                                    displayValue = String(filter.value);
                                  }

                                  // Special handling for the 'Container' filter
                                  if (
                                    filter.label === "Container" ||
                                    filter.type === "container"
                                  ) {
                                    // Use filter.type if available and unique
                                    const containerItems = displayValue
                                      .split(/,\s*/)
                                      .filter((item) => item.trim() !== ""); // Split by comma and space, remove empty items
                                    return (
                                      <li
                                        key={filter.type}
                                        className="text-sm text-gray-800"
                                      >
                                        <span className="font-medium">
                                          {filter.label}:
                                        </span>
                                        <ul className="list-disc list-inside ml-4 mt-1 space-y-0.5">
                                          {" "}
                                          {/* Nested list */}
                                          {containerItems.map((item, i) => (
                                            <li key={`${filter.type}-${i}`}>
                                              {item}
                                            </li>
                                          ))}
                                        </ul>
                                      </li>
                                    );
                                  }

                                  return (
                                    <li
                                      key={filter.type}
                                      className="text-sm text-gray-800"
                                    >
                                      <span className="font-medium">
                                        {filter.label}:
                                      </span>{" "}
                                      {displayValue}
                                    </li>
                                  );
                                })}
                            </ul>
                          </div>
                        )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* --- Action Buttons --- */}
          <div className="bg-gray-50 px-6 py-4 flex justify-end items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-2 bg-transparent border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleCreate}
              className="px-6 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 shadow-sm transition-colors"
            >
              Confirm & Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;
