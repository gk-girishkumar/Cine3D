import type { Movie, Showtime, Theater, User } from "../types";

export const MOCK_THEATERS: Theater[] = [
  {
    id: "theater-imax-1",
    name: "IMAX Laser 3D Dome",
    location: "Cyber City Mall, Aud 1",
    totalSeats: 48,
  },
  {
    id: "theater-dolby-2",
    name: "Dolby Atmos Cinema Lounge",
    location: "Starlight Square, Aud 4",
    totalSeats: 48,
  },
  {
    id: "theater-4dx-3",
    name: "4DX Motion & Sensation Arena",
    location: "Nexus Apex Horizon, Aud 2",
    totalSeats: 48,
  },
];

export const MOCK_MOVIES: (Movie & { showtimes?: Showtime[] })[] = [
  {
    id: "movie-dune-2",
    title: "Dune: Part Two (IMAX 3D Experience)",
    description: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family in a breathtaking visual sci-fi epic.",
    durationMinutes: 166,
    genre: "Sci-Fi / Adventure",
    posterUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80",
    releaseDate: "2026-03-01T00:00:00.000Z",
  },
  {
    id: "movie-cyberpunk",
    title: "Cyberpunk 2099: Neo Tokyo",
    description: "In a hyper-illuminated neon metropolis, an augmented mercenary uncovers a neural conspiracy threatening the boundary between human consciousness and synthetic AI.",
    durationMinutes: 142,
    genre: "Cyberpunk / Action",
    posterUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80",
    releaseDate: "2026-04-15T00:00:00.000Z",
  },
  {
    id: "movie-interstellar",
    title: "Interstellar: 10th Anniversary (70mm 3D)",
    description: "A team of intrepid explorers travels through a newly discovered wormhole in deep space to ensure the continued survival of humanity across the cosmic void.",
    durationMinutes: 169,
    genre: "Sci-Fi / Drama",
    posterUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80",
    releaseDate: "2026-02-10T00:00:00.000Z",
  },
  {
    id: "movie-avatar-3",
    title: "Avatar: The Way of Water (HFR 3D)",
    description: "Jake Sully and Neytiri form a family and must leave their home to explore the ocean realms of Pandora when an ancient threat resurfaces.",
    durationMinutes: 192,
    genre: "Fantasy / Adventure",
    posterUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80",
    releaseDate: "2026-05-20T00:00:00.000Z",
  },
  {
    id: "movie-spider-verse",
    title: "Spider-Man: Beyond the Spider-Verse",
    description: "Miles Morales catapults across the Multiverse, encountering a society of Spider-People charged with protecting its very existence.",
    durationMinutes: 140,
    genre: "Animation / Action",
    posterUrl: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=800&auto=format&fit=crop&q=80",
    releaseDate: "2026-06-12T00:00:00.000Z",
  },
  {
    id: "movie-oppenheimer",
    title: "Oppenheimer: Director's 3D Cut",
    description: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb, rendered with dynamic 3D soundscapes.",
    durationMinutes: 180,
    genre: "Biography / Drama",
    posterUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80",
    releaseDate: "2026-01-25T00:00:00.000Z",
  },
];

export function generateMockShowtimes(movieId: string): Showtime[] {
  const movie = MOCK_MOVIES.find((m) => m.id === movieId) || MOCK_MOVIES[0];
  const now = new Date();
  
  return [
    {
      id: `showtime-${movieId}-1`,
      movieId,
      theaterId: MOCK_THEATERS[0].id,
      startTime: new Date(now.getTime() + 2 * 3600 * 1000).toISOString(),
      endTime: new Date(now.getTime() + 4.5 * 3600 * 1000).toISOString(),
      price: 350,
      theater: MOCK_THEATERS[0],
      movie,
    },
    {
      id: `showtime-${movieId}-2`,
      movieId,
      theaterId: MOCK_THEATERS[1].id,
      startTime: new Date(now.getTime() + 6 * 3600 * 1000).toISOString(),
      endTime: new Date(now.getTime() + 8.5 * 3600 * 1000).toISOString(),
      price: 280,
      theater: MOCK_THEATERS[1],
      movie,
    },
    {
      id: `showtime-${movieId}-3`,
      movieId,
      theaterId: MOCK_THEATERS[2].id,
      startTime: new Date(now.getTime() + 24 * 3600 * 1000).toISOString(),
      endTime: new Date(now.getTime() + 26.5 * 3600 * 1000).toISOString(),
      price: 420,
      theater: MOCK_THEATERS[2],
      movie,
    },
  ];
}

export const MOCK_DEMO_USERS: Record<string, { user: User; token: string }> = {
  user: {
    token: "mock-jwt-token-guest-user-2026",
    user: {
      id: "user-guest-1",
      name: "Alex Rivera (VIP Cinephile)",
      email: "alex.rivera@cinema3d.io",
      role: "USER",
    },
  },
  admin: {
    token: "mock-jwt-token-admin-user-2026",
    user: {
      id: "admin-cinebook-1",
      name: "CineBook Master Admin",
      email: "admin@cinema3d.io",
      role: "ADMIN",
    },
  },
};
