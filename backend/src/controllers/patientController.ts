import { Request, Response } from 'express';
import PatientPeriodicModel from '../models/patientPeriodic';
import { IPatientPeriodic, IPatient, AuthRequest } from '../types';
import PatientModel from '../models/patients';
import patient_from_redis from '../helpers/fetchPatientfromRedis';
import { prisma } from '../prisma';

export const createPatient = async (req: Request, res: Response) => {
    try {
      const { name, age, gender, email, phone, hospitalId } = req.body;
      let user = await prisma.patient.findFirst({
        where:{
          hospitalId,
          phone
        }
      });
        if (!user) {
            const savedPatient = await prisma.patient.create({
              data:{
                name,
                age,
                gender,
                email,
                phone,
                hospitalId
              }
            })
            return res.status(201).json(savedPatient);
        }

      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create patient' });
    }
  };

export const getPatients = async (req: Request, res: Response) => {
    try {
      const patients = await prisma.patient.findMany();
      res.json(patients);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
export const getPatient = async (req: Request, res: Response) => {
    try {
      const patient = req.params.patient;
      const patient_res = prisma.patient.findUnique({
                                      where:{
                                        id:patient
                                      }});
      res.json(patient_res);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

export const getLatestlog = async(req: Request, res: Response) => {
    try{
      const patient = req.params.patient;
      const rangehigh = new Date(req.body.rangehigh);
      const rangelow = new Date(req.body.rangelow);
      if ((req.body.rangehigh === undefined || req.body.rangelow === undefined) && patient) {
        const queue = await patient_from_redis(patient);
        return res.json(queue);
      }
      return res.json({
        patient,
        rangehigh,
        rangelow,
      });


    } catch (err) {
      res.status(500).json({ message: err.message });
    }
}
export const createPatientPeriodic = async (req: Request, res: Response) => {
  try {
    if (!req.file) throw "Failed";
      const file:any = req.file;
      const s3Link:string = file.location;
      const fileName:string = file.key;
      // Send the response with file info
      res.status(200).json({
        message: 'File uploaded loodu successfully',
        s3Link,
        fileName
      });

  } catch(err){
    res.status(400).json({ message: 'File upload failed' });
  }
};

export const setCritcality = async (req:AuthRequest, res:Response) =>{
  try {
    const {criticality, bedId:bedID } = req.body;
    const criticalityObj = await prisma.bed.update({
      where:{
        id: bedID
      },
      data:{
        apache:criticality,
      }
    })
    res.status(200).json(criticalityObj);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "failed set criticality" });
  }
}