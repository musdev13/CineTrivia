export interface TMDBMovie {
  id: number;
  title: string;
  original_title: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  genre_ids: number[];
  overview: string;
}

// Акторський склад
export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}