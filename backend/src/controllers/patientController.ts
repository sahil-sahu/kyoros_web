import e, { Request, Response } from 'express';
import PatientPeriodicModel from '../models/patientPeriodic';
import { IPatientPeriodic, IPatient, AuthRequest } from '../types';
import PatientModel from '../models/patients';
import patient_from_redis from '../helpers/fetchPatientfromRedis';
import { prisma } from '../prisma';
import { redisClient } from '../redis';
import user_from_redis from '../helpers/userfromRedis';

export const createPatient = async (req: Request, res: Response) => {
    try {
      const { name, age, dob, gender, email, phone, hospitalId } = req.body;
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
                dob,
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

export const getPatientbyUhid = async (req: AuthRequest, res: Response) => {
    try {
      const uhid = req.query?.uhid ?? "";
      if(typeof(uhid) != 'string') throw Error("Invalid type");
      const patient_res = await prisma.patient.findUniqueOrThrow({
                                      where:{
                                        uhid_hospitalId: {
                                          uhid,
                                          hospitalId: req.hospital
                                        }
                                      }});
      res.json(patient_res);
    } catch (err) {
      // console.error(err)
      res.status(200).json({ message: err.message });
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
export const createPatientPeriodic = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) throw "Failed from S3";
      
      const file:any = req.file;
      const s3Link:string = file.location;
      const fileName:string = file.key;
      const {tag, name, patientId} = req.body;
      const doc = await prisma.patientDoc.create({
        data:{
          name,
          patientId,
          fileName,
          s3Link,
          tag: tag
        }
      })
      // Send the response with file info
      res.status(200).json(doc);

  } catch(err){
    console.log(err)
    res.status(400).json({ message: 'File upload failed' });
  }
};

export const getDocs = async (req: AuthRequest, res: Response) => {
  try {
    const patient = await patient_from_redis(req.params.patient);
    const docs = await prisma.patientDoc.findMany({
      where:{
        patientId: patient.id
      },
      select:{
        id: true,
        name: true,
        tag: true,
        fileName: true,
        s3Link: true,
        createdAt: true,
      }
    })
    return res.json({patient,docs});

  } catch(err){
    console.error(err);
    res.status(400).json({ message: 'File fetching failed' });
  }
};

export const setCritcality = async (req:AuthRequest, res:Response) =>{
  try {
    const {criticality, bedId:bedID, patientId } = req.body;
    const criticalityObj = await prisma.bed.update({
      where:{
        id: bedID
      },
      data:{
        apache:criticality,
      }
    })
    await redisClient.del(`patient:${patientId}`)
    res.status(200).json(criticalityObj);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "failed set criticality" });
  }
}

export const makeNote = async (req:AuthRequest, res:Response) =>{
  try {
    const {note, patientId } = req.body;
    const user = await prisma.user.findUniqueOrThrow({
      where:{
        firebaseUid: req.user
      }
    })
    const noteObj = await prisma.notes.create({
      data:{
        userid: user.id,
        note,
        patientId,
        hospitalId:req.hospital
      }
    })
    res.status(200).json(noteObj);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "failed make to note" });
  }
}

export const getNotes = async (req:AuthRequest, res:Response) =>{
  try {
    const patient = req.params.patient;
    const now = new Date();
    now.setHours(0,0,0,0)
    const timeStamp = (req.query?.timeStamp)? new Date(req.query?.timeStamp.toString()) : new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const notes = await prisma.notes.findMany({
      where:{
        patientId: patient,
        createdAt:{
          gte: timeStamp
        }
      }
    });
    const notes_user = await Promise.all(notes.map(async e => {
      const user = await user_from_redis(e.userid);
      return {...e, name: user.name, type: user.userType}
    }))
    res.json(notes_user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}