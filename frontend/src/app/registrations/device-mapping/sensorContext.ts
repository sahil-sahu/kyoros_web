import { sensor } from "@/types/sensor";
import { createContext } from "react";

export const SensorContext = createContext<Map<string, sensor>>(new Map());