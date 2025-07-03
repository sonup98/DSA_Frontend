// src/components/MultiSelectWithSelectAll.js

import React from "react";
import Select, { components } from "react-select";
import { XIcon } from "../constants/icons";
import SelectAllToggle from "./SelectAllToggle";

// This is the key part: we create a custom MenuList component
// that injects our SelectAllToggle above the list of options.
const MenuList = (props) => {
  const { options, selectProps } = props;
  const { value, onChange } = selectProps;

  const isAllSelected = options.length > 0 && options.length === value.length;

  const handleToggle = () => {
    if (isAllSelected) {
      onChange([]); // Deselect all
    } else {
      onChange(options); // Select all
    }
  };

  return (
    <components.MenuList {...props}>
      <SelectAllToggle
        label="Select All Containers"
        isAllSelected={isAllSelected}
        onToggle={handleToggle}
      />
      {/* This renders the actual options */}
      {props.children}
    </components.MenuList>
  );
};

const MultiSelectWithSelectAll = ({
  label,
  id,
  name,
  value, // Expects an array of option objects
  onChange,
  options,
  onRemove,
  showRemoveButton = false,
}) => {
  const handleChange = (selectedOptions) => {
    // The parent component will receive the full array of selected option objects
    onChange({
      target: {
        name,
        value: selectedOptions || [], // Ensure value is always an array
      },
    });
  };

  return (
    <div className="flex items-end space-x-2">
      <div className="flex-grow">
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <Select
          inputId={id}
          name={name}
          isMulti // Enable multi-select
          closeMenuOnSelect={false} // Keep menu open to allow multiple selections
          hideSelectedOptions={false} // Show selected options
          value={value}
          onChange={(selected) => handleChange(selected)}
          options={options}
          // Use our custom MenuList component
          components={{ MenuList }}
          className="mt-1"
          classNamePrefix="react-select"
        />
      </div>
      {/* The remove button is now outside the dropdown */}
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

export default MultiSelectWithSelectAll;
