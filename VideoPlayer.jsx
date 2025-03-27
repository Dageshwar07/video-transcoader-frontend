import { useEffect, useRef, useState } from "react"
import videojs from "video.js"
import "video.js/dist/video-js.css"

const BASE_URL = "http://localhost:2000/hls-output"

const VideoPlayer = ({ videoId }) => {
    const videoRef = useRef(null)
    const playerRef = useRef(null)
    const [currentQuality, setCurrentQuality] = useState("480p") // Default to 480p

    const availableResolutions = [
        { label: "Auto", value: "auto" },
        { label: "144p", value: `${BASE_URL}/${videoId}/144p/index.m3u8` },
        { label: "360p", value: `${BASE_URL}/${videoId}/360p/index.m3u8` },
        { label: "480p", value: `${BASE_URL}/${videoId}/480p/index.m3u8` }, // Default selection
        { label: "720p", value: `${BASE_URL}/${videoId}/720p/index.m3u8` },
        { label: "1080p", value: `${BASE_URL}/${videoId}/1080p/index.m3u8` },
    ]

    useEffect(() => {
        if (!playerRef.current) {
            const defaultQuality = availableResolutions.find(q => q.label === "144p")

            playerRef.current = videojs(videoRef.current, {
                autoplay: false,
                controls: true,
                responsive: true,
                fluid: true,
                sources: [
                    {
                        src: defaultQuality.value, // Set default source to 480p
                        type: "application/x-mpegURL",
                    },
                ],
            })
        }
    }, [videoId])

    const handleResolutionChange = (resolution) => {
        if (!playerRef.current) return

        setCurrentQuality(resolution.label)

        playerRef.current.src([
            {
                src: resolution.value === "auto"
                    ? `${BASE_URL}/${videoId}/index.m3u8`
                    : resolution.value,
                type: "application/x-mpegURL",
            },
        ])

        playerRef.current.play()
    }

    return (
        <div className="relative w-full aspect-w-16 aspect-h-9 max-w-lg mx-auto">
            <div data-vjs-player>
                <video ref={videoRef} className="video-js vjs-default-skin rounded-lg shadow-sm" />
            </div>
    
            {/* Quality Selector Inside Video Frame */}
            <div className="absolute top-4 right-4 bg-white bg-opacity-50 text-black px-3 py-1 rounded-md">
                <label className="mr-2 font-semibold text-sm">Quality:</label>
                <select
                    className="bg-transparent border border-black p-1 text-sm rounded-md"
                    value={currentQuality}
                    onChange={(e) => {
                        const selectedQuality = availableResolutions.find(q => q.label === e.target.value)
                        handleResolutionChange(selectedQuality)
                    }}
                >
                    {availableResolutions.map((res, index) => (
                        <option key={index} value={res.label}>{res.label}</option>
                    ))}
                </select>
            </div>
        </div>
    )
    
}
export default VideoPlayer
