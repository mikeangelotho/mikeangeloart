// NYC Local SEO utilities
export const nycLocalSeoConfig = {
  business: {
    name: "Mike Angelo - Art Director & Web Designer",
    description: "Award-winning art director and web designer serving the greater New York City area, specializing in advertising campaigns, web design, and digital content creation.",
    url: "https://mikeangelo.art",
    telephone: "+1-555-0123",
    email: "m.angelo@177edgar.com",
    address: {
      "@type": "PostalAddress",
      "addressLocality": "New Jersey",
      "addressRegion": "NJ",
      "postalCode": "07095",
      "addressCountry": "US",
      "streetAddress": "Serving all of NJ and NYC boroughs"
    },
    geo: {
      "@type": "GeoCoordinates",
      "latitude": "40.7128",
      "longitude": "-74.0060"
    }
  },
  
  serviceAreas: [
    "Hoboken",
    "Jersey City",
    "Edison",
    "New Brunswick",
    "Princeton",
    "Trenton",
    "Red Bank",
    "New York City",
    "Manhattan", 
    "Brooklyn",
    "Queens",
    "Bronx",
    "Staten Island",
    "Westchester County",
    "Northern New Jersey",
    "Long Island"
  ],
  
  services: [
    {
      "name": "Art Direction",
      "description": "Professional art direction services for advertising campaigns, branding, and visual identity projects."
    },
    {
      "name": "Web Design & Development", 
      "description": "Custom website design and development with responsive layouts and modern technologies."
    },
    {
      "name": "Digital Marketing",
      "description": "Comprehensive digital marketing including social media, content creation, and online advertising."
    },
    {
      "name": "Video Production",
      "description": "Professional video production services for commercials, branded content, and social media."
    },
    {
      "name": "Brand Development",
      "description": "Complete brand development services including logo design, brand guidelines, and visual identity."
    }
  ],
  
  targetKeywords: [
    "art director new york",
    "web designer nyc", 
    "advertising agency manhattan",
    "web design brooklyn",
    "digital marketing queens",
    "brand development nyc",
    "visual identity design",
    "nyc web development",
    "new york art direction",
    "website design brooklyn",
    "creative agency nyc",
    "digital advertising manhattan"
  ],
  
  hoursOfOperation: [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"
      ],
      "opens": "010:00",
      "closes": "20:00"
    },
    {
      "@type": "OpeningHoursSpecification", 
      "dayOfWeek": ["Saturday", "Sunday"],
      "opens": "10:00",
      "closes": "14:00"
    }
  ]
};

// Enhanced LocalBusiness schema for NYC
export function generateNYCLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    ...nycLocalSeoConfig.business,
    "areaServed": {
      "@type": "GeoCircle",
      "geoMidpoint": nycLocalSeoConfig.business.geo,
      "geoRadius": {
        "@type": "QuantitativeValue",
        "value": "50",
        "unitCode": "MI"
      }
    },
    "serviceArea": nycLocalSeoConfig.serviceAreas.map(area => ({
      "@type": "City",
      "name": area
    })),
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Services",
      "itemListElement": nycLocalSeoConfig.services.map((service, index) => ({
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": service.name,
          "description": service.description
        },
        "position": index + 1
      }))
    },
    "openingHoursSpecification": nycLocalSeoConfig.hoursOfOperation,
    "sameAs": [
      "https://linkedin.com/in/mikeangelo",
      "https://www.behance.net/mikeangelotho"    ]
  };
}

// Service area schema for each NYC borough
export function generateServiceAreaSchema(serviceArea: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": `Art Direction & Web Design in ${serviceArea}`,
    "description": `Professional art direction, web design, and digital marketing services for businesses in ${serviceArea}.`,
    "provider": {
      "@type": "LocalBusiness",
      "name": nycLocalSeoConfig.business.name,
      "url": nycLocalSeoConfig.business.url
    },
    "areaServed": {
      "@type": "City",
      "name": serviceArea
    },
    "serviceType": nycLocalSeoConfig.services.map(s => s.name)
  };
}