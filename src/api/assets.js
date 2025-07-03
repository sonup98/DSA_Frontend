const BASE_URL = "https://amadeus-dev.collibra.com/rest/2.0/assets";

export async function fetchAllAssets() {
  const csrfToken = localStorage.getItem("csrfToken");

  const params = {
    offset: "0",
    limit: "0",
    countLimit: "-1",
    nameMatchMode: "ANYWHERE",
    typeId: "00000000-0000-0000-0000-000000050000",
    statusId: "00000000-0000-0000-0000-000000005055",
    typeInheritance: "true",
    excludeMeta: "true",
    sortField: "NAME",
    sortOrder: "ASC",
  };

  const query = new URLSearchParams(params).toString();

  try {
    const response = await fetch(`${BASE_URL}?${query}`, {
      method: "GET",
      headers: {
        "X-CSRF-TOKEN": csrfToken,
      },
      credentials: "include", // to send cookies
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch assets");
    }

    return data;
  } catch (error) {
    console.error("Error fetching all assets:", error);
    return [];
  }
}

export async function createAsset(payload) {
  try {
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || "Failed to create asset");
    }

    const data = await response.json();
    return data; // Successful creation response
  } catch (error) {
    console.error("Error creating asset:", error.message);
    throw error;
  }
}

export async function fetchAssetById(assetId) {
  const csrfToken = localStorage.getItem("csrfToken");

  try {
    const response = await fetch(`${BASE_URL}/${assetId}`, {
      method: "GET",
      headers: {
        "X-CSRF-TOKEN": csrfToken,
      },
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch asset");
    }

    return data;
  } catch (error) {
    console.error(`Error fetching asset ${assetId}:`, error);
    return null;
  }
}

export async function fetchAssetBreadcrumb(assetId) {
  const csrfToken = localStorage.getItem("csrfToken");

  try {
    const response = await fetch(`${BASE_URL}/${assetId}/breadcrumb`, {
      method: "GET",
      headers: {
        "X-CSRF-TOKEN": csrfToken,
      },
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch breadcrumb");
    }

    return data;
  } catch (error) {
    console.error(`Error fetching breadcrumb for asset ${assetId}:`, error);
    return null;
  }
}
