import axios from "axios";

export async function getMovies() {
  const { data: movies } = await axios.get(
    process.env.REACT_APP_API_URL + "/api/movies"
  );
  return movies;
}
