import { prisma } from "../prisma";
import { AuthRequest } from "../types";
import { Request, Response } from 'express';

export const getSensors = async (req: AuthRequest, res: Response) => {
    try {
      let hospitalId = req.hospital;
      const sensors = await prisma.sensor.findMany();
      res.json(sensors);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

export const setSensor = async (req: AuthRequest, res: Response) => {
    try {
      let { sensorId, bedId} = req.body;
      let bedID = (!!bedId) ? +bedId :null;
      const sensor = await prisma.sensor.update({
        where:{
            id:sensorId.toString()
        },
        data:{
            bedID
        }
      })
      res.json(sensor);
    } catch (err) {
      console.error(err)
      res.status(500).json({ message: err.message });
    }
  }