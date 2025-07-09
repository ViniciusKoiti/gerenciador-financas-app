import {RecurrenceType} from '@models/recurrence-type';

export interface TransactionConfig {
  paid?: boolean;
  recurring?: boolean;
  periodicity?: number;
  recurrenceType?: RecurrenceType;
  dueDate?: Date;
  paymentDate?: Date;
  installment?: boolean;
  ignoreCategoryLimit?: boolean;
  ignoreBudget?: boolean;
  }
