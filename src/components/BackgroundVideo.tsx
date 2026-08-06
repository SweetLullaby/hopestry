import { useRef } from 'react'
import { useScrubVideo } from '../hooks/useScrubVideo'

const VIDEO_SRC = '/bg.mp4'

export default function BackgroundVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)
  useScrubVideo(videoRef)

  return (
    <video
      ref={videoRef}
      className="fixed inset-0 z-0 h-full w-full object-cover"
      style={{ objectPosition: '70% center' }}
      src={VIDEO_SRC}
      muted
      playsInline
      preload="auto"
    />
  )
}
