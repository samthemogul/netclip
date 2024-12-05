export interface TopMovie {
  big_image: string;
  description: string;
  genre: string[];
  id: string;
  image: string;
  imdb_link: string;
  imdbid: string;
  rank: number;
  rating: string;
  thumbnail: string;
  title: string;
  year: number;
}

export interface IMovie {
  imdbId: string;
  title: string;
  year: number;
  rating?: string;
  description?: string;
  genre?: string[];
  image: string;
  imdb_link?: string;
}
