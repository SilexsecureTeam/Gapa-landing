import {
  CarIcon,
  CircleDot,
  Disc,
  Droplets,
  Gauge,
  ScanLine,
  WrenchIcon,
} from "lucide-react";

// Service icons
export const serviceIcons = [
  { title: "Oil Service", icon: Droplets, route: "/service" },
  { title: "Brake System Service", icon: Disc, route: "/service" },
  { title: "Diagnostic Services", icon: ScanLine, route: "/service" },
  { title: "Engine Check", icon: Gauge, route: "/service" },
  {
    title: "Wheel Balancing & Alignment",
    icon: CircleDot,
    route: "/service",
  },
  { title: "Suspension Services", icon: CarIcon, route: "/service" },
  {
    title: "Car Part",
    icon: WrenchIcon,
    route: "https://gapaautoparts.com/",
  },
];

// === ADDED: Services & Locations arrays (were missing) ===
export const services = [
  "Oil Service",
  "Brake System Service",
  "Diagnostic Services",
  "Paint & Bodywork",
  "Wheel Balancing & Alignment",
  "Tyre Change",
  "Car Detailing",
  "Suspension Systems",
  "Comprehensive Repairs",
  "Engine Check",
];

export const locations = [
  "Giwa Barracks Car Park, Ikoyi, Lagos",
  "Kilometer 15, Lekki Epe Expressway, By Jakande Roundabout, Lekki, Lagos",
];
