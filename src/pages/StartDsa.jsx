import React from "react";
import MDEditor from "@uiw/react-md-editor";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setTextspace } from "../slice/startDsaSlice"; // adjust path if needed

const StartDsa = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const textspace = useSelector((state) => state.dsa.textspace);

  const inputBaseClass =
    "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2";
  const labelBaseClass = "block text-sm font-medium text-gray-700 mb-1";

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted DSA:", textspace);
    navigate("/create-dsa");
  };

  const handleChange = (val) => {
    dispatch(setTextspace(val));
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen flex flex-col items-center">
      <div className="max-w-2xl w-full bg-white p-8 shadow-xl rounded-lg">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Data Sharing Agreement
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div data-color-mode="light">
            <MDEditor
              value={textspace}
              onChange={handleChange}
              id="purpose"
              name="purpose"
              preview="edit"
              className={inputBaseClass}
              height={300}
              textareaProps={{
                placeholder: "Describe the purpose of data sharing",
              }}
            />
          </div>

          <div className="flex md:grid-cols-2 gap-6">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out"
            >
              Create DSA
            </button>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out"
            >
              Version a DSA
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StartDsa;
