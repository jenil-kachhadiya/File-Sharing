import { useState } from "react";
import { FiX, FiDownload } from "react-icons/fi";
import { getFileType } from "./FileIcon";

const PreviewModal = ({ file, onClose }) => {
    const [loading, setLoading] = useState(true);

    if (!file) {
        return null;
    }

    const fileType = getFileType(file);
    const fileUrl = file.url;

    const officeViewer = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fileUrl)}`;

    const handleLoad = () => {
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="relative flex h-[95vh] w-full max-w-6xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl">

                <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
                    <div className="min-w-0">
                        <h2 className="truncate text-lg font-semibold text-gray-800">
                            {file.name}
                        </h2>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="p-2 text-gray-600 hover:bg-gray-200"
                            title="Close">
                            <FiX size={24} />
                        </button>
                    </div>
                </div>

                <div className="relative flex flex-1 items-center justify-center overflow-auto bg-gray-100 p-4">

                    {loading &&
                        ["Image", "Video", "Audio", "PDF", "Word", "Excel"].includes(fileType) && (
                            <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-100">
                                <p className="text-gray-500">Loading...</p>
                            </div>
                        )}

                    {fileType === "Image" && (
                        <img
                            src={fileUrl}
                            alt={file.name}
                            onLoad={handleLoad}
                            onError={() => setLoading(false)}
                            className="max-h-full max-w-full rounded-lg object-contain" />
                    )}

                    {fileType === "Video" && (
                        <video
                            src={fileUrl}
                            controls
                            autoPlay={false}
                            onLoadedData={handleLoad}
                            onError={() => setLoading(false)}
                            className="max-h-full max-w-full rounded-lg">
                            Your browser does not support video playback.
                        </video>
                    )}

                    {fileType === "Audio" && (
                        <div className="flex w-full max-w-xl flex-col items-center gap-6 rounded-xl bg-white p-8 shadow">
                            <p className="max-w-full truncate text-lg font-semibold text-gray-700">
                                {file.name}
                            </p>
                            <audio
                                src={fileUrl}
                                controls
                                onLoadedData={handleLoad}
                                onError={() => setLoading(false)}
                                className="w-full"
                            />
                        </div>
                    )}

                    {fileType === "PDF" && (
                        <iframe
                            src={fileUrl}
                            title={file.name}
                            onLoad={handleLoad}
                            className="h-full w-full rounded-lg border border-gray-300 bg-white"
                        />
                    )}

                    {fileType === "Word" && (
                        <iframe
                            src={officeViewer}
                            title={file.name}
                            onLoad={handleLoad}
                            className="h-full w-full rounded-lg border border-gray-300 bg-white"
                        />
                    )}

                    {fileType === "Excel" && (
                        <iframe
                            src={officeViewer}
                            title={file.name}
                            onLoad={handleLoad}
                            className="h-full w-full rounded-lg border border-gray-300 bg-white"
                        />
                    )}

                    {!["Image", "Video", "Audio", "PDF", "Word", "Excel",].includes(fileType) && (
                        <div className="flex flex-col items-center justify-center text-center">
                            <h3 className="text-lg font-semibold text-gray-700">
                                Preview not available
                            </h3>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PreviewModal;