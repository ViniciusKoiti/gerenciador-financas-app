import { Audit } from "./audit";
import { TransactionConfig } from "./transaction-config";
import { TransactionType } from "./transaction-type";
import { IUser } from "./user";
import {Category} from '@models/category';

export interface Transaction {
  id?: number;
  description: string;
  amount: number;
  type: TransactionType;
  date: Date;
  categoryId: number;
  category?: Category;
  configuration?: TransactionConfig;
  observations?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
