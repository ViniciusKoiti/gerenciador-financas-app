import { Transaction } from "./transation";

export interface Category {
    id: number;
    name: string;
    description: string;
    isActive: boolean;
    icon: string;
    transactions: Transaction[];
  }