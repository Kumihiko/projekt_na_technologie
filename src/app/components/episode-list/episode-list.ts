// src/app/components/episode-list/episode-list.ts

import { Component, OnInit, OnDestroy } from '@angular/core'; // Add OnDestroy
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs'; // Import Subscription

// Import services and models with correct paths
import { ApiService } from '../../services/api';
import { Episode, Info } from '../../models/api.models';
import { FavoritesService } from '../../services/favorites'; // Import FavoritesService
import { AuthService } from '../../services/auth'; // Import AuthService

@Component({
  selector: 'app-episode-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './episode-list.html',
  styleUrl: './episode-list.css'
})
export class EpisodeListComponent implements OnInit, OnDestroy { // Implement OnDestroy

  public episodes: Episode[] = [];
  public info: Info | null = null;
  public currentPage: number = 1;
  public isLoading: boolean = true;
  public error: string | null = null;

  // Filters
  public filterName: string = '';
  public filterEpisode: string = '';

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
    
    this.loadEpisodes();
  }

  ngOnDestroy(): void {
    // Prevent memory leaks
    this.subscriptions.unsubscribe();
  }

  loadEpisodes(): void {
    this.isLoading = true;
    this.error = null;

    const filters = {
      name: this.filterName,
      episode: this.filterEpisode
    };

    this.api.getEpisodes(this.currentPage, filters).subscribe({
      next: (response) => {
        this.episodes = response.results;
        this.info = response.info;
        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.error = `Error: ${err.error.error || 'Something went wrong'}`;
        this.episodes = [];
        this.info = null;
        this.isLoading = false;
      }
    });
  }

  // --- NEW FAVORITE METHODS ---

  toggleFavorite(episode: Episode): void {
    // Pass 'episodes' as the type
    this.favorites.toggleFavorite(episode, 'episodes');
  }

  isFavorite(episodeId: number): boolean {
    // Pass 'episodes' as the type
    return this.favorites.isFavorite(episodeId, 'episodes');
  }
  
  // --- PAGINATION & FILTERS (Unchanged) ---
  
  goToNextPage(): void {
    if (this.info && this.info.next) {
      this.currentPage++;
      this.loadEpisodes();
    }
  }

  goToPrevPage(): void {
    if (this.info && this.info.prev) {
      this.currentPage--;
      this.loadEpisodes();
    }
  }

  applyFilters(): void {
    this.currentPage = 1;
    this.loadEpisodes();
  }

  clearFilters(): void {
    this.filterName = '';
    this.filterEpisode = '';
    this.currentPage = 1;
    this.loadEpisodes();
  }
}