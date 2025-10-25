// src/app/components/location-list/location-list.ts

import { Component, OnInit, OnDestroy } from '@angular/core'; // Add OnDestroy
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs'; // Import Subscription

// Import services and models with correct paths
import { ApiService } from '../../services/api';
import { Location, Info } from '../../models/api.models';
import { FavoritesService } from '../../services/favorites'; // Import FavoritesService
import { AuthService } from '../../services/auth'; // Import AuthService

@Component({
  selector: 'app-location-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './location-list.html',
  styleUrl: './location-list.css'
})
export class LocationListComponent implements OnInit, OnDestroy { // Implement OnDestroy

  public locations: Location[] = [];
  public info: Info | null = null;
  public currentPage: number = 1;
  public isLoading: boolean = true;
  public error: string | null = null;

  // Filters
  public filterName: string = '';
  public filterType: string = '';
  public filterDimension: string = '';

  // Auth & Favorites
  public isLoggedIn: boolean = false;
  private subscriptions = new Subscription(); // To manage subscriptions

  constructor(
    private api: ApiService,
    private favorites: FavoritesService, // Inject FavoritesService
    private auth: AuthService           // Inject AuthService
  ) { }

  ngOnInit(): void {
    // Check login status
    this.subscriptions.add(
      this.auth.currentUser$.subscribe(user => {
        this.isLoggedIn = !!user;
      })
    );

    // Refresh list if favorites change
    this.subscriptions.add(
      this.favorites.favoritesChanged$.subscribe(() => {
        // This subscription forces Angular to re-check the 'isFavorite' status
      })
    );
    
    this.loadLocations();
  }

  ngOnDestroy(): void {
    // Prevent memory leaks
    this.subscriptions.unsubscribe();
  }

  loadLocations(): void {
    this.isLoading = true;
    this.error = null;

    const filters = {
      name: this.filterName,
      type: this.filterType,
      dimension: this.filterDimension
    };

    this.api.getLocations(this.currentPage, filters).subscribe({
      next: (response) => {
        this.locations = response.results;
        this.info = response.info;
        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.error = `Error: ${err.error.error || 'Something went wrong'}`;
        this.locations = [];
        this.info = null;
        this.isLoading = false;
      }
    });
  }

  // --- NEW FAVORITE METHODS ---

  toggleFavorite(location: Location): void {
    // Pass 'locations' as the type
    this.favorites.toggleFavorite(location, 'locations');
  }

  isFavorite(locationId: number): boolean {
    // Pass 'locations' as the type
    return this.favorites.isFavorite(locationId, 'locations');
  }
  
  // --- PAGINATION & FILTERS (Unchanged) ---
  
  goToNextPage(): void {
    if (this.info && this.info.next) {
      this.currentPage++;
      this.loadLocations();
    }
  }

  goToPrevPage(): void {
    if (this.info && this.info.prev) {
      this.currentPage--;
      this.loadLocations();
    }
  }

  applyFilters(): void {
    this.currentPage = 1;
    this.loadLocations();
  }

  clearFilters(): void {
    this.filterName = '';
    this.filterType = '';
    this.filterDimension = '';
    this.currentPage = 1;
    this.loadLocations();
  }
}