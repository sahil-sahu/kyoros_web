export interface PatientDoc {
    id:number;
    createdAt: string;
    name: string;
    s3Link: string;
    tag?:"Pathology"|"Radiology"|"Microbiology"|"General";
}