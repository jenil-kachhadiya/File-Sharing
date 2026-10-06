import { useEffect, useState } from "react";
import { FiUpload, FiFolderPlus, FiDownload } from "react-icons/fi";
import { MdPreview } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";
import { IoHomeOutline } from "react-icons/io5";
import { FaGreaterThan } from "react-icons/fa";
import { API } from "../api/api";
import { toast } from "react-toastify";
import ActionButton from "../components/ActionButton";
import Signup from "../components/SignUp";
import FileIcon, { getFileType } from "../components/FileIcon";
import PreviewModal from "../components/Preview";

const Root = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [userId, setUserId] = useState(location.state?.userId || "");
  const mode = location.state?.mode || "sender";

  const [currentFolderId, setCurrentFolderId] = useState(null);
  const [breadcrumbs, setBreadcrumbs] = useState([{ _id: null, name: "Root" }]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);
  const [showSignup, setShowSignup] = useState(false);
  const [sendUserId, setSendUserId] = useState("");
  const [saving, setSaving] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);

  useEffect(() => {
    const checkSendAccount = async () => {
      try {
        const response = await fetch(API.CHECK_SEND_ACCOUNT, {
          credentials: "include",
        });

        const data = await response.json();
        if (data.exists) {
          setSendUserId(data.userId);
          setUserId(data.userId);
        }
      } catch (error) {
        console.error("CHECK SEND ACCOUNT ERROR:", error);
      }
    };
    checkSendAccount();
  }, []);

  const getFolderItems = async (
    folderId = null,
    userIdToUse = userId
  ) => {
    if (mode === "sender") {
      const Folders = JSON.parse(localStorage.getItem("Folders")) || [];
      const Files = JSON.parse(localStorage.getItem("Files")) || [];

      const folderItems = Folders.filter((folder) =>
          folder.parentFolderId === folderId
      ).map((folder) => ({
          _id: folder.tempId,
          name: folder.name,
          type: "folder",
        }));

      const fileItems = Files.filter((file) =>
          file.parentFolderId === folderId
      ).map((file) => ({
          _id: file.tempId,
          name: file.name,
          type: "file",
        }));

      setItems([...folderItems, ...fileItems]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      if (!userIdToUse) {
        toast.error("User ID is missing");
        return;
      }

      const id = folderId || "root";

      const response = await fetch(
        `${API.GET_FOLDER_ITEMS}/${id}?userId=${encodeURIComponent(userIdToUse)}`,
        {
          method: "GET",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error( data.message || "Failed to get folder contents");
      }

      const folders = (data.folders || []).map(
        (folder) => ({
          ...folder, type: "folder",
        })
      );

      const files = (data.files || []).map(
        (file) => ({
          ...file, type: "file",
        })
      );
      setItems([...folders, ...files]);

    } catch (error) {
      console.error("Get folder items error:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const folderId = location.state?.folderId || null;
    const saveBreadcrumbs = location.state?.breadcrumbs;
    const stateUserId = location.state?.userId || "";
    if (stateUserId) {
      setUserId(stateUserId);
    }

    if (folderId) {
      if (saveBreadcrumbs) {
        setBreadcrumbs(saveBreadcrumbs);
      } else {
        const folderName =
          location.state?.folderName || "Folder";

        setBreadcrumbs([
          {
            _id: null,
            name: "Root",
          },
          {
            _id: folderId,
            name: folderName,
          },
        ]);
      }

      setCurrentFolderId(folderId);
      getFolderItems(folderId, stateUserId);
    } else {
      setCurrentFolderId(null);
      setBreadcrumbs([
        {
          _id: null,
          name: "Root",
        },
      ]);

      getFolderItems(null, stateUserId);
    }
  }, [location.state]);

  const openFolder = (folder) => {
    setCurrentFolderId(folder._id);
    setBreadcrumbs((previous) => [
      ...previous,
      { _id: folder._id, name: folder.name },
    ]);
    getFolderItems(folder._id);
  };

  const openBreadcrumb = (index) => {
    const breadcrumb = breadcrumbs[index];
    setCurrentFolderId(breadcrumb._id);
    setBreadcrumbs(breadcrumbs.slice(0, index + 1));
    getFolderItems(breadcrumb._id);
  };

  const handleCreateFolder = () => {
    navigate("/create-folder", {
      state: { parentFolderId: currentFolderId, breadcrumbs, userId },
    });
  };

  const handleUploadFile = () => {
    navigate("/upload-file", {
      state: {
        parentFolderId: currentFolderId,
        breadcrumbs,
        userId,
      },
    });
  };

  const handleDownloadFile = async (file) => {
    try {
      setDownloadingId(file._id);

      const response = await fetch(API.DOWNLOAD_FILE(file._id, userId));
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Download failed");
      }

      const fileResponse = await fetch(data.url);

      if (!fileResponse.ok) {
        throw new Error("Failed to download file");
      }
      const blob = await fileResponse.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = blobUrl;
      link.download = data.name || file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      toast.success("Download started");

    } catch (error) {
      console.error("Download error:", error);
      toast.error(error.message || "Download failed");

    } finally {
      setDownloadingId(null);
    }
  };


  const handleItemClick = (item) => {
    if (item.type === "folder") {
      openFolder(item);
    } else if (mode === "receiver") {
      handleDownloadFile(item);
    }
  };

  const saveFilesAndFolders = async (userId) => {
    try {
      setSaving(true);

      const Folders = JSON.parse(localStorage.getItem("Folders")) || [];
      const Files = JSON.parse(localStorage.getItem("Files")) || [];

      if (Folders.length === 0 && Files.length === 0) {
        toast.error("No File and Folder");
        return;
      }

      let folderData = {};

      if (Folders.length > 0) {
        const response = await fetch(API.SAVE_FOLDERS, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            folders: Folders,
          }),
        });

        const data = await response.json();
        if (!response.ok) {
          toast.error(data.message || "Failed to save folders");
          return;
        }

        folderData = data.folderData || {};
      }

      for (const item of Files) {
        const blobResponse = await fetch(item.data);
        const blob = await blobResponse.blob();

        const realFile = new File(
          [blob], item.name,
          {
            type: item.mimeType,
          }
        );

        const formData = new FormData();

        formData.append("file", realFile);
        formData.append("userId", userId);

        if (item.parentFolderId) {
          const realParentFolderId = folderData[item.parentFolderId];

          if (!realParentFolderId) {
            toast.error(`Folder not found for: ${item.name}`);
            return;
          }
          formData.append("parentFolderId", realParentFolderId);
        }

        const response = await fetch(API.UPLOAD_FILE, {
          method: "POST", body: formData,
        });

        const data = await response.json();
        if (!response.ok) {
          toast.error(data.message || "Failed to upload");
          return;
        }
      }
      toast.success("Saved successfully");
      localStorage.removeItem("Folders");
      localStorage.removeItem("Files");

      setItems([]);
      setCurrentFolderId(null);
      setBreadcrumbs([
        {
          _id: null, name: "Root"
        },
      ]);
    } catch (error) {
      console.error("Save Error:", error);

      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="min-h-screen bg-gray-100 rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col">
        <div className="flex items-start justify-between w-full">
          {mode === "sender" && (
            <>
              <div className="flex gap-6 items-start">
                <ActionButton
                  icon={<FiUpload size={25} />}
                  onClick={handleUploadFile}
                  className="border-2 border-blue-300 bg-blue-50 text-blue-600 hover:bg-blue-100">
                  Upload File
                </ActionButton>

                <ActionButton
                  icon={<FiFolderPlus size={25} />}
                  onClick={handleCreateFolder}
                  className="border-2 border-red-300 bg-red-50 text-red-700 hover:bg-red-100">
                  Create Folder
                </ActionButton>
              </div>

              <div className="text-right">
                {!sendUserId && (
                  <button
                    onClick={() => setShowSignup(true)}
                    className="rounded-lg bg-blue-600 px-10 py-3 font-medium text-white transition hover:bg-blue-700">
                    Send File
                  </button>
                )}
                {showSignup && (
                  <Signup
                    saving={saving}
                    onClose={() => setShowSignup(false)}
                    onSuccess={async (generatedUserId) => {
                      
                      setSendUserId(generatedUserId);
                      setUserId(generatedUserId);
                      setShowSignup(false);

                      await saveFilesAndFolders(generatedUserId);
                    }}/>
                )}
              </div>
            </>
          )}
        </div>

        <div className="flex gap-3 items-center bg-gray-200 rounded-md mt-5 py-2 px-3">
          <IoHomeOutline size={21} />
          <FaGreaterThan className="text-gray-400" size={13} />
          {breadcrumbs.map((breadcrumb, index) => (
            <div
              key={`${breadcrumb._id || "root"}-${index}`}
              className="flex items-center gap-3">
              {index > 0 && (
                <FaGreaterThan className="text-gray-400" size={13} />
              )}

              <button
                onClick={() => openBreadcrumb(index)}
                className="font-semibold text-lg hover:text-blue-600">
                {breadcrumb.name}
              </button>
            </div>
          ))}
        </div>

        <div className="flex items-center py-6">
          <div className="w-full max-w-7xl min-h-[315px] rounded-lg border-2 border-gray-500 bg-white p-3">

            <div className="flex items-center border-b border-gray-300 px-4 pb-3 font-semibold text-gray-700">
              <div className="w-1/3">
                Name
              </div>

              <div className="w-1/3 text-center">
                Type
              </div>

              {mode === "receiver" && (
                <div className="flex w-1/3 justify-center gap-7">
                  <span>Preview</span>
                  <span>Download</span>
                </div>
              )}
            </div>

            {!loading && items.length === 0 && (
              <div className="p-6 text-center text-gray-500">
                Folder is empty.
              </div>
            )}

            {!loading &&
              items.map((item) => (
                <div
                  key={item._id}
                  onClick={() => handleItemClick(item)}
                  className={`flex items-center border-b border-gray-200 px-4 py-3 ${item.type === "folder" || mode === "receiver"
                    ? "cursor-pointer hover:bg-gray-50" : ""
                    }`}>

                  <div className="flex w-1/3 min-w-0 items-center gap-3">
                    <FileIcon item={item} />

                    <span className="truncate text-sm text-gray-800">
                      {item.name}
                    </span>
                  </div>

                  <div className="flex w-1/3 items-center justify-center text-sm text-gray-600">
                    {getFileType(item)}
                  </div>

                  {mode === "receiver" && (
                    <div className="flex w-1/3 justify-center gap-17">

                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          setPreviewFile(item);
                        }}
                        className="flex items-center justify-center">
                        {item.type === "file" && (
                          <MdPreview size={30} className="cursor-pointer text-blue-600"/>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleItemClick(item);
                        }}
                        className="flex items-center justify-start">
                        {item.type === "file" && (
                          <FiDownload size={30} className="cursor-pointer text-red-500"/>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>

        {mode === "receiver" && (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => navigate("/", { replace: true })}
              className="rounded-lg bg-blue-600 px-10 py-3 font-medium text-white transition hover:bg-blue-700">
              Done
            </button>
          </div>
        )}
      </div>

      {previewFile && (
        <PreviewModal
          file={previewFile}
          onClose={() => setPreviewFile(null)}
        />
      )}
    </div>
  );
};

export default Root;
