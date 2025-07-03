import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ContainerListSelector = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    containers = [],
    selectedContainers = [],
    datasetSearchInstances = [],
  } = location.state || {};

  const [searchTerm, setSearchTerm] = useState("");
  const [selected, setSelected] = useState([]);

  // ✅ Set once on mount
  useEffect(() => {
    setSelected(
      selectedContainers.length > 0
        ? selectedContainers
        : containers.map((c) => c.value)
    );
  }, []); // ✅ empty dependency array to prevent infinite loop

  const toggleSelection = (value) => {
    setSelected((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const handleSubmit = () => {
    // ✅ Go to confirmation page with updated container selection
    navigate("/confirmation", {
      state: {
        datasetSearchInstances: datasetSearchInstances.map((instance) => ({
          ...instance,
          activeCustomFilters: instance.activeCustomFilters.map((filter) =>
            filter.type === "container"
              ? { ...filter, value: selected }
              : filter
          ),
        })),
      },
    });
  };

  const filteredContainers = containers.filter((c) =>
    c.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Select Containers</h2>

      <input
        type="text"
        placeholder="Search containers..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full mb-4 px-3 py-2 border border-gray-300 rounded"
      />

      <ul className="max-h-64 overflow-y-auto border rounded px-4 py-2">
        {filteredContainers.map((c) => (
          <li key={c.value} className="flex items-center py-1">
            <input
              type="checkbox"
              checked={selected.includes(c.value)}
              onChange={() => toggleSelection(c.value)}
              className="mr-2"
            />
            {c.label}
          </li>
        ))}
      </ul>

      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 border rounded text-gray-700 bg-white hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export default ContainerListSelector;
