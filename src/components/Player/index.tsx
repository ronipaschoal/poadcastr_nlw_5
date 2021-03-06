import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Slider from 'rc-slider';

import { usePlayer } from '../../contexts/PlayerContexts';

import 'rc-slider/assets/index.css';
import styles from './styles.module.scss';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';

export function Player() {

    const {
        episodeList,
        currentEpisodeIndex,
        hasNext,
        hasPrevious,
        isPlaying,
        isLooping,
        isShuffling,
        playNext,
        playPrevious,
        togglePlay,
        toggleLoop,
        toggleShuffle,
        setPlayingState
    } = usePlayer();

    const audioRef = useRef<HTMLAudioElement>(null);
    const episode = episodeList[currentEpisodeIndex];
    const [progress, setProgress] = useState(0);

    function setupProgressListener() {
        audioRef.current.currentTime = 0;
        audioRef.current.addEventListener('timeupdate', () => {
            setProgress(Math.floor(audioRef.current.currentTime))});
    }

    function handleSeek(amount: number) {
        audioRef.current.currentTime = amount;
        setProgress(amount);
    }

    function handleEpisodeEnded() {
        playNext();
    }

    useEffect(() => {
        if(!audioRef.current) {
            return;
        }
        if (isPlaying) {
            audioRef.current.play();
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying]);

    return (
        <div className={styles.playerContainer}>
            <header>
                <img src="/playing.svg" alt="Tocando agora"/>
                <strong>Tocando agora</strong>
            </header>

            { episode ? (
                <div className={styles.currentEpisode}>
                    <Image width={592} height={592} src={episode.thumbnail} objectFit="cover" />
                    <strong>{episode.title}</strong>
                    <span>{episode.members}</span>
                </div>
            ) : (
                <div className={styles.emptyPlayer}>
                    <strong>Selecione um poadcast para ouvir</strong>
                </div>
            ) }

            <footer className={!episode ? styles.empty : ''}>
                <div className={styles.progress}>
                    <span>{convertDurationToTimeString(episode ? progress : 0)}</span>
                    <div className={styles.slider}>

                        { episode ? (
                            <Slider 
                                max={episode.duration}
                                value={progress}
                                onChange={ handleSeek }
                                trackStyle={{ backgroundColor: '#04d361' }}
                                railStyle={{ backgroundColor: '#9f75ff' }}
                                handleStyle={{ borderColor: '#04d361', borderWidth: 4 }}
                            />
                        ) : (
                            <div className={styles.emptySlider} />
                        )}

                    </div>
                    <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
                </div>

                { episode && (
                    <audio
                        ref={audioRef}
                        src={episode.url}
                        autoPlay
                        onPlay={() => setPlayingState(true)}
                        onPause={() => setPlayingState(false)}
                        onEnded={handleEpisodeEnded}
                        onLoadedMetadata={() => setupProgressListener()}
                        loop={isLooping}
                    />
                ) }

                <div className={styles.buttons}>
                    <button type="button" onClick={toggleShuffle} disabled={!episode || episodeList.length == 1} 
                        className={isShuffling ? styles.isActive: ''}>
                        <img src="/shuffle.svg" alt="Aleat??rio"/>
                    </button>
                    <button type="button" onClick={playPrevious} disabled={!episode || !hasPrevious}>
                        <img src="/play-previous.svg" alt="Anterior"/>
                    </button>
                    <button type="button" className={styles.playButton} disabled={!episode} onClick={() => togglePlay()}>
                    { isPlaying ? (
                        <img src="/pause.svg" alt="Tocar"/>
                    ) : (
                        <img src="/play.svg" alt="Tocar"/>
                    )}
                    </button>
                    <button type="button" onClick={playNext} disabled={!episode || !hasNext}>
                        <img src="/play-next.svg" alt="Pr??ximo"/>
                    </button>
                    <button type="button" onClick={toggleLoop} disabled={!episode} 
                        className={isLooping ? styles.isActive: ''}>
                        <img src="/repeat.svg" alt="Repetir"/>
                    </button>
                </div>
            </footer>
        </div>
    );
}