import { type } from 'node:os';
import { createContext, useState, ReactNode, useContext } from 'react';
import { getStaticProps } from '../pages';

type Episode = {
    title: string;
    thumbnail: string;
    members: string;
    duration: number;
    description: string;
    url: string;
}

type PlayerContextData = {
    episodeList: Episode[];
    currentEpisodeIndex: number;
    isPlaying: boolean;
    isLooping: boolean;
    isShuffling: boolean;
    hasNext: boolean;
    hasPrevious: boolean;
    play: (episode: Episode) => void;
    playList: (list: Episode[], index: number) => void;
    playNext: () => void;
    playPrevious: () => void;
    togglePlay: () => void;
    toggleLoop: () => void;
    toggleShuffle: () => void;
    setPlayingState: (state: boolean) => void;
}

const PlayerContext = createContext({} as PlayerContextData);

type PlayerContextProviderProps = {
    children: ReactNode;
}

export function PlayerContextProvider({ children }: PlayerContextProviderProps ) {
    const [episodeList, setEpisodeList] = useState([]);
    const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLooping, setIsLooping] = useState(false);
    const [isShuffling, setIsShuffling] = useState(false);

    function play(episode: Episode) {
        setEpisodeList([episode]);
        setCurrentEpisodeIndex(0);
        setIsPlaying(true);
    }

    function playList(list: Episode[], index: number) {
        setEpisodeList(list);
        setCurrentEpisodeIndex(index);
        setIsPlaying(true);
    }

    function togglePlay() {
        setIsPlaying(!isPlaying);
    }

    function toggleLoop() {
        setIsLooping(!isLooping);
    }

    function toggleShuffle() {
        setIsShuffling(!isShuffling);
    }

    function setPlayingState(state: boolean) {
        setIsPlaying(state);
    }

    function clearPlayerState() {
        setEpisodeList([]);
        setCurrentEpisodeIndex(0);
    }

    const nextEpisdeIndex = currentEpisodeIndex + 1;
    const hasNext = isShuffling || nextEpisdeIndex < episodeList.length;

    const previousEpisdeIndex = currentEpisodeIndex - 1;
    const hasPrevious = previousEpisdeIndex >= 0;

    function playNext() {
        if(isShuffling) {
            const nextRandomEpisdeIndex = Math.floor(Math.random() * episodeList.length);
            setCurrentEpisodeIndex(nextRandomEpisdeIndex);

        } else if(hasNext) { setCurrentEpisodeIndex(nextEpisdeIndex);
        } else { clearPlayerState(); }
    }

    function playPrevious() {
        if(hasPrevious) { setCurrentEpisodeIndex(previousEpisdeIndex); }
    }

    return (
        <PlayerContext.Provider
            value={{
                episodeList,
                currentEpisodeIndex,
                hasNext,
                hasPrevious,
                isPlaying,
                isLooping,
                isShuffling,
                play,
                playList,
                playNext,
                playPrevious,
                togglePlay,
                toggleLoop,
                toggleShuffle,
                setPlayingState
            }}>
            { children }
        </PlayerContext.Provider>
    )
}

export const usePlayer = () => {
    return useContext(PlayerContext);
}