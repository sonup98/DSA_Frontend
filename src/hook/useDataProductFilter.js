import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ProducerDataSetAttributes } from "./ProducerDataSetAttributes";
import { getAttributes } from "../api/attributes";
import { getDomainById } from "../api/domains";
import { setAllDatasets } from "../slice/dataSetSlice";
import { ATTRIBUTES_TYPES_IDS } from "../constants/filters";

const dpCategoryHierarchy = {
  "Customer/Restricted": [
    "Customer/Restricted",
    "Internal",
    "External",
    "Public",
  ],
  Internal: ["Internal", "External", "Public"],
  External: ["External", "External", "Public"],
  Public: ["Public"],
};

export default function useDataProductFilter() {
  const dispatch = useDispatch();
  const sourceIdforDp = useSelector(
    (state) => state.dsaForm.form.dataProductProvider
  );
  const sourceIdforCd = useSelector(
    (state) => state.dsaForm.form.dataProductConsumer
  );
  const macroPhase = useSelector(
    (state) => state.dsaForm.form.containerMacroPhase
  );

  const [producerAttributes, setProducerAttributes] = useState([]);
  const [consumerAttributes, setConsumerAttributes] = useState([]);
  const [filteredProducerAssets, setFilteredProducerAssets] = useState([]);
  const [filteredDatasetNames, setFilteredDatasetNames] = useState([]);

  useEffect(() => {
    const loadProducerAttributes = async () => {
      if (!sourceIdforDp) return;
      try {
        const data = await ProducerDataSetAttributes(sourceIdforDp);
        setProducerAttributes(data);
        console.log("Producer attributes loaded:", data);
      } catch (err) {
        console.error("Error fetching producer attributes:", err);
      }
    };
    loadProducerAttributes();
  }, [sourceIdforDp]);

  useEffect(() => {
    const loadConsumerAttributes = async () => {
      if (!sourceIdforCd) return;
      try {
        const data = await getAttributes({
          typeIds: ATTRIBUTES_TYPES_IDS.Category,
          assetId: sourceIdforCd,
        });
        setConsumerAttributes(data);
      } catch (err) {
        console.error("Error fetching consumer attributes:", err);
      }
    };
    loadConsumerAttributes();
  }, [sourceIdforCd]);

  useEffect(() => {
    const applyFilters = async () => {
      // 👈 Start loading
      try {
        if (
          consumerAttributes.length === 0 ||
          producerAttributes.length === 0
        ) {
          setFilteredProducerAssets([]);
          setFilteredDatasetNames([]);
          return;
        }

        const categoryAttr = consumerAttributes.find(
          (attr) => attr.type?.name === "Category"
        );
        const consumerCategoryValue = categoryAttr?.value;

        if (
          !consumerCategoryValue ||
          !dpCategoryHierarchy[consumerCategoryValue]
        ) {
          setFilteredProducerAssets([]);
          setFilteredDatasetNames([]);
          console.warn("Consumer 'Category' value not valid.");
          return;
        }

        const allowedValues = dpCategoryHierarchy[consumerCategoryValue];
        const intermediateAssets = [];

        for (const item of producerAttributes) {
          for (const attr of item.attributes || []) {
            if (
              attr.type?.name === "Usage" &&
              allowedValues.includes(attr.value)
            ) {
              intermediateAssets.push(item);
              break;
            }
          }
        }

        const finalAssets = [];
        const datasetNames = [];

        for (const item of intermediateAssets) {
          const domainId = item.asset?.domain?.id;
          if (!domainId) continue;

          try {
            const domainData = await getDomainById(domainId);
            const communityName = domainData?.community?.name || "";

            if (communityName.includes(macroPhase)) {
              finalAssets.push(item);
              if (item.asset?.displayName) {
                datasetNames.push(item.asset.displayName.trim());
              }
            }
          } catch (err) {
            console.warn(
              `Failed to fetch domain for asset: ${item.asset?.id}`,
              err
            );
          }
        }
        const uniqueDatasetNames = [...new Set(datasetNames)];
        setFilteredProducerAssets(finalAssets);
        setFilteredDatasetNames(uniqueDatasetNames);
        dispatch(setAllDatasets(uniqueDatasetNames));
      } finally {
      }
    };

    applyFilters();
  }, [consumerAttributes, producerAttributes, macroPhase, dispatch]);

  return {
    producerAttributes,
    consumerAttributes,
    filteredProducerAssets,
    filteredDatasetNames,
    // ✅ return loading
  };
}
