import { Hospital } from "./hospital";

export interface CreateUserBody {
    email: string;
    userType: string;
    password:string;
    hospital: Hospital
  }