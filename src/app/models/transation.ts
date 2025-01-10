import { Audit } from "./audit";
import { TransactionConfig } from "./transaction-config";
import { TransactionType } from "./transaction-type";
import { IUser } from "./user";

export interface Transaction {
    id?: number;
    description: string;
    amount: number;
    type: TransactionType;
    date: Date;
    user?: IUser;
    config: TransactionConfig;
    audit?: Audit;
  }
  