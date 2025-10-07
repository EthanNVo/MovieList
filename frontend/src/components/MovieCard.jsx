import "../css/MovieCard.css"
import { useMovieContext } from "../contexts/MovieContext";
import { useState } from "react";
import MovieDetails from "./MovieDetails";

function MovieCard({movie}){
    const {isFavorite, addToFavorites, removeFromFavorites} = useMovieContext();
    const favorite = isFavorite(movie.id);
    const [showDetails, setShowDetails] = useState(false);
    
    function onFavoriteClick(e){
        e.preventDefault();
        e.stopPropagation();
        if(favorite) removeFromFavorites(movie.id);
        else addToFavorites(movie);
    }

    function onCardClick(){
        setShowDetails(true);
    }
    
    function formatReleaseDate(dateString) {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString(undefined, options);
    }

    return(
        <>
            <div className="movie-card" onClick={onCardClick} role="button" tabIndex={0} style={{cursor: 'pointer'}}>
                <div className="movie-poster">
                    <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title}/>
                    <div className="movie-overlay">
                        <button className={`favorite-btn ${favorite ? "active" : ""}`} onClick={onFavoriteClick}>
                            ❤︎
                        </button>
                    </div>
                </div>
                <div className="movie-info">
                    <h3>{movie.title}</h3>
                    <p>{formatReleaseDate(movie.release_date)}</p>
                </div>
            </div>
            {showDetails && (
                <MovieDetails movie={movie} onClose={() => setShowDetails(false)} />
            )}
        </>
    )
}

export default MovieCard