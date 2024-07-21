import {Patientlog} from  "@/types/pateintinfo"

export const PatientInfoType: HealthParameter[] = ["bp", "heart_rate", "pulse", "resp_rate", "spo2", "temp"];

export type HealthParameter = "bp" | "heart_rate" | "pulse" | "resp_rate" | "spo2" | "temp";
enum css {
  critical = "border-dashed border-red-500",
  normal = "border-dashed border-[#D9DE00]",
  default = "border-solid"
}
export const alertCheck = (log: Patientlog|undefined): ["critical" | "normal"|null, css:string] => {
    if(!log) return [null, css.default];

    let type: "critical" | "normal" | null = null;
    let param:HealthParameter|null = null;
    let style = css.default
    const [systolic, diastolic] = log.bp;
  
    // BP Check
    if (systolic > 140 || systolic < 90 || diastolic > 90 || diastolic < 60) {
      type = "critical";
      param = PatientInfoType[0];
    } else if ((systolic >= 130 && systolic <= 140) || (systolic >= 90 && systolic <= 100) || 
               (diastolic >= 85 && diastolic <= 90) || (diastolic >= 60 && diastolic <= 65)) {
      if (type !== "critical") {
        type = "normal";
        param = PatientInfoType[0];
      }
    }
  
    // Respiratory Rate Check
    if (log.resp_rate > 24 || log.resp_rate < 10) {
      type = "critical";
      param = PatientInfoType[3];
    } else if ((log.resp_rate >= 20 && log.resp_rate <= 24) || (log.resp_rate >= 10 && log.resp_rate < 12)) {
      if (type !== "critical") {
        type = "normal";
        param = PatientInfoType[3];
      }
    }
  
    // SpO2 Check
    if (log.spo2 < 90) {
      type = "critical";
      param = PatientInfoType[4];
    } else if (log.spo2 >= 90 && log.spo2 < 95) {
      if (type !== "critical") {
        type = "normal";
        param = PatientInfoType[4];
      }
    }
  
    // Heart Rate Check
    if (log.heart_rate > 120 || log.heart_rate < 50) {
      type = "critical";
      param = PatientInfoType[1];
    } else if ((log.heart_rate >= 100 && log.heart_rate <= 120) || (log.heart_rate >= 50 && log.heart_rate < 60)) {
      if (type !== "critical") {
        type = "normal";
        param = PatientInfoType[1];
      }
    }

    if(type === "critical") style = css.critical
    if(type === "normal") style = css.normal
    return [type, style];
  };