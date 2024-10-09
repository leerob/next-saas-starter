import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${process.env.BASE_URL}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    // Add more URLs here
  ];
}
