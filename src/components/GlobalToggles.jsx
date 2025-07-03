const GlobalToggles = ({
  selectAllDatasets,
  onSelectAllToggle,
  enablePerGroupFiltering,
  onEnablePerGroupFilteringToggle,
}) => {
  return (
    <>
      <div className="mb-6">
        <div className="flex items-center">
          <input
            id="select-all-datasets"
            name="select-all-datasets"
            type="checkbox"
            checked={selectAllDatasets}
            onChange={onSelectAllToggle}
            className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          />
          <label
            htmlFor="select-all-datasets"
            className="ml-2 block text-sm text-gray-900"
          >
            Select All Datasets
          </label>
        </div>
      </div>
      <div className="mb-6">
        <div className="flex items-center">
          <input
            id="enable-per-group-filtering"
            name="enable-per-group-filtering"
            type="checkbox"
            checked={enablePerGroupFiltering}
            onChange={onEnablePerGroupFilteringToggle}
            className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          />
          <label
            htmlFor="enable-per-group-filtering"
            className="ml-2 block text-sm text-gray-900"
          >
            Enable per-group custom filtering
          </label>
        </div>
      </div>
    </>
  );
};

export default GlobalToggles;
