import { TransactionType } from '@models/transaction-type';
import { RecurrenceType } from '@models/recurrence-type';
import {SelectOption} from '@models/form-options.model';

export const TRANSACTION_TYPES: SelectOption<TransactionType>[] = [
  { value: TransactionType.RECEITA, label: '💰 Receita' },
  { value: TransactionType.DESPESA, label: '💸 Despesa' },
  { value: TransactionType.TRANSFERENCIA, label: '🔄 Transferência' }
];

export const RECURRENCE_TYPES: SelectOption<RecurrenceType>[] = [
  { value: 'DIARIO', label: '📅 Diário' },
  { value: 'SEMANAL', label: '📆 Semanal' },
  { value: 'QUINZENAL', label: '🗓️ Quinzenal' },
  { value: 'MENSAL', label: '📊 Mensal' },
  { value: 'ANUAL', label: '🎯 Anual' }
];

export const RECURRENCE_TYPE_LABELS: Record<RecurrenceType, string> = {
  'DIARIO': 'dia(s)',
  'SEMANAL': 'semana(s)',
  'QUINZENAL': 'quinzena(s)',
  'MENSAL': 'mês(es)',
  'ANUAL': 'ano(s)'
};

export const FORM_VALIDATION_MESSAGES = {
  required: 'Este campo é obrigatório',
  minlength: 'Mínimo de {requiredLength} caracteres',
  min: 'Valor mínimo: {min}',
  email: 'Email inválido'
};

export const FORM_DEFAULTS = {
  amount: null,
  type: TransactionType.DESPESA,
  date: new Date(),
  paid: false,
  installment: false,
  recurring: false,
  periodicity: 1,
  ignorarLimiteCategoria: false,
  ignorarOrcamento: false
};
