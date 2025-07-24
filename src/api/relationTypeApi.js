const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// GET: fetch relation types with query parameters
export async function getRelationTypeID() {
  const csrfToken = localStorage.getItem("csrfToken");
  const RELATION_TYPES_URL = `${BASE_URL}/relationTypes`;

  const params = {
    sourceTypeName: "Data Product",
    role: "contains",
    targetTypeName: "Data Set",
    coRole: "is part of",
    offset: 0,
    limit: 0,
    countLimit: -1,
    sortField: "ROLE",
    sortOrder: "ASC",
    roleCoRoleLogicalOperator: "AND",
  };

  const query = new URLSearchParams(params).toString();

  try {
    const response = await fetch(`${RELATION_TYPES_URL}?${query}`, {
      method: "GET",
      headers: {
        "X-CSRF-TOKEN": csrfToken,
      },
      credentials: "include", // ⬅️ Required to send session cookie
    });

    const data = await response.json();

    if (!response.ok)
      throw new Error(data.error || "Failed to fetch relation types");

    const relationType = data?.results?.[0];
    const relationID = relationType?.id;

    return relationID;
  } catch (error) {
    console.error("Error fetching relationID:", error);
    return null;
  }
}
