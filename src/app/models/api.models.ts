// src/app/models/api.models.ts

// Generic interface for the pagination info
export interface Info {
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
}

// Generic interface for the API response
// It uses a generic type 'T' which can be Character, Location, or Episode
export interface ApiResponse<T> {
  info: Info;
  results: T[];
}

// Interface for a single Character
export interface Character {
  id: number;
  name: string;
  status: 'Alive' | 'Dead' | 'unknown';
  species: string;
  type: string;
  gender: 'Female' | 'Male' | 'Genderless' | 'unknown';
  origin: {
    name: string;
    url: string;
  };
  location: {
    name: string;
    url: string;
  };
  image: string;
  episode: string[];
  url: string;
  created: string;
}

// Interface for a single Episode
export interface Episode {
  id: number;
  name: string;
  air_date: string;
  episode: string; // e.g., "S01E01"
  characters: string[];
  url: string;
  created: string;
}

// Interface for a single Location
export interface Location {
  id: number;
  name: string;
  type: string;
  dimension: string;
  residents: string[];
  url: string;
  created: string;
}