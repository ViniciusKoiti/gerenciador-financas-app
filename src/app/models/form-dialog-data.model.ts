import {Transaction} from '@models/transation';
import {Category} from '@models/category';

export interface FormTransactionDialogData {
  category?: Category;
  transaction?: Transaction;
}
