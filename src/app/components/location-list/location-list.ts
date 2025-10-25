import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-location-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './location-list.html',
  styleUrl: './location-list.css'
})
export class LocationListComponent { // <-- ZMIEŃ NAZWĘ KLASY

}