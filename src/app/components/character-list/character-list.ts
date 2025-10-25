// src/app/components/character-list/character-list.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // <-- DODAJ TO (dla *ngIf, *ngFor)
import { FormsModule } from '@angular/forms'; // <-- DODAJ TO (dla filtrów [(ngModel)])

@Component({
  selector: 'app-character-list',
  standalone: true,
  imports: [CommonModule, FormsModule], // <-- UZUPEŁNIJ TABLICĘ IMPORTS
  templateUrl: './character-list.html',
  styleUrl: './character-list.css'
})
export class CharacterListComponent { // <-- POPRAWIONA NAZWA KLASY
  // Na razie puste, zaraz wypełnimy
}