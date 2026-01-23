export interface Movie {
  id: number;
  title: string;
  poster: string;
  backdrop: string;
  rating: number;
  genre: string[];
  duration: string;
  releaseDate: string;
  language: string;
  description: string;
  featured?: boolean;
}

export const genres = [
  "All",
  "Action",
  "Comedy",
  "Drama",
  "Horror",
  "Romance",
  "Sci-Fi",
  "Thriller",
] as const;

export const movies: Movie[] = [
  {
    id: 1,
    title: "Galactic Odyssey",
    poster: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&h=600&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1920&h=1080&fit=crop",
    rating: 8.7,
    genre: ["Sci-Fi", "Action"],
    duration: "2h 35m",
    releaseDate: "2026-01-15",
    language: "English",
    description: "An epic journey across galaxies as humanity's last hope ventures into the unknown.",
    featured: true,
  },
  {
    id: 2,
    title: "Shadow Hunter",
    poster: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&h=600&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=1920&h=1080&fit=crop",
    rating: 7.9,
    genre: ["Thriller", "Action"],
    duration: "2h 12m",
    releaseDate: "2026-01-10",
    language: "English",
    description: "A detective haunted by his past must track down a serial killer before time runs out.",
  },
  {
    id: 3,
    title: "Love in Paris",
    poster: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=600&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=1920&h=1080&fit=crop",
    rating: 7.5,
    genre: ["Romance", "Drama"],
    duration: "1h 58m",
    releaseDate: "2026-01-20",
    language: "English",
    description: "Two strangers meet in the city of love and discover that fate has other plans.",
  },
  {
    id: 4,
    title: "The Last Laugh",
    poster: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=600&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920&h=1080&fit=crop",
    rating: 8.1,
    genre: ["Comedy", "Drama"],
    duration: "1h 45m",
    releaseDate: "2026-01-08",
    language: "English",
    description: "A retired comedian gets one last chance to prove he's still got what it takes.",
  },
  {
    id: 5,
    title: "Nightmare Realm",
    poster: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=600&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1509248961725-aec71f8c67d4?w=1920&h=1080&fit=crop",
    rating: 7.3,
    genre: ["Horror", "Thriller"],
    duration: "1h 52m",
    releaseDate: "2026-01-25",
    language: "English",
    description: "When dreams become reality, a group of friends must survive their worst nightmares.",
  },
  {
    id: 6,
    title: "Steel Warriors",
    poster: "https://images.unsplash.com/photo-1535016120720-40c646be5580?w=400&h=600&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=1920&h=1080&fit=crop",
    rating: 8.4,
    genre: ["Action", "Sci-Fi"],
    duration: "2h 20m",
    releaseDate: "2026-01-18",
    language: "English",
    description: "In a world dominated by machines, rebels fight for humanity's freedom.",
  },
  {
    id: 7,
    title: "Echoes of Tomorrow",
    poster: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=600&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&h=1080&fit=crop",
    rating: 8.8,
    genre: ["Sci-Fi", "Drama"],
    duration: "2h 28m",
    releaseDate: "2026-01-22",
    language: "English",
    description: "A scientist discovers a way to communicate with her future self, but at what cost?",
    featured: true,
  },
  {
    id: 8,
    title: "Midnight Heist",
    poster: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=600&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1920&h=1080&fit=crop",
    rating: 7.8,
    genre: ["Thriller", "Action"],
    duration: "2h 05m",
    releaseDate: "2026-01-12",
    language: "English",
    description: "A master thief assembles a team for one impossible job that will change everything.",
  },
];

export const featuredMovie = movies.find((m) => m.featured) || movies[0];
