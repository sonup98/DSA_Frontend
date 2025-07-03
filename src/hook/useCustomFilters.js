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

        const allZones = zoneResults.flat().filter(Boolean);
        const allPhases = phaseResults.flat().filter(Boolean);

        const zoneOptions = allZones.map((attr) => ({
          label: attr.value,
          value: attr.value,
        }));

        const phaseOptions = allPhases.map((attr) => ({
          label: attr.value,
          value: attr.value,
        }));

        setFilterOptions({
          dataLakeZoneValues: zoneOptions,
          phaseValues: phaseOptions,
        });
      } catch (error) {
        console.error("Error fetching relation filters:", error);
      }
    };

    fetchFilters();
  }, [assets]);

  return filterOptions;
};
