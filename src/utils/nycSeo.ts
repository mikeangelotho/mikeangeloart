// Regional service information; no unverified physical address or opening hours.
const business = {
  name: "Mike Angelo — Art Director & Multidisciplinary Designer",
  description:
    "Art director and multidisciplinary designer creating brands, campaigns, and digital experiences from concept through production across New Jersey and New York City.",
  url: "https://mikeangelo.art",
  email: "m.angelo@177edgar.com",
};

const services = [
  {
    name: "Art Direction",
    description: "Art direction for brands, campaigns, and digital experiences.",
  },
  {
    name: "Brand Identity & Systems",
    description: "Visual identities and brand systems across print and digital touchpoints.",
  },
  {
    name: "Web Design & Development",
    description: "Website and landing page design and frontend implementation.",
  },
  {
    name: "Campaign & Digital Design",
    description: "Promotional creative, paid social, motion, video, print, and digital design.",
  },
];

export function generateNYCLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://mikeangelo.art/#business",
    ...business,
    areaServed: [
      { "@type": "State", name: "New Jersey" },
      { "@type": "City", name: "New York City" },
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Services",
      itemListElement: services.map((service) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", ...service },
      })),
    },
    sameAs: [
      "https://linkedin.com/in/mikeangelotho",
      "https://www.behance.net/mikeangelotho",
    ],
  };
}
