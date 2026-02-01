// NYC / NJ Local SEO configuration
export const nycLocalSeoConfig = {
  business: {
    name: "Mike Angelo — Art Director & Web Developer",
    description:
      "Independent art director and web developer working with brands and startups across New Jersey and New York City. Specializing in brand systems, visual identity, and custom web experiences.",
    url: "https://mikeangelo.art",
    email: "m.angelo@177edgar.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "New Jersey",
      addressRegion: "NJ",
      postalCode: "07095",
      addressCountry: "US",
      streetAddress: "Serving New Jersey and New York City"
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "40.7195",
      longitude: "-74.0776"
    }
  },

  serviceAreas: [
    // NJ
    "Hoboken",
    "Jersey City",
    "Newark",
    "Princeton",
    "New Brunswick",
    "Red Bank",

    // NYC
    "New York City",
    "Manhattan",
    "Brooklyn",
    "Queens",
    "Bronx",

    // Broader regions
    "Northern New Jersey",
    "Westchester County",
    "Long Island"
  ],

  services: [
    {
      name: "Art Direction",
      description:
        "Art direction for brands, campaigns, and digital products, with a focus on clarity, systems, and long-term visual coherence."
    },
    {
      name: "Brand Identity & Systems",
      description:
        "Brand identity design and scalable visual systems including logos, typography, color, and brand guidelines."
    },
    {
      name: "Web Design & Development",
      description:
        "Custom website design and frontend development using modern frameworks, optimized for performance and longevity."
    },
    {
      name: "Creative Technology",
      description:
        "Design-led development for interactive, experimental, or technically complex digital experiences."
    }
  ],

  targetKeywords: [
    // Core identity
    "art director nyc",
    "freelance art director new york",
    "brand art director nyc",
    "visual identity designer nyc",

    // Web + build
    "web designer and developer nyc",
    "creative web developer nyc",
    "frontend web designer nyc",
    "custom website design brooklyn",

    // Brand + systems
    "brand identity design new york",
    "brand systems designer nyc",
    "digital brand design studio nyc",

    // Studio / positioning
    "independent creative studio nyc",
    "creative technologist new york",
    "art director who codes"
  ],

  hoursOfOperation: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday"
      ],
      opens: "10:00",
      closes: "20:00"
    }
  ]
};

// LocalBusiness schema
export function generateNYCLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    ...nycLocalSeoConfig.business,
    areaServed: {
      "@type": "GeoCircle",
      geoMidpoint: nycLocalSeoConfig.business.geo,
      geoRadius: {
        "@type": "QuantitativeValue",
        value: 50,
        unitCode: "MI"
      }
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Services",
      itemListElement: nycLocalSeoConfig.services.map((service, index) => ({
        "@type": "Offer",
        position: index + 1,
        itemOffered: {
          "@type": "Service",
          name: service.name,
          description: service.description
        }
      }))
    },
    openingHoursSpecification: nycLocalSeoConfig.hoursOfOperation,
    sameAs: [
      "https://linkedin.com/in/mikeangelo",
      "https://www.behance.net/mikeangelotho"
    ]
  };
}

// Service area schema
export function generateServiceAreaSchema(serviceArea: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `Art Direction & Web Design in ${serviceArea}`,
    description:
      `Art direction, brand identity, and custom web development for businesses and startups in ${serviceArea}.`,
    provider: {
      "@type": "LocalBusiness",
      name: nycLocalSeoConfig.business.name,
      url: nycLocalSeoConfig.business.url
    },
    areaServed: {
      "@type": "Place",
      name: serviceArea
    },
    serviceType: nycLocalSeoConfig.services.map(s => s.name)
  };
}
