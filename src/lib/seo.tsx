import { useEffect } from "react";

type SEOProps = {
  title: string;
  description?: string;
  canonical?: string;
  image?: string;
  type?: "website" | "article";
  robots?: string; // e.g., "index,follow" or "noindex,nofollow"
  keywords?: string;
  structuredDataJson?: Record<string, any> | Array<Record<string, any>>;
};

const SITE_URL = "https://cararenaceylon.com";
const DEFAULT_IMAGE = `${SITE_URL}/hero%20image.png`;

function upsertMeta(attr: "name" | "property", key: string, content: string | undefined) {
  if (!content) return;
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}='${key}']`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setCanonical(href: string | undefined) {
  if (!href) return;
  let link = document.head.querySelector<HTMLLinkElement>("link[rel='canonical']");
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }
  link.setAttribute("href", href);
}

function upsertJsonLd(id: string, data: Record<string, any> | Record<string, any>[]) {
  // Remove existing by id then insert
  const existing = document.getElementById(id);
  if (existing && existing.parentNode) existing.parentNode.removeChild(existing);
  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.id = id;
  script.text = JSON.stringify(data);
  document.head.appendChild(script);
}

export function SEO({
  title,
  description,
  canonical,
  image,
  type = "website",
  robots,
  keywords,
  structuredDataJson,
}: SEOProps) {
  useEffect(() => {
    document.title = title;

    const url = canonical || `${SITE_URL}${window.location.pathname}${window.location.search}`;
    const img = image || DEFAULT_IMAGE;

    // Basic
    if (description) upsertMeta("name", "description", description);
    if (robots) upsertMeta("name", "robots", robots);
    if (keywords) upsertMeta("name", "keywords", keywords);
    setCanonical(url);

    // Open Graph
    upsertMeta("property", "og:site_name", "Car Arena Ceylon");
    upsertMeta("property", "og:title", title);
    if (description) upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:type", type);
    upsertMeta("property", "og:url", url);
    upsertMeta("property", "og:image", img);
  upsertMeta("property", "og:image:alt", "Premium cars dealership — Car Arena Ceylon");

    // Twitter
    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", title);
    if (description) upsertMeta("name", "twitter:description", description);
    upsertMeta("name", "twitter:image", img);
  upsertMeta("name", "twitter:image:alt", "Premium cars dealership — Car Arena Ceylon");

    // Optional JSON-LD
    if (structuredDataJson) {
      upsertJsonLd("page-structured-data", structuredDataJson as any);
    } else {
      const existing = document.getElementById("page-structured-data");
      if (existing && existing.parentNode) existing.parentNode.removeChild(existing);
    }
  }, [title, description, canonical, image, type, robots, keywords, structuredDataJson]);

  return null;
}

export default SEO;
