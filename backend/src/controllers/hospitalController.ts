import { Request, Response } from 'express';
import { prisma } from '../prisma';
import { AuthRequest } from '../types';

export const getHospitals = async(req:Request,res:Response) =>{
    try {
        const hospitals = await prisma.hospital.findMany({select:{
            id:true,
            name:true
        }});
        res.status(200).json(hospitals);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch hospitals from db' });
    }
}

export const getICUs = async (req:AuthRequest,res:Response) =>{
    try {
        const hospital = req.hospital;
        const icus = await prisma.iCU.findMany({
            where:{hospitalId:hospital},
            include:{
                beds:{
                    where:{
                        occupied:true
                    },
                    select:{
                        name:true,
                        id:true,
                        patient:{
                            select:{
                                name:true,
                                age:true,
                                gender:true,
                                id:true
                            }
                        }
                    },
                }
            }
        });
        res.status(200).json(icus);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch icus from db' });
    }
}