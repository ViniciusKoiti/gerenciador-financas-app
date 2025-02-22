import { Component, OnInit } from '@angular/core';
import { TransactionType } from '@app/models/transaction-type';
import { Transaction } from '@app/models/transation';

import { CommonModule } from '@angular/common';
import {
  CdkDragDrop,
  CdkDragEnd,
  CdkDragStart,
  DragDropModule,
  moveItemInArray,
  transferArrayItem
} from '@angular/cdk/drag-drop';
import { TransactionTotalizatorComponent } from '../transaction-totalizator/transaction-totalizator.component';
import {delay, forkJoin, lastValueFrom, map, Observable, of, throwError} from 'rxjs';
import { Category } from '@app/models/category';
import { HttpClient } from '@angular/common/http';
import { CategoriaService } from '@app/shared/services/category.service';
import { AuthService } from '@app/shared/services/auth.service';
import { IUser } from '@app/models/user';
import { AddButtonComponent } from '../add-button/add-button.component';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormTransactionComponent } from '../form-transaction/form-transaction.component';
import { TransactionService } from '@app/shared/services/transaction.service';
import {catchError} from 'rxjs/operators';
import {ApiResponse} from '@models/api-response';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {MatIcon} from '@angular/material/icon';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {MatCardContent} from '@angular/material/card';
import {MatButtonToggle, MatButtonToggleGroup} from '@angular/material/button-toggle';
import {CategoryFormComponent} from '@shared/components/category-form/category-form.component';
import {MatAccordion, MatExpansionPanel, MatExpansionPanelHeader} from '@angular/material/expansion';


@Component({
  selector: 'app-transaction-board',
  imports: [
    CommonModule,
    DragDropModule,
    MatDialogModule,
    AddButtonComponent,
    TransactionTotalizatorComponent,
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatIcon,
  ],
  standalone: true,
  templateUrl: './transaction-board.component.html',
  styleUrls: ['./transaction-board.component.scss'],

})
export class TransactionBoardComponent implements OnInit {
  isLoading: boolean = true;
  categories: Category[] = [];
  actualUser?: IUser | undefined;
  isDragging = false;

  connectedDropLists: string[] = [];

  constructor(private categoriaService: CategoriaService,
    private transactionService: TransactionService,
    private authService: AuthService,
    private dialog: MatDialog,

  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories() {
    this.actualUser = this.authService.getCurrentUser();
    this.findCategories();
  }

  async findCategories() {
    this.isLoading = true;

    try {
      const response = await lastValueFrom(this.categoriaService.findByUsuarioId(this.actualUser!.id));

      this.categories = response;
      if (!response) return;

      const transacaoRequests = this.categories.map(category =>
        this.transactionService.findByCategoryId(category.id)
      );

      if (transacaoRequests.length === 0) {
        this.isLoading = false;
        return;
      }

      const transacoesPorCategoria = await lastValueFrom(forkJoin(transacaoRequests));

      this.categories.forEach((category, index) => {
        category.transactions = transacoesPorCategoria[index] as Transaction[] || [];
      });

      this.connectedDropLists = this.categories.map(category => category.name);
    } catch (error) {
      console.error("Erro ao buscar categorias ou transações:", error);
    } finally {
      this.isLoading = false; // Garantir que o loading seja desativado mesmo em caso de erro
    }
  }

  onDragCategoryStarted(event: CdkDragStart) {
    this.isDragging = true;
  }

  onDragCategoryEnded(event: CdkDragEnd) {
    this.isDragging = false;
  }


  dropCategory(event: CdkDragDrop<Category[]>) {



    moveItemInArray(this.categories, event.previousIndex, event.currentIndex);
    this.categories = [...this.categories];
  }

  onDrop(event: CdkDragDrop<Transaction[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      const movedTransaction: Transaction = event.container.data[event.currentIndex];

      const targetCategoryId = this.categories.find((categoria) => event.container.id === categoria.name)?.id

      if(!movedTransaction.id) return;
      if(!targetCategoryId) return;


      this.categories = [...this.categories];

      this.updateTransactionCategory(movedTransaction.id, targetCategoryId).subscribe({
        next: (response) => {
          console.log(response);
          },
        error: (error) => {

          console.log(error);
        }
      });
    }
  }

  updateTransactionCategory(transactionId: number, newCategoryId: number): Observable<ApiResponse<void>> {
    return this.transactionService.updateTransactionCategory(transactionId,

      newCategoryId
    )
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  calculateTotals() {
    this.categories = this.categories.map(category => ({
      ...category,
      totalAmount: category.transactions.reduce((acc, curr) => acc + curr.amount, 0)
    }));
  }


  sortTransactions(category: any, criteria: 'date' | 'amount') {
    category.transactions.sort((a: any, b: any) => {
      if (criteria === 'date') {
        return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
      }
      return b.amount - a.amount;
    });
  }

  openTransationForm(category: Category, transaction: Transaction | null = null): void {
    let dialogRef = this.dialog.open(FormTransactionComponent, {
      height: '400px',
      width: '600px',
      data: {category, transaction}
    });

    dialogRef.afterClosed().subscribe((result: Transaction | undefined) => {
      if (result) {
        this.findCategories()
    }
    });

  }

  openCategoryForm(){
    let dialogRef = this.dialog.open(CategoryFormComponent, {
      height: '400px',
      width: '600px',
    })

    dialogRef.afterClosed().subscribe((result: Transaction | undefined) => {
      if (result) {
        this.findCategories()
      }
    });



  }
}
