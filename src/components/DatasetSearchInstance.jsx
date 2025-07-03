import React, { useState, useEffect, useRef } from "react";
import CustomFilterDropdown from "./CustomFilterDropdown";
import { PlusIcon, XIcon } from "../constants/icons";
import useDataProductFilter from "../hook/useDataProductFilter";
import { useDispatch } from "react-redux";
import { getRelations } from "../api/relations";
import { useSelector } from "react-redux";
import useFetchRelatedData from "../hook/useFetchRelatedData";
import { setContainerDataOptions } from "../slice/containerSlice";
import {
  DATA_ASSET_TYPE_FILTER_MAP,
  ALL_CONFIGURABLE_FILTER_TYPES,
  DATA_LAKE_ZONES_GLOBAL,
  PHASES_GLOBAL,
  SHARDS_GLOBAL,
  LOGIC_OPTIONS_GLOBAL,
  DATA_ASSET_TYPES_GLOBAL,
} from "../constants/filters";

const DatasetSearchInstance = ({
  instance,
  updateInstance,
  removeInstance,
  canRemove,
  showPerGroupFilteringSection,
  filterOptionsConfig, // This prop now needs to be dynamically updated in Filters.jsx
}) => {
  //fetch all datasets globally
  const ALL_DATASETS_GLOBAL = useSelector((state) => state.dataset.allDatasets);
  const { filteredProducerAssets } = useDataProductFilter();
  console.log("filteredProducerAssets", filteredProducerAssets);
  const fetchRelatedData = useFetchRelatedData();
  const dispatch = useDispatch();

  const {
    id,
    selectedDatasets,
    datasetSearchTerm,
    isDatasetDropdownOpen,
    activeCustomFilters,
  } = instance;
  const instanceRef = useRef(null);
  const [showAddFilterDropdown, setShowAddFilterDropdown] = useState(false);

  // State to hold the Azure Container Data options (mock data for now)
  // const [containerDataOptions, setContainerDataOptions] = useState([]);

  // Find the selected Data Asset Type
  const selectedDataAssetTypeFilter = activeCustomFilters.find(
    (filter) => filter.type === "dataAssetType"
  );
  console.log("selectedDataAssetTypeFilter", selectedDataAssetTypeFilter);

  useEffect(() => {
    if (filteredProducerAssets.length === 0) return;
    const selectedAssetType = selectedDataAssetTypeFilter?.value;
    const assetConfig = DATA_ASSET_TYPE_FILTER_MAP[selectedAssetType];

    if (!selectedAssetType || !assetConfig) {
      // Remove any dynamic filters if asset type is unrecognized
      const updatedFilters = activeCustomFilters.filter(
        (filter) =>
          !Object.values(DATA_ASSET_TYPE_FILTER_MAP).some(
            (config) => config.filterType === filter.type
          )
      );
      if (updatedFilters.length !== activeCustomFilters.length) {
        updateInstance(id, { activeCustomFilters: updatedFilters });
      }
      return;
    }

    const { filterType, label, relationTypeId, relationTypeIdForDBI } =
      assetConfig;
    const filtersToRemove = activeCustomFilters.filter((f) =>
      Object.values(DATA_ASSET_TYPE_FILTER_MAP).some(
        (config) =>
          config.filterType === f.type &&
          config.filterType !== assetConfig.filterType
      )
    );
    if (filtersToRemove.length > 0) {
      updateInstance(id, {
        activeCustomFilters: activeCustomFilters.filter(
          (f) => !filtersToRemove.includes(f)
        ),
      });
    }

    //   try {
    //     console.log("Fetching related data...");
    //     console.log("relationTypeId:", relationTypeId);

    //     const promises = filteredProducerAssets.map((asset) =>
    //       getRelations({
    //         getRelationTypeID: relationTypeId,
    //         sourceId: asset.assetId,
    //       })
    //     );

    //     const allResponses = await Promise.all(promises);
    //     console.log("Raw allResponses:", allResponses);

    //     const flatResponses = allResponses.flat().filter(Boolean);
    //     console.log("Flat relations count:", flatResponses.length);

    //     const matchingRelations = flatResponses.filter(
    //       (r) => r?.type?.id === relationTypeId
    //     );
    //     console.log("Matching relations:", matchingRelations);

    //     const formattedOptions = matchingRelations
    //       .filter((r) => r?.target?.name && r?.target?.id)
    //       .map((r) => ({
    //         label: r.target.name,
    //         value: r.target.id,
    //       }));

    //     console.log("Formatted options:", formattedOptions);

    //     return formattedOptions;
    //   } catch (err) {
    //     console.error(
    //       `Error fetching related data for ${selectedAssetType}:`,
    //       err
    //     );
    //     return [];
    //   }
    // };

    const existingFilter = activeCustomFilters.find(
      (f) => f.type === filterType
    );

    if (!existingFilter) {
      fetchRelatedData(
        relationTypeId,
        filteredProducerAssets,
        relationTypeIdForDBI
      ).then((data) => {
        dispatch(setContainerDataOptions(data));
        setContainerDataOptions(data);
        updateInstance(id, {
          activeCustomFilters: [
            ...activeCustomFilters,
            {
              type: filterType,
              label,
              options: data,
              value: [],
            },
          ],
        });
      });
    } else if (existingFilter.options?.length === 0) {
      fetchRelatedData(relationTypeId, filteredProducerAssets).then((data) => {
        updateInstance(id, {
          activeCustomFilters: activeCustomFilters.map((f) =>
            f.type === filterType ? { ...f, options: data } : f
          ),
        });
      });
    }
  }, [
    selectedDataAssetTypeFilter?.value,
    activeCustomFilters,
    filteredProducerAssets,
    id,
    updateInstance,
  ]);

  const availableDatasetsToSelect = ALL_DATASETS_GLOBAL.filter(
    (ds) =>
      !selectedDatasets.includes(ds) &&
      (datasetSearchTerm
        ? ds.toLowerCase().includes(datasetSearchTerm.toLowerCase())
        : true)
  );

  const handleSelectDataset = (dataset) => {
    if (!selectedDatasets.includes(dataset)) {
      updateInstance(id, {
        selectedDatasets: [...selectedDatasets, dataset],
        datasetSearchTerm: "",
        isDatasetDropdownOpen: false,
      });
    } else {
      updateInstance(id, {
        datasetSearchTerm: "",
        isDatasetDropdownOpen: false,
      });
    }
  };

  const handleRemoveDataset = (datasetToRemove) => {
    updateInstance(id, {
      selectedDatasets: selectedDatasets.filter((ds) => ds !== datasetToRemove),
    });
  };

  const handleDatasetSearchChange = (e) => {
    updateInstance(id, {
      datasetSearchTerm: e.target.value,
      isDatasetDropdownOpen: true,
    });
  };

  const handleDatasetSearchFocus = () => {
    updateInstance(id, { isDatasetDropdownOpen: true });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        instanceRef.current &&
        !instanceRef.current.contains(event.target) &&
        isDatasetDropdownOpen
      ) {
        updateInstance(id, { isDatasetDropdownOpen: false });
      }
      // Also close add filter dropdown if clicking outside
      if (
        instanceRef.current &&
        !instanceRef.current.contains(event.target) &&
        showAddFilterDropdown
      ) {
        setShowAddFilterDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [id, isDatasetDropdownOpen, showAddFilterDropdown, updateInstance]);

  const handleCustomFilterChange = (filterType, newValue) => {
    const updatedFilters = activeCustomFilters.map((f) =>
      f.type === filterType ? { ...f, value: newValue } : f
    );
    updateInstance(id, { activeCustomFilters: updatedFilters });
  };

  const addCustomFilter = (filterConfig) => {
    const newFilter = { ...filterConfig, value: "Select" };
    updateInstance(id, {
      activeCustomFilters: [...activeCustomFilters, newFilter],
    });
    setShowAddFilterDropdown(false);
  };

  const removeCustomFilter = (filterTypeToRemove) => {
    updateInstance(id, {
      activeCustomFilters: activeCustomFilters.filter(
        (f) => f.type !== filterTypeToRemove
      ),
    });
  };

  const currentlyActiveFilterTypes = activeCustomFilters.map((f) => f.type);
  const availableFilterTypesToAdd = filterOptionsConfig.filter(
    (config) => !currentlyActiveFilterTypes.includes(config.type)
  );

  return (
    <div
      ref={instanceRef}
      className="p-4 border border-gray-300 rounded-md mb-4 bg-white shadow"
    >
      {/* Dataset Selection Part */}
      <div className="flex items-center mb-3">
        <div className="relative flex-grow">
          <label htmlFor={`dataset-search-${id}`} className="sr-only">
            Search Datasets for instance {id}
          </label>
          <div className="flex flex-wrap gap-2 p-2.5 border border-gray-300 rounded-md min-h-[42px] bg-white">
            {selectedDatasets.map((ds, index) => (
              <span
                key={`${ds}_${index}`}
                className="flex items-center px-2 py-1 bg-gray-200 text-gray-700 text-sm rounded-md"
              >
                {ds}
                <button
                  onClick={() => handleRemoveDataset(ds)}
                  type="button"
                  className="ml-1.5 focus:outline-none"
                  aria-label={`Remove ${ds}`}
                >
                  <XIcon />
                </button>
              </span>
            ))}
            <input
              type="text"
              id={`dataset-search-${id}`}
              value={datasetSearchTerm || ""}
              onChange={handleDatasetSearchChange}
              onFocus={handleDatasetSearchFocus}
              placeholder={
                selectedDatasets.length === 0 ? "Select datasets..." : ""
              }
              className="flex-grow p-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
            />
          </div>
          {isDatasetDropdownOpen && availableDatasetsToSelect.length > 0 && (
            <div className="absolute z-20 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
              {availableDatasetsToSelect.map((ds, index) => (
                <div
                  key={`${ds.id}-${index}`}
                  onClick={() => handleSelectDataset(ds)}
                  className="cursor-pointer select-none relative py-2 pl-3 pr-9 text-gray-900 hover:bg-indigo-600 hover:text-white"
                >
                  {ds}
                </div>
              ))}
            </div>
          )}
        </div>
        {canRemove && (
          <button
            type="button"
            onClick={() => removeInstance(id)}
            className="ml-2 p-2 text-red-500 hover:text-red-700 focus:outline-none"
            aria-label="Remove this dataset filter group"
          >
            <XIcon />
          </button>
        )}
      </div>

      {/* Per-Group Custom Filtering Section */}
      {showPerGroupFilteringSection && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="space-y-3 mb-3">
            {activeCustomFilters.map((filter, index) => {
              const isContainerFilter = filter.type === "container";
              const isMulti = isContainerFilter;

              return (
                <CustomFilterDropdown
                  key={`${filter.type}-${id}-${index}`}
                  label={filter.label}
                  id={`${filter.type}-${id}`}
                  name={`${filter.type}-${id}`}
                  value={filter.value}
                  onChange={(e) =>
                    handleCustomFilterChange(filter.type, e.target.value)
                  }
                  options={filter.options}
                  onRemove={() => removeCustomFilter(filter.type)}
                  isMulti={isMulti}
                  onSelectAll={
                    isContainerFilter
                      ? () => {
                          const allValues = filter.options.map(
                            (opt) => opt.value
                          );
                          handleCustomFilterChange(filter.type, allValues);
                        }
                      : null
                  }
                  showRemoveButton={
                    filter.type !== "dataAssetType" ||
                    !Object.values(DATA_ASSET_TYPE_FILTER_MAP).some(
                      (config) =>
                        config.filterType === filter.type &&
                        selectedDataAssetTypeFilter?.value === filter.label
                    )
                  }
                />
              );
            })}
          </div>
          {availableFilterTypesToAdd.length > 0 && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowAddFilterDropdown((prev) => !prev)}
                className="mt-2 flex items-center px-3 py-2 text-sm text-indigo-700 bg-indigo-100 hover:bg-indigo-200 rounded-md focus:outline-none"
              >
                <PlusIcon className="w-5 h-5 mr-2" /> Add Filter
              </button>
              {showAddFilterDropdown && (
                <div className="absolute z-10 mt-1 w-auto bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                  {availableFilterTypesToAdd.map((filterConfig) => (
                    <div
                      key={filterConfig.type}
                      onClick={() => addCustomFilter(filterConfig)}
                      className="cursor-pointer select-none relative py-2 px-4 text-gray-900 hover:bg-indigo-100"
                    >
                      {filterConfig.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DatasetSearchInstance;
