import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
 selector: 'app-dashboard-menu',
 standalone: true,
 imports: [CommonModule, MatIconModule],
 templateUrl: "./dashboard-menu.component.html"
})
export class DashboardMenuComponent {

  isOpen = false;
 menuItems = [
   { icon: 'home', text: 'Dashboard', link: '/dashboard' },
   { icon: 'dashboard', text: 'Kanban', badge: 'Pro', link: '/kanban' },
   { icon: 'inbox', text: 'Inbox', badge: '3', badgeColor: 'blue', link: '/inbox' },
   { icon: 'group', text: 'Users', link: '/users' },
   { icon: 'shopping_bag', text: 'Products', link: '/products' }
 ];

 getBadgeClass(item: any) {
   return item.badgeColor === 'blue' ? 'badge-blue' : 'badge-gray';
 }

 toggleMenu() {
  this.isOpen = !this.isOpen;
 }
}