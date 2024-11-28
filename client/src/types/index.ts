export interface ButtonProps {
  text?: string;
  onClick: () => void;
  type: string;
  icon?: React.ReactNode;
}

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

export interface SearchedMovie {
  id: string;
  title: string;
  year: number;
  type: string;
  image: string;
  image_large: string;
  api_path: string;
  imdb: string;
}

export interface IUser {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  photoUrl: string;
}
