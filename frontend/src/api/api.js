const API_URL = import.meta.env.VITE_API_URL; //http://localhost:5000/api

export const API = {
  SIGNUP: `${API_URL}/signup`,
  CHECK_SEND_ACCOUNT: `${API_URL}/check-account`,
  CREATE_FOLDER: `${API_URL}/folder`,
  GET_FOLDERS: `${API_URL}/folder`,
  UPLOAD_FILE: `${API_URL}/file/upload`,
  GET_FILES: `${API_URL}/file/all`,

  RECEIVE_LOGIN: `${API_URL}/share/receive-login`,
  GET_FOLDER_ITEMS: `${API_URL}/folder`,
  SAVE_FOLDERS: `${API_URL}/folder/save`,
  DOWNLOAD_FILE: (fileId, userId) =>
    `${API_URL}/share/file/${fileId}/download?userId=${encodeURIComponent(userId)}`,
};
