import Chip from "@mui/material/Chip";
import React, { useEffect } from "react";

const Genres = ({
  selectedGenres,
  setSelectedGenres,
  genres,
  setGenres,
  type,
  setPage,
}) => {
  const handleAdd = (genre) => {
    setSelectedGenres([...selectedGenres, genre]);
    setGenres(genres.filter((g) => g.id !== genre.id));
    setPage(1);
  };

  const handleRemove = (genre) => {
    setSelectedGenres(
      selectedGenres.filter((seleted) => seleted.id !== genre.id)
    );
    setGenres([...genres, genre]);
    setPage(1);
  };

  const fetchGenres = async () => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/genre/${type}/list?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch");
      }

      const data = await response.json();
      setGenres(data.genres); // Setting genres after data is defined
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchGenres();
    // eslint-disable-next-line
  }, []);

  return (
    <div style={{ padding: "6px 0" }}>
      {selectedGenres &&
        selectedGenres.map((genre) => (
          <Chip
            key={genre.id}
            label={genre.name}
            style={{ margin: 2 }}
            size="medium"
            color="primary"
            clickable
            onDelete={() => handleRemove(genre)}
            // color: "black", backgroundColor: "white"
          />
        ))}

      {genres &&
        genres.map((genre) => (
          <Chip
            key={genre.id}
            label={genre.name}
            style={{ margin: 2, color: "black", backgroundColor: "white" }}
            size="medium"
            clickable
            onClick={() => handleAdd(genre)}
          />
        ))}
    </div>
  );
};

export default Genres;
