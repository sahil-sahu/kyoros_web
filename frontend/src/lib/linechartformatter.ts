import { PatientInfoType, PatientRealtimeObj } from "@/types/pateintinfo";

function getTimeFromISOString(isoString: string): string {
    const date = new Date(isoString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${hours}:${minutes}`;
  }
export default function linechartFormatter(param : PatientInfoType, info:PatientRealtimeObj[]){
    
    const labels = info.map((log)=>getTimeFromISOString(log.timestamp));
    const data = info.map((log)=>log[param]);


    return {
        labels,
        datasets: [
        {
            label: 'Heart Rate (BPM)',
            data,
            fill: false, // Avoid filling the area below the line
            backgroundColor: 'rgba(255, 99, 132, 0.2)', // Semi-transparent red
            borderColor: 'rgba(255, 99, 132, 1)', // Red line
            pointRadius: 3, // Adjust point size
            pointHitRadius: 10, // Increase clickable area for points
        },
        ],
    };
};