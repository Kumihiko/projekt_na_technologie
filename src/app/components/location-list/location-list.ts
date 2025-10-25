// src/app/components/location-list/location-list.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

// Import our service and models
import { ApiService } from '../../services/api';
import { Location, Info } from '../../models/api.models'; // Changed to Location

@Component({
  selector: 'app-location-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './location-list.html', // Poprawiona ścieżka bez .component
  styleUrl: './location-list.css'    // Poprawiona ścieżka bez .component
})
export class LocationListComponent implements OnInit {

  // Data stores
  public locations: Location[] = []; // Changed to 'locations'
  public info: Info | null = null;
  
  // State management
  public currentPage: number = 1;
  public isLoading: boolean = true;
  public error: string | null = null;

  // Filters (Name and Type for locations)
  public filterName: string = '';
  public filterType: string = ''; // Added filter for 'type'

  // Inject the ApiService
  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.loadLocations(); // Changed to 'loadLocations'
  }

  loadLocations(): void { // Changed to 'loadLocations'
    this.isLoading = true;
    this.error = null;

    // Prepare filters object (name and type)
    const filters = {
      name: this.filterName,
      type: this.filterType // Added type
    };

    // Call the correct service method
    this.api.getLocations(this.currentPage, filters).subscribe({
      next: (response) => {
        this.locations = response.results; // Changed to 'locations'
        this.info = response.info;
        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.error = `Error: ${err.error.error || 'Something went wrong'}`;
        this.locations = []; // Changed to 'locations'
        this.info = null;
        this.isLoading = false;
      }
    });
  }

  // --- PAGINATION HANDLERS ---
  
  goToNextPage(): void {
    if (this.info?.next) {
      this.currentPage++;
      this.loadLocations(); // Changed to 'loadLocations'
    }
  }

  goToPrevPage(): void {
    if (this.info?.prev) {
      this.currentPage--;
      this.loadLocations(); // Changed to 'loadLocations'
    }
  }

  // --- FILTER HANDLERS ---

  applyFilters(): void {
    this.currentPage = 1;
    this.loadLocations(); // Changed to 'loadLocations'
  }

  clearFilters(): void {
    this.filterName = '';
    this.filterType = ''; // Clear type filter
    this.currentPage = 1;
    this.loadLocations(); // Changed to 'loadLocations'
  }
}