import { useCallback } from "react";
import { getRelations } from "../api/relations";

// Utility to deduplicate by ID
const deduplicateOptions = (arr) => {
  const seen = new Set();
  return arr.filter((item) => {
    if (seen.has(item.value)) return false;
    seen.add(item.value);
    return true;
  });
};

const useFetchRelatedData = () => {
  const fetchRelatedData = useCallback(
    async (relationTypeId, assets = [], relationTypeIdForDBI = null) => {
      try {
        // Step 1: Primary fetch
        const primaryResponses = await Promise.all(
          assets.map((asset) =>
            getRelations({
              getRelationTypeID: relationTypeId,
              sourceId: asset.assetId,
            })
          )
        );

        const flatPrimary = primaryResponses.flat().filter(Boolean);
        const primaryRelations = flatPrimary.filter(
          (r) => r?.type?.id === relationTypeId
        );

        const primaryOptions = primaryRelations
          .filter((r) => r?.target?.name && r?.target?.id)
          .map((r) => ({
            label: r.target.name,
            value: r.target.id,
          }));

        // If no DBI fetch required, return the primary options
        if (!relationTypeIdForDBI) {
          return deduplicateOptions(primaryOptions);
        }

        // Step 2: DBI fetch using target IDs from step 1
        const secondaryResponses = await Promise.all(
          assets.map((asset) =>
            getRelations({
              getRelationTypeID: relationTypeIdForDBI,
              sourceId: asset.assetId,
            })
          )
        );
        console.log("Secondary Responses:", secondaryResponses);
        //flatten the secondary responses so that we can map over them

        const flattenedResponses = secondaryResponses.flat().filter(Boolean);
        const secondaryResponsesFiltered = await Promise.all(
          flattenedResponses.map((response) =>
            getRelations({
              getRelationTypeID: relationTypeId,
              sourceId: response?.target?.id,
            })
          )
        );

        const flatSecondary = secondaryResponsesFiltered.flat().filter(Boolean);

        const secondaryOptions = flatSecondary
          .filter((r) => r?.target?.name && r?.target?.id)
          .map((r) => ({
            label: r.target.name,
            value: r.target.id,
          }));
        console.log("Secondary Options:", secondaryOptions);
        // Combine both and deduplicate
        const combined = [...primaryOptions, ...secondaryOptions];

        return deduplicateOptions(combined);
      } catch (err) {
        console.error("Error fetching related data:", err);
        return [];
      }
    },
    []
  );

  return fetchRelatedData;
};

export default useFetchRelatedData;
