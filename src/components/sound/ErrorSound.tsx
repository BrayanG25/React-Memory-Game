import { useRef, forwardRef, useImperativeHandle } from 'react'
import ErrorSound from './../../assets/sound-error.mp3'

export const PlaySoundError = forwardRef<unknown>((_, ref) => {
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
                <source src={ErrorSound} type="audio/mp3" />
                <track kind="captions" />
                Tu navegador no soporta el elemento de audio
            </audio>
        </div>
    )
})