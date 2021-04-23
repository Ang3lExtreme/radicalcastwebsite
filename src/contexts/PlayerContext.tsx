import {createContext, useState, ReactNode} from 'react';

type Episode = {
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
  play: (episode: Episode) => void;
  playList: (list: Episode[], index: number) => void;
  togglePlay: () => void;
  setPlayingState: (state:boolean) => void;
  playNext: () => void;
  playPrevious:  () => void;

}

export const PlayerContext = createContext({} as PlayerContextData);

type PlayerContextProviderProps = {
  children: ReactNode;
}
export function PlayerContextProvider({children} : PlayerContextProviderProps){
  const [episodeList, setEpisodeList] = useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setisPlaying] = useState(false);

  function play(episode : Episode){
    setEpisodeList([episode])
    setCurrentEpisodeIndex(0);
    setisPlaying(true);
   
  }

  function playList(list: Episode[], index: number){
    setEpisodeList(list);
    setCurrentEpisodeIndex(index);
    setisPlaying(true);
    console.log(currentEpisodeIndex);
    
  }

  function togglePlay(){
    setisPlaying(!isPlaying);
  }

  function setPlayingState(state: boolean){
    setisPlaying(state)
  }
  
  function playNext(){
    console.log(currentEpisodeIndex);
    const nextEpisodeIndex = currentEpisodeIndex - 1;
    console.log(nextEpisodeIndex);
    if(nextEpisodeIndex > 0){
      setCurrentEpisodeIndex(0)
      return;
    }
   
    
    setCurrentEpisodeIndex(nextEpisodeIndex)
  }

  function playPrevious(){
    if(currentEpisodeIndex >= 0){
      setCurrentEpisodeIndex(currentEpisodeIndex + 1);
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
      }}>
        {children}
    </PlayerContext.Provider>

  )
}