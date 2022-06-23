import React, { useState, useEffect } from 'react';
import axios from './axios';
import "./Row.css";
import YouTube from 'react-youtube';
import movieTrailer from 'movie-trailer';

const base_url = "https://image.tmdb.org/t/p/original/";
function Row({ title, fetchURL, isLargeRow }) {
  const [movies, setMovies] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState("");


  useEffect(() => {
    //if [], run once when the row loads and dont run again.
    //when ever you are using something outside the useffect block that is defined outside
    //and that will need to change when component loads, add it like [fetchURL]

    async function fetchData() {
      const request = await axios.get(fetchURL);
      setMovies(request.data.results);
      //console.log(request);
      return request;
    }
    fetchData();
  }, [fetchURL])
 
  const opts ={
    height: "390",
    width:"100%",
    playerVars:{
      //
      autoplay:1,
      origin: 'http://localhost:3000',
      // 'videoId': videoId,
       host: 'https://www.youtube.com',
    }
  };


 const handleClick = (movie)=>{
    if(trailerUrl){
      setTrailerUrl("");
    }else{
      movieTrailer(movie?.name || "")
      .then((url)=>{
        const urlParams = new URLSearchParams(new URL(url).search)
        setTrailerUrl(urlParams.get('v'));
        console.log(urlParams.get('v'));
      })
      .catch((error)=>console.log(error));
    }
  }

  return (
    <div className='row'>
      <h1>{title}</h1>
      <div className='row_posters'>
       {movies.map((movie) =>
         <img 
         onClick={()=>handleClick(movie)}
         className={`row_poster ${isLargeRow && "row_posterLarge"}`}
         key={movie.id}
         src={`${base_url}${isLargeRow?movie.poster_path:movie.backdrop_path}`} alt={movie.name} />
       )}

      </div>
    {/* {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />} */}
    
{trailerUrl && <iframe width="100%" height="390" 
src={`https://www.youtube.com/embed/${trailerUrl}`} 
title="YouTube video player" frameborder="0" 
allow="accelerometer; autoplay; clipboard-write; 
encrypted-media; gyroscope; picture-in-picture" 
allowfullscreen>
  {/* opts={opts} */}
</iframe> }
    </div>
  );
}

export default Row
