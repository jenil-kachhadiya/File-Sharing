import folderIcon from "../assets/folder.png";
import pdfIcon from "../assets/pdf.png";
import imageIcon from "../assets/image.png";
import wordIcon from "../assets/word.png";
import excelIcon from "../assets/excel.png";
import videoIcon from "../assets/video.png";
import audioIcon from "../assets/mp3.png";
import zipIcon from "../assets/zip.png";
import fileIcon from "../assets/file.png";

export const getFileType = (item) => {

  if (item.type === "folder") {
    return "Folder";
  }

  const fileName = item.name;
  const extension = fileName.split(".").pop().toLowerCase();

  if (extension === "pdf") {
    return "PDF";
  }

  if (
    ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(extension)
  ) {
    return "Image";
  }

  if (["doc", "docx"].includes(extension)) {
    return "Word";
  }

  if (["xls", "xlsx", "csv"].includes(extension)) {
    return "Excel";
  }

  if (["ppt", "pptx"].includes(extension)) {
    return "PowerPoint";
  }

  if (
    ["mp4", "mkv", "avi", "mov", "webm"].includes(extension)
  ) {
    return "Video";
  }

  if (
    ["mp3", "wav", "ogg", "m4a"].includes(extension)
  ) {
    return "Audio";
  }

  if (
    ["zip", "rar"].includes(extension)
  ) {
    return "Archive";
  }

  if (["txt", "md"].includes(extension)) {
    return "Text";
  }

  return "File";
};

const FileIcon = ({ item }) => {
  const fileType = getFileType(item);

  const icons = {
    Folder: folderIcon,
    PDF: pdfIcon,
    Image: imageIcon,
    Word: wordIcon,
    Excel: excelIcon,
    Video: videoIcon,
    Audio: audioIcon,
    Archive: zipIcon,
    Text: fileIcon,
    File: fileIcon,
  };

  return (
    <img
      src={icons[fileType]}
      alt={fileType}
      className="h-8 w-8 object-contain"
    />
  );
};

export default FileIcon;
