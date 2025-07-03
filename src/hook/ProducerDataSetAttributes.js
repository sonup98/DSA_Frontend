import { getRelationTypeID } from "../api/relationTypeApi";
import { getRelations } from "../api/relations";
import { getAttributes } from "../api/attributes";
import { fetchAssetById } from "../api/assets"; // ✅ Import the asset fetch function

/**
 * Fetch attributes + asset details for assets related to the given sourceId and relationTypeId.
 *
 * @param {string} sourceId
 * @param {string} [relationTypeId]
 * @param {string} [typeIds]
 * @returns {Promise<Array<{ assetId: string, attributes: any[], asset: object }>>}
 */
export async function ProducerDataSetAttributes(
  sourceId,
  relationTypeId = null,
  typeIds = "0195dbfa-61fa-78d9-a2c4-fadff1672acf"
) {
  try {
    let relTypeId = relationTypeId;

    // Get relation type ID if not provided
    if (!relTypeId) {
      relTypeId = await getRelationTypeID();
    }

    // Get related asset relations
    const relations = await getRelations({
      relationTypeId: relTypeId,
      sourceId,
    });
    console.log("Relations found:", relations);

    if (relations.length === 0) {
      console.warn(
        "⚠️ No relations found for sourceId:",
        sourceId,
        "and relationTypeId:",
        relTypeId
      );
      return [];
    }

    // Get attributes for each related asset
    const attributesPromises = relations.map(async (relation) => {
      const assetId = relation.target.id;
      const attrData = await getAttributes({ typeIds, assetId });
      return { assetId, attributes: attrData };
    });

    const allAttributes = await Promise.all(attributesPromises);
    console.log("Attributes per asset:", allAttributes);

    // Enrich with full asset details
    const enrichedDataPromises = allAttributes.map(
      async ({ assetId, attributes }) => {
        const asset = await fetchAssetById(assetId);
        return { assetId, asset, attributes };
      }
    );

    const enrichedData = await Promise.all(enrichedDataPromises);
    console.log("Final enriched data:", enrichedData);

    return enrichedData;
  } catch (error) {
    console.error("Error fetching enriched asset data:", error);
    throw error;
  }
}
