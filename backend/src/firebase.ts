import { applicationDefault } from "firebase-admin/app";

const { initializeApp } = require('firebase-admin/app');
import { getAuth } from 'firebase-admin/auth';
import { getMessaging } from 'firebase-admin/messaging';
require('dotenv').config();

var admin = require("firebase-admin");

var serviceAccount = require(process.env.GOOGLE_APPLICATION_CREDENTIALS ?? "");

export const myapp = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

export const fireAuth = getAuth(myapp);
export const fireNotifier = getMessaging(myapp);
// fireAuth.app.options