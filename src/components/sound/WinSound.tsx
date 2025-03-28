import { useRef, forwardRef, useImperativeHandle } from 'react'
import WinSound from './../../assets/sound-win.mp3'

export const PlaySoundWin = forwardRef<unknown>((_, ref) => {
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
                <source src={WinSound} type="audio/mp3" />
                <track kind="captions" />
                Tu navegador no soporta el elemento de audio
            </audio>
        </div>
    )
})