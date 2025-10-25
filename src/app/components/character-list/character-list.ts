// src/app/components/character-list/character-list.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

// Import our service and models
import { ApiService } from '../../services/api';
import { Character, Info } from '../../models/api.models';

@Component({
  selector: 'app-character-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './character-list.html',
  styleUrl: './character-list.css'
})
export class CharacterListComponent implements OnInit { // <-- Make sure it implements OnInit

  // Data stores
  public characters: Character[] = [];
  public info: Info | null = null;
  
  // State management
  public currentPage: number = 1;
  public isLoading: boolean = true;
  public error: string | null = null;

  // Filters (bound with ngModel in the template)
  public filterName: string = '';
  public filterStatus: 'alive' | 'dead' | 'unknown' | '' = '';

  // Inject the ApiService in the constructor
  constructor(private api: ApiService) { }

  // ngOnInit is a lifecycle hook that runs once when the component is created
  ngOnInit(): void {
    this.loadCharacters();
  }

  // Main function to fetch data from the service
  loadCharacters(): void {
    this.isLoading = true;
    this.error = null;

    // Prepare filters object
    const filters = {
      name: this.filterName,
      status: this.filterStatus
    };

    this.api.getCharacters(this.currentPage, filters).subscribe({
      // This runs if the request is successful
      next: (response) => {
        this.characters = response.results;
        this.info = response.info;
        this.isLoading = false;
      },
      // This runs if the request fails
      error: (err: HttpErrorResponse) => {
        // Handle error (e.g., "404 - Not found")
        this.error = `Error: ${err.error.error || 'Something went wrong'}`;
        this.characters = []; // Clear data on error
        this.info = null;
        this.isLoading = false;
      }
    });
  }

  // --- PAGINATION HANDLERS ---
  
  goToNextPage(): void {
    // We only go to the next page if the 'next' URL exists
    if (this.info?.next) {
      this.currentPage++;
      this.loadCharacters();
    }
  }

  goToPrevPage(): void {
    // We only go to the previous page if the 'prev' URL exists
    if (this.info?.prev) {
      this.currentPage--;
      this.loadCharacters();
    }
  }

  // --- FILTER HANDLERS ---

  applyFilters(): void {
    // Reset to page 1 when applying new filters
    this.currentPage = 1;
    this.loadCharacters();
  }

  clearFilters(): void {
    // Clear filter values and reload data from page 1
    this.filterName = '';
    this.filterStatus = '';
    this.currentPage = 1;
    this.loadCharacters();
  }
}