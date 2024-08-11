import { bedInfo } from "./ICU";

export interface sensor{
    id: string;
    bedID?: number;
    username?: string;
}

export interface bedwSensor extends bedInfo {
    sensorId : string[];
}