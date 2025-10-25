// src/app/app.routes.ts

import { Routes } from '@angular/router';

// Poprawiony import - wskazujemy na plik z .guard.ts na końcu
import { authCheckGuard } from './services/auth-check-guard'; 

// Importy komponentów (te są OK)
import { CharacterListComponent } from './components/character-list/character-list';
import { EpisodeListComponent } from './components/episode-list/episode-list';
import { LocationListComponent } from './components/location-list/location-list';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { FavoritesComponent } from './components/favorites/favorites';

export const routes: Routes = [
  // Nowe ścieżki
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: 'favorites', 
    component: FavoritesComponent, 
    canActivate: [authCheckGuard] // Ta nazwa funkcji jest OK
  },

  // Stare ścieżki
  { path: 'characters', component: CharacterListComponent },
  { path: 'episodes', component: EpisodeListComponent },
  { path: 'locations', component: LocationListComponent },

  // Przekierowania
  { path: '', redirectTo: '/characters', pathMatch: 'full' },
  { path: '**', redirectTo: '/characters' }
];