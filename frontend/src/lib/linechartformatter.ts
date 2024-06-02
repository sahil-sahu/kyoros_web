import { HealthParameter, PatientInfoType, PatientRealtimeObj, Patientlog } from "@/types/pateintinfo";

function getTimeFromISOString(isoString: string): string {
    const date = new Date(isoString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${hours}:${minutes}`;
  }

export const options = {
    responsive: true,
    interaction: {
        mode: 'index' as const,
        intersect: false,
      },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      Ticks: {
        tickFormatter: (value:number, index:number) => {
          if (index % 20 === 0) { // Show labels every 10th point (adjust as needed)
            return value.toString(); // Return formatted value for display
          }
          return ''; // Hide labels for non-matching indices
        },
      },
    },
  };
export function linechartFormatter(param : HealthParameter, info:Patientlog[]){
    
    const labels = info.map((log)=>getTimeFromISOString(log.timeStamp));
    if(param === "bp"){
        return {
            labels,
            datasets: [
            {
                label: "Distolic",
                data: info.map(e => e.bp[0]),
                fill: false,
                pointRadius: 3,
                pointHitRadius: 10,
                borderColor: '#0F52BA',
                backgroundColor: '#0F52BA',
                tension:.3
            },
            {
                label: 'Systolic',
                data: info.map(e => e.bp[1]),
                fill: false,
                pointRadius: 3,
                borderColor: '#ABCCFF', // Increase clickable area for points
                backgroundColor: '#ABCCFF', // Increase clickable area for points
                pointHitRadius: 10,
                tension:.3
            },
            ],
        };
    }
    const data = info.map((log) => log[param]);

    return {
        labels,
        datasets: [
        {
            label: param,
            data,
            fill: false,
            pointRadius: 3,
            pointHitRadius: 10,
            borderColor: '#0F52BA',
            backgroundColor: '#0F52BA',
            tension:.3
        },
        ],
    };
};