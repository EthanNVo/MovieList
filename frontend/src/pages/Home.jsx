import MovieCard from "../components/MovieCard";
import {useState, useEffect} from "react";
import {searchMovies, getPopularMovies, getNowPlayingMovies, getTopRatedMovies, getUpcomingMovies} from "../services/api";
import "../css/Home.css";

function Home(){
    const [searchQuery, setSearchQuery] = useState("");

    const [movies, setMovies] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [popular, setPopular] = useState([]);
    const [nowPlaying, setNowPlaying] = useState([]);
    const [topRated, setTopRated] = useState([]);
    const [upcoming, setUpcoming] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        const loadAll = async() => {
            try {
                setLoading(true);
                const [pop, now, top, up] = await Promise.all([
                    getPopularMovies(),
                    getNowPlayingMovies(),
                    getTopRatedMovies(),
                    getUpcomingMovies()
                ]);
                setPopular(pop || []);
                setNowPlaying(now || []);
                setTopRated(top || []);
                setUpcoming(up || []);
                // default grid uses popular
                setMovies(pop || []);
                setIsSearching(false);
            } catch(err){
                console.log(err);
                setError("Failed to load movies...");
            }
            finally{
                setLoading(false);
            }
        }

        loadAll();
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        if(!searchQuery.trim()) return;
        if(loading) return;
        setLoading(true);
        setIsSearching(true);
        try{
            const searchResults = await searchMovies(searchQuery);
            setMovies(searchResults);
            setError(null);
        } catch (err) {
            console.log(err);
            setError("Failed to search movies...");
        } finally {
            setLoading(false);
        }
    }
    return(
        <div className="home">
            <form onSubmit={handleSearch} className="search-form">
                <input 
                    type ="text" 
                    placeholder="Search for movies..." 
                    className ="search-input"
                    value={searchQuery}
                    onChange={(e) => {
                        const v = e.target.value;
                        setSearchQuery(v);
                        if (!v.trim()) {
                            // restore category view when clearing search
                            setIsSearching(false);
                            setMovies(popular || []);
                        }
                    }}
                />
                <button type="submit" className="search-button">Search</button>
            </form>

            {error && <div className="error-message">{error}</div>}

            {loading ? (
                <div className="loading">Loading...</div>
            ) : (
                <>
                    {/* when not searching, show category sections in requested order */}
                    {!isSearching && (
                        <div className="sections">
                            <section className="section">
                                <h3 className="section-title">Now Playing</h3>
                                <div className="section-list">
                                    {nowPlaying.map(m => (
                                        <div className="section-item" key={m.id}><MovieCard movie={m} /></div>
                                    ))}
                                </div>
                            </section>

                            <section className="section">
                                <h3 className="section-title">Top Rated</h3>
                                <div className="section-list">
                                    {topRated.map(m => (
                                        <div className="section-item" key={m.id}><MovieCard movie={m} /></div>
                                    ))}
                                </div>
                            </section>

                            <section className="section">
                                <h3 className="section-title">Popular</h3>
                                <div className="section-list">
                                    {popular.map(m => (
                                        <div className="section-item" key={m.id}><MovieCard movie={m} /></div>
                                    ))}
                                </div>
                            </section>

                            {/* <section className="section">
                                <h3 className="section-title">Upcoming</h3>
                                <div className="section-list">
                                    {upcoming.map(m => (
                                        <div className="section-item" key={m.id}><MovieCard movie={m} /></div>
                                    ))}
                                </div>
                            </section> */}
                        </div>
                    )}

                    {/* main grid (used only for search results) */}
                    {isSearching && (
                        <div className="movies-grid">
                            {movies.map((movie) => (
                                <MovieCard movie={movie} key={movie.id}/>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

export default Home