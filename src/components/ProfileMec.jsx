import { useState } from "react";

const ProfileMec = () => {
  const [form, setForm] = useState({
    workshopName: "",
    workshopAddress: "",
    contactNumber: "",
    vin: "",
    certName: "",
    issuingAuthority: "",
    certId: "",
    certFile: null,
    skills: "",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "certFile") {
      setForm((prev) => ({ ...prev, certFile: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit logic here
    alert(JSON.stringify(form, null, 2));
  };

  return (
    <div className="min-h-screen py-8 md:py-12 px-4 sm:px-8 md:px-16 lg:px-20 ">
      <div className="w-full max-w-6xl p-6 sm:p-8 md:p-12 lg:p-16 mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <h2 className="text-xl sm:text-2xl font-bold text-[#141414] mb-8 ">
          Set up your workshop profile
        </h2>
        <div className="flex flex-col md:flex-row w-full ">
          <form
            onSubmit={handleSubmit}
            className="w-full flex flex-col md:space-x-20 md:flex-row gap-8 "
          >
            {/* Left Column: Workshop Details */}
            <div className="w-full md:w-1/2">
              <div className="mb-6">
                <h3 className="text-lg font-medium text-[#141414] mb-4">
                  Workshop details
                </h3>
                <div className="space-y-6.5">
                  <div>
                    <label className="block text-base font-semibold text-[#333333] mb-1">
                      Name<span className="text-[#FF0000]">*</span>
                    </label>
                    <input
                      type="text"
                      name="workshopName"
                      value={form.workshopName}
                      onChange={handleChange}
                      required
                      className="w-full bg-[#F2F2F2] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                      placeholder="Enter workshop name"
                    />
                  </div>
                  <div>
                    <label className="block text-base font-semibold text-[#333333] mb-1">
                      Address<span className="text-[#FF0000]">*</span>
                    </label>
                    <input
                      type="text"
                      name="workshopAddress"
                      value={form.workshopAddress}
                      onChange={handleChange}
                      required
                      className="w-full bg-[#F2F2F2] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                      placeholder="Enter workshop address"
                    />
                  </div>
                  <div>
                    <label className="block text-base font-semibold text-[#333333] mb-1">
                      Contact Number<span className="text-[#FF0000]">*</span>
                    </label>
                    <input
                      type="text"
                      name="contactNumber"
                      value={form.contactNumber}
                      onChange={handleChange}
                      required
                      className="w-full bg-[#F2F2F2] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                      placeholder="Enter contact number"
                    />
                  </div>
                  <div>
                    <label className="block text-base font-semibold text-[#333333] mb-1">
                      Vehicle Identification Number (VIN)
                      <span className="text-[#FF0000]">*</span>
                    </label>
                    <input
                      type="text"
                      name="vin"
                      value={form.vin}
                      onChange={handleChange}
                      required
                      className="w-full bg-[#F2F2F2] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                      placeholder="Please enter your email"
                    />
                  </div>
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-[#492F92] mt-10 text-white py-2 rounded-md hover:bg-indigo-700 font-semibold transition-colors hidden md:block"
              >
                SUBMIT
              </button>
            </div>

            {/* Right Column: Certifications */}
            <div className="w-full md:w-1/2 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-medium text-[#141414] mb-4">
                  Certifications
                </h3>
                <div className="space-y-6.5">
                  <div>
                    <label className="block text-base font-semibold text-[#333333] mb-1">
                      Name<span className="text-[#FF0000]">*</span>
                    </label>
                    <input
                      type="text"
                      name="certName"
                      value={form.certName}
                      onChange={handleChange}
                      required
                      className="w-full bg-[#F2F2F2] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                      placeholder="Enter certification name"
                    />
                  </div>
                  <div>
                    <label className="block text-base font-semibold text-[#333333] mb-1">
                      Issuing Authority<span className="text-[#FF0000]">*</span>
                    </label>
                    <input
                      type="text"
                      name="issuingAuthority"
                      value={form.issuingAuthority}
                      onChange={handleChange}
                      required
                      className="w-full bg-[#F2F2F2] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                      placeholder="Enter issuing authority"
                    />
                  </div>
                  <div>
                    <label className="block text-base font-semibold text-[#333333] mb-1">
                      Certification ID<span className="text-[#FF0000]">*</span>
                    </label>
                    <input
                      type="text"
                      name="certId"
                      value={form.certId}
                      onChange={handleChange}
                      required
                      className="w-full bg-[#F2F2F2] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                      placeholder="Please enter your email"
                    />
                  </div>
                  <div>
                    <label className="block text-base font-semibold text-[#333333] mb-1">
                      Upload Certification
                      <span className="text-[#FF0000]">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        name="certFile"
                        onChange={handleChange}
                        required
                        className="w-full bg-[#F2F2F2] rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                        {/* Simple upload icon */}
                        <svg
                          width="20"
                          height="20"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M12 16V4M12 4l-4 4M12 4l4 4"
                            stroke="#A3A3A3"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <rect
                            x="4"
                            y="16"
                            width="16"
                            height="4"
                            rx="2"
                            fill="#A3A3A3"
                          />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Skills box */}
              <div className="mt-8">
                <label className="block text-base font-semibold text-[#333333] mb-1">
                  Skills
                </label>
                <textarea
                  name="skills"
                  value={form.skills}
                  onChange={handleChange}
                  rows={3}
                  className="w-full bg-white border border-[#CFD3D4] h-[150px] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors resize-none"
                  placeholder="List your skills here"
                />
              </div>
            </div>
            {/* Submit Button for Mobile View */}
            <button
              type="submit"
              className="w-full bg-[#492F92] mt-6 text-white py-2 rounded-md hover:bg-indigo-700 font-semibold transition-colors block md:hidden"
            >
              SUBMIT
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileMec;
