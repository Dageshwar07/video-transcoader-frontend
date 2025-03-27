import { useState, useEffect } from "react";
import VideoPlayer from "./VideoPlayer";

const API_URL = "http://localhost:2000/api/videos"; 
const UPLOAD_URL = "http://localhost:2000/api/upload";

const App = () => {
    const [videos, setVideos] = useState([]);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [failedThumbnails, setFailedThumbnails] = useState({});
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        fetchVideos();
    }, []);

    const fetchVideos = () => {
        setLoading(true);
        fetch(API_URL)
            .then((res) => res.json())
            .then((data) => setVideos(data))
            .catch((err) => console.error("Error fetching videos:", err))
            .finally(() => setLoading(false));
    };

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            alert("Please select a file first!");
            return;
        }

        const formData = new FormData();
        formData.append("video", selectedFile);

        setUploading(true);
        try {
            const response = await fetch(UPLOAD_URL, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) throw new Error("Upload failed");

            alert("Upload successful!");
            setSelectedFile(null);
            fetchVideos(); // Refresh video list after upload
        } catch (error) {
            console.error("Error uploading video:", error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-6">
            <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">🎬 Video Library</h1>

            {/* Upload Section */}
            <div className="mb-6 flex flex-col items-center gap-3">
                <input type="file" accept="video/*" onChange={handleFileChange} className="border p-2" />
                <button 
                    onClick={handleUpload} 
                    disabled={uploading}
                    className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
                >
                    {uploading ? "Uploading..." : "Upload Video"}
                </button>
            </div>

            {/* Video Player */}
            {selectedVideo && (
                <div className="mb-6 flex justify-center">
                    <div className="w-full max-w-lg p-3 border rounded-lg shadow-md bg-white">
                        <VideoPlayer videoId={selectedVideo.videoId} />
                    </div>
                </div>
            )}

            {/* Video List */}
            <h2 className="text-xl font-semibold mb-4 text-gray-700">📂 Uploaded Videos</h2>

            {loading ? (
                <p className="text-center text-gray-500">Loading videos...</p>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {videos.map((video) => (
                        <div
                            key={video.videoId}
                            className="cursor-pointer border rounded-lg overflow-hidden shadow-md bg-white transition-transform transform hover:scale-105 hover:shadow-xl"
                            onClick={() => setSelectedVideo(video)}
                        >
                            <img
                                src={failedThumbnails[video.videoId] ? "/fallback-thumbnail.jpg" : video.thumbnailUrl} 
                                alt="Video Thumbnail"
                                className="w-full h-28 object-cover"
                                onError={() =>
                                    setFailedThumbnails((prev) => ({
                                        ...prev,
                                        [video.videoId]: true,
                                    }))
                                }
                            />

                            <div className="p-3">
                                <p className="text-sm font-semibold text-gray-800 truncate">{video.videoId}</p>
                                <p className="text-xs text-gray-500">
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

export default App;
