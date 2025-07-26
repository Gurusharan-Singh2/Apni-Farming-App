import * as Device from 'expo-device';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const checkFirstInstall = async () => {
  const STORAGE_KEY = 'lastInstallCheck';
  const currentId = Device.osInternalBuildId ?? Device.osBuildId ?? "unknown";

  const storedId = await AsyncStorage.getItem(STORAGE_KEY);

  if (storedId !== currentId) {
    console.log('Fresh install detected — clearing AsyncStorage...');
    await AsyncStorage.clear();
    await AsyncStorage.setItem(STORAGE_KEY, currentId);
  } else {
    console.log('Returning user — keeping stored data.');
  }
};
