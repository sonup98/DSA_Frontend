import Select from "react-select";
import { XIcon } from "../constants/icons";

const CustomFilterDropdown = ({
  label,
  id,
  name,
  value,
  onChange,
  options,
  onRemove,
  showRemoveButton = false,
  isMulti = false,
  onSelectAll = null,
}) => {
  const formattedOptions = options.map((opt) =>
    typeof opt === "string" ? { label: opt, value: opt } : opt
  );

  const selectedValue = isMulti
    ? formattedOptions.filter((opt) => value?.includes(opt.value))
    : formattedOptions.find((opt) => opt.value === value);

  const handleChange = (selected) => {
    if (isMulti) {
      const selectedValues = selected?.map((opt) => opt.value) || [];
      onChange({ target: { name, value: selectedValues } });
    } else {
      onChange({ target: { name, value: selected ? selected.value : "" } });
    }
  };

  const handleSelectAll = () => {
    const allValues = formattedOptions.map((opt) => opt.value);
    onChange({ target: { name, value: allValues } });
  };

  return (
    <div className="flex items-end space-x-2 w-full">
      <div className="flex-grow">
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <Select
          inputId={id}
          name={name}
          value={selectedValue}
          onChange={handleChange}
          options={formattedOptions}
          isClearable={!isMulti}
          isMulti={isMulti}
          isDisabled={formattedOptions.length === 0}
          className="mt-1"
          classNamePrefix="react-select"
        />
        {isMulti && onSelectAll && (
          <div className="mt-2 flex items-center space-x-2">
            <label className="text-sm text-gray-700">Select All</label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={value?.length === options.length}
                onChange={(e) =>
                  e.target.checked
                    ? handleSelectAll()
                    : onChange({ target: { name, value: [] } })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer peer-checked:bg-indigo-600 transition-all"></div>
              <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition peer-checked:translate-x-full"></div>
            </label>
          </div>
        )}
      </div>
      {showRemoveButton && onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="p-2 text-red-500 hover:text-red-700 focus:outline-none mb-1"
          aria-label={`Remove ${label} filter`}
        >
          <XIcon className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default CustomFilterDropdown;
