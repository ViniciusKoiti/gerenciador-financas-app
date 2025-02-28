import { Component, Input, Output, EventEmitter } from '@angular/core';
import {CdkDragDrop, CdkDropList} from '@angular/cdk/drag-drop';
import {AddButtonComponent} from '@shared/components/add-button/add-button.component';
import {CategoryCardComponent} from '@shared/components/category-card/category-card.component';

interface Transaction {
  description: string;
  amount: number;
  type: string;
  config: {
    dueDate: string;
  };
}

interface Category {
  name: string;
  transactions: Transaction[];
}

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss'],
  standalone: true,
  imports: [
    CdkDropList,
    AddButtonComponent,
    CategoryCardComponent
  ]
})
export class CategoryListComponent {
  @Input() categories: Category[] = [];
  @Input() isDragging: boolean = false;
  @Output() dropCategory = new EventEmitter<CdkDragDrop<Category[]>>();
  @Output() openTransactionForm = new EventEmitter<Category>();
  @Output() openCategoryForm = new EventEmitter<void>();

  connectedDropLists: string[] = [];

  ngOnChanges(): void {
    // Atualiza os IDs das listas conectadas para o drag-and-drop funcionar corretamente
    this.connectedDropLists = this.categories.map(c => c.name);
  }

  onDrop(event: CdkDragDrop<Category[]>): void {
    this.dropCategory.emit(event);
  }

  onDragCategoryStarted(event: any): void {
    this.isDragging = true;
  }

  onDragCategoryEnded(event: any): void {
    this.isDragging = false;
  }
}
