import { useState } from "react";
import Video from "./Video";
import Player from "./Player";
import Upload from "./Upload"; 
const App = () => {
    const [selectedVideo, setSelectedVideo] = useState(null);

    return (
        <div className="max-w-5xl mx-auto p-6">
            <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">🎬 Video Library</h1>

            {/* Upload Section */}
            <Upload onUploadSuccess={() => window.location.reload()} />

            {/* Video Player */}
            {selectedVideo && (
                <div className="mb-6 flex justify-center">
                    <div className="w-full max-w-lg p-3 border rounded-lg shadow-md bg-white">
                        <Player videoId={selectedVideo} />
                    </div>
                </div>
            )}

            {/* Video List */}
            <Video onSelectVideo={setSelectedVideo} />
        </div>
    );
};

export default App;
