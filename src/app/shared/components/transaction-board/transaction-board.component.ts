import { Component, OnInit } from '@angular/core';
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
import {forkJoin, lastValueFrom, Observable, of, switchMap} from 'rxjs';
import { Category } from '@app/models/category';
import { CategoriaService } from '@app/shared/services/category.service';
import { AuthService } from '@app/shared/services/auth.service';
import { IUser } from '@app/models/user';
import { AddButtonComponent } from '../add-button/add-button.component';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormTransactionComponent } from '../form-transaction/form-transaction.component';
import { TransactionService } from '@app/shared/services/transaction.service';
import {ApiResponse} from '@models/api-response';
import {MatIcon} from '@angular/material/icon';

import {CategoryFormComponent} from '@shared/components/category-form/category-form.component';
import {MatAccordion, MatExpansionPanel, MatExpansionPanelHeader} from '@angular/material/expansion';
import {TransactionItemComponent} from '@shared/components/transaction-item/transaction-item.component';
import {CategoryCardComponent} from '@shared/components/category-card/category-card.component';
import {ReportGraphComponent} from '@shared/components/report-graph/report-graph.component';


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
    TransactionItemComponent,
    CategoryCardComponent,
    ReportGraphComponent,
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
    this.actualUser = this.authService.getCurrentUser();
    this.loadCategories();
  }

  loadCategories() {
    this.findCategories();
  }

  async findCategories() {
    this.isLoading = true;

    try {
      if (!this.actualUser) return;

      const categoriesResponse = await lastValueFrom(this.categoriaService.findByUsuarioId(this.actualUser.id));

      if (Array.isArray(categoriesResponse)) {
        this.categories = categoriesResponse;
      } else if (categoriesResponse && 'data' in categoriesResponse) {
        this.categories = categoriesResponse || [];
      } else {
        this.categories = [];
      }

      if (this.categories.length === 0) {
        this.isLoading = false;
        return;
      }

      const transacaoRequests = this.categories.map(category =>
        this.transactionService.findByCategoryId(category.id)
      );

      const transacoesPorCategoria = await lastValueFrom(forkJoin(transacaoRequests));

      this.categories.forEach((category, index) => {
        const transacoesResult = transacoesPorCategoria[index];

        if (Array.isArray(transacoesResult)) {
          category.transactions = transacoesResult;
        } else if (transacoesResult && 'data' in transacoesResult) {
          category.transactions = transacoesResult || [];
        } else {
          category.transactions = [];
        }
      });

      this.connectedDropLists = this.categories.map(category => category.name);
    } catch (error) {
      console.error("Erro ao buscar categorias ou transações:", error);
      this.categories = [];
    } finally {
      this.isLoading = false;
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
  calculateTotals() {
    this.categories = this.categories.map(category => ({
      ...category,
      totalAmount: category.transactions.reduce((acc, curr) => acc + curr.amount, 0)
    }));
  }


  openTransactionForm(category: Category, transaction: Transaction | null = null): void {
    const dialogRef = this.dialog.open(FormTransactionComponent, {
      // Configurações do modal aprimorado
      width: '800px',           // Largura maior para acomodar o conteúdo
      maxWidth: '90vw',         // Responsivo em telas menores
      maxHeight: '90vh',        // Altura máxima
      panelClass: 'enhanced-transaction-dialog', // Classe CSS customizada
      disableClose: false,      // Permitir fechar com ESC
      hasBackdrop: true,
      backdropClass: 'dialog-backdrop',
      data: {
        category,
        transaction
      },
      // Animações suaves
      enterAnimationDuration: '300ms',
      exitAnimationDuration: '200ms'
    });

    // Gerenciar resultado do modal
    dialogRef.afterClosed().pipe(
      switchMap((result: Transaction | undefined) => {
        if (result) {
          return this.transactionService.findByCategoryId(category.id);
        }
        return of(null);
      })
    ).subscribe(transactions => {
      if (transactions) {
        const categoryIndex = this.categories.findIndex(cat => cat.id === category.id);
        if (categoryIndex !== -1) {
          this.categories[categoryIndex].transactions = transactions;
          this.categories = [...this.categories];
          this.calculateTotals();
        }
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
      }
    });



  }
}
