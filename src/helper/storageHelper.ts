import AsyncStorage from '@react-native-async-storage/async-storage';

export const getToken = async () => {
  return await AsyncStorage.getItem('@token');
};

export const getUser = async () => {
  return await AsyncStorage.getItem('@user');
};

export const setToken = async (token: string) => {
  return await AsyncStorage.setItem('@token', token);
};

export const removeToken = async () => {
  return await AsyncStorage.removeItem('@token');
};

export const removeUser = async () => {
  return await AsyncStorage.removeItem('@user');
};

export const removeWallet = async () => {
  return await AsyncStorage.removeItem(
    '@walletconnect/qrcode-modal-react-native:session',
  );
};

export const setFirst = async () => {
  return await AsyncStorage.setItem('@first', 'true');
};

export const getFirst = async () => {
  return await AsyncStorage.getItem('@first');
};
