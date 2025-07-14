import {RecurrenceType} from '@models/recurrence-type';
import {TransactionType} from '@models/transaction-type';

export interface SelectOption<T = any> {
  value: T;
  label: string;
}

export interface TransactionFormOptions {
  transactionTypes: SelectOption<TransactionType>[];
  recurrenceTypes: SelectOption<RecurrenceType>[];
  categories: SelectOption<number>[];
}
