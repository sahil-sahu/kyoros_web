import { Hospital } from "./hospital";

export interface CreateUserBody {
    email: string;
    userType: string;
    password:string;
    name:string;
    hospital: Hospital
  }