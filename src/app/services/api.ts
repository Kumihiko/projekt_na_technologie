// src/app/services/api.ts
import { map } from 'rxjs'; // <-- Zaktualizuj tę linię
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
// Import our new models. Path '../models/api.models' is correct.
import { ApiResponse, Character, Episode, Location } from '../models/api.models';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private readonly baseUrl = 'https://rickandmortyapi.com/api';

  // Inject HttpClient to make requests
  constructor(private http: HttpClient) { }

  // --- CHARACTERS ---
  // Accepts a page number and a filters object
  getCharacters(page: number = 1, filters: { name?: string, status?: string } = {}): Observable<ApiResponse<Character>> {
    let params = new HttpParams().set('page', page.toString());

    // Add filters to params if they exist
    if (filters.name) {
      params = params.set('name', filters.name);
    }
    if (filters.status) {
      params = params.set('status', filters.status);
    }

    // Return an Observable, typed to our interface
    return this.http.get<ApiResponse<Character>>(`${this.baseUrl}/character`, { params });
  }

  // --- EPISODES ---
  getEpisodes(page: number = 1, filters: { name?: string } = {}): Observable<ApiResponse<Episode>> {
    let params = new HttpParams().set('page', page.toString());

    if (filters.name) {
      params = params.set('name', filters.name);
    }

    return this.http.get<ApiResponse<Episode>>(`${this.baseUrl}/episode`, { params });
  }

  // --- LOCATIONS ---
  getLocations(page: number = 1, filters: { name?: string, type?: string } = {}): Observable<ApiResponse<Location>> {
    let params = new HttpParams().set('page', page.toString());

    if (filters.name) {
      params = params.set('name', filters.name);
    }
    if (filters.type) {
      params = params.set('type', filters.type);
    }

    return this.http.get<ApiResponse<Location>>(`${this.baseUrl}/location`, { params });
  }
  /**
   * Gets a list of characters by their IDs.
   * @param ids - An array of character IDs.
   */
  getCharactersByIds(ids: number[]): Observable<Character[]> {
    // API returns a single object if only one ID is passed,
    // but an array if multiple IDs are passed. We handle both.
    return this.http.get<Character[] | Character>(`${this.baseUrl}/character/${ids.join(',')}`)
      .pipe(
        map(response => Array.isArray(response) ? response : [response])
      );
  }

  /**
   * Gets a list of episodes by their IDs.
   * @param ids - An array of episode IDs.
   */
  getEpisodesByIds(ids: number[]): Observable<Episode[]> {
    return this.http.get<Episode[] | Episode>(`${this.baseUrl}/episode/${ids.join(',')}`)
      .pipe(
        map(response => Array.isArray(response) ? response : [response])
      );
  }

  /**
   * Gets a list of locations by their IDs.
   * @param ids - An array of location IDs.
   */
  getLocationsByIds(ids: number[]): Observable<Location[]> {
    return this.http.get<Location[] | Location>(`${this.baseUrl}/location/${ids.join(',')}`)
      .pipe(
        map(response => Array.isArray(response) ? response : [response])
      );
  }
}