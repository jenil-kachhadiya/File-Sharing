import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { API } from "../api/api";
import { toast } from "react-toastify";

const CreateFolder = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const parentFolderId = location.state?.parentFolderId || null;
  const breadcrumbs = location.state?.breadcrumbs || [{
    _id: null,
    name: "Root",
  }];

  const userId = location.state?.userId || "";

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Folder name is required");
      return;
    }

    const Folders = JSON.parse(localStorage.getItem("Folders")) || [];
    const newFolder = {
      tempId: crypto.randomUUID(),
      name: name.trim(),
      parentFolderId,
    };
    Folders.push(newFolder);
    localStorage.setItem("Folders", JSON.stringify(Folders));

    toast.success("Folder created");
    navigate("/root", {
      state: { folderId: parentFolderId, breadcrumbs, userId },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-300 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
        <h1 className="text-2xl font-semibold text-gray-800 text-center mb-8">
          Create Folder
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5" >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Folder Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter folder name"
              className="w-full px-4 py-3 border border-gray-500 rounded-lg outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-300" />
          </div>

          <div className="flex gap-4 pt-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-full py-3 rounded-lg border border-gray-500 text-gray-700 font-medium hover:bg-gray-100 transition">
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition disabled:opacity-50">
              {loading ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateFolder;