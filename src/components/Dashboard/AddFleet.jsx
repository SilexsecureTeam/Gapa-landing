// src/components/Dashboard/AddFleet.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const AddFleet = () => {
  const [selectedBrand, setSelectedBrand] = useState("");
  const [model, setModel] = useState("");
  const [selectedSubModel, setSelectedSubModel] = useState("");
  const [partNumber, setPartNumber] = useState("");
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [submodels, setSubmodels] = useState([]);
  const [loadingModels, setLoadingModels] = useState(false);
  const [loadingSubModels, setLoadingSubModels] = useState(false);

  const navigate = useNavigate();
  const { fleetName } = useParams();
  const location = useLocation();

  // Fetch brands
  useEffect(() => {
    let cancelled = false;
    axios
      .get("https://stockmgt.gapaautoparts.com/api/brand/all-brand")
      .then((res) => {
        if (cancelled) return;
        const raw = res.data?.brands ?? [];
        const normalized = raw.map((b) =>
          typeof b === "string"
            ? { name: b }
            : b?.name
            ? b
            : { name: String(b) }
        );
        setBrands(normalized);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("Error fetching car brands", err);
        setBrands([{ name: "Toyota" }, { name: "Honda" }, { name: "Ford" }]);
        toast.error("Failed to fetch car brands. Using fallback data.");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Fetch models based on selected brand
  useEffect(() => {
    if (selectedBrand) {
      const selectedBrandObj = brands.find(
        (b) => b.name.toLowerCase() === selectedBrand.toLowerCase()
      );
      if (selectedBrandObj?.id) {
        setLoadingModels(true);
        axios
          .get(
            `https://stockmgt.gapaautoparts.com/api/getModelByBrandId?brand_id=${selectedBrandObj.id}`
          )
          .then((res) => {
            setModels(res.data.result || []);
            setLoadingModels(false);
          })
          .catch((err) => {
            console.error("Error fetching models", err);
            setModels([]);
            setLoadingModels(false);
            toast.error("Failed to fetch vehicle models.");
          });
      }
    } else {
      setModels([]);
      setModel("");
    }
  }, [selectedBrand, brands]);

  // Fetch submodels based on selected model
  useEffect(() => {
    if (model) {
      setLoadingSubModels(true);
      axios
        .get(
          `https://stockmgt.gapaautoparts.com/api/getSubModelByModelId?model_id=${model}`
        )
        .then((res) => {
          setSubmodels(res.data.result || []);
          setLoadingSubModels(false);
        })
        .catch((err) => {
          console.error("Error fetching submodels", err);
          setSubmodels([]);
          setLoadingSubModels(false);
          toast.error("Failed to fetch vehicle submodels.");
        });
    } else {
      setSubmodels([]);
      setSelectedSubModel("");
    }
  }, [model]);

  const handleCancel = () => {
    navigate(`/dashboard/quote/${encodeURIComponent(fleetName)}`, {
      state: location.state,
    });
  };

  const handleAddModel = () => {
    const partName =
      partNumber ||
      (selectedBrand && model && selectedSubModel
        ? `${selectedBrand} ${models.find((m) => m.id.toString() === model)?.name || model} ${
            submodels.find((s) => s.id.toString() === selectedSubModel)?.name || selectedSubModel
          }`
        : "");
    if (!partName) {
      toast.error(
        "Please fill in either part number or brand, model, and sub-model.",
        {
          position: "top-right",
          autoClose: 2000,
        }
      );
      return;
    }
    toast.success("Fleet model added, proceeding to select parts.", {
      position: "top-right",
      autoClose: 2000,
    });
    navigate(
      `/dashboard/quote/${encodeURIComponent(fleetName)}/automotive-parts`,
      {
        state: {
          ...location.state,
          booking_id: location.state?.booking_id || fleetName,
        },
      }
    );
  };

  return (
    <div className="w-full mx-auto p-6 bg-white overflow-y-auto custom-scrollbar">
      <div className="max-w-3xl">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-[#333333] mb-6">
            Add Fleet Model
          </h2>
          <button
            onClick={handleCancel}
            className="h-5 w-5 flex items-center cursor-pointer justify-center bg-red-700 text-white font-medium rounded-full transition-colors"
          >
            x
          </button>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Select Brand
            </label>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full px-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
            >
              <option value="">Choose a brand...</option>
              {brands.map((brand) => (
                <option key={brand.id || brand.name} value={brand.name}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Select Model
            </label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              disabled={loadingModels || !selectedBrand || models.length === 0}
              className="w-full px-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
            >
              <option value="">Choose a model...</option>
              {models.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </select>
            {loadingModels && (
              <p className="text-sm text-gray-500 mt-1">Loading models...</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Select Sub Model
            </label>
            <select
              value={selectedSubModel}
              onChange={(e) => setSelectedSubModel(e.target.value)}
              disabled={loadingSubModels || !model || submodels.length === 0}
              className="w-full px-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
            >
              <option value="">Choose a sub model...</option>
              {submodels.map((submodel) => (
                <option key={submodel.id} value={submodel.id}>
                  {submodel.name}
                </option>
              ))}
            </select>
            {loadingSubModels && (
              <p className="text-sm text-gray-500 mt-1">Loading submodels...</p>
            )}
          </div>
          <button
            onClick={handleAddModel}
            className="w-full bg-[#4B3193] hover:bg-[#3A256F] text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            Find My Part
          </button>
          <div className="flex items-center justify-center py-2">
            <div className="w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">OR</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Search with Part Number
            </label>
            <input
              type="text"
              value={partNumber}
              onChange={(e) => setPartNumber(e.target.value)}
              placeholder="Enter part number..."
              className="w-full px-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
            />
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleAddModel}
              className="w-full bg-[#4B3193] hover:bg-[#3A256F] text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Find My Part
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddFleet;