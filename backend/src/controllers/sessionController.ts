import { clearMapping } from '../helpers/clearMappings';
import { prisma } from '../prisma';
import { IPatientPeriodic, IPatient, AuthRequest } from '../types';
import { Request, Response } from 'express';

interface sessionLoad {
  patientInfo: {
      uhid: string;
      dob: Date;
      gender: string;
      name: string;
  };
  session: {
      icu: number;
      bed: number;
      diagnosis: string;
      comorbidities: string;
      doctor: string[];
      apache: number;
      nurse: string[];
      icuName: string;
      bedName: string;
  };
  found?: string;
}

export const makeSession = async (req: AuthRequest, res: Response) => {
    try {
      const values:sessionLoad = req.body;
      if(values.found){
        const session = await prisma.$transaction(async (prisma) => {
          let patientCheck = await prisma.bed.findMany({
            where:{
              patientId:values.found,
              occupied: true
            }
          })
          if(patientCheck.length > 0) throw Error("Patient Already admitted at"+ patientCheck.map(e => e.id))
          let patient = await prisma.patient.update({
            where:{
              id: values.found
            },
            data:{
              comorbidities: values.session.comorbidities.split("\n"),
              diagnosis: values.session.diagnosis,
            }
        })
            let session = await prisma.session.create({
                data:{
                    patientId: values.found,
                    icuId: values.session?.icu ? [values.session?.icu]:[],
                    bedId: values.session?.bed ? [values.session?.bed] : [],
                    icuName: values.session?.icuName,
                    bedName: values.session?.bedName,
                    diagnosis: values.session.diagnosis,
                    comorbidities: values.session.comorbidities.split("\n"),
                    doctorIds: values.session.doctor,
                    apache: values.session.apache,
                    nurseIds: values.session.nurse,
                    hospitalId: req.hospital,
                }
            })
            let bedCheck = values.session.bed && await prisma.bed.findFirstOrThrow({
              where:{
                id: values.session.bed,
                occupied: false
              }
            })
            let bedAllot = values.session.bed && await prisma.bed.update({
              where: {id: values.session.bed},
              data:{
                patientId: values.found,
                apache: values.session.apache,
                bedStamp: new Date(),
                occupied:true,
              }
            })
            return [patient, session, bedCheck, bedAllot];
        })
        return res.status(200).json(session);
      }

      const session = await prisma.$transaction(async (prisma) => {
                            let patient = await prisma.patient.create({
                                data:{
                                  name: values.patientInfo.name,
                                  dob: new Date(values.patientInfo.dob),
                                  gender: values.patientInfo.gender,
                                  uhid: values.patientInfo.uhid,
                                  hospitalId: req.hospital,
                                  comorbidities: values.session.comorbidities.split("\n"),
                                  diagnosis: values.session.diagnosis,
                                }
                            })
                            let session = await prisma.session.create({
                              data:{
                                patientId: patient.id,
                                icuId: values.session?.icu ? [values.session?.icu]:[],
                                bedId: values.session?.bed ? [values.session?.bed] : [],
                                icuName: values.session?.icuName,
                                bedName: values.session?.bedName,
                                diagnosis: values.session.diagnosis,
                                comorbidities: values.session.comorbidities.split("\n"),
                                doctorIds: values.session.doctor,
                                apache: values.session.apache,
                                nurseIds: values.session.nurse,
                                hospitalId: req.hospital,
                            }
                            })
                            let bedCheck = values.session.bed && await prisma.bed.findFirstOrThrow({
                              where:{
                                id: values.session.bed,
                                occupied: false
                              }
                            })
                            let bedAllot = values.session.bed && await prisma.bed.update({
                              where: {id: values.session.bed},
                              data:{
                                patientId: patient.id,
                                apache: values.session.apache,
                                bedStamp: new Date(),
                                occupied:true,
                              }
                            })
                            return [patient, session, bedCheck, bedAllot];
                        })
      return res.status(200).json(session);
    } catch (err) {
      console.error(err)
      res.status(500).json({ message: err.message });
    }
  }

export const transfer = async (req: AuthRequest, res: Response) => {
  try {
    const {bedId, bedName, icuName ,oldId, icuId, sessionId} = req.body;
    const session = await prisma.$transaction(async (prisma) => {
      let oldSession = await prisma.session.findUniqueOrThrow({
        where:{id:sessionId}
      })
      let bedCheck = await prisma.bed.findFirstOrThrow({
        where:{
          id: bedId,
          occupied: false
        }
      })
      let session = await prisma.session.update({
        where:{id:sessionId},
        data:{
          //append new ids to icu and bed to an array + updatedAt clause
          bedId: [...oldSession.bedId, bedId],
          icuId:  [...oldSession.icuId, icuId],
          icuName,
          bedName
      }
      })
      let bedRemove = oldId && await prisma.bed.update({
        where:{
          id: oldId,
        },
        data:{
          patientId: null,
          apache: null,
          occupied:false,
        }
      })
      // console.log(bedRemove)
      let bedAllot = await prisma.bed.update({
        where: {id: bedId},
        data:{
          patientId: session.patientId,
          apache: session.apache,
          bedStamp: new Date(),
          occupied:true,
        }
      })
      if(oldId) await clearMapping(oldId)
      await clearMapping(bedId)
      return [session, bedCheck, bedRemove,bedAllot];
  }, {
    maxWait: 10000,
    timeout: 10000
  })
  return res.status(200).json(session);
  } catch (error) {
    console.error(error)
    return res.status(500).json("Failed to transfer");
  }
}
export const discharge = async (req: AuthRequest, res: Response) => {
  try {
    const {sessionId, reason} = req.body;
    const session = await prisma.$transaction(async (prisma) => {
      let session = await prisma.session.update({
        where:{
          id: sessionId
        },
        data:{
          reason,
          dischargedAt: new Date()
      }
      })
      let bedDischarge = await prisma.bed.update({
        where: {id: session.bedId[session.bedId.length -1]},
        data:{
          patientId: null,
          apache: null,
          occupied:false,
        }
      })
      await clearMapping(session.bedId[session.bedId.length -1]);
      return [session, bedDischarge];
  })
  return res.status(200).json(session);
  } catch (error) {
    console.error(error)
    return res.status(500).json("Failed to discharge");
  }
}

export const getSessionsActive = async (req: AuthRequest, res: Response) =>{
  try {
    const sessions = await prisma.session.findMany({
      where:{
        hospitalId: req.hospital,
        dischargedAt: null,
        reason:null
      },
      select:{
        id: true,
        bedId:true,
        patient:{
          select:{
            name:true,
            uhid:true,
            id:true
          }
        }
      }
    })
    return res.status(200).json(sessions)
  } catch (error) {
    console.error(error)
    return res.status(500).json("Failed to discharge");
  }
}