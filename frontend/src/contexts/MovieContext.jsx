import { createContext, useState, useContext, useEffect } from "react";

const MovieContext = createContext();

export const useMovieContext = () => useContext(MovieContext);

export const MovieProvider = ({children}) => {
    const [favorites, setFavorites] = useState([]);
    const [genres, setGenres] = useState([]);

    const getGenreNames = (genreArray) => {
        if (!genreArray) return [];
        if (genreArray.length > 0 && typeof genreArray[0] === 'object' && genreArray[0].name) {
            return genreArray.map(g => g.name);
        }
        return genreArray.map(id => {
            const found = genres.find(g => g.id === id);
            return found ? found.name : id;
        });
    }

    useEffect(() => {
        const storedFavs = localStorage.getItem("favorites");
        
        if(storedFavs) setFavorites(JSON.parse(storedFavs));
    }, []);

    useEffect(() => {
        let mounted = true;
        import("../services/api").then(({ getGenres }) => {
            getGenres().then(list => {
                if (mounted) setGenres(list || []);
            }).catch(() => {});
        }).catch(() => {});
        return () => { mounted = false };
    }, []);

    useEffect(() => {
        localStorage.setItem('favorites', JSON.stringify(favorites))
    }, [favorites])

    const addToFavorites = (movie) => {
        setFavorites(prev => [...prev, movie]);
    }

    const removeFromFavorites = (movieId) => {
        setFavorites(prev => prev.filter(movie => movie.id !== movieId));
    }

    const isFavorite = (movieId) => {
        return favorites.some(movie => movie.id === movieId);
    }

    const value = {
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        genres,
        getGenreNames,
    }

    return <MovieContext.Provider value={value}>
        {children}
    </MovieContext.Provider>
};