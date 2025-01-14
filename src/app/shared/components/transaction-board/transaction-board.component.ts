import { Component, OnInit } from '@angular/core';
import { TransactionType } from '@app/models/transaction-type';
import { Transaction } from '@app/models/transation';

import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { TransactionTotalizatorComponent } from '../transaction-totalizator/transaction-totalizator.component';
import { delay, map, Observable, of } from 'rxjs';
import { Category } from '@app/models/category';
import { HttpClient } from '@angular/common/http';
import { CategoriaService } from '@app/shared/services/category.service';
import { AuthService } from '@app/shared/services/auth.service';
import { IUser } from '@app/models/user';


@Component({
  selector: 'app-transaction-board',
  imports: [
    CommonModule, 
    DragDropModule,
  ],
  standalone: true,
  templateUrl: './transaction-board.component.html',
  styleUrls: ['./transaction-board.component.scss'],
})
export class TransactionBoardComponent implements OnInit {
  isLoading: boolean = true;
  categories: Category[] = [];
  actualUser?: IUser | undefined; 
  
  connectedDropLists: string[] = [];

  constructor(private categoriaService: CategoriaService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories() {
    this.actualUser = this.authService.getCurrentUser();

    this.categoriaService.findByUsuarioId(this.actualUser!.id).subscribe((response: any) => {
      this.categories = response;
      this.connectedDropLists = this.categories.map(category => category.name); // Popula os IDs conectados
      this.isLoading = false;
    });
  }

  onDrop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      const transaction = event.item.data;
      const targetCategory = event.container.id;

      this.updateTransactionCategory(transaction.id, targetCategory);
    }
  }

  updateTransactionCategory(transactionId: number, newCategoryName: string) {
    // this.http.put(`sua-api-endpoint/${transactionId}`, { newCategoryName }).subscribe();
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }
}