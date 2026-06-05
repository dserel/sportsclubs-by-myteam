import type { MetadataRoute } from "next";
import { getAllClubSlugs, getSports } from "@/lib/queries";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const revalidate = 86400;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [clubs, sports] = await Promise.all([getAllClubSlugs(), getSports()]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/athlimata`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/perioxes`, changeFrequency: "weekly", priority: 0.6 },
  ];

  const sportRoutes: MetadataRoute.Sitemap = sports.map((s) => ({
    url: `${SITE_URL}/athlimata/${s.slug}`,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const clubRoutes: MetadataRoute.Sitemap = clubs.map((c) => ({
    url: `${SITE_URL}/sullogoi/${c.slug}`,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...staticRoutes, ...sportRoutes, ...clubRoutes];
}
