import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Home, Inbox, LayoutDashboard, LucideAngularModule, ShoppingBag, Users } from 'lucide-angular';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'gerenciador-financeiro-app';
}
