import { HealthParameter, PatientInfoType, PatientRealtimeObj, Patientlog } from "@/types/pateintinfo";
import {
  Chart,
  ChartOptions,
} from 'chart.js';
export function getTimeFromISOString(isoString: string): string {
  const date = new Date(isoString);

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = monthNames[date.getMonth()];
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  return `${month} ${day} ${hours}:${minutes}`;
}

export function linechartFormatter(data:{y:number[]; x: string[]}, label?:string){
    
    return {
        labels:data.x,
        datasets: [
        {
            label: label?.toUpperCase(),
            data: data.y,
            fill: false,
            pointRadius: 3,
            pointHitRadius: 10,
            borderColor: '#2F377A',
            backgroundColor: '#2F377A',
            tension:.25
        },
        ],
    };
};