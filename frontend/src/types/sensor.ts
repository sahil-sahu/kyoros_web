import { bedInfo } from "./ICU";

export interface sensor{
    id: string;
    bedID?: number;
}

export interface bedwSensor extends bedInfo {
    sensorId : string[];
}