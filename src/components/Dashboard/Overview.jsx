import React from "react";
import { AlertTriangle } from "lucide-react";
import car from "../../assets/vehicle.png";

const cars = [
  {
    name: "Toyota Corolla 2019  ",
    subname: "ABC 123 DE",
    engine: "AC 1234 BC",
    subengine: "Color: Midnight Blue",
    image: car,
  },
  {
    name: "Toyota Corolla 2018  ",
    subname: "ABC 123 DE",
    engine: "AG 001 AB",
    subengine: "Color: Midnight Blue",
    image: car,
  },
  {
    name: "Toyota Corolla 2018  ",
    subname: "ABC 123 DE",
    engine: "KU 114 YX",
    subengine: "Color: Midnight Blue",
    image: car,
  },
  {
    name: "Toyota Corolla 2019  ",
    subname: "ABC 123 DE",
    engine: "KY 310 DE",
    subengine: "Color: Midnight Blue",
    image: car,
  },
];

const ongoingServices = [
  {
    car: "Toyota Corolla 2018",
    type: "Oil Change",
    progress: 60,
  },
  {
    car: "Toyota Corolla 2018",
    type: "Oil Change",
    progress: 25,
  },
];

const maintenances = [
  {
    type: "Oil Change",
    time: "Due in 4 days",
    mileage: "#30.00 - #50.00",
  },
  {
    type: "Oil Change",
    time: "Due in 4 days",
    mileage: "#30.00 - #50.00",
  },
  {
    type: "Oil Change",
    time: "Due in 4 days",
    mileage: "#30.00 - #50.00",
  },
  {
    type: "Oil Change",
    time: "Due in 4 days",
    mileage: "#30.00 - #50.00",
  },
];

const Overview = () => {
  return (
    <div className="space-y-8 ">
      {/* Available Cars + Ongoing Service */}
      <div className="grid   lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-4 bg-white rounded-xl grid md:grid-cols-2 gap-4">
          {cars.map((car, index) => (
            <div
              key={index}
              className="bg-[#f3f1f7] p-2 rounded-xl overflow-hidden shadow hover:shadow-lg transition"
            >
              <img
                src={car.image}
                alt={car.name}
                className="h-40 w-full rounded-xl object-cover"
              />
              <div className="p-4">
                <div className="flex items-center space-x-3">
                  <h4 className="font-semibold">{car.name}</h4>
                  <h4 className="font-normal text-sm text-gray-500">
                    {car.subname}
                  </h4>
                </div>
                <div className="flex items-center mt-2 justify-between">
                  <p className="text-[12px] text-gray-500">{car.engine}</p>
                  <p className="text-[12px] text-gray-500">{car.subengine}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white p-4 rounded-xl shadow flex flex-col gap-4">
          <h3 className="font-bold text-lg">Ongoing Service</h3>
          {ongoingServices.map((service, index) => (
            <div
              key={index}
              className="bg-purple-700 text-white rounded-lg px-3 py-4"
            >
              <h4 className="font-medium">{service.car}</h4>
              <p className="text-sm mb-2">{service.type}</p>
              <div className="bg-purple-300 mt-7 rounded-full h-2 w-full">
                <div
                  className="bg-[#F7CD3A] h-2 rounded-full"
                  style={{ width: `${service.progress}%` }}
                />
              </div>
              <div className="flex w-full justify-between mt-2">
                <h2 className="font-light text-[12px] text-[#E5E5E5]">
                  in progress
                </h2>
                <h2 className="font-light text-[12px] text-[#E5E5E5]">
                  ETA, 9:Am/ 13|06|2025
                </h2>
              </div>
            </div>
          ))}
          <button className="mt-auto bg-purple-700 hover:bg-purple-800 text-white font-semibold py-2 rounded-lg">
            + Request Service
          </button>
        </div>
      </div>

      {/* Upcoming Maintenance */}
      <h3 className="font-bold text-xl text-[#333333] mb-4">
        Upcoming Maintenance
      </h3>
      <div className="bg-white rounded-xl shadow p-6">
        <div className="space-y-4">
          {maintenances.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 border border-purple-300 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="bg-yellow-400 text-white p-2 rounded-full">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold">{item.type}</p>
                  <p className="text-sm text-gray-500">{item.time}</p>
                  <p className="text-xs ">{item.mileage}</p>
                </div>
              </div>
              <button className="bg-purple-700 text-white px-4 py-2 rounded-md text-sm hover:bg-purple-800">
                Book now
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Overview;
