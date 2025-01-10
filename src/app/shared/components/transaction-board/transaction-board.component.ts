import { Component } from '@angular/core';
import { TransactionType } from '@app/models/transaction-type';
import { Transaction } from '@app/models/transation';

import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';


@Component({
  selector: 'app-transaction-board',
  imports: [
    CommonModule,
    DragDropModule,
  ],
  templateUrl: './transaction-board.component.html',
  styleUrl: './transaction-board.component.scss'
})
export class TransactionBoardComponent {
  columns = {
    todo: {
      id: 'todo',
      title: 'A Pagar/Receber',
      items: [] as Transaction[]
    },
    inProgress: {
      id: 'inProgress',
      title: 'Em Processamento',
      items: [] as Transaction[]
    },
    done: {
      id: 'done',
      title: 'Concluído',
      items: [] as Transaction[]
    }
  };

  constructor() {
    this.columns.todo.items = [
      {
        id: 1,
        description: 'Aluguel',
        amount: 2000,
        type: TransactionType.DESPESA,
        date: new Date(),
        config: {
          paid: false,
          recurrent: true,
          periodicity: 1,
          ignoreCategoryLimit: false,
          ignoreBudget: false,
          installments: false,
          dueDate: new Date()
        }
      },
      {
        id: 2,
        description: 'Salário',
        amount: 5000,
        type: TransactionType.RECEITA,
        date: new Date(),
        config: {
          paid: false,
          recurrent: true,
          periodicity: 1,
          ignoreCategoryLimit: false,
          ignoreBudget: false,
          installments: false,
          dueDate: new Date()
        }
      }
    ];
  }

  ngOnInit() {
  }

  onDrop(event: CdkDragDrop<Transaction[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      
      const transaction = event.container.data[event.currentIndex];
      const newStatus = event.container.id;
      
      switch (newStatus) {
        case 'done':
          transaction.config.paid = true;
          transaction.config.paymentDate = new Date();
          break;
        case 'inProgress':
          transaction.config.paid = false;
          break;
        case 'todo':
          if(transaction.config){
            transaction.config.paid = false;
          }
          
          break;
      }
      
    }
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'todo':
        return 'bg-yellow-100';
      case 'inProgress':
        return 'bg-blue-100';
      case 'done':
        return 'bg-green-100';
      default:
        return 'bg-gray-100';
    }
  }
}

