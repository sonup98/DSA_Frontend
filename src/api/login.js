// 1. LOGIN - save CSRF token to localStorage
const username = import.meta.env.VITE_COLLIBRA_USERNAME;
const password = import.meta.env.VITE_COLLIBRA_PASSWORD;
export async function loginToCollibra(username, password) {
  const res = await fetch(
    "https://amadeus-dev.collibra.com/rest/2.0/auth/sessions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Frame-Options": "ALLOWALL",
        "Content-Security-Policy": "frame-ancestors *",
      },
      body: JSON.stringify({ username, password }),
      credentials: "include", // ⬅️ Include session cookie
    }
  );

  const data = await res.json();
  if (data.csrfToken) {
    localStorage.setItem("csrfToken", data.csrfToken);
  }
  return data;
}
