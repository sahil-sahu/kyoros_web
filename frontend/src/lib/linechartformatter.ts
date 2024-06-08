import { HealthParameter, PatientInfoType, PatientRealtimeObj, Patientlog } from "@/types/pateintinfo";

function getTimeFromISOString(isoString: string): string {
  const date = new Date(isoString);

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = monthNames[date.getMonth()];
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  return `${month} ${day} ${hours}:${minutes}`;
}


export const options = {
    responsive: true,
    interaction: {
        mode: 'index' as const,
        intersect: false,
      },
      scales: {
        x: {
          ticks: {
            // For a category axis, the val is the index so the lookup via getLabelForValue is needed
            maxTicksLimit:12,
          }
        }
      },
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };
export function linechartFormatter(param : HealthParameter, info:Patientlog[]){
    
    const labels = info.map((log)=>getTimeFromISOString(log.timeStamp));
    console.log(labels);
    if(param === "bp"){
        return {
            labels,
            datasets: [
            {
                label: "Systolic",
                data: info.map(e => e.bp[0]),
                fill: false,
                pointRadius: 3,
                pointHitRadius: 10,
                borderColor: '#0F52BA',
                backgroundColor: '#0F52BA',
                tension:.25
            },
            {
                label: 'Diastolic',
                data: info.map(e => e.bp[1]),
                fill: false,
                pointRadius: 3,
                borderColor: '#ABCCFF', // Increase clickable area for points
                backgroundColor: '#ABCCFF', // Increase clickable area for points
                pointHitRadius: 10,
                tension:.25
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
            tension:.25
        },
        ],
    };
};