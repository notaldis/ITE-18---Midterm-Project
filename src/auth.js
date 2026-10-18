const ACCESS_KEY = "mineops-local-access";

export function hasLocalAccess() {
  return Boolean(sessionStorage.getItem(ACCESS_KEY));
}

export function getLocalUser() {
  return sessionStorage.getItem(ACCESS_KEY) || "";
}

export function enterWorkspace(email) {
  sessionStorage.setItem(ACCESS_KEY, email.trim());
}

export function leaveWorkspace() {
  sessionStorage.removeItem(ACCESS_KEY);
}
