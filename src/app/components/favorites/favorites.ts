// src/app/components/favorites/favorites.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router'; // Needed for linking

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterLink], // Make sure these are here
  templateUrl: './favorites.html', // Make sure this matches your file name
  styleUrl: './favorites.css'     // Make sure this matches your file name
})
export class FavoritesComponent { // <-- This is the corrected class name

  // We will add logic here later
}