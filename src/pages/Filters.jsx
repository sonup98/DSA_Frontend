import React, { useState, useEffect, useRef } from "react";
import { getAttributes } from "../api/attributes";
import DatasetSearchInstance from "../components/DatasetSearchInstance";
import GlobalToggles from "../components/GlobalToggles";

import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import useDataProductFilter from "../hook/useDataProductFilter";

import { ALL_CONFIGURABLE_FILTER_TYPES } from "../constants/filters";
import { PlusIcon, XIcon } from "../constants/icons";
import { useCustomFilters } from "../hook/useCustomFilters";
import { toast } from "react-hot-toast";

// Icon for adding a new dataset search field

function Filters() {
  const navigate = useNavigate();
  const containerOptions = useSelector((state) => state.container.dataOptions);

  const [filterOptionsConfig, setFilterOptionsConfig] = useState(
    ALL_CONFIGURABLE_FILTER_TYPES
  );

  const { filteredProducerAssets, filteredDatasetNames } =
    useDataProductFilter();

  console.log("Filtered Producer Assets:", filteredProducerAssets);
  const { dataLakeZoneValues, phaseValues } = useCustomFilters(
    filteredProducerAssets
  );

  useEffect(() => {
    setFilterOptionsConfig((prev) =>
      prev.map((config) => {
        if (config.type === "dataLakeZone") {
          return dataLakeZoneValues.length > 0
            ? { ...config, options: dataLakeZoneValues }
            : config; // keep previous if empty
        }
        if (config.type === "phase") {
          return phaseValues.length > 0
            ? { ...config, options: phaseValues }
            : config;
        }
        return config;
      })
    );
  }, [dataLakeZoneValues, phaseValues]);

  // useEffect(() => {
  //   const fetchDatalakeZones = async () => {
  //     try {
  //       const typeIds = "243285b3-e3a5-4304-88e9-60b618422c32"; // Data Lake Zone Type ID

  //       // 1. Make parallel API calls for each assetId
  //       const promises = filteredProducerAssets.map(
  //         (asset) => getAttributes({ typeIds, assetId: asset.assetId }) // Assuming `id` is the asset ID key
  //       );

  //       // 2. Wait for all API calls to complete
  //       const allResponses = await Promise.all(promises);

  //       // 3. Combine all results into a single array (flattened)
  //       const combinedOptions = allResponses
  //         .flat()
  //         .filter(Boolean)
  //         .map((attr) => ({
  //           label: attr.value,
  //           value: attr.value,
  //         }));

  //       // 4. Update filter options config
  //       setFilterOptionsConfig((currentConfig) =>
  //         currentConfig.map((config) =>
  //           config.type === "dataLakeZone"
  //             ? { ...config, options: combinedOptions }
  //             : config
  //         )
  //       );
  //     } catch (error) {
  //       console.error("Failed to fetch datalake zones:", error);
  //       setFilterOptionsConfig((currentConfig) =>
  //         currentConfig.map((config) =>
  //           config.type === "dataLakeZone"
  //             ? { ...config, options: ["Select", "Error loading"] }
  //             : config
  //         )
  //       );
  //     }
  //   };

  //   if (filteredProducerAssets.length > 0) {
  //     fetchDatalakeZones();
  //   }
  // }, [filteredProducerAssets]);

  // const dataLakeZoneValues = filterOptionsConfig
  //   .filter((config) => config.type === "dataLakeZone")
  //   .flatMap((config) => (config.options || []).map((opt) => opt.value));

  // console.log("Data Lake Zone Values:", dataLakeZoneValues);

  //fetching phases
  console.log("container option:", containerOptions);
  useEffect(() => {
    const fetchShards = async () => {
      try {
        const typeIds = "bec6b658-5fb4-4004-8ba5-35ef3bf0f2cf"; // shards attribute Type ID

        // 1. Make parallel API calls for each assetId
        const promises = containerOptions.map(
          (container) => getAttributes({ typeIds, assetId: container.value }) // Assuming `id` is the asset ID key
        );

        // 2. Wait for all API calls to complete
        const allResponses = await Promise.all(promises);
        console.log("All Responses:", allResponses);

        // 3. Combine all results into a single array (flattened)
        const combinedOptions = allResponses
          .flat()
          .filter(Boolean)
          .map((attr) => ({
            label: attr.value,
            value: attr.value,
          }));

        // 4. Update filter options config
        setFilterOptionsConfig((currentConfig) =>
          currentConfig.map((config) =>
            config.type === "shards"
              ? { ...config, options: combinedOptions }
              : config
          )
        );
      } catch (error) {
        console.error("Failed to fetch datalake zones:", error);
        setFilterOptionsConfig((currentConfig) =>
          currentConfig.map((config) =>
            config.type === "shards"
              ? { ...config, options: ["Select", "Error loading"] }
              : config
          )
        );
      }
    };

    if (containerOptions.length > 0) {
      fetchShards();
    }
  }, [containerOptions]);

  const shardsValues = filterOptionsConfig
    .filter((config) => config.type === "shards")
    .flatMap((config) => (config.options || []).map((opt) => opt.value));

  console.log("shards Values:", shardsValues);

  const createInitialActiveFilters = () => {
    return ALL_CONFIGURABLE_FILTER_TYPES.filter((config) => config.default).map(
      (config) => ({ ...config, value: "Select" })
    );
  };

  const initialInstanceId = Date.now();
  const [datasetSearchInstances, setDatasetSearchInstances] = useState([
    {
      id: initialInstanceId,
      selectedDatasets: [],
      datasetSearchTerm: "",
      isDatasetDropdownOpen: false,
      activeCustomFilters: createInitialActiveFilters(),
    },
  ]);
  const [selectAllDatasets, setSelectAllDatasets] = useState(false);
  const [enablePerGroupFiltering, setEnablePerGroupFiltering] = useState(true);

  const addDatasetSearchInstance = () => {
    setDatasetSearchInstances((prev) => [
      ...prev,
      {
        id: Date.now(),
        selectedDatasets: [],
        datasetSearchTerm: "",
        isDatasetDropdownOpen: false,
        activeCustomFilters: createInitialActiveFilters(),
      },
    ]);
  };

  const updateDatasetSearchInstance = (id, updates) => {
    setDatasetSearchInstances((prev) =>
      prev.map((inst) => (inst.id === id ? { ...inst, ...updates } : inst))
    );
  };

  const removeDatasetSearchInstance = (idToRemove) => {
    if (datasetSearchInstances.length > 1) {
      setDatasetSearchInstances((prev) =>
        prev.filter((inst) => inst.id !== idToRemove)
      );
    }
  };

  useEffect(() => {
    setDatasetSearchInstances((prev) =>
      prev.map((inst) => ({
        ...inst,
        selectedDatasets: selectAllDatasets ? [...filteredDatasetNames] : [],
      }))
    );
  }, [selectAllDatasets, filteredDatasetNames]);

  const handleSelectAllToggle = () => setSelectAllDatasets((prev) => !prev);
  const handleEnablePerGroupFilteringToggle = () =>
    setEnablePerGroupFiltering((prev) => !prev);

  const handleNext = () => {
    const isSelectAllContainerOn = datasetSearchInstances.some((inst) =>
      inst.activeCustomFilters.some(
        (f) =>
          f.type === "container" &&
          Array.isArray(f.value) &&
          f.value.length === containerOptions.length
      )
    );

    if (isSelectAllContainerOn) {
      // ✅ Find the first container filter (or aggregate all if needed)
      const selectedContainerValues = datasetSearchInstances.flatMap((inst) =>
        inst.activeCustomFilters
          .filter((f) => f.type === "container")
          .flatMap((f) => f.value)
      );

      navigate("/selectContainers", {
        state: {
          datasetSearchInstances,
          containers: containerOptions,
          selectedContainers: selectedContainerValues,
        },
      });
    } else {
      navigate("/confirmation", {
        state: {
          datasetSearchInstances,
        },
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-lg shadow-xl">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Filters</h1>
        <GlobalToggles
          selectAllDatasets={selectAllDatasets}
          onSelectAllToggle={handleSelectAllToggle}
          enablePerGroupFiltering={enablePerGroupFiltering}
          onEnablePerGroupFilteringToggle={handleEnablePerGroupFilteringToggle}
        />
        <div className="mb-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-medium text-gray-700">
              Dataset Selection Groups <span className="text-red-500">*</span>
            </h2>
            <button
              type="button"
              onClick={addDatasetSearchInstance}
              className="p-1.5 text-indigo-600 hover:text-indigo-800 focus:outline-none rounded-full hover:bg-indigo-100 active:bg-indigo-200"
              aria-label="Add new dataset selection group"
            >
              <PlusIcon />
            </button>
          </div>
          {datasetSearchInstances.length > 0 ? (
            datasetSearchInstances.map((instance) => (
              <DatasetSearchInstance
                key={instance.id}
                instance={instance}
                updateInstance={updateDatasetSearchInstance}
                removeInstance={removeDatasetSearchInstance}
                canRemove={datasetSearchInstances.length > 1}
                showPerGroupFilteringSection={enablePerGroupFiltering}
                filterOptionsConfig={filterOptionsConfig}
              />
            ))
          ) : (
            <p className="text-gray-500 text-sm">
              Click the '+' button to add a dataset selection group.
            </p>
          )}
        </div>
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 mt-8">
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            onClick={() => navigate("/create-dsa")}
            type="button"
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Back
          </button>
          <button
            type="submit"
            onClick={handleNext}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default Filters;
