const BASE_URL = "https://amadeus-dev.collibra.com/rest/2.0/domains"; // Your backend API base URL

/**
 * Fetch a domain by ID from your backend
 * @param {string} domainId - The UUID of the domain to fetch
 * @returns {Promise<object>} - Returns domain data or throws an error
 */
export async function getDomainById(domainId) {
  try {
    const response = await fetch(`${BASE_URL}/${domainId}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch domain");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching domain:", error.message);
    throw error;
  }
}
