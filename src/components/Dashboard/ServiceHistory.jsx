import { Eye } from "lucide-react";

const services = [
  {
    date: "2024-07-15",
    type: "Oil Change",
    mechanic: "Mark Johnson",
    cost: "₦75,000",
    details: "#",
  },
  {
    date: "2024-07-15",
    type: "Tire Rotation",
    mechanic: "Sarah Williams",
    cost: "₦75,000",
    details: "#",
  },
  {
    date: "2024-07-15",
    type: "Brake Inspection",
    mechanic: "David Lee",
    cost: "₦75,000",
    details: "#",
  },
  {
    date: "2024-07-15",
    type: "Battery Replacement",
    mechanic: "Emily Chen",
    cost: "₦75,000",
    details: "#",
  },
  {
    date: "2024-07-15",
    type: "Alignment",
    mechanic: "Robert Garcia",
    cost: "₦75,000",
    details: "#",
  },
];

const ServiceHistory = () => {
  return (
    <section className="w-full mx-auto px-4 py-8">
      <div className="overflow-x-auto scrollbar-hide rounded-lg border border-gray-200 p-4 md:p-7 bg-white shadow-sm">
        <h2 className="text-2xl text-[#333333] font-semibold mb-1">
          Service History
        </h2>
        <p className="text-[#757575] mb-6 text-sm">
          Review past services performed on your vehicle.
        </p>
        <table className="min-w-[600px] border border-[#E0E0E0] w-full text-left">
          <thead>
            <tr className="\ border-b border-b-[#E0E0E0]">
              <th className="py-3 px-4 font-medium text-[#333333] text-base">
                Date
              </th>
              <th className="py-3 px-4 font-medium text-[#333333] text-base">
                Service Type
              </th>
              <th className="py-3 px-4 font-medium text-[#333333] text-base">
                Mechanic
              </th>
              <th className="py-3 px-4 font-medium tex[#333333] text-base">
                Cost
              </th>
              <th className="py-3 px-4 font-medium text-[#333333] text-base">
                Details
              </th>
            </tr>
          </thead>
          <tbody>
            {services.map((service, idx) => (
              <tr
                key={idx}
                className={`hover:bg-gray-50 transition-colors ${
                  idx !== services.length - 1
                    ? "border-b border-b-[#E0E0E0]"
                    : ""
                }`}
              >
                <td className="py-3 px-4 text-[#333333] font-normal text-[14px]">
                  {service.date}
                </td>
                <td className="py-3 px-4 text-[#333333] font-normal text-[14px]">
                  {service.type}
                </td>
                <td className="py-3 px-4 text-[#333333] font-normal text-[14px]">
                  {service.mechanic}
                </td>
                <td className="py-3 px-4 text-[#333333] font-normal text-[14px]">
                  {service.cost}
                </td>
                <td className="py-3 px-4">
                  <a
                    href={service.details}
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded transition-colors"
                    aria-label={`View details for ${service.type}`}
                  >
                    <Eye className="w-4 h-4" />
                    <span className="hidden sm:inline">View</span>
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default ServiceHistory;
