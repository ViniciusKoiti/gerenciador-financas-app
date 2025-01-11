import { Component } from '@angular/core';
import { TransactionType } from '@app/models/transaction-type';
import { Transaction } from '@app/models/transation';

import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { TransactionTotalizatorComponent } from '../transaction-totalizator/transaction-totalizator.component';


@Component({
  selector: 'app-transaction-board',
  imports: [
    CommonModule,
    DragDropModule,
    TransactionTotalizatorComponent
  ],
  templateUrl: './transaction-board.component.html',
  styleUrl: './transaction-board.component.scss'
})
export class TransactionBoardComponent {
  columns = {
    toBePaid: {
      id: 'toBePaid',
      title: 'A Pagar',
      items: [] as Transaction[]
    },
    intended: {
      id: 'intended',
      title: 'Pretendidas',
      items: [] as Transaction[]
    },
    deadline: {
      id: 'deadline',
      title: 'Prazo',
      items: [] as Transaction[]
    },
    paid: {
      id: 'paid',
      title: 'Pagas',
      items: [] as Transaction[]
    }
  };

  constructor() {
   
  }

  ngOnInit() {

    this.initializeMockData();
  }

  private initializeMockData() {
    this.columns.toBePaid.items = [
      {
        id: 1,
        description: 'Conta de Luz',
        amount: 250.50,
        type: TransactionType.DESPESA,
        date: new Date(),
        config: {
          paid: false,
          recurrent: true,
          periodicity: 1,
          ignoreCategoryLimit: false,
          ignoreBudget: false,
          installments: false,
          dueDate: new Date(2024, 0, 15) // 15 de Janeiro
        }
      },
      {
        id: 2,
        description: 'Internet',
        amount: 149.90,
        type: TransactionType.DESPESA,
        date: new Date(),
        config: {
          paid: false,
          recurrent: true,
          periodicity: 1,
          ignoreCategoryLimit: false,
          ignoreBudget: false,
          installments: false,
          dueDate: new Date(2024, 0, 20)
        }
      }
    ];

    this.columns.intended.items = [
      {
        id: 3,
        description: 'Curso de Inglês',
        amount: 400.00,
        type: TransactionType.DESPESA,
        date: new Date(),
        config: {
          paid: false,
          recurrent: true,
          periodicity: 1,
          ignoreCategoryLimit: false,
          ignoreBudget: false,
          installments: false,
          dueDate: new Date(2024, 1, 1)
        }
      },
      {
        id: 4,
        description: 'Venda Item OLX',
        amount: 1500.00,
        type: TransactionType.RECEITA,
        date: new Date(),
        config: {
          paid: false,
          recurrent: false,
          periodicity: 1,
          ignoreCategoryLimit: false,
          ignoreBudget: false,
          installments: false,
          dueDate: new Date(2024, 0, 25)
        }
      }
    ];
    this.columns.deadline.items = [
      {
        id: 5,
        description: 'Parcela Notebook',
        amount: 499.90,
        type: TransactionType.DESPESA,
        date: new Date(),
        config: {
          paid: false,
          recurrent: false,
          periodicity: 1,
          ignoreCategoryLimit: false,
          ignoreBudget: false,
          installments: true,
          dueDate: new Date(2024, 0, 10) // 10 de Janeiro
        }
      },
      {
        id: 6,
        description: 'Salário',
        amount: 5000.00,
        type: TransactionType.RECEITA,
        date: new Date(),
        config: {
          paid: false,
          recurrent: true,
          periodicity: 1,
          ignoreCategoryLimit: false,
          ignoreBudget: false,
          installments: false,
          dueDate: new Date(2024, 0, 5) // 5 de Janeiro
        }
      }
    ];

    this.columns.paid.items = [
      {
        id: 7,
        description: 'Netflix',
        amount: 55.90,
        type: TransactionType.DESPESA,
        date: new Date(),
        config: {
          paid: true,
          recurrent: true,
          periodicity: 1,
          ignoreCategoryLimit: false,
          ignoreBudget: false,
          installments: false,
          dueDate: new Date(2024, 0, 1), // 1 de Janeiro
          paymentDate: new Date(2024, 0, 1)
        }
      },
      {
        id: 8,
        description: 'Freela Website',
        amount: 2500.00,
        type: TransactionType.RECEITA,
        date: new Date(),
        config: {
          paid: true,
          recurrent: false,
          periodicity: 1,
          ignoreCategoryLimit: false,
          ignoreBudget: false,
          installments: false,
          dueDate: new Date(2024, 0, 1), // 1 de Janeiro
          paymentDate: new Date(2024, 0, 1)
        }
      }
    ];
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
        case 'paid':
          transaction.config.paid = true;
          transaction.config.paymentDate = new Date();
          break;
        case 'deadline':
          transaction.config.paid = false;
          transaction.config.dueDate = new Date();
          break;
        case 'intended':
          transaction.config.paid = false;
          break;
        case 'toBePaid':
          transaction.config.paid = false;
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
      case 'toBePaid':
        return 'bg-red-50';     
      case 'intended':
        return 'bg-yellow-50';  
      case 'deadline':
        return 'bg-blue-50';   
      case 'paid':
        return 'bg-green-50'; 
      default:
        return 'bg-gray-50';
    }
  }

}

