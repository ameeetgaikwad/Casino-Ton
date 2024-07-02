import { Metadata } from "next";
import { absoluteUrl } from "@/lib/utils";
import { SiteConfig } from "./types";


/*
export const siteConfig: SiteConfig = {
  name: "Flipya",
  description: "Flipya - Vitruveo Blockchain Gaming",
  url: absoluteUrl(),
  ogImage: "/img/flipya.jpg",
  links: {
    twitter: "",
    github: "",
  },
}; */

export const siteConfig: SiteConfig = {
  name: "Flipya",
  description: "Flipya - Vitruveo Blockchain Gaming",
  url: "https://flipya.xyz",  // Assuming the correct base URL for your site
  ogImage: "https://flipya.xyz/img/flipya.jpg",  // Use the direct image URL
  links: {
    twitter: "",
    github: "",
  },
};


export const siteMetadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: ["Flipya"],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [siteConfig.ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/img/flipya.jpg",
    apple: "/img/flipya.jpg",
  },
};
