import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DashboardMenuComponent } from '@app/shared/components/dashboard-menu/dashboard-menu.component';
import { TransactionBoardComponent } from '@app/shared/components/transaction-board/transaction-board.component';

interface MenuItem {
  icon: string;
  text: string;
  badge?: string;
  badgeColor?: string;
}

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    DashboardMenuComponent,
    TransactionBoardComponent,

  ],
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
}
