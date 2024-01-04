import {storeData} from './storeData';

export const cacheData = async (key: string, data: any) => {
  try {
    await storeData(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};
