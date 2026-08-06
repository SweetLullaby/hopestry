import { useRef } from 'react'
import { useScrubVideo } from '../hooks/useScrubVideo'

// Original CloudFront URL in the brief was truncated ("…").
// Local stand-in so the live preview matches the layout; swap when you have the full URL.
const VIDEO_SRC = '/bg.mp4'

export default function BackgroundVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)
  useScrubVideo(videoRef)

  return (
    <video
      ref={videoRef}
      className="fixed inset-0 z-0 w-full h-full object-cover"
      style={{ objectPosition: '70% center' }}
      src={VIDEO_SRC}
      muted
      playsInline
      preload="auto"
    />
  )
}
