import axios from "axios";

export async function getGenres() {
  const { data: genres } = await axios.get(
    process.env.REACT_APP_API_URL + "/api/genres"
  );
  return genres;
}
