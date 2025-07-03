// src/components/SelectAllToggle.js

import React from "react";

const SelectAllToggle = ({ label, isAllSelected, onToggle }) => {
  return (
    <div className="px-4 py-2 border-b border-gray-200">
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={isAllSelected}
          onChange={onToggle}
          className="sr-only peer" // Hide the default checkbox
        />
        {/* This is the styled slider */}
        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-indigo-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
        <span className="ml-3 text-sm font-medium text-gray-900">{label}</span>
      </label>
    </div>
  );
};

export default SelectAllToggle;
