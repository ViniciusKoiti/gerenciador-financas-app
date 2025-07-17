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
  paymentDate?: Date;
  installment: boolean;
  recurring: boolean;
  recurrenceType?: RecurrenceType;
  periodicity: number;
  ignoreCategoryLimit?: boolean;
  ignoreBudget?: boolean;
}
