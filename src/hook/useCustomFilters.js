import { useEffect, useState } from "react";
import { STATIC_FILTER_RELATION_TYPES } from "../constants/filters";
import { getAttributes } from "../api/attributes";

export const useCustomFilters = (assets = []) => {
  const [filterOptions, setFilterOptions] = useState({
    dataLakeZoneValues: [],
    phaseValues: [],
  });

  useEffect(() => {
    if (assets.length === 0) {
      setFilterOptions({
        dataLakeZoneValues: [],
        phaseValues: [],
      });
      return;
    }

    const fetchFilters = async () => {
      try {
        const zoneTypeId = STATIC_FILTER_RELATION_TYPES.dataLakeZone;
        const phaseTypeId = STATIC_FILTER_RELATION_TYPES.phase;

        const zonePromises = assets.map((asset) =>
          getAttributes({ typeIds: zoneTypeId, assetId: asset.assetId })
        );
        const phasePromises = assets.map((asset) =>
          getAttributes({ typeIds: phaseTypeId, assetId: asset.assetId })
        );

        const [zoneResults, phaseResults] = await Promise.all([
          Promise.all(zonePromises),
          Promise.all(phasePromises),
        ]);

        // ✅ Flatten and validate
        const allZones = zoneResults.flat().filter(Boolean);
        const allPhases = phaseResults.flat().filter(Boolean);

        // ✅ Normalize + deduplicate
        const normalize = (val) =>
          val !== null && val !== undefined
            ? val.toString().trim().toLowerCase()
            : "";

        const uniqueZoneMap = new Map();
        allZones.forEach((attr) => {
          const raw = attr?.value;
          const key = normalize(raw);
          if (key && !uniqueZoneMap.has(key)) {
            uniqueZoneMap.set(key, {
              label: raw.toString().trim(),
              value: raw.toString().trim(),
            });
          }
        });

        const uniquePhaseMap = new Map();
        allPhases.forEach((attr) => {
          const raw = attr?.value;
          const key = normalize(raw);
          if (key && !uniquePhaseMap.has(key)) {
            uniquePhaseMap.set(key, {
              label: raw.toString().trim(),
              value: raw.toString().trim(),
            });
          }
        });

        setFilterOptions({
          dataLakeZoneValues: Array.from(uniqueZoneMap.values()),
          phaseValues: Array.from(uniquePhaseMap.values()),
        });
      } catch (error) {
        console.error("Error fetching relation filters:", error);
      }
    };

    fetchFilters();
  }, [assets]);

  return filterOptions;
};
