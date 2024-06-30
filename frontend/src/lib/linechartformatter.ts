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

const zoomOptions = {
  limits: {
    // x: {min: -200, max: 1000, minRange: 50},
    y: {min: -200, max: 200, minRange: 50}
  },
  pan: {
    enabled: true,
    onPanStart({ chart, point }: { chart: Chart; point: { x: number; y: number } }): boolean | void {
      const area = chart.chartArea;
      const w25 = area.width * 0.25;
      const h25 = area.height * 0.25;
      if (point.x < area.left + w25 || point.x > area.right - w25
          || point.y < area.top + h25 || point.y > area.bottom - h25) {
          return false; // abort
      }
  },
    mode: 'xy',
  }  as any,
  zoom: {
    wheel: {
      enabled: true,
    },
    // pinch: {
    //   enabled: true
    // },
    mode: 'xy',
  } as any
};


export const options:ChartOptions<'line'> = {
    responsive: true,
    interaction: {
        mode: 'index' as const,
        intersect: false,
      },
      scales: {
        x: {
          ticks: {
            // For a category axis, the val is the index so the lookup via getLabelForValue is needed
            maxTicksLimit:11,
          },
          grid: {
            display: false, // This disables the grid lines on the y-axis
          },
        },
      },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      zoom: zoomOptions
    },
  };
export function linechartFormatter(param : HealthParameter, info:Patientlog[]){
    
    const labels = info.map((log)=>getTimeFromISOString(log.timeStamp));
    // console.log(labels);
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
                borderColor: '#2F377A',
                backgroundColor: '#2F377A',
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
            borderColor: '#2F377A',
            backgroundColor: '#2F377A',
            tension:.25
        },
        ],
    };
};