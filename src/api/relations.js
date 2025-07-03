const csrfToken = localStorage.getItem("csrfToken");

export async function getRelations({ relationTypeId, sourceId }) {
  const params = new URLSearchParams({
    offset: "0",
    limit: "100",
    countLimit: "-1",
    sourceTargetLogicalOperator: "AND",
    sourceId: String(sourceId),
    ...(relationTypeId && { relationTypeId }),
  });

  const res = await fetch(
    `https://amadeus-dev.collibra.com/rest/2.0/relations?${params.toString()}`,
    {
      method: "GET",
      headers: {
        "X-CSRF-TOKEN": csrfToken,
      },
      credentials: "include", // crucial to send the session cookie
    }
  );

  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();
  return data?.results || [];
}
