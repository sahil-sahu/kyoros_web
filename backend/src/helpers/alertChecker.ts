import { Patientlog } from "../types"

export const alertCheck = (log: Patientlog): ["critical" | "normal" | null, string] => {
    let type: "critical" | "normal" | null = null;
    let alertMessages: string[] = [];
  
    const [systolic, diastolic] = log.bp;
  
    // BP Check
    if (systolic > 140 || systolic < 90 || diastolic > 90 || diastolic < 60) {
      type = "critical";
      alertMessages.push(`Critical BP: ${systolic}/${diastolic} mmHg`);
    } else if ((systolic >= 130 && systolic <= 140) || (systolic >= 90 && systolic <= 100) || 
               (diastolic >= 85 && diastolic <= 90) || (diastolic >= 60 && diastolic <= 65)) {
      if (type !== "critical") {
        type = "normal";
      }
      alertMessages.push(`BP: ${systolic}/${diastolic} mmHg`);
    }
  
    // Respiratory Rate Check
    if (log.resp_rate > 24 || log.resp_rate < 10) {
      type = "critical";
      alertMessages.push(`Critical Resp Rate: ${log.resp_rate} breaths/min`);
    } else if ((log.resp_rate >= 20 && log.resp_rate <= 24) || (log.resp_rate >= 10 && log.resp_rate < 12)) {
      if (type !== "critical") {
        type = "normal";
      }
      alertMessages.push(`Resp Rate: ${log.resp_rate} breaths/min`);
    }
  
    // SpO2 Check
    if (log.spo2 < 90) {
      type = "critical";
      alertMessages.push(`Critical SpO2: ${log.spo2}%`);
    } else if (log.spo2 >= 90 && log.spo2 < 95) {
      if (type !== "critical") {
        type = "normal";
      }
      alertMessages.push(`SpO2: ${log.spo2}%`);
    }
  
    // Heart Rate Check
    if (log.heart_rate > 120 || log.heart_rate < 50) {
      type = "critical";
      alertMessages.push(`Critical HR: ${log.heart_rate} bpm`);
    } else if ((log.heart_rate >= 100 && log.heart_rate <= 120) || (log.heart_rate >= 50 && log.heart_rate < 60)) {
      if (type !== "critical") {
        type = "normal";
      }
      alertMessages.push(`HR: ${log.heart_rate} bpm`);
    }
  
    if (type === null) {
      alertMessages.push('No Alert');
    }
  
    return [type, alertMessages.join(', ')];
  };