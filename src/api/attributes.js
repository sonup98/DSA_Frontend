const BASE_URL = "https://amadeus-dev.collibra.com/rest/2.0/attributes";

export async function getAttributes({ typeIds, assetId }) {
  const csrfToken = localStorage.getItem("csrfToken");

  const params = {
    offset: "0",
    limit: "100",
    countLimit: "-1",
    sortOrder: "DESC",
    sortField: "LAST_MODIFIED",
  };

  if (typeIds) {
    params.typeIds = Array.isArray(typeIds)
      ? typeIds.join(",")
      : String(typeIds);
  }

  if (assetId) {
    params.assetId = String(assetId);
  }

  const query = new URLSearchParams(params).toString();

  try {
    const response = await fetch(`${BASE_URL}?${query}`, {
      method: "GET",
      headers: {
        "X-CSRF-TOKEN": csrfToken,
      },
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch attributes");
    }

    return data?.results || [];
  } catch (error) {
    console.error("Error fetching attributes:", error);
    return [];
  }
}
