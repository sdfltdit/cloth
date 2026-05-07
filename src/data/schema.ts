export const SITE_URL = "https://sdfltd.com";

export const schemaOrganization = {
  "@context": "https://schema.org",
  "@type": ["Organization", "LocalBusiness"],
  "@id": SITE_URL + "/#organization",
  "name": "SDF Clothing",
  "legalName": "SDF Clothing",
  "url": SITE_URL,
  "logo": {
    "@type": "ImageObject",
    "@id": SITE_URL + "/#logo",
    "url": SITE_URL + "/sdf.jpg",
    "contentUrl": SITE_URL + "/sdf.jpg",
    "caption": "SDF Clothing",
    "inLanguage": "en"
  },
  "image": {
    "@type": "ImageObject",
    "url": SITE_URL + "/factory.jpg",
    "width": 1200,
    "height": 630
  },
  "description": "SDF Clothing is a global low MOQ clothing manufacturer based in Dhaka, Bangladesh. Founded by Chowdhury Remon in 1998, we serve startup fashion brands worldwide with 300 piece minimum orders, GOTS certification, and 13 international quality certifications.",
  "foundingDate": "1998",
  "founder": {
    "@type": "Person",
    "name": "Chowdhury Remon",
    "jobTitle": "Founder & CEO",
    "url": SITE_URL + "/about/",
    "sameAs": [
      "https://www.linkedin.com/company/clothing-manufacturers",
      "https://x.com/clothing_makers"
    ]
  },
  "numberOfEmployees": {
    "@type": "QuantitativeValue",
    "minValue": 500
  },
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "House 125, Road 01, Baridhara DOSH",
    "addressLocality": "Dhaka",
    "addressRegion": "Dhaka Division",
    "postalCode": "1212",
    "addressCountry": "BD"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 23.7956,
    "longitude": 90.4203
  },
  "telephone": "+8801911733226",
  "email": "contact@sdfltd.com",
  "currenciesAccepted": "USD, GBP, EUR, AUD, CAD",
  "paymentAccepted": "Bank Transfer, Letter of Credit, T/T",
  "priceRange": "$$",
  "slogan": "Low MOQ Clothing Manufacturing for Startup Fashion Brands",
  "contactPoint": [
    {
      "@type": "ContactPoint",
      "telephone": "+8801911733226",
      "contactType": "sales",
      "areaServed": "Worldwide",
      "availableLanguage": ["English"],
      "contactOption": "TollFree"
    },
    {
      "@type": "ContactPoint",
      "url": "https://wa.me/8801911733226",
      "contactType": "customer support",
      "areaServed": "Worldwide",
      "availableLanguage": ["English"]
    }
  ],
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Sunday"],
      "opens": "09:00",
      "closes": "18:00"
    }
  ],
  "areaServed": {
    "@type": "Place",
    "name": "Worldwide"
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Clothing Manufacturing Services",
    "itemListElement": [
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "OEM Clothing Manufacturing", "url": SITE_URL + "/services/" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Private Label Apparel", "url": SITE_URL + "/services/" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "CMT Garment Services", "url": SITE_URL + "/services/" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Bespoke Apparel Development", "url": SITE_URL + "/services/" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Sustainable Organic Manufacturing", "url": SITE_URL + "/sustainability/" } }
    ]
  },
  "knowsAbout": [
    "Low MOQ Clothing Manufacturing",
    "Private Label Apparel",
    "OEM Garment Production",
    "GOTS Organic Cotton Manufacturing",
    "Bangladesh Garment Export",
    "Startup Fashion Brand Manufacturing",
    "Tech Pack Development",
    "HS Code Classification",
    "Apparel Pricing",
    "International Shipping FOB"
  ],
  "award": [
    "GOTS Certified", "OEKO-TEX Certified", "ISO 9001", "BSCI",
    "SEDEX", "GRS", "OCS", "RCS", "C-TPAT", "WRAP", "SA8000",
    "ISO 14001", "BCI"
  ],
  "sameAs": [
    "https://www.linkedin.com/company/clothing-manufacturers",
    "https://www.facebook.com/ClothingManufacturers/",
    "https://x.com/clothing_makers",
    "https://www.wikidata.org/wiki/Q139678386",
    "https://au.pinterest.com/sdfltdclothingnsw/",
    "https://www.reddit.com/user/clothing-mmakers/",
    "https://www.slideshare.net/sdfashion1",
    "https://www.quora.com/profile/SDF-Clothing-1"
  ]
};

export const schemaPerson = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": SITE_URL + "/#founder",
  "name": "Chowdhury Remon",
  "jobTitle": "Founder & CEO",
  "worksFor": { "@id": SITE_URL + "/#organization" },
  "url": SITE_URL + "/about/",
  "description": "Founder and CEO of SDF Clothing, Bangladeshi entrepreneur with 25+ years in garment manufacturing. Philanthropist and disability rights advocate.",
  "nationality": "Bangladeshi",
  "knowsAbout": [
    "Garment Manufacturing",
    "Bangladesh RMG Industry",
    "Sustainable Fashion",
    "Low MOQ Production",
    "GOTS Certification",
    "Apparel Export"
  ],
  "sameAs": [
    "https://www.linkedin.com/company/clothing-manufacturers",
    "https://x.com/clothing_makers",
    "https://chowdhury-remon.pages.dev",
    "https://www.wikidata.org/wiki/Q139678426",
    "https://en.wikiquote.org/wiki/Chowdhury_Remon"
  ]
};
