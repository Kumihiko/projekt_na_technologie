// src/app/components/favorites/favorites.ts

import { Component, OnInit, OnDestroy } from '@angular/core'; // Add OnInit, OnDestroy
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin, Subscription } from 'rxjs'; // Import forkJoin, Subscription
import { catchError, of } from 'rxjs'; // Import catchError, of

// Import services and models with correct paths
import { FavoritesService } from '../../services/favorites';
import { ApiService } from '../../services/api';
import { Character, Episode, Location } from '../../models/api.models';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './favorites.html',
  styleUrl: './favorites.css'
})
export class FavoritesComponent implements OnInit, OnDestroy {

  // Arrays to hold the full objects
  favCharacters: Character[] = [];
  favEpisodes: Episode[] = [];
  favLocations: Location[] = [];
  
  isLoading: boolean = true;
  private sub: Subscription | null = null;

  constructor(
    private favorites: FavoritesService,
    private api: ApiService
  ) {}

  ngOnInit(): void {
    this.loadFavorites();

    // Subscribe to changes (e.g., when user removes an item)
    this.sub = this.favorites.favoritesChanged$.subscribe(() => {
      this.loadFavorites(); // Reload all favorites
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe(); // Unsubscribe to prevent memory leaks
  }

  /**
   * Loads all favorite items from the API.
   */
  loadFavorites(): void {
    this.isLoading = true;
    
    // Get all favorite IDs from the service
    const allIds = this.favorites.getAllFavoriteIds();

    // We use forkJoin to run all 3 API calls in parallel
    forkJoin({
      // For each type, check if there are IDs to fetch
      characters: allIds.characters.length
        ? this.api.getCharactersByIds(allIds.characters).pipe(catchError(() => of([]))) // Handle API error
        : of([]), // If no IDs, return an empty array immediately
      
      episodes: allIds.episodes.length
        ? this.api.getEpisodesByIds(allIds.episodes).pipe(catchError(() => of([])))
        : of([]),
        
      locations: allIds.locations.length
        ? this.api.getLocationsByIds(allIds.locations).pipe(catchError(() => of([])))
        : of([])

    }).subscribe(({ characters, episodes, locations }) => {
      // We have all data
      this.favCharacters = characters;
      this.favEpisodes = episodes;
      this.favLocations = locations;
      this.isLoading = false;
    });
  }

  /**
   * Removes an item from favorites.
   * We pass the full item and its type.
   */
  removeFavorite(item: Character | Episode | Location, type: 'characters' | 'episodes' | 'locations'): void {
    this.favorites.toggleFavorite(item, type);
    // The subscription in ngOnInit will automatically reload the list
  }

  /**
   * Helper to check if there are no favorites at all.
   */
  get hasNoFavorites(): boolean {
    return !this.isLoading && 
           this.favCharacters.length === 0 && 
           this.favEpisodes.length === 0 && 
           this.favLocations.length === 0;
  }
}