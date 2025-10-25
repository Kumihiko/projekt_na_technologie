// src/app/services/favorites.ts
import { Injectable } from '@angular/core';
import { AuthService } from './auth';
import { Character, Episode, Location } from '../models/api.models';
import { BehaviorSubject } from 'rxjs';

// Define a type for what we will store in localStorage
type FavoriteStorage = {
  [userEmail: string]: {
    characters: number[];
    episodes: number[];
    locations: number[];
  }
};

// Define the type for a single favorite item (for display)
export type FavoriteItem = (Character | Episode | Location) & { favType: 'character' | 'episode' | 'location' };

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {

  private storageKey = 'rick-morty-favorites';

  // A Subject to notify components when favorites change
  private favoritesSubject = new BehaviorSubject<void>(undefined);
  // Public observable for components to subscribe to
  public favoritesChanged$ = this.favoritesSubject.asObservable();

  // We need AuthService to know WHO is logged in
  constructor(private auth: AuthService) { }

  // --- PRIVATE HELPER METHODS ---

  /**
   * Gets the email of the currently logged-in user.
   */
  private getCurrentUser(): string | null {
    return this.auth.getCurrentUserEmail();
  }

  /**
   * Reads the entire favorites object from localStorage.
   */
  private getAllFavorites(): FavoriteStorage {
    const data = localStorage.getItem(this.storageKey);
    return data ? (JSON.parse(data) as FavoriteStorage) : {};
  }

  /**
   * Saves the entire favorites object back to localStorage.
   */
  private saveAllFavorites(data: FavoriteStorage): void {
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  /**
   * Gets the favorites array (e.g., [1, 5, 10]) for the current user and a specific type.
   */
  private getFavoritesForCurrentUser(type: 'characters' | 'episodes' | 'locations'): number[] {
    const user = this.getCurrentUser();
    if (!user) return []; // Not logged in

    const allData = this.getAllFavorites();
    if (allData[user] && allData[user][type]) {
      return allData[user][type];
    }
    return []; // No favorites of this type for this user yet
  }

  // --- PUBLIC API METHODS ---

  /**
   * Toggles (adds/removes) a favorite item.
   */
  public toggleFavorite(item: Character | Episode | Location, type: 'characters' | 'episodes' | 'locations'): void {
    const user = this.getCurrentUser();
    if (!user) return; // Should not happen if UI is correct, but good to check

    const allData = this.getAllFavorites();

    // Ensure user entry exists
    if (!allData[user]) {
      allData[user] = { characters: [], episodes: [], locations: [] };
    }

    // Ensure type array exists
    if (!allData[user][type]) {
      allData[user][type] = [];
    }

    const favorites = allData[user][type];
    const index = favorites.indexOf(item.id);

    if (index > -1) {
      // It exists, so remove it
      favorites.splice(index, 1);
    } else {
      // It doesn't exist, so add it
      favorites.push(item.id);
    }

    this.saveAllFavorites(allData);
    // Notify all subscribers that favorites have changed
    this.favoritesSubject.next();
  }

  /**
   * Checks if a specific item is already a favorite for the current user.
   */
  public isFavorite(itemId: number, type: 'characters' | 'episodes' | 'locations'): boolean {
    const favorites = this.getFavoritesForCurrentUser(type);
    return favorites.includes(itemId);
  }

  /**
   * Gets a list of all favorite IDs for the current user.
   */
  public getAllFavoriteIds(): { characters: number[], episodes: number[], locations: number[] } {
    const user = this.getCurrentUser();
    if (!user) {
      return { characters: [], episodes: [], locations: [] };
    }
    
    const allData = this.getAllFavorites();
    if (allData[user]) {
      return allData[user];
    }

    return { characters: [], episodes: [], locations: [] };
  }
}