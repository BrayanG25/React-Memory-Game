import { useRef, forwardRef, useImperativeHandle } from 'react'
import SoundCard from './../../assets/sound-card.mp3'

export const PlaySoundCard = forwardRef<unknown>((_, ref) => {
    const audioRef = useRef<HTMLAudioElement>(null)

    useImperativeHandle(ref, () => ({
        playAudio: () => {
            if (audioRef.current) {
                audioRef.current.play()
            }
        },
    }))

    return (
        <div>
            <audio ref={audioRef}>
                <source src={SoundCard} type="audio/mp3" />
                <track kind="captions" />
                Tu navegador no soporta el elemento de audio
            </audio>
        </div>
    )
})