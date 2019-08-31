const KEY_ID_TOKEN = "ID_TOKEN";

export const getToken = () => {
  return window.localStorage.getItem(KEY_ID_TOKEN);
};

export const saveToken = token => {
  window.localStorage.setItem(KEY_ID_TOKEN, token);
};

export const destroyToken = () => {
  window.localStorage.removeItem(KEY_ID_TOKEN);
};

export default {
  getToken,
  saveToken,
  destroyToken,
};
