import { RecurrenceType } from "./recurrence-type";

export interface TransactionConfig {
    paid: boolean;
    recurrent: boolean;
    periodicity?: number;
    ignoreCategoryLimit: boolean;
    recurrenceType?: RecurrenceType;
    ignoreBudget: boolean;
    installments: boolean;
    paymentDate?: Date;
    dueDate?: Date;
  }