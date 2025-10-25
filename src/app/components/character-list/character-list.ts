// src/app/components/character-list/character-list.ts

import { Component, OnInit, OnDestroy } from '@angular/core'; // Add OnDestroy
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs'; // Import Subscription

// Import services and models with correct paths
import { ApiService } from '../../services/api';
import { Character, Info } from '../../models/api.models';
import { FavoritesService } from '../../services/favorites'; // Correct path
import { AuthService } from '../../services/auth'; // Correct path

@Component({
  selector: 'app-character-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './character-list.html',
  styleUrl: './character-list.css'
})
export class CharacterListComponent implements OnInit, OnDestroy { // Implement OnDestroy

  public characters: Character[] = [];
  public info: Info | null = null;
  public currentPage: number = 1;
  public isLoading: boolean = true;
  public error: string | null = null;

  // Filters
  public filterName: string = '';
  public filterStatus: 'alive' | 'dead' | 'unknown' | '' = '';
  public filterSpecies: string = '';

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
        this.isLoggedIn = !!user; // !!user turns string/null into true/false
      })
    );

    // Refresh list if favorites change (to update star icons)
    this.subscriptions.add(
      this.favorites.favoritesChanged$.subscribe(() => {
        // This is a simple way to force re-checking the 'isFavorite' status
        // We just trigger a dummy reload of the view's data
      })
    );
    
    this.loadCharacters();
  }

  ngOnDestroy(): void {
    // This is crucial to prevent memory leaks
    this.subscriptions.unsubscribe();
  }

  loadCharacters(): void {
    this.isLoading = true;
    this.error = null;

    const filters = {
      name: this.filterName,
      status: this.filterStatus,
      species: this.filterSpecies
    };

    this.api.getCharacters(this.currentPage, filters).subscribe({
      next: (response) => {
        this.characters = response.results;
        this.info = response.info;
        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.error = `Error: ${err.error.error || 'Something went wrong'}`;
        this.characters = [];
        this.info = null;
        this.isLoading = false;
      }
    });
  }

  // --- NEW FAVORITE METHODS ---

  /**
   * Calls the service to toggle a character's favorite status.
   */
  toggleFavorite(character: Character): void {
    this.favorites.toggleFavorite(character, 'characters');
  }

  /**
   * Checks with the service if a character is already a favorite.
   */
  isFavorite(characterId: number): boolean {
    return this.favorites.isFavorite(characterId, 'characters');
  }
  
  // --- PAGINATION & FILTERS (Unchanged) ---
  
  goToNextPage(): void {
    if (this.info && this.info.next) {
      this.currentPage++;
      this.loadCharacters();
    }
  }

  goToPrevPage(): void {
    if (this.info && this.info.prev) {
      this.currentPage--;
      this.loadCharacters();
    }
  }

  applyFilters(): void {
    this.currentPage = 1;
    this.loadCharacters();
  }

  clearFilters(): void {
    this.filterName = '';
    this.filterStatus = '';
    this.filterSpecies = '';
    this.currentPage = 1;
    this.loadCharacters();
  }
}