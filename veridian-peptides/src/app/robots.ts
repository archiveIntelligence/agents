import type { MetadataRoute } from "next";

const SITE_URL = "https://verum-biolabs.test";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Keep private and transactional areas out of the index.
      disallow: ["/admin", "/account", "/checkout", "/cart", "/api"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
