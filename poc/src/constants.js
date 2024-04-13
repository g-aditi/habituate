import RNFS from 'react-native-fs';
import {HOST, PORT} from './IP_constants';

export const AppFolderName = 'habituate';
export const ReceivedFolderName = 'received';
export const SentFolderName = 'sent';
export const FileDirectory = `${RNFS.DownloadDirectoryPath}/${AppFolderName}`;
export const ReceivedFolderPath = `${FileDirectory}/${ReceivedFolderName}`;
export const SentFolderPath = `${FileDirectory}/${SentFolderName}`;

export const API_URL = `http://${HOST}:${PORT}/habituate`;
export const UPLOAD_URL = `${API_URL}/upload_text`;
export const UPLOAD_FILE_URL = `${API_URL}/upload_file`;
export const DOWNLOAD_URL = `${API_URL}/download`;
export const POLL_INTERVAL = 5000;
