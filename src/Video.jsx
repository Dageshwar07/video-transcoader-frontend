import { useEffect, useState } from "react";

const API_URL = "http://localhost:2000/api/videos";

const Video = ({ onSelectVideo }) => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [failedThumbnails, setFailedThumbnails] = useState({});

    useEffect(() => {
        fetch(API_URL)
            .then((res) => res.json())
            .then((data) => setVideos(data))
            .catch((err) => console.error("Error fetching videos:", err))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-700">📂 Uploaded Videos</h2>
            {loading ? (
                <p className="text-center text-gray-500">Loading videos...</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {videos.map((video) => (
                        <div
                            key={video.videoId}
                            className="max-w-sm rounded overflow-hidden shadow-lg bg-white hover:shadow-xl transition-transform transform hover:scale-105 cursor-pointer"
                            onClick={() => onSelectVideo(video.videoId)}
                        >
                            <img
                                src={failedThumbnails[video.videoId] ? "/fallback-thumbnail.jpg" : video.thumbnailUrl}
                                alt="Video Thumbnail"
                                className="w-full h-48 object-cover"
                                onError={() =>
                                    setFailedThumbnails((prev) => ({
                                        ...prev,
                                        [video.videoId]: true,
                                    }))
                                }
                            />
                            <div className="px-6 py-4">
                                <div className="font-bold text-xl mb-2 truncate">{video.videoId}</div>
                                <p className="text-gray-700 text-base">
                                    {video.createdAt ? new Date(video.createdAt).toLocaleString() : "Unknown Date"}
                                </p>
                            </div>
                       
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
    
};

export default Video