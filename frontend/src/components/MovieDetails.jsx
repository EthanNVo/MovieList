import "../css/MovieDetails.css";
import { useMovieContext } from "../contexts/MovieContext";

function MovieDetails({ movie, onClose }){
    const { getGenreNames } = useMovieContext();
    function formatReleaseDate(dateString) {
        if (!dateString) return 'Unknown';
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString(undefined, options);
    }
    return (
        <div className="md-overlay" onClick={onClose}>
            <div className="md-card" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
                <button className="md-close" onClick={onClose} aria-label="Close">✕</button>

                {movie ? (
                    <div className="md-content">
                        <div className="md-poster">
                            <img src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : ''} alt={movie.title} />
                        </div>
                        <div className="md-details">
                            <h2>{movie.title}</h2>
                            <p className="md-sub">{movie.tagline || movie.original_title} • {formatReleaseDate(movie.release_date)}</p>
                            <p className="md-overview">{movie.overview}</p>

                            <div className="md-meta">
                                <div><strong>Rating:</strong> {movie.vote_average ?? 'N/A'} / 10</div>
                                <div><strong>Votes:</strong> {movie.vote_count ?? 'N/A'}</div>
                                <div><strong>Popularity:</strong> {Math.round(movie.popularity ?? 0)}</div>
                            </div>

                            <div className="md-genres">
                                {getGenreNames(movie.genres || movie.genre_ids).map((name) => (
                                    <span key={name} className="md-genre">{name}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="md-loading">No movie data</div>
                )}
            </div>
        </div>
    )
}

export default MovieDetails;
