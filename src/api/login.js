import.meta.env.VITE_COLLIBRA_USERNAME;
import.meta.env.VITE_COLLIBRA_PASSWORD;

export async function loginToCollibra() {
  const res = await fetch(
    "https://amadeus-dev.collibra.com/rest/2.0/auth/sessions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: import.meta.env.VITE_COLLIBRA_USERNAME,
        password: import.meta.env.VITE_COLLIBRA_PASSWORD,
      }),
      credentials: "include",
    }
  );

  if (!res.ok) throw new Error("Login failed");

  const data = await res.json();
  localStorage.setItem("csrfToken", data.csrfToken);
}
