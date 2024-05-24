import { Request, Response } from 'express';
import { AuthRequest } from '../types';
import * as dotenv from 'dotenv';
import multer, { MulterError } from 'multer';
import multerS3 from 'multer-s3';
import { S3Client } from '@aws-sdk/client-s3';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();
// AWS.config.update({
//     accessKeyId:process.env.S3_ACCESS_KEY,
//     secretAccessKey:process.env.S3_ACCESS_SECRET,
//     region: 'us-east-1'
// });
const s3 = new S3Client({
    credentials:{
        accessKeyId:process.env.S3_ACCESS_KEY,
        secretAccessKey:process.env.S3_ACCESS_SECRET
    },
    region: 'us-east-1'
});

const s3Storage = multerS3({
    s3: s3, // s3 instance
    bucket: "kyorospatientdocs", // change it as per your project requirement
    // acl: "public-read", // storage access type
    metadata: (req, file, cb) => {
        cb(null, {fieldname: file.fieldname})
    },
    key: (req, file, cb) => {
        const fileName = Date.now() + '_' + uuidv4() + "_" + file.fieldname + "_" + file.originalname;
        cb(null, fileName);
    }
});

function sanitizeFile(file: Express.Multer.File, cb: (err?: string, success?: boolean) => void) {
    // Define allowed extensions and mimetypes for both images and documents
    const allowedImageExts = [".png", ".jpg", ".jpeg", ".gif"];
    const allowedDocExts = [".pdf", ".doc", ".docx"];
    const allowedMimeTypesArray: string[] = [
        'image/png',
        'image/jpeg',
        'image/gif',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
    // Check extension and mimetype based on file type category
    const ext = path.extname(file.originalname.toLowerCase());
    const isAllowedExt = (allowedImageExts.includes(ext) || allowedDocExts.includes(ext));
    const isAllowedMimeType = allowedMimeTypesArray.includes(file.mimetype);
  
    if (isAllowedExt && isAllowedMimeType) {
      return cb(null, true); // No errors
    } else {
      let errorMsg;
      if (!isAllowedExt) {
        errorMsg = "Error: File extension not allowed!";
      } else if (!isAllowedMimeType) {
        errorMsg = "Error: File mimetype not allowed!";
      }
      cb(errorMsg); // Pass specific error message to callback
    }
  }

  // Configure Multer middleware with enhanced validation and error handling
export const upload: multer.Multer = multer({
    storage: s3Storage, // Assuming you have a properly configured S3 storage
    fileFilter: (req: Express.Request, file: Express.Multer.File, callback: (err?: MulterError | null, success?: boolean) => void) => {
      sanitizeFile(file, (err, success) => {
        if (err) {
            // new MulterError(E, err);
          return callback(new MulterError('LIMIT_UNEXPECTED_FILE', file.fieldname));
        }
        callback(null, success);
      });
    },
    limits: {
      fileSize: 1024 * 1024 * 10 // 10 MB file size limit
    }
  });
