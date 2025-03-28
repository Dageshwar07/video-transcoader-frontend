import { useState } from "react";

const UPLOAD_URL = "http://localhost:2000/api/upload";

const UploadVideo = ({ onUploadSuccess }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);

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
            onUploadSuccess();
        } catch (error) {
            console.error("Error uploading video:", error);
        } finally {
            setUploading(false);
        }
    };

    return (
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
    );
};

export default UploadVideo;  // ✅ Ensure this line exists
