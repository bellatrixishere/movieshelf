const API_KEY = "cb2ceae9";
const BASE_URL = "https://www.omdbapi.com/";

export async function searchMovie(title) {
  try {
    const response = await fetch(
      `${BASE_URL}?t=${encodeURIComponent(title)}&apikey=${API_KEY}`
    );

    const data = await response.json();

    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}