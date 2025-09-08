
import { Component } from '@angular/core';
import { LoaderService } from '../../../core/services/loader.service';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [NgIf , CommonModule],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.scss'
})
export class LoaderComponent {
  isLoading = this.loaderService.loading$;

  constructor(private loaderService: LoaderService) {}
}
