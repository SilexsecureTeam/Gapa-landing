import technician1 from "../assets/recent.png";
import technician2 from "../assets/recent.png";
import technician3 from "../assets/recent.png";
import technician4 from "../assets/recent.png";
import technician5 from "../assets/recent.png";
import technician6 from "../assets/recent.png";
import technician7 from "../assets/recent.png";
import technician8 from "../assets/recent.png";
import technician9 from "../assets/recent.png";
import technician10 from "../assets/recent.png";

const technicians = [
  { id: 1, image: technician1 },
  { id: 2, image: technician2 },
  { id: 3, image: technician3 },
  { id: 4, image: technician4 },
  { id: 5, image: technician5 },
  { id: 6, image: technician6 },
  { id: 7, image: technician7 },
  { id: 8, image: technician8 },
  { id: 9, image: technician9 },
  { id: 10, image: technician10 },
];

const Team = () => {
  return (
    <div className="py-12 md:py-16 lg:px-10 md:px-8 sm:px-6 px-2">
      <h1 className="mx-auto text-[#333333] text-center max-w-[973px] font-semibold mb-6 leading-tight text-xl md:text-3xl lg:text-[40px]">
        We Bring a Wealth of Skills and Experience from Diverse Backgrounds
      </h1>
      <p className="max-w-[597px] text-[#333333] mx-auto text-center text-base mb-10 font-medium md:text-lg">
        Great people, equipped with the right tools and support, create
        exceptional solutions. At Gapa Auto Fix, we're powered by a team
        committed to innovation, reliability, and real-world impact.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8">
        {technicians.map((technician) => (
          <div
            key={technician.id}
            className="relative overflow-hidden h-60 rounded-lg shadow-lg bg-center bg-cover group"
            style={{ backgroundImage: `url(${technician.image})` }}
          >
            {/* Bottom-to-Top Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent transition duration-300"></div>

            {/* Text Content */}
            <div className="relative z-10 flex flex-col items-center justify-end h-full text-center text-white p-4">
              <h3 className="text-lg font-bold">Emeka Johnson</h3>
              <p className="text-[12px] font-medium mt-1.5">
                Senior Auto Technician
              </p>
              <p className="text-[12px] font-medium">
                12+ years in vehicle <br /> diagnostics and repairs
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Team;
