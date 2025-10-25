// src/app/app.routes.ts

import { Routes } from '@angular/router';

import { CharacterListComponent } from './components/character-list/character-list';
import { EpisodeListComponent } from './components/episode-list/episode-list';
import { LocationListComponent } from './components/location-list/location-list';

export const routes: Routes = [
  { path: 'characters', component: CharacterListComponent },
  { path: 'episodes', component: EpisodeListComponent },
  { path: 'locations', component: LocationListComponent },
  { path: '', redirectTo: '/characters', pathMatch: 'full' },
  { path: '**', redirectTo: '/characters' }
];