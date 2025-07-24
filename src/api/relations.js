const csrfToken = localStorage.getItem("csrfToken");
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function getRelations({ relationTypeId, sourceId }) {
  const params = new URLSearchParams({
    offset: "0",
    limit: "100",
    countLimit: "-1",
    sourceTargetLogicalOperator: "AND",
    sourceId: String(sourceId),
    ...(relationTypeId && { relationTypeId }),
  });

  const RELATIONS_URL = `${BASE_URL}/relations`;

  const res = await fetch(`${RELATIONS_URL}?${params.toString()}`, {
    method: "GET",
    headers: {
      "X-CSRF-TOKEN": csrfToken,
    },
    credentials: "include", // crucial to send the session cookie
  });

  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();
  return data?.results || [];
}
