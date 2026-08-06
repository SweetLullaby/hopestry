import { RefObject, useEffect, useRef } from 'react'

const SENSITIVITY = 0.8

/**
 * Scrubs a <video>'s currentTime forward/backward based on horizontal
 * mouse movement anywhere in the window. Seeks are queued so we never
 * flood the video element with more seeks than it can process.
 */
export function useScrubVideo(videoRef: RefObject<HTMLVideoElement>) {
  const prevX = useRef<number | null>(null)
  const targetTime = useRef(0)
  const seeking = useRef(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const seekTo = (time: number) => {
      if (!video.duration || Number.isNaN(video.duration)) return
      const clamped = Math.min(Math.max(time, 0), video.duration)
      targetTime.current = clamped

      if (!seeking.current) {
        seeking.current = true
        video.currentTime = clamped
      }
    }

    const handleSeeked = () => {
      if (video.currentTime !== targetTime.current) {
        video.currentTime = targetTime.current
      } else {
        seeking.current = false
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (prevX.current === null) {
        prevX.current = e.clientX
        return
      }

      const delta = e.clientX - prevX.current
      prevX.current = e.clientX

      if (!video.duration || Number.isNaN(video.duration)) return

      const offset = (delta / window.innerWidth) * SENSITIVITY * video.duration
      const base = seeking.current ? targetTime.current : video.currentTime
      seekTo(base + offset)
    }

    video.addEventListener('seeked', handleSeeked)
    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      video.removeEventListener('seeked', handleSeeked)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [videoRef])
}
