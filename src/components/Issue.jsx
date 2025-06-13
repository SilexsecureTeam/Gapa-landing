import React, { useState } from "react";
import * as Progress from "@radix-ui/react-progress";
import { useNavigate } from "react-router-dom";

const Issue = () => {
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle continue action here (e.g., form submission)
    console.log("Description:", description);
    console.log("File:", file);
    navigate("/book-third");
  };

  return (
    <div className="py-6 lg:px-24 md:px-20 sm:px-16 px-6 w-full mx-auto ">
      {/* Progress Bar */}
      <div className="mb-6 py-5 px-10 bg-white rounded-xl">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-[#141414]">Progress</span>
          <span className="text-sm font-medium text-[#492F92]">
            40% completed
          </span>
        </div>
        <Progress.Root
          className="relative overflow-hidden bg-[#f3f1f7] rounded-full w-full h-4"
          value={40}
          max={100}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={40}
        >
          <Progress.Indicator
            className="bg-[#492F92] h-full transition-transform duration-500 ease-out"
            style={{ transform: "translateX(-60%)" }}
          />
        </Progress.Root>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow rounded-lg p-10 space-y-6"
      >
        <div>
          <label
            htmlFor="description"
            className="block text-xl sm:text-[22px] font-semibold text-[#141414] mb-2"
          >
            Describe the issue
          </label>
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={handleDescriptionChange}
            rows={9}
            placeholder="Please describe the issue with your vehicle..."
            className="w-full border border-gray-300 rounded-md p-3 text-[#333333] resize-y focus:outline-none focus:ring-2 focus:ring-[#492F92]"
            required
          />
        </div>

        <div>
          <label className="block text-lg font-semibold text-[#141414] mb-1">
            Add photos or videos
          </label>
          <p className="text-sm text-[#757575] mb-3">
            Upload photos or short videos to help illustrate the problem.
            (Optional)
          </p>
          <label
            htmlFor="file-upload"
            className="flex flex-col items-center justify-center border-2 border-dotted border-gray-400 rounded-lg cursor-pointer p-10 text-center text-gray-500 hover:border-[#492F92] hover:text-[#492F92] transition-colors"
          >
            <span className="mb-2">Drag and drop or browse</span>
            <span className="text-xs">Max. file size: 10MB</span>
            <input
              id="file-upload"
              type="file"
              accept="image/*,video/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
          {file && (
            <p className="mt-2 text-sm text-[#492F92]">
              Selected file: {file.name}
            </p>
          )}
        </div>
        <div className="w-full flex justify-end">
          <button
            type="submit"
            className="w-fit px-6 bg-[#492F92] cursor-pointer text-white py-3 rounded shadow hover:bg-[#3a236d] transition-colors font-semibold"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );
};

export default Issue;
