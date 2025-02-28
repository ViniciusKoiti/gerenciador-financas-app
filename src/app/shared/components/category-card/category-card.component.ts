import { Component, Input, Output, EventEmitter } from '@angular/core';
import {CdkDrag, CdkDragDrop, CdkDragEnd, CdkDragStart, CdkDropList} from '@angular/cdk/drag-drop';
import {AddButtonComponent} from '@shared/components/add-button/add-button.component';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {Category} from '@models/category';
import {TransactionItemComponent} from '@shared/components/transaction-item/transaction-item.component';




@Component({
  selector: 'app-category-card',
  templateUrl: './category-card.component.html',
  styleUrls: ['./category-card.component.scss'],
  imports: [
    CdkDropList,
    AddButtonComponent,
    NgClass,
    CdkDrag,
    NgIf,
    TransactionItemComponent,
    NgForOf
  ],
  standalone: true
})
export class CategoryCardComponent {
  @Input() category!: Category;
  @Input() connectedDropLists: string[] = [];
  @Input() isDragging: boolean = false;
  @Output() dragStart = new EventEmitter<CdkDragStart<any>>();
  @Output() dragEnd = new EventEmitter<CdkDragEnd<any>>();
  @Output() openTransactionForm = new EventEmitter<Category>();

  onDragStart(): void {
    this.dragStart.emit();
  }

  onDragEnd(): void {
    this.dragEnd.emit();
  }

  onDrop(event: CdkDragDrop<any[]>): void {
    console.log('Item movido:', event);
  }
}
