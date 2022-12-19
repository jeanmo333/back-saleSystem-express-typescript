import { ICustomer } from "./customer";
import { IUser } from "./user";

export interface ISale {
    id? : string;
    user?: IUser | string;
    customer?: ICustomer | string;
    details: IDetails[];
    discount?: string;

    createdAt?: string;
    updatedAt?: string;
}


export interface IDetails {
    product: string;
    quantity: number;
  }


