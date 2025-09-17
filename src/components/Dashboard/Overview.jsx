import React from "react";
import { Eye, Trash2, ArrowDownUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Overview = () => {
  const maintenanceData = [
    {
      fleetName: "ALFR787E646",
      startDate: "07/08/2023",
      endDate: "07/08/2023",
      maintenanceType: "Oil Services",
      totalCost: "7,000",
      status: "Approved",
    },
    {
      fleetName: "ALFR787E646",
      startDate: "07/08/2023",
      endDate: "07/08/2023",
      maintenanceType: "Oil Services",
      totalCost: "7,000",
      status: "Approved",
    },
    {
      fleetName: "ALFR787E646",
      startDate: "07/08/2023",
      endDate: "07/08/2023",
      maintenanceType: "Oil Services",
      totalCost: "7,000",
      status: "Approved",
    },
    {
      fleetName: "ALFR787E646",
      startDate: "07/08/2023",
      endDate: "07/08/2023",
      maintenanceType: "Oil Services",
      totalCost: "7,000",
      status: "Approved",
    },
  ];

  const navigate = useNavigate();

  const handleView = (item) => {
    navigate(`/dashboard/quote/${encodeURIComponent(item.fleetName)}`, {
      state: item,
    });
    console.log("Navigating to Quote for:", item); // Debug log
  };

  return (
    <div className="w-full bg-white overflow-hidden">
      <div className="overflow-x-auto scrollbar-hide">
        <table className="w-full min-w-[600px] border-separate border-spacing-y-2">
          <thead>
            <tr className="bg-white">
              <th className="text-left py-3 px-4 font-semibold text-[#333333] md:text-base text-sm">
                Fleet Name
              </th>
              <th className="text-left py-3 px-4 font-semibold text-[#333333] md:text-base text-sm">
                <div className="inline-flex items-center gap-1">
                  <ArrowDownUp size={16} className="text-gray-600" />
                  Start Date
                </div>
              </th>
              <th className="text-left py-3 px-4 font-semibold text-[#333333] md:text-base text-sm">
                <div className="inline-flex items-center gap-1">
                  <ArrowDownUp size={16} className="text-gray-600" />
                  End Date
                </div>
              </th>
              <th className="text-left py-3 px-4 font-semibold text-[#333333] md:text-base text-sm">
                <div className="inline-flex items-center gap-1">
                  <ArrowDownUp size={16} className="text-gray-600" />
                  Maintenance Type
                </div>
              </th>
              <th className="text-left py-3 px-4 font-semibold text-[#333333] md:text-base text-sm">
                <div className="inline-flex items-center gap-1">
                  <ArrowDownUp size={16} className="text-gray-600" />
                  Total Cost
                </div>
              </th>
              <th className="text-left py-3 px-4 font-semibold text-[#333333] md:text-base text-sm">
                Status
              </th>
              <th className="text-left py-3 px-4 font-semibold text-[#333333] md:text-base text-sm w-20"></th>
            </tr>
          </thead>
          <tbody>
            {maintenanceData.map((item, index) => (
              <tr
                key={index}
                className={`border-b bg-[#F9F9F9] border-[#E0E0E0] hover:bg-gray-50 transition-colors ${
                  index === maintenanceData.length - 1 ? "border-b-0" : ""
                }`}
              >
                <td className="py-4 px-4 text-sm text-gray-900 font-medium">
                  {item.fleetName}
                </td>
                <td className="py-4 px-4 text-sm text-gray-600">
                  {item.startDate}
                </td>
                <td className="py-4 px-4 text-sm text-gray-600">
                  {item.endDate}
                </td>
                <td className="py-4 px-4 text-sm text-gray-600">
                  {item.maintenanceType}
                </td>
                <td className="py-4 px-4 text-sm text-gray-900 font-medium">
                  ₦ {item.totalCost}
                </td>
                <td className="py-4 px-4 text-sm">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {item.status}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleView(item)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Eye size={16} className="text-green-600" />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <Trash2 size={16} className="text-red-500" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        @media (max-width: 640px) {
          table {
            font-size: 0.85rem;
          }
          th,
          td {
            padding: 0.5rem;
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none; /* IE and Edge */
            scrollbar-width: none; /* Firefox */
          }
        }
      `}</style>
    </div>
  );
};

export default Overview;
