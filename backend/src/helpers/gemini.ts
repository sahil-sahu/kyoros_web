import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import { Notes } from '@prisma/client'
import { redisClient } from "../redis";
import { prisma } from "../prisma";
dotenv.config();

const gemini_api_key = process.env.GEMINI_API_KEY;
const googleAI = new GoogleGenerativeAI(gemini_api_key);
const geminiConfig = {
  temperature: 0.9,
  topP: 1,
  topK: 1,
  maxOutputTokens: 4096,
};
 
const geminiModel = googleAI.getGenerativeModel({
  model: "gemini-pro",
  generationConfig:geminiConfig,
});
 
export const generate_summary = async (patientId:string):Promise<string> => {
  try {
    const summary_r = await redisClient.get(`summary:${patientId}`);
    if(!summary_r){
        const prompt = "provided some notes of a icu patient summarise it into a sentence of maximum 50 words: \n";
        const dt = new Date();
        dt.setHours(0,0,0,0)
        const notes = await prisma.notes.findMany({
            where:{
                patientId,
                createdAt:{
                    gte: new Date(dt.getMilliseconds() - 24*60*60*1000)
                }
            }
        });
        const result = await geminiModel.generateContent(prompt+notes.map(e => e.note).join(",\n"));
        const response = result.response;
        const summary = response.text();
        await redisClient.set(`summary:${patientId}`, summary);
        await redisClient.expire(`summary:${patientId}`, 60 * 60 * 6);
        return summary;
    }
    return summary_r;
  } catch (error) {
    console.log("response error", error);
  }
};