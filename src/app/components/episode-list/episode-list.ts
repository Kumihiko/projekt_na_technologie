import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-episode-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './episode-list.html',
  styleUrl: './episode-list.css'
})
export class EpisodeListComponent { // <-- ZMIEŃ NAZWĘ KLASY

}