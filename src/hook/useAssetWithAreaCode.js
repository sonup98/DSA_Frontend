import { useEffect, useState } from "react";
import { fetchAssetById } from "../api/assets"; // update path if needed
import { getDomainById } from "../api/domains"; // update path if needed

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

export function useAssetWithAreaCode(assetId) {
  const [data, setData] = useState({
    asset: null,
    domain: null,
    areaCode: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!assetId) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const asset = await fetchAssetById(assetId);
        const domainId = asset?.domain?.id;

        if (!domainId) throw new Error("No domain ID found in asset.");

        const domain = await getDomainById(domainId);
        const communityName = domain?.community?.name;
        const areaCode = findAreaCode(communityName);

        setData({ asset, domain, areaCode });
      } catch (err) {
        console.error("Hook error:", err);
        setError(err);
        setData({ asset: null, domain: null, areaCode: null });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [assetId]);

  return { ...data, loading, error };
}
