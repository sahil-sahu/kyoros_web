import { PatientRealtimeObj } from "@/types/pateintinfo";

const randomBoolean = () => Math.random() < 0.5;

// Generate a random integer between min and max (inclusive)
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

// Generate dummy data for PatientRealtimeObj interface
const generateDummyData = (): PatientRealtimeObj => ({
  bp:{bp_d: randomInt(60, 100),bp_s: randomInt(90, 140),},
  spo2: randomInt(90, 100),
  temp: +(Math.random() * (37.5 - 36.0) + 36.0).toFixed(1), // Random temperature between 36.0 and 37.5
  critical: randomBoolean(),
  bpm: randomInt(60, 100),
  timestamp: new Date().toISOString(),
});

// Generate an array of dummy data
export const dummyData: PatientRealtimeObj[] = Array.from({ length: 20 }, () => generateDummyData());
