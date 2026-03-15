
let refreshTokenFn: (() => Promise<void>);
let logoutFn: (() => Promise<void>);

export const setAuthHandlers = (
  refresh: () => Promise<void>,
  logout: () => Promise<void>
) => {
  refreshTokenFn = refresh;
  logoutFn = logout;
};

export const refreshTokenHandler = async () => {
  if (refreshTokenFn) {
    await refreshTokenFn();
  }
};

export const logoutHandler = async () => {
  if (logoutFn) {
    await logoutFn();
  }
};