import {createContext, useState, ReactNode, useContext} from 'react';

type Episode = {
  id: string;
  title: string;
  member: string;
  thumbnail: string;
  duration: number;
  url: string;
}

type PlayerContextData = {
  episodeList: Episode[];
  currentEpisodeIndex: number;
  isPlaying: boolean;
  //play: (episode: Episode) => void;
  playList: (list: Episode[], index: number) => void;
  togglePlay: () => void;
  play: (episode:Episode) => void;
  setPlayingState: (state:boolean) => void;
  playNext: () => void;
  playPrevious:  () => void;
  hasNext: boolean;
  hasPrevious: boolean;
  onlyOnePlay: boolean;
  toogleloop:() => void;
  isLooping: boolean;
  isShuffling: boolean;
  toogleShuffle: () => void;

}

export const PlayerContext = createContext({} as PlayerContextData);

type PlayerContextProviderProps = {
  children: ReactNode;
}
export function PlayerContextProvider({children} : PlayerContextProviderProps){
  const [episodeList, setEpisodeList] = useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(null);
  const [isPlaying, setisPlaying] = useState(false);
  const [onlyOnePlay, setOnlyOnePlay] = useState(false);
  const [isLooping, setisLooping] = useState(false)
  const [isShuffling, setisShuffling] = useState(false); 

function toogleloop() {
  setisLooping(!isLooping)
}
function toogleShuffle(){
  setisShuffling(!isShuffling)
}


 function play(episode : Episode){
    setisPlaying(true);
    setOnlyOnePlay(true);
    setEpisodeList([episode])
    setCurrentEpisodeIndex(0);
    
   
  }

  function playList(list: Episode[], index: number){
    
    setOnlyOnePlay(false)
    console.log(Object.keys(list).length)
    setEpisodeList(list);
    
    setCurrentEpisodeIndex(index);
    setisPlaying(true);
    
    
  }

  function togglePlay(){
    setisPlaying(!isPlaying);
    
  }

  function setPlayingState(state: boolean){
    setisPlaying(state)
  }
  
  const hasNext = currentEpisodeIndex >= Object.keys(episodeList).length-1;
  const hasPrevious = currentEpisodeIndex <= 0

  function playNext(){
    if(isShuffling){
      const n = Math.floor(Math.random() * Object.keys(episodeList).length)
      setCurrentEpisodeIndex(n)
    }
    else{
      const nextEpisodeIndex = currentEpisodeIndex + 1;
      if(hasNext){
        setCurrentEpisodeIndex(0)
        
      }
     
      else{
        console.log('next')
        setCurrentEpisodeIndex(nextEpisodeIndex)
  
      }
    }
    
  }

  function playPrevious(){
    const nextEpisodeIndex = currentEpisodeIndex - 1;
    if(hasPrevious){
      setCurrentEpisodeIndex(Object.keys(episodeList).length-1)
    }
    else{
      setCurrentEpisodeIndex(nextEpisodeIndex)

    }
    
  }

  return(
    <PlayerContext.Provider value={{
      episodeList, 
      currentEpisodeIndex,
      play,
      playList,
      playNext,
      playPrevious,
      isPlaying, 
      togglePlay,
      setPlayingState,
      onlyOnePlay,
      hasNext,
      hasPrevious,
      isLooping,
      toogleloop,
      toogleShuffle,
      isShuffling,
      }}>
        {children}
    </PlayerContext.Provider>

  )
}

export const usePlayer = () =>{
  return useContext(PlayerContext)
}