import { useRef, useEffect, useState } from 'react';
import { usePlayer} from '../../contexts/PlayerContext';
import styles from './styles.module.scss'
import Image from 'next/image'; 
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'
import { totimeString } from '../../utils/totimeString';
export function Player(){
  const [progress, setprogress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const {episodeList, currentEpisodeIndex, isPlaying, togglePlay, setPlayingState, playNext, playPrevious, 
    isLooping,onlyOnePlay, toogleloop, isShuffling, toogleShuffle,hasNext } = usePlayer();
  
  useEffect(() =>{
    if(!audioRef.current){
      return
    }
    if(isPlaying){
      audioRef.current.play();
    }
    else{
      audioRef.current.pause()
    }
  },[isPlaying])

  function setupProgressListener(){
    audioRef.current.currentTime = 0;

    audioRef.current.addEventListener('timeupdate', event =>{
      setprogress(Math.floor(audioRef.current.currentTime))
    });
  }

  function handleSeek(amount: number){
    audioRef.current.currentTime = amount;
    setprogress(amount);
  }

  function handleEpisodeEnded(){
          playNext();
      
  }

  const episode = episodeList[currentEpisodeIndex]
  return(
   <div className={styles.playerContainer}>
     <header>
       <img src="/playing.svg" alt="tocando agora"/>
       <strong>Tocando agora</strong>
     </header>

      { episode ? (
        <div className={styles.currentEpisode}>
          <Image 
              width={592} 
              height={592} 
              src={episode.thumbnail} 
              objectFit="cover"
              />

              <strong>{episode.title}</strong>
              <span>{episode.title}</span>

          </div>
      ) : (
        <div className={styles.emptyPlayer}>
        <strong>Selecione um podcast para ouvir</strong>
        </div>
      )}

    <footer className={!episode ? styles.empty : ''}>
      <div className={styles.progress}>
        <span>{totimeString(progress)}</span>
        <div className={styles.slider}>
        {episode ?(
          <Slider
          max={episode.duration}
          value={progress}
          onChange={handleSeek}
          trackStyle={{backgroundColor: '#04d361'}}
          railStyle={{backgroundColor:'#9f75ff'}}
          handleStyle={{borderColor:'#04d361', borderWidth: 4}}/>
        ):(
          <div className={styles.emptySlider}/>
        )}
        </div>
        <span>{totimeString(episode?.duration ?? 0)}</span>
        </div>
          {episode && (
            <audio src={episode.url}
                  ref={audioRef}
              loop={isLooping}
              autoPlay
              onEnded={handleEpisodeEnded}
              onPlay={() => setPlayingState(true)}
              onPause={() => setPlayingState(false)}
              onLoadedMetadata={setupProgressListener}/> 
          )}
        <div className={styles.buttons}>
          <button type="button"
           disabled={!episode|| onlyOnePlay}
           onClick={toogleShuffle}
              className={isShuffling ? styles.isActive : ''}>
            <img src="/shuffle.svg" alt="Embaralhar"/>
          </button>
          <button type="button" disabled={!episode || onlyOnePlay} onClick={playPrevious}>
            <img src="/play-previous.svg" alt="Tocar anterior"/>
          </button>
          <button 
          type="button" 
          className={styles.playButton} 
          disabled={!episode}
          onClick={togglePlay}>
            {isPlaying 
              ? <img src="/pause.svg" alt="Tocar"/>
              : <img src="/play.svg" alt="Parar"/>}
            
          </button>
          <button type="button" disabled={!episode || onlyOnePlay} onClick={playNext}>
            <img src="/play-next.svg" alt="Tocar proxima"/>
          </button>
          <button type="button" disabled={!episode } onClick={toogleloop}
          className={isLooping ? styles.isActive : ''}>
            <img src="/repeat.svg" alt="Repetir"/>
          </button>

        </div>
    </footer>

   </div>
  );

}
  
