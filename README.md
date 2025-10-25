# Rick & Morty API Client (Angular Project)

This project is a client-side application built with Angular for the [Rick and Morty API](https://rickandmortyapi.com/). It was created as a project for an Internet Technologies university course.

The application allows users to browse characters, episodes, and locations from the show, filter them, and (for registered users) save their favorites.

![Rick and Morty App Screenshot](https://rickandmortyapi.com/api/character/avatar/1.jpeg) 
*(You can replace this with a real screenshot of your app)*

---

## 🚀 Features

* **Three Separate Views**: Browse lists for **Characters**, **Episodes**, and **Locations** on dedicated routes.
* **Pagination**: All lists are paginated using the API's `info` object.
* **Advanced Filtering**: All lists include a comprehensive set of filters based on the API's capabilities:
    * **Characters**: Filter by Name, Status, Species, Type, and Gender.
    * **Locations**: Filter by Name, Type, and Dimension.
    * **Episodes**: Filter by Name and Episode Code.
* **Dummy Authentication**:
    * Client-side user **Registration** and **Login**.
    * User data and sessions are mocked using browser `localStorage`.
    * Uses **`BehaviorSubject`** from RxJS for reactive state management.
* **Protected Routes**:
    * The "Favorites" page is protected by an **Auth Guard** (`CanActivateFn`).
    * Unauthenticated users are redirected to the `/login` page.
* **Favorites System**:
    * Logged-in users can add or remove any Character, Episode, or Location to their favorites.
    * Favorites are saved per-user in `localStorage`.
    * A dedicated "Favorites" page fetches all saved items from the API by their IDs and displays them, sorted by category.

---

## 🛠️ Tech Stack

* **Angular** (v17+): Built using modern **Standalone Components**.
* **TypeScript**: For strict type-safety (no `any` types).
* **RxJS**: Used extensively for state management (e.g., `BehaviorSubject` in `AuthService`) and handling asynchronous API calls (`Observable`, `forkJoin`).
* **Angular Reactive Forms**: For robust form handling and validation in Login/Register components.
* **Angular Router**: For all app navigation and route protection.
* **`localStorage`**: Used as a mock database for the dummy auth and favorites system.
* **CSS**: Unique and responsive styles for all components.

---

## 🏁 Getting Started

To run this project locally, follow these steps:

git clone [https://github.com/Kumihiko/projekt_na_technologie.git](https://github.com/Kumihiko/projekt_na_technologie.git)
cd projekt_na_technologie
npm install
ng serve --open
### Prerequisites

You must have [Node.js](https://nodejs.org/) (which includes `npm`) and the [Angular CLI](https://angular.io/cli) installed on your machine.

```bash
# Install Angular CLI globally (if you don't have it)
npm install -g @angular/cli