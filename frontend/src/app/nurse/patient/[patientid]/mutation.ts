import { axiosInstance, setheader } from '@/lib/axios';

interface PatientPeriodic {
    bloodTests: string;
    abgAnalysis: string;
    imagingStudies: string;
    nutritionalAssessment: string;
    drugLevels: string;
    fluidBalance: string;
    woundAssessment: string;
    rehabilitationProgress: string;
    cultureAndInfectionMarkers: string;
    ecgMonitoring: string;
    mentalHealthAssessment: string;
  }

export const addPeriodicData = async ({patientlog, patientId}:{patientlog: PatientPeriodic, patientId:string}):Promise<string> => {
    try {
      await axiosInstance.post('/patient/periodic', {
        ...patientlog,
        patientId
      }, {
        headers: await setheader(),
      });
      return "done";
    } catch (error) {
      throw error;
    }
  };
