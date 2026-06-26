export const PHONE = "+8801819172080";
export const WHATSAPP_NUMBER = "8801819172080";
export const EMAIL = "contact@sdfltd.com";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

export const SITE_URL = "https://sdfltd.com";

export const schemaOrganization = {
  "@context": "https://schema.org",
  "@type": ["Corporation", "ManufacturingBusiness"],
  "@id": SITE_URL + "/#org",
  "name": "SDF Clothing",
  "legalName": "SDF Clothing Ltd",
  "alternateName": ["SDF Ltd", "SDF Garments"],
  "url": SITE_URL,

  "logo": {
    "@type": "ImageObject",
    "@id": SITE_URL + "/#logo",
    "url": SITE_URL + "/sdf.jpg",
    "contentUrl": SITE_URL + "/sdf.jpg",
    "caption": "SDF Clothing — Custom Clothing Manufacturers Bangladesh",
    "inLanguage": "en"
  },
  "image": {
    "@type": "ImageObject",
    "url": SITE_URL + "/factory.jpg",
    "width": 1200,
    "height": 630
  },

  "description": "SDF Clothing is a world-class, vertically integrated B2B apparel manufacturing factory serving global fashion brands in the USA, UK, and European Union. As a direct clothing manufacturer established in 1998, we offer OEM, ODM, and Private Label production with a low MOQ of 300 pieces. Our facilities include in-house yarn spinning, fabric knitting, dyeing, and high-capacity cut-and-sew lines. We hold 13 international certifications including GOTS and OEKO-TEX, ensuring ethical and sustainable production for the global market.",

  "additionalType": [
    "https://schema.org/TextileMill"
  ],

  "foundingDate": "1998-08-22",
  "inLanguage": "en",
  "numberOfLocations": 4,
  "numberOfEmployees": {
    "@type": "QuantitativeValue",
    "minValue": 500
  },

  "naics": [
    "313110",
    "313210",
    "313230",
    "313310",
    "315220",
    "315280",
    "315990",
    "493110"
  ],
  "isicV4": "1410",

  "taxID": "000792572",
  "identifier": [
    {
      "@type": "PropertyValue",
      "name": "RJSC Company Registration",
      "value": "C3457"
    },
    {
      "@type": "PropertyValue",
      "name": "TIN / VAT Number",
      "value": "000792572"
    },
    {
      "@type": "PropertyValue",
      "name": "BGMEA Membership Number",
      "value": "6762"
    }
  ],

  "founder": {
    "@type": "Person",
    "name": "Chowdhury Remon",
    "jobTitle": "Founder & CEO",
    "url": SITE_URL + "/about/",
    "sameAs": [
      "https://www.wikidata.org/wiki/Q139678426",
      "https://x.com/clothing_makers"
    ]
  },

  "address": {
    "@type": "PostalAddress",
    "name": "SDF Clothing — Head Office",
    "streetAddress": "House 125, Road 01, Baridhara DOHS",
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

  "location": [
    {
      "@type": "Place",
      "name": "SDF Clothing Head Office — Baridhara DOHS",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "House 125, Road 01, Baridhara DOHS",
        "addressLocality": "Dhaka",
        "addressRegion": "Dhaka Division",
        "postalCode": "1212",
        "addressCountry": "BD"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 23.7956,
        "longitude": 90.4203
      }
    },
    {
      "@type": "Place",
      "name": "SDF Clothing Main Factory — Narayanganj",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Narayanganj",
        "addressRegion": "Dhaka Division",
        "addressCountry": "BD"
      }
    },
    {
      "@type": "Place",
      "name": "SDF Clothing Export Factory — Chittagong CEPZ",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Chittagong Export Processing Zone",
        "addressRegion": "Chittagong Division",
        "addressCountry": "BD"
      }
    },
    {
      "@type": "Place",
      "name": "SDF Clothing Factory — Gazipur",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Gazipur",
        "addressRegion": "Dhaka Division",
        "addressCountry": "BD"
      }
    }
  ],

  "telephone": PHONE,
  "email": EMAIL,
  "currenciesAccepted": "USD, GBP, EUR, AUD, CAD",
  "paymentAccepted": "Bank Transfer, Letter of Credit, T/T",
  "priceRange": "$$",
  "slogan": "Low MOQ Clothing Manufacturing for Startup Fashion Brands",

  "contactPoint": [
    {
      "@type": "ContactPoint",
      "telephone": PHONE,
      "contactType": "sales",
      "areaServed": "Worldwide",
      "availableLanguage": ["English"]
    },
    {
      "@type": "ContactPoint",
      "url": WHATSAPP_URL,
      "contactType": "customer support",
      "areaServed": "Worldwide",
      "availableLanguage": ["English"]
    }
  ],

  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Saturday","Sunday"],
      "opens": "09:00",
      "closes": "18:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Friday"],
      "opens": "00:00",
      "closes": "00:00"
    }
  ],

  "areaServed": [
    { "@type": "Country", "name": "United States" },
    { "@type": "Country", "name": "United Kingdom" },
    { "@type": "Country", "name": "Australia" },
    { "@type": "Country", "name": "Canada" },
    { "@type": "AdministrativeArea", "name": "European Union" },
    { "@type": "Country", "name": "Germany" },
    { "@type": "Country", "name": "France" },
    { "@type": "Country", "name": "Netherlands" },
    { "@type": "Country", "name": "Sweden" },
    { "@type": "Country", "name": "Denmark" },
    { "@type": "Country", "name": "Norway" },
    { "@type": "Country", "name": "Japan" },
    { "@type": "Country", "name": "United Arab Emirates" },
    { "@type": "Country", "name": "New Zealand" }
  ],

  "memberOf": [
    {
      "@type": "Organization",
      "name": "Bangladesh Garment Manufacturers and Exporters Association",
      "alternateName": "BGMEA",
      "url": "https://www.bgmea.com.bd/",
      "identifier": "6762"
    }
  ],

  "certification": [
    {
      "@type": "Certification",
      "name": "GOTS — Global Organic Textile Standard",
      "issuedBy": { "@type": "Organization", "name": "Global Organic Textile Standard International Working Group" }
    },
    {
      "@type": "Certification",
      "name": "OEKO-TEX Standard 100",
      "issuedBy": { "@type": "Organization", "name": "OEKO-TEX Association" }
    },
    {
      "@type": "Certification",
      "name": "ISO 9001 Quality Management System",
      "issuedBy": { "@type": "Organization", "name": "International Organization for Standardization" }
    },
    {
      "@type": "Certification",
      "name": "ISO 14001 Environmental Management System",
      "issuedBy": { "@type": "Organization", "name": "International Organization for Standardization" }
    },
    {
      "@type": "Certification",
      "name": "BSCI — Business Social Compliance Initiative",
      "issuedBy": { "@type": "Organization", "name": "amfori" }
    },
    {
      "@type": "Certification",
      "name": "SEDEX SMETA Audit",
      "issuedBy": { "@type": "Organization", "name": "Supplier Ethical Data Exchange" }
    },
    {
      "@type": "Certification",
      "name": "GRS — Global Recycled Standard",
      "issuedBy": { "@type": "Organization", "name": "Control Union" }
    },
    {
      "@type": "Certification",
      "name": "OCS — Organic Content Standard",
      "issuedBy": { "@type": "Organization", "name": "Control Union" }
    },
    {
      "@type": "Certification",
      "name": "RCS — Recycled Claim Standard",
      "issuedBy": { "@type": "Organization", "name": "Control Union" }
    },
    {
      "@type": "Certification",
      "name": "C-TPAT — Customs-Trade Partnership Against Terrorism",
      "issuedBy": { "@type": "Organization", "name": "U.S. Customs and Border Protection" }
    },
    {
      "@type": "Certification",
      "name": "WRAP — Worldwide Responsible Accredited Production",
      "issuedBy": { "@type": "Organization", "name": "Worldwide Responsible Accredited Production" }
    },
    {
      "@type": "Certification",
      "name": "SA8000 Social Accountability",
      "issuedBy": { "@type": "Organization", "name": "Social Accountability International" }
    },
    {
      "@type": "Certification",
      "name": "BCI — Better Cotton Initiative",
      "issuedBy": { "@type": "Organization", "name": "Better Cotton" }
    }
  ],

  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "B2B Clothing Manufacturing Services",
    "itemListElement": [
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "OEM Clothing Manufacturing", "description": "Produce garments from your own designs and tech packs under your brand label. B2B only.", "url": SITE_URL + "/clothing-manufacturers" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "ODM Clothing Manufacturing", "description": "Choose from our existing designs and add your own branding. Minimum 300 pieces.", "url": SITE_URL + "/clothing-manufacturers" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Private Label Apparel Production", "description": "Launch your own fashion line with custom labels, tags, and packaging included.", "url": SITE_URL + "/white-label-manufacturer" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "CMT Garment Services", "description": "Send your own fabric — we cut, make, and trim to your specifications.", "url": SITE_URL + "/cut-and-sew-service" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Tech Pack Development", "description": "Full technical package development from sketch or reference to production-ready spec.", "url": SITE_URL + "/tech-pack-service" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Sustainable Organic Manufacturing", "description": "GOTS certified organic cotton and GRS certified recycled fabric production.", "url": SITE_URL + "/sustainability" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Full Package Production", "description": "End-to-end manufacturing from yarn spinning and fabric production to finished garment delivery — no outsourcing." } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Low MOQ Manufacturing", "description": "Starting from 300 pieces per style. All production in-house, zero outsourcing. Ideal for startup fashion brands." } }
    ]
  },

  "knowsAbout": [
    "Clothing Manufacturing",
    "Garment Manufacturing",
    "OEM Clothing Manufacturing",
    "ODM Clothing Manufacturing",
    "Private Label Apparel Production",
    "CMT Garment Services",
    "Full Package Production",
    "Low MOQ Clothing Manufacturing",
    "Sustainable Clothing Manufacturing",
    "GOTS Certified Organic Cotton Production",
    "Knitwear Manufacturing",
    "Woven Garment Manufacturing",
    "T-Shirt Manufacturing",
    "Hoodie Manufacturing",
    "Activewear Manufacturing",
    "Swimwear Manufacturing",
    "Denim Manufacturing",
    "Streetwear Manufacturing",
    "Kidswear Manufacturing",
    "Uniform Manufacturing",
    "Tech Pack Development",
    "Garment Sampling",
    "AQL Quality Inspection",
    "Pre-Shipment Inspection",
    "Screen Printing and Embroidery",
    "Garment Washing and Finishing",
    "FOB Export",
    "EU GSP Duty-Free Compliance",
    "UK DCTS Trade Compliance",
    "EU Digital Product Passport Compliance",
    "B2B Apparel Sourcing",
    "Supply Chain Transparency",
    "Circular Fashion Manufacturing"
  ],

  // NOTE: "award" array below intentionally lists certification short names as industry recognition signals.
  // These are not duplicates of the "certification" array — the certification array has full structured objects
  // with issuedBy data, while award lists the achievement labels for Google's award signal.
  "award": [
    "GOTS Certified Organic Textile Manufacturer",
    "OEKO-TEX Standard 100 Certified",
    "ISO 9001 Quality Management Certified",
    "ISO 14001 Environmental Management Certified",
    "BSCI Social Compliance Certified",
    "SEDEX SMETA Audited Supplier",
    "GRS Global Recycled Standard Certified",
    "OCS Organic Content Standard Certified",
    "RCS Recycled Claim Standard Certified",
    "C-TPAT Certified Importer",
    "WRAP Certified Production Facility",
    "SA8000 Social Accountability Certified",
    "BCI Better Cotton Certified"
  ],

  "subjectOf": [
    {
      "@type": "Article",
      "url": "https://www.openpr.com/news/4555811/clothing-manufacturers-face-new-us-tariff-threat-as-bangladesh",
      "name": "Clothing Manufacturers Face New US Tariff Threat As Bangladesh Hearings Loom In July"
    },
    {
      "@type": "Article",
      "url": "https://www.einpresswire.com/article/731723484/clothing-manufacturers-including-sdf-clothing-face-814-million-loss-amidst-bangladesh-unrest",
      "name": "Clothing Manufacturers Including SDF Clothing Face 814 Million Loss Amidst Bangladesh Unrest"
    },
    {
      "@type": "Article",
      "url": "https://www.openpr.com/news/4510478/bangladesh-apparel-manufacturers-sdf-clothing-introduce",
      "name": "Bangladesh Apparel Manufacturers SDF Clothing Introduce Sustainability Score Tool"
    },
    {
      "@type": "Article",
      "url": "https://www.openpr.com/news/3630452/sdf-clothing-launches-major-relief-effort-for-6-million-flood",
      "name": "SDF Clothing Launches Major Relief Effort for 6 Million Flood Victims in Bangladesh"
    },
    {
      "@type": "Article",
      "url": "https://www.openpr.com/news/4386872/chowdhury-remon-of-sdf-clothing-bangladesh-election-2026",
      "name": "Chowdhury Remon of SDF Clothing: Bangladesh Election 2026 Promises a Thriving Future for RMG Sector"
    },
    {
      "@type": "Article",
      "url": "https://www.prlog.org/12963609-sdf-clothing-announces-full-package-production-clothing-manufacturing-services.html",
      "name": "SDF Clothing Announces Full Package Production Clothing Manufacturing Services"
    },
    {
      "@type": "Article",
      "url": "https://www.salary.com/research/company/sdf-clothing-ltd-overview",
      "name": "SDF Clothing Ltd Company Overview"
    },
    {
      "@type": "Article",
      "url": "https://www.issuewire.com/how-to-start-a-fashion-business-with-a-clothing-manufacturer-1767218657179484",
      "name": "How to Start a Fashion Business with a Clothing Manufacturer"
    },
    {
      "@type": "Article",
      "url": "https://world.einnews.com/pr_news/630706300/clothing-manufacturer-sdf-reduces-minimum-order-quantity-to-300-pieces",
      "name": "Clothing Manufacturer SDF Reduces Minimum Order Quantity to 300 Pieces"
    },
    {
      "@type": "Article",
      "url": "https://medium.com/@stonedeadfashion/clothing-manufacturers-355ac3c57bf0",
      "name": "Clothing Manufacturers — SDF Clothing",
      "author": { "@id": "https://sdfltd.com/#founder" }
    }
  ],

  "audience": {
    "@type": "BusinessAudience",
    "name": "Fashion brands and clothing labels worldwide",
    "audienceType": "Fashion startups, established fashion brands, wholesalers, retailers, private label brands, buying houses"
  },

  "potentialAction": [
    {
      "@type": "ContactAction",
      "name": "Request Quote",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": SITE_URL + "/contact/",
        "actionPlatform": [
          "http://schema.org/DesktopWebPlatform",
          "http://schema.org/MobileWebPlatform"
        ]
      }
    },
    {
      "@type": "OrderAction",
      "name": "Place Manufacturing Order",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": SITE_URL + "/contact/",
        "actionPlatform": [
          "http://schema.org/DesktopWebPlatform",
          "http://schema.org/MobileWebPlatform"
        ]
      }
    }
  ],

  "sameAs": [
    // ── SOCIAL MEDIA PROFILES ─────────────────────────────────────────
    "https://www.instagram.com/clothing_manufacturerss",
    "https://www.facebook.com/ClothingManufacturers/",
    "https://x.com/clothing_makers",
    "https://www.linkedin.com/company/clothing-manufacturers",
    "https://www.pinterest.com/clothing1manufacturers/",
    "https://au.pinterest.com/sdfltdclothingnsw/",
    "https://clothing-manufacturers.tumblr.com/",
    "https://medium.com/@stonedeadfashion",
    "https://www.reddit.com/user/clothing-mmakers/",
    "https://www.slideshare.net/sdfashion1",
    "https://www.quora.com/profile/SDF-Clothing-1",

    // ── ENTITY VERIFICATION ───────────────────────────────────────────
    "https://www.wikidata.org/wiki/Q139678386",

    // ── B2B DIRECTORIES & REVIEW PLATFORMS ───────────────────────────
    "https://clutch.co/profile/sdf-clothing",
    "https://theorg.com/org/clothing-manufacturer-sdf",
    "https://brandfetch.com/sdfltd.com",
    "https://www.salary.com/research/company/sdf-clothing-ltd-salary",
    "https://biz.prlog.org/sdf-clothing/",

    // ── INDUSTRY DIRECTORIES ─────────────────────────────────────────
    "https://thetextilenetwork.com/company/sdf-clothing",
    "https://yourstory.com/companies/sdf-clothing",
    "https://siachen.com/sdfclothing/"
  ],

  "publishingPrinciples": SITE_URL + "/editorial-policy/",
  "actionableFeedbackPolicy": SITE_URL + "/contact/",
  "diversityPolicy": SITE_URL + "/sustainability/",
  "correctionsPolicy": SITE_URL + "/editorial-policy/",
  "ownershipFundingInfo": SITE_URL + "/about/",

  "makesOffer": [
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": "Low MOQ Clothing Manufacturing",
        "description": "Premium custom clothing manufacturing from 300 pieces per style. Direct factory B2B production for USA, UK, and EU markets.",
        "provider": { "@id": SITE_URL + "/#org" }
      },
      "eligibleQuantity": {
        "@type": "QuantitativeValue",
        "minValue": 300,
        "unitCode": "C62",
        "unitText": "pieces per style (MOQ)"
      },
      "eligibleCustomerType": "http://schema.org/Business",
      "areaServed": ["US", "GB", "EU"]
    },
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": "Sustainable Garments Manufacturing",
        "description": "GOTS and OEKO-TEX certified sustainable garment production using organic cotton and recycled materials.",
        "provider": { "@id": SITE_URL + "/#org" }
      },
      "eligibleCustomerType": "http://schema.org/Business",
      "areaServed": ["US", "GB", "EU"]
    },
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": "OEM/ODM Garment Manufacturing",
        "description": "Full-package OEM and ODM apparel production from design to export.",
        "provider": { "@id": SITE_URL + "/#org" }
      },
      "eligibleCustomerType": "http://schema.org/Business",
      "areaServed": ["US", "GB", "EU"]
    }
  ]
};

export const schemaPerson = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": SITE_URL + "/#founder",
  "name": "Chowdhury Remon",
  "jobTitle": "Founder & CEO",
  "worksFor": { "@id": SITE_URL + "/#org" },
  "url": SITE_URL + "/about/",
  "description": "Founder and CEO of SDF Clothing, Bangladeshi entrepreneur with 25+ years in garment manufacturing. Industrialist, philanthropist, and disability rights advocate.",
  "nationality": "Bangladeshi",
  "alumniOf": [
    {
      "@type": "EducationalOrganization",
      "name": "University of Dhaka",
      "url": "https://www.du.ac.bd/"
    },
    {
      "@type": "EducationalOrganization",
      "name": "Dhaka College",
      "url": "https://dhakacollege.edu.bd/"
    }
  ],
  "hasOccupation": {
    "@type": "Occupation",
    "name": "Clothing Manufacturer and Garment Industry Entrepreneur",
    "occupationLocation": { "@type": "Country", "name": "Bangladesh" },
    "skills": "Garment Manufacturing, Textile Sourcing, Apparel Export, Fashion Production, GOTS Certification, Low MOQ Production, Supply Chain Management, Compliance Management"
  },
  "knowsAbout": [
    "Garment Manufacturing",
    "Bangladesh RMG Industry",
    "Sustainable Fashion",
    "Low MOQ Production",
    "GOTS Certification",
    "Apparel Export",
    "Private Label Manufacturing",
    "OEM Manufacturing",
    "ODM Manufacturing",
    "CMT Services",
    "Tech Pack Development",
    "Fabric Sourcing",
    "Fashion Brand Development",
    "Quality Control",
    "Compliance Management",
    "International Shipping",
    "FOB Export",
    "Vertically Integrated Manufacturing",
    "Factory Social Compliance",
    "Disability Rights Advocacy",
    "Philanthropy"
  ],
  "knowsLanguage": ["English", "Bengali", "Hindi", "Urdu"],
  "memberOf": [
    {
      "@type": "Organization",
      "name": "Bangladesh Garment Manufacturers and Exporters Association",
      "alternateName": "BGMEA",
      "url": "https://www.bgmea.com.bd/"
    }
  ],
  "sameAs": [
    "https://chowdhury-remon.pages.dev",
    "https://www.wikidata.org/wiki/Q139678426",
    "https://en.wikiquote.org/wiki/Chowdhury_Remon",
    "https://x.com/clothing_makers"
  ]
};
