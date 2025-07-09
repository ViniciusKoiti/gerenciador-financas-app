import {TransactionType} from '@models/transaction-type';

export interface TransactionRequest {
  description: string;
  amount: number;
  type: TransactionType;
  date: string;
  categoryId: number;
}
