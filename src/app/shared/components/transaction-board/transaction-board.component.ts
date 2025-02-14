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
import { AddButtonComponent } from '../add-button/add-button.component';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormTransactionComponent } from '../form-transaction/form-transaction.component';
import { TransactionService } from '@app/shared/services/transaction.service';


@Component({
  selector: 'app-transaction-board',
  imports: [
    CommonModule, 
    DragDropModule,
    MatDialogModule,
    AddButtonComponent,
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
    private transactionService: TransactionService,
    private authService: AuthService,
    private dialog: MatDialog
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

  openTransationForm(): void {
    let dialogRef = this.dialog.open(FormTransactionComponent, {
      height: '400px',
      width: '600px',
    });

    dialogRef.afterClosed().subscribe((result: Transaction | undefined) => {
      if (result) {
        this.transactionService.saveTransaction(result).subscribe({
          next: (response) => {
            console.log("Teste");
          },
          error: (err) => {
            console.error("Error ao criar transação")
          }
      })
    }
    });

  }
}