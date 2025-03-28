import { useEffect, useRef, useState } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

const BASE_URL = "http://localhost:2000/hls-output";
const BACK_URL = "http://localhost:2000";

const Player = ({ videoId }) => {
    const videoRef = useRef(null);
    const playerRef = useRef(null);
    const [currentQuality, setCurrentQuality] = useState("480p"); // Default to 480p
    const [videoData, setVideoData] = useState(null); // Store video data

    const availableResolutions = [
        { label: "Auto", value: `${BASE_URL}/${videoId}/480p/index.m3u8` },
        { label: "144p", value: `${BASE_URL}/${videoId}/144p/index.m3u8` },
        { label: "360p", value: `${BASE_URL}/${videoId}/360p/index.m3u8` },
        { label: "480p", value: `${BASE_URL}/${videoId}/480p/index.m3u8` },
        { label: "720p", value: `${BASE_URL}/${videoId}/720p/index.m3u8` },
        { label: "1080p", value: `${BASE_URL}/${videoId}/1080p/index.m3u8` },
    ];

    // Fetch video data from API
    useEffect(() => {
        const fetchVideoData = async () => {
            try {
                const response = await fetch(`${BACK_URL}/api/videos/${videoId}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch video data");
                }
                const data = await response.json();
                setVideoData(data);
            } catch (err) {
                console.error("❌ Error fetching video data:", err);
            }
        };

        fetchVideoData();
    }, [videoId]);

    // Initialize Video.js player
    useEffect(() => {
        if (!playerRef.current) {
            const defaultQuality = availableResolutions.find((q) => q.label === "480p");

            playerRef.current = videojs(videoRef.current, {
                autoplay: true,
                controls: true,
                responsive: true,
                fluid: true,
                sources: [
                    {
                        src: defaultQuality.value,
                        type: "application/x-mpegURL",
                    },
                ],
            });
        }
    }, [videoId]);

    // Handle quality change
    const handleResolutionChange = (resolution) => {
        if (!playerRef.current) return;
        const currentTime = playerRef.current.currentTime();
        setCurrentQuality(resolution.label);
    
        playerRef.current.src([
            {
                src: resolution.value, // Use the master playlist for "Auto"
                type: "application/x-mpegURL",
            },
        ]);
    
        playerRef.current.ready(() => {
            playerRef.current.currentTime(currentTime);
            playerRef.current.play();
        });
    };
    

    return (
        <div className="relative w-full max-w-2xl mx-auto rounded-lg overflow-hidden shadow-lg bg-black">
            {/* Display video title and description */}
            {videoData && (
                <div className="p-4 bg-gray-800 text-white">
                    <h2 className="text-xl font-semibold">{videoData.title}</h2>
                    <p className="text-gray-400">{videoData.description}</p>
                </div>
            )}

            <div data-vjs-player className="rounded-lg overflow-hidden">
                <video
                    ref={videoRef}
                    className="video-js vjs-default-skin h-full w-full rounded-lg"
                    controls
                />
            </div>

            {/* Quality Selector */}
            <div className="absolute top-4 right-4 bg-white bg-opacity-70 text-black px-3 py-1 rounded-full shadow-md hover:bg-opacity-90 transition">
                <label className="mr-2 font-semibold text-sm">Quality:</label>
                <select
                    className="bg-transparent border-none outline-none text-sm font-medium"
                    value={currentQuality}
                    onChange={(e) => {
                        const selectedQuality = availableResolutions.find(q => q.label === e.target.value);
                        handleResolutionChange(selectedQuality);
                    }}
                >
                    {availableResolutions.map((res, index) => (
                        <option key={index} value={res.label} className="text-black">
                            {res.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default Player;
