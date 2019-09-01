import { del, get, set } from 'idb-keyval';

const KEY_ID_TOKEN = "ID_TOKEN";

export const getToken = async () => {
  return get(KEY_ID_TOKEN);
};

export const saveToken = async token => {
  return set(KEY_ID_TOKEN, token);
};

export const destroyToken = async () => {
  return del(KEY_ID_TOKEN);
};

export default {
  getToken,
  saveToken,
  destroyToken,
};
