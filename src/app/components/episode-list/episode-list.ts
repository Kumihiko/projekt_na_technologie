// src/app/components/episode-list/episode-list.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

// Import our service and models
import { ApiService } from '../../services/api';
import { Episode, Info } from '../../models/api.models'; // Changed to Episode

@Component({
  selector: 'app-episode-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './episode-list.html',
  styleUrl: './episode-list.css'
})
export class EpisodeListComponent implements OnInit {

  // Data stores
  public episodes: Episode[] = []; // Changed to 'episodes'
  public info: Info | null = null;
  
  // State management
  public currentPage: number = 1;
  public isLoading: boolean = true;
  public error: string | null = null;

  // Filters (Only 'name' for episodes)
  public filterName: string = '';

  // Inject the ApiService
  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.loadEpisodes(); // Changed to 'loadEpisodes'
  }

  loadEpisodes(): void { // Changed to 'loadEpisodes'
    this.isLoading = true;
    this.error = null;

    // Prepare filters object (only name)
    const filters = {
      name: this.filterName
    };

    // Call the correct service method
    this.api.getEpisodes(this.currentPage, filters).subscribe({
      next: (response) => {
        this.episodes = response.results; // Changed to 'episodes'
        this.info = response.info;
        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.error = `Error: ${err.error.error || 'Something went wrong'}`;
        this.episodes = []; // Changed to 'episodes'
        this.info = null;
        this.isLoading = false;
      }
    });
  }

  // --- PAGINATION HANDLERS ---
  
  goToNextPage(): void {
    if (this.info?.next) {
      this.currentPage++;
      this.loadEpisodes(); // Changed to 'loadEpisodes'
    }
  }

  goToPrevPage(): void {
    if (this.info?.prev) {
      this.currentPage--;
      this.loadEpisodes(); // Changed to 'loadEpisodes'
    }
  }

  // --- FILTER HANDLERS ---

  applyFilters(): void {
    this.currentPage = 1;
    this.loadEpisodes(); // Changed to 'loadEpisodes'
  }

  clearFilters(): void {
    this.filterName = '';
    this.currentPage = 1;
    this.loadEpisodes(); // Changed to 'loadEpisodes'
  }
}