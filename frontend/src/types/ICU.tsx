import { PatientInfoProps } from "./pateintinfo";

export interface ICU {
    name:string;
    filled:number;
    total:number;
}

interface bedInfo{
    name:string;
    id:number;
    patient:PatientInfoProps
}
export interface ICUInfo {
    id:number;
    name:string;
    beds: bedInfo[];
}

function getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandomICUData(): ICU[] {
    const icuData: ICU[] = [];

    const names = ['ICU A', 'ICU B', 'ICU C', 'ICU D', 'ICU E', 'ICU F']; // Example names

    for (let i = 0; i < 4; i++) {
        const totalBeds = getRandomInt(50, 100); // Total beds between 50 and 100
        const filledBeds = getRandomInt(0, totalBeds); // Filled beds between 0 and totalBeds

        const icu: ICU = {
            name: names[getRandomInt(0, names.length - 1)], // Random name from the list
            filled: filledBeds,
            total: totalBeds
        };

        icuData.push(icu);
    }

    return icuData;
}

export const icuData = generateRandomICUData();
