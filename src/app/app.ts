import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  title = 'Gestione Post';

  constructor(private router: Router) {}

  resetStorage() {
    if (confirm('Vuoi resettare tutti i dati locali?')) {
      sessionStorage.clear();
      alert('Dati resettati!');
      this.router.navigate(['/posts']).then(() => {
        window.location.reload();
      });
    }
  }
}