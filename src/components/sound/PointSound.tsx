import { useRef, forwardRef, useImperativeHandle } from 'react'
import SoundPoint from './../../assets/sound-point.mp3'

export const PlaySoundPoint = forwardRef<unknown>((_, ref) => {
    const audioRef = useRef<HTMLAudioElement>(new Audio())

    useImperativeHandle(ref, () => ({
        playAudio: () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
                audioRef.current.play();
            }
        },
    }))

    return (
        <div>
            <audio ref={audioRef}>
                <source src={SoundPoint} type="audio/mp3" />
                <track kind="captions" />
                Tu navegador no soporta el elemento de audio
            </audio>
        </div>
    )
})