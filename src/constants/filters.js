export const ALL_DATASETS_GLOBAL = ["loading"];

export const DATA_LAKE_ZONES_GLOBAL = [];

export const PHASES_GLOBAL = [];

export const SHARDS_GLOBAL = [];

export const LOGIC_OPTIONS_GLOBAL = ["ANY", "EXACT"];

export const DATA_ASSET_TYPES_GLOBAL = ["Azure Container", "AWS"];

export const ALL_CONFIGURABLE_FILTER_TYPES = [
  {
    type: "dataLakeZone",
    label: "Data Lake Zone",
    options: DATA_LAKE_ZONES_GLOBAL,
  },
  { type: "phase", label: "Phase", options: PHASES_GLOBAL },
  { type: "shards", label: "Shards", options: SHARDS_GLOBAL },
  { type: "logic", label: "Logic", options: LOGIC_OPTIONS_GLOBAL },
  {
    type: "dataAssetType",
    label: "Data Asset Type",
    options: DATA_ASSET_TYPES_GLOBAL,
  },
];

export const DATA_ASSET_TYPE_FILTER_MAP = {
  "Azure Container": {
    filterType: "container",
    label: "Container",

    relationTypeId: "00000000-0000-0000-0000-000000007005", // Relation ID for Azure
    relationTypeIdForDBI: "00000000-0000-0000-0000-000000007017", // Relation Id for DB intance
  },
  "Amazon S3": {
    dependentFilterType: "amazonS3Data",
    dependentFilterLabel: "Amazon S3 Bucket",
    relationTypeId: "00000000-0000-0000-0000-000000007006", // Example Relation ID for S3
  },
};

export const STATIC_FILTER_RELATION_TYPES = {
  dataLakeZone: "243285b3-e3a5-4304-88e9-60b618422c32", // Replace with real ID
  phase: "cf0d0853-f966-4fda-852a-d498eb3fbb69", // Replace with real ID
};
