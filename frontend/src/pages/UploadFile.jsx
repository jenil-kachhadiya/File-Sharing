import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { API } from "../api/api";
import { toast } from "react-toastify";

const UploadFile = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const { parentFolderId, breadcrumbs } = location.state || {};

const handleSubmit = (e) => {
  e.preventDefault();

  if (!file) {
    toast.error("Please select a file");
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    toast.error("File must be smaller than 5 MB");
    return;
  }

  const reader = new FileReader();

  reader.onload = () => {
    try {
      const Files = JSON.parse(localStorage.getItem("Files")) || [];

      Files.push({
        tempId: crypto.randomUUID(),
        name: file.name,
        mimeType: file.type,
        size: file.size,
        parentFolderId,        
        data: reader.result,  
      });
      localStorage.setItem("Files", JSON.stringify(Files));
      toast.success("File created successfully");
      
      navigate("/root", { state: { folderId: parentFolderId, breadcrumbs } });
    } catch (error) {
      toast.error("Storage is full. Try a smaller file.");
    }
  };
  reader.readAsDataURL(file);
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-300 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
        <h1 className="text-2xl font-semibold text-gray-800 text-center mb-8">
          Upload File
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select File
            </label>

            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full border border-gray-500 rounded-lg file:bg-gray-400 file:py-2 file:px-3"/>
          </div>

          <div className="flex gap-4 pt-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-full py-3 rounded-lg border border-gray-500 text-gray-700 font-medium hover:bg-gray-100">
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50">
              {loading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadFile;
