"use client"
import ageCalc from "@/lib/ageCalc";
import { PatientInfoProps, Patientlog } from "@/types/pateintinfo";
import { useEffect } from "react";
interface LogData extends PatientInfoProps {
    logs : Patientlog[];
}
const DataTable = ({data, searchParams}:{data:LogData, searchParams: { [key: string]: string | undefined }}) =>{
    useEffect(()=>{
        // let type = searchParams["download"]
        // if(type == "true"){
        //     @import("")
        // } else{
            window.print()
        // }
    })
    const params = searchParams["params"]?.split(",") ?? ["bp","heart_rate","pulse","resp_rate","spo2","temp"];
    let bp_b = params.includes("bp");
    let heartrates_b = params.includes("heart_rate");
    let pulse_b = params.includes("pulse");
    let resp_rate_b = params.includes("resp_rate");
    let spo2_b = params.includes("spo2");
    let temp_b = params.includes("temp");

    return (
        <div
  style={{
    margin: 'auto',
    width: 794,
    padding: '1.25rem', // Converted from p-5
  }}
>
  <table
    style={{
      tableLayout: 'auto',
      width: '100%',
      borderWidth: '1px',
      borderColor:"#000",
      textAlign: 'center',
      marginBottom: '1.25rem',
    }}
  >
    <thead>
      <tr
        style={{
          borderWidth: '1px',
          borderColor:"#000",
        }}
      >
        <th
          style={{
            borderWidth: '1px',
            borderColor:"#000",
            borderRightWidth: '1px',
          }}
        >
          Name
        </th>
        <th
          style={{
            borderWidth: '1px',
            borderColor:"#000",
            borderRightWidth: '1px',
          }}
        >
          UHID
        </th>
        <th
          style={{
            borderWidth: '1px',
            borderColor:"#000",
            borderRightWidth: '1px',
          }}
        >
          Gender
        </th>
        <th
          style={{
            borderWidth: '1px',
            borderColor:"#000",
            borderRightWidth: '1px',
          }}
        >
          Age
        </th>
      </tr>
    </thead>
    <tbody
      style={{
        borderWidth: '1px',
        borderColor:"#000",
      }}
    >
      <tr
        style={{
          borderWidth: '1px',
          borderColor:"#000",
        }}
      >
        <td
          style={{
            borderWidth: '1px',
            borderColor:"#000",
            borderRightWidth: '1px',
          }}
        >
          {data.name}
        </td>
        <td
          style={{
            borderWidth: '1px',
            borderColor:"#000",
            borderRightWidth: '1px',
          }}
        >
          {data.uhid}
        </td>
        <td
          style={{
            borderWidth: '1px',
            borderColor:"#000",
            borderRightWidth: '1px',
          }}
        >
          {data.gender}
        </td>
        <td
          style={{
            borderWidth: '1px',
            borderColor:"#000",
            borderRightWidth: '1px',
          }}
        >
          {ageCalc(data.dob)}
        </td>
      </tr>
    </tbody>
  </table>

  <table
    style={{
      tableLayout: 'auto',
      width: '100%',
      borderWidth: '1px',
      borderColor:"#000",
      textAlign: 'center',
    }}
  >
    <thead>
      <tr
        style={{
          borderWidth: '1px',
          borderColor:"#000",
        }}
      >
        <th
          style={{
            borderWidth: '1px',
            borderColor:"#000",
            borderRightWidth: '1px',
          }}
        >
          Timestamp
        </th>
        {bp_b && (
          <th
            style={{
              borderWidth: '1px',
              borderColor:"#000",
              borderRightWidth: '1px',
            }}
          >
            BP
          </th>
        )}
        {heartrates_b && (
          <th
            style={{
              borderWidth: '1px',
              borderColor:"#000",
              borderRightWidth: '1px',
            }}
          >
            Heart Rate
          </th>
        )}
        {pulse_b && (
          <th
            style={{
              borderWidth: '1px',
              borderColor:"#000",
              borderRightWidth: '1px',
            }}
          >
            Pulse
          </th>
        )}
        {resp_rate_b && (
          <th
            style={{
              borderWidth: '1px',
              borderColor:"#000",
              borderRightWidth: '1px',
            }}
          >
            Resp Rate
          </th>
        )}
        {spo2_b && (
          <th
            style={{
              borderWidth: '1px',
              borderColor:"#000",
              borderRightWidth: '1px',
            }}
          >
            SPO2
          </th>
        )}
        {temp_b && (
          <th
            style={{
              borderWidth: '1px',
              borderColor:"#000",
            }}
          >
            Temperature
          </th>
        )}
      </tr>
    </thead>
    <tbody
      style={{
        borderWidth: '1px',
        borderColor:"#000",
      }}
    >
      {data.logs.map((log, index) => (
        <tr
          style={{
            borderWidth: '1px',
            borderColor:"#000",
          }}
          key={index}
        >
          <td
            style={{
              borderWidth: '1px',
              borderColor:"#000",
              borderRightWidth: '1px',
            }}
          >
            {new Date(log.timeStamp).toLocaleString()}
          </td>
          {bp_b && (
            <td
              style={{
                borderWidth: '1px',
                borderColor:"#000",
                borderRightWidth: '1px',
              }}
            >
              {log.bp.join('/')}
            </td>
          )}
          {heartrates_b && (
            <td
              style={{
                borderWidth: '1px',
                borderColor:"#000",
                borderRightWidth: '1px',
              }}
            >
              {log.heart_rate}
            </td>
          )}
          {pulse_b && (
            <td
              style={{
                borderWidth: '1px',
                borderColor:"#000",
                borderRightWidth: '1px',
              }}
            >
              {log.pulse}
            </td>
          )}
          {resp_rate_b && (
            <td
              style={{
                borderWidth: '1px',
                borderColor:"#000",
                borderRightWidth: '1px',
              }}
            >
              {log.resp_rate}
            </td>
          )}
          {spo2_b && (
            <td
              style={{
                borderWidth: '1px',
                borderColor:"#000",
                borderRightWidth: '1px',
              }}
            >
              {log.spo2}
            </td>
          )}
          {temp_b && (
            <td
              style={{
                borderWidth: '1px',
                borderColor:"#000",
              }}
            >
              {log.temp}
            </td>
          )}
        </tr>
      ))}
    </tbody>
  </table>
</div>

    )
}

export default DataTable;