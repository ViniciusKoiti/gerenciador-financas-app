import {TransactionType} from '@models/transaction-type';
import {RecurrenceType} from '@models/recurrence-type';

export interface TransactionFormData {
  description: string;
  amount: number;
  type: TransactionType;
  date: Date;
  categoryId: number;
  observations?: string;
  paid: boolean;
  dueDate?: Date;
  installment: boolean;
  recurring: boolean;
  recurrenceType?: RecurrenceType;
  periodicity: number;
  ignoreLimitCategory: boolean;
  ignoreBudged: boolean;
}
