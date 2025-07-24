// utils/getAreaCode.js (or in same file above the component)
import { fetchAssetById } from "../api/assets";
import { getDomainById } from "../api/domains";

const AREA_CONFIG = {
  air: { collibra_community_name: "Airline Area", area_code: "air" },
  apt: { collibra_community_name: "Airport IT Area", area_code: "apt" },
  cba: {
    collibra_community_name: "Corporate Business Analytics Area",
    area_code: "cba",
  },
  cdd: { collibra_community_name: "Corporate Duties Area", area_code: "cdd" },
  cyt: { collibra_community_name: "Corporate Area", area_code: "cyt" },
  dis: {
    collibra_community_name: "Travel Distribution Area",
    area_code: "dis",
  },
  hos: { collibra_community_name: "Hospitality Area", area_code: "hos" },
  mgt: { collibra_community_name: null, area_code: "mgt" },
  nav: { collibra_community_name: "Navitaire Area", area_code: "nav" },
  pay: { collibra_community_name: "Payment Area", area_code: "pay" },
  rnd: {
    collibra_community_name: "Research and Development Area (RND)",
    area_code: "shp",
  },
  shp: {
    collibra_community_name: "Search and Shopping Area",
    area_code: "shp",
  },
  tcp: { collibra_community_name: "Traveler Area", area_code: "tcp" },
};

function findAreaCode(communityName) {
  for (const key in AREA_CONFIG) {
    if (AREA_CONFIG[key].collibra_community_name === communityName) {
      return AREA_CONFIG[key].area_code;
    }
  }
  return null;
}

export async function getAreaCodeByAssetId(assetId) {
  try {
    const asset = await fetchAssetById(assetId);
    const domainId = asset?.domain?.id;
    if (!domainId) throw new Error("Domain ID not found");

    const domain = await getDomainById(domainId);
    const communityName = domain?.community?.name;

    return findAreaCode(communityName);
  } catch (error) {
    console.error("Error fetching area code:", error);
    return null;
  }
}
