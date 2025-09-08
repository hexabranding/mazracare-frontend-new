import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-institutional',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './institutional.component.html',
  styleUrl: './institutional.component.scss'
})
export class InstitutionalComponent {
  constructor(private router: Router) {}



  routerLink(id:number){
        this.router.navigate(['/products', id]);

  }
}
