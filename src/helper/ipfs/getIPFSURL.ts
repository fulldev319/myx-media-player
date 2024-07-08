import Config from 'react-native-config';

export const getIPFSURL = () => {
  return Config.IPFS_API_URL ?? 'https://ipfs.filebase.io/ipfs';
};

export const getIPFSFileURL = () => {
  return Config.IPFS_FILE_URL ?? 'https://ipfs.filebase.io/ipfs';
};

export default getIPFSURL;
