const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 🔍 Fetch all assets (no name parameter)
export async function fetchAllAssets() {
  const csrfToken = localStorage.getItem("csrfToken");
  const ASSETS_URL = `${BASE_URL}/assets`;

  const params = new URLSearchParams({
    offset: "0",
    limit: "0",
    countLimit: "-1",
    typeInheritance: "true",
    excludeMeta: "true",
    sortField: "NAME",
    sortOrder: "ASC",
    typeId: "00000000-0000-0000-0000-000000050000",
    statusId: "00000000-0000-0000-0000-000000005055",
    nameMatchMode: "ANYWHERE",
  });

  try {
    const response = await fetch(`${ASSETS_URL}?${params.toString()}`, {
      method: "GET",
      headers: {
        "X-CSRF-TOKEN": csrfToken,
      },
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch assets");
    }

    return data;
  } catch (error) {
    console.error("Error fetching all assets:", error);
    return { results: [], total: 0 };
  }
}

// 🔍 Search for a single asset by exact name
// export async function searchAssetByName(assetName) {
//   if (!assetName) return null;

//   const csrfToken = localStorage.getItem("csrfToken");
//   const ASSETS_URL = `${BASE_URL}/assets`;

//   const params = new URLSearchParams({
//     name: assetName,
//     nameMatchMode: "EXACT",
//   });

//   try {
//     const response = await fetch(`${ASSETS_URL}?${params.toString()}`, {
//       method: "GET",
//       headers: {
//         "X-CSRF-TOKEN": csrfToken,
//       },
//       credentials: "include",
//     });

//     const data = await response.json();

//     if (!response.ok) {
//       throw new Error(data.error || "Failed to fetch asset by name");
//     }

//     return data?.results?.[0] || null;
//   } catch (error) {
//     console.error(`Error searching asset by name "${assetName}":`, error);
//     return null;
//   }
// }
export async function searchAssetByName(name) {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const response = await fetch(
    `${BASE_URL}/assets?name=${encodeURIComponent(name)}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": localStorage.getItem("csrfToken"),
      },
      credentials: "include", // CRITICAL
    }
  );

  if (!response.ok) {
    console.error("Search failed:", response.status, response.statusText);
    return null;
  }

  return await response.json();
}

// 📦 Create a new asset
export async function createAsset(payload) {
  const csrfToken = localStorage.getItem("csrfToken");
  const POST_URL = `${BASE_URL}/assets`;

  try {
    const response = await fetch(POST_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-TOKEN": csrfToken,
      },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || "Failed to create asset");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating asset:", error.message);
    throw error;
  }
}

// 🔍 Fetch asset by ID
export async function fetchAssetById(assetId) {
  const csrfToken = localStorage.getItem("csrfToken");

  try {
    const response = await fetch(`${BASE_URL}/assets/${assetId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
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

// 🧭 Fetch breadcrumb for asset
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
