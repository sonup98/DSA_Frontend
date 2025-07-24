//const BASE_URL = "https://amadeus-dev.collibra.com/rest/2.0/attributeTypes";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function getAttributeTypes({ name } = {}) {
  const csrfToken = localStorage.getItem("csrfToken");
  const ATTRIBUTE_TYPES_URL = `${BASE_URL}/attributeTypes`;

  const params = {
    offset: "0",
    limit: "1000",
    countLimit: "-1",
    nameMatchMode: "EXACT",
    sortField: "NAME",
    sortOrder: "ASC",
  };

  if (name) {
    params.name = String(name);
  }

  const query = new URLSearchParams(params).toString();

  try {
    const response = await fetch(`${ATTRIBUTE_TYPES_URL}?${query}`, {
      method: "GET",
      headers: {
        "X-CSRF-TOKEN": csrfToken,
      },
      credentials: "include", // required for session cookie
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch attribute types");
    }

    return data?.results || [];
  } catch (error) {
    console.error("Error fetching attribute types:", error);
    return [];
  }
}
