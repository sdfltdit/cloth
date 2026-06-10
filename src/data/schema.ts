export const PHONE = "+8801911733226";
export const WHATSAPP_NUMBER = "8801911733226";
export const EMAIL = "contact@sdfltd.com";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

export const SITE_URL = "https://sdfltd.com";

export const schemaOrganization = {
  "@context": "https://schema.org",
  "@type": ["Organization", "LocalBusiness", "ManufacturingBusiness"],
  "@id": SITE_URL + "/#organization",
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

  "description": "SDF Clothing is a vertically integrated B2B clothing manufacturer based in Dhaka, Bangladesh. Founded in 1998 by Chowdhury Remon, we are a direct factory — not an agent, trader, or buying house. We operate yarn spinning, fabric knitting, weaving, dyeing, cutting, sewing, finishing, and warehousing under one ownership. We serve startup and established fashion brands worldwide with low MOQ from 300 pieces, GOTS certification, and 13 international quality certifications. B2B manufacturing only — no retail, no stock garments. Exporting to USA, EU, UK, Canada, Australia, Japan, and UAE.",

  "additionalType": [
    "https://schema.org/TextileMill"
  ],

  "foundingDate": "1998",
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
      "https://www.linkedin.com/in/hubfacebok",
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
      "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Sunday"],
      "opens": "09:00",
      "closes": "18:00"
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
    "B2B Clothing Manufacturing",
    "OEM Clothing Manufacturing",
    "ODM Clothing Manufacturing",
    "Private Label Apparel Production",
    "CMT Garment Services",
    "Full Package Production",
    "Bespoke Apparel Development",
    "White Label Manufacturing",
    "Contract Manufacturing",
    "Co-Design Development",
    "Wholesale Garment Supply",
    "Drop Shipping Manufacturing",
    "Startup Brand Manufacturing",
    "Capsule Collection Manufacturing",
    "Seasonal Collection Development",
    "Rush Order Production",
    "Repeat Order Management",
    "Confidential NDA Manufacturing",
    "Low MOQ Fashion Manufacturing",
    "Small Batch Apparel Manufacturing",
    "Large Scale Bulk Production",
    "Vertically Integrated Manufacturing",
    "Factory Direct Apparel Supply",
    "Yarn Spinning",
    "Yarn Procurement",
    "Fabric Knitting",
    "Woven Fabric Manufacturing",
    "Fabric Sourcing",
    "Woven Fabric Sourcing",
    "Knit Fabric Sourcing",
    "Organic Cotton Sourcing",
    "Recycled Fabric Sourcing",
    "Sustainable Fabric Development",
    "Deadstock Fabric Utilization",
    "Interlining Sourcing",
    "Lining Fabric Sourcing",
    "Fabric Inspection",
    "Fabric Consumption Calculation",
    "Sewing Thread Management",
    "Thread Consumption Calculation",
    "Tech Pack Development",
    "CAD Pattern Design",
    "Pattern Making",
    "Grading",
    "Size Grading Service",
    "Marker Making",
    "Bill of Materials Development",
    "Costing Sheet Preparation",
    "Color Matching Service",
    "Pantone Matching",
    "Fit Model Service",
    "Trend Research and Development",
    "3D Garment Design",
    "Virtual Sampling",
    "Digital Showroom",
    "Garment Sampling",
    "Pre-Production Sample Development",
    "Proto Sample Development",
    "Fit Sample Development",
    "Salesman Sample Development",
    "Counter Sample Development",
    "Approval Sample Development",
    "Pre-Production Meeting",
    "Woven Garment Manufacturing",
    "Knit Garment Manufacturing",
    "Cutting",
    "Sewing and Assembly",
    "Bulk Production Management",
    "Production Scheduling",
    "Capacity Planning",
    "Production Planning",
    "Industrial Engineering",
    "Garment Finishing",
    "Garment Washing",
    "Garment Dyeing",
    "Pigment Dyeing",
    "Reactive Dyeing",
    "Enzyme Wash",
    "Stone Wash",
    "Acid Wash",
    "Garment Overdye",
    "Vintage Wash",
    "Screen Printing",
    "Digital Textile Printing",
    "DTG Printing",
    "DTF Printing",
    "Sublimation Printing",
    "Heat Transfer Printing",
    "Puff Printing",
    "Foil Printing",
    "Discharge Printing",
    "Reflective Printing",
    "Photochromic Printing",
    "Embroidery Services",
    "Flat Embroidery",
    "3D Puff Embroidery",
    "Chenille Embroidery",
    "Applique Work",
    "Rhinestone Application",
    "Laser Cutting",
    "Woven Label Production",
    "Printed Label Production",
    "Hang Tag Production",
    "Brand Packaging",
    "Quality Control",
    "AQL Quality Inspection",
    "In-Line Quality Inspection",
    "End-Line Quality Inspection",
    "Pre-Shipment Inspection",
    "Third Party Inspection",
    "SGS Inspection",
    "Bureau Veritas Inspection",
    "Intertek Inspection",
    "Fabric Testing",
    "GSM Testing",
    "Colorfastness Testing",
    "Shrinkage Testing",
    "Tensile Strength Testing",
    "Pilling Resistance Testing",
    "Testing Laboratory Services",
    "Packaging",
    "Poly Bag Packaging",
    "Retail Packaging",
    "Warehousing",
    "Bonded Warehouse Operations",
    "International Shipping",
    "Sea Freight Export",
    "Air Freight Export",
    "FOB Chittagong Shipment",
    "FOB Dhaka Shipment",
    "CIF Shipping",
    "EXW Pricing",
    "DDP Delivery",
    "Incoterms Compliance",
    "Freight Forwarding",
    "Customs Clearance",
    "FOB Export Documentation",
    "Export Documentation",
    "Letter of Credit Processing",
    "Commercial Invoice Preparation",
    "Packing List Preparation",
    "Certificate of Origin",
    "GSP Certificate",
    "HS Code Classification",
    "Duty Drawback Processing",
    "BGMEA Membership",
    "Merchandising",
    "Price Negotiation Support",
    "NDA and IP Protection",
    "GOTS Certified Production",
    "GOTS Certification Compliance",
    "OEKO-TEX Certification",
    "ISO 9001 Quality Management",
    "BSCI Social Compliance Audit",
    "SEDEX SMETA Audit",
    "GRS Certification",
    "OCS Certification",
    "RCS Certification",
    "C-TPAT Certification",
    "WRAP Certification",
    "SA8000 Social Accountability",
    "ISO 14001 Environmental Management",
    "BCI Better Cotton",
    "Higg Index Assessment",
    "Factory Social Audit",
    "Ethical Trading Initiative",
    "Compliance Management",
    "Restricted Substances List Management",
    "Chemical Compliance REACH",
    "Sustainable Clothing Manufacturing",
    "Carbon Footprint Calculation",
    "Environmental Impact Assessment",
    "EU Ecolabel Compliance",
    "LEED Certified Factory",
    "Circular Fashion Manufacturing",
    "Zero Waste Production",
    "Renewable Energy Manufacturing",
    "Water Treatment and Recycling",
    "Ethical Sourcing",
    "Fair Trade Manufacturing",
    "Living Wage Compliance",
    "T-Shirt Manufacturing",
    "Polo Shirt Manufacturing",
    "Hoodie Manufacturing",
    "Sweatshirt Manufacturing",
    "Jogger Manufacturing",
    "Shorts Manufacturing",
    "Denim Manufacturing",
    "Denim Jeans Manufacturing",
    "Jacket Manufacturing",
    "Dress Manufacturing",
    "Blouse Manufacturing",
    "Leggings Manufacturing",
    "Swimwear Manufacturing",
    "Activewear Manufacturing",
    "Sportswear Manufacturing",
    "Streetwear Manufacturing",
    "Workwear Manufacturing",
    "Uniform Manufacturing",
    "Resort Wear Manufacturing",
    "Nightwear Manufacturing",
    "Underwear Manufacturing",
    "Kids Clothing Manufacturing",
    "Womenswear Manufacturing",
    "Menswear Manufacturing",
    "Unisex Apparel Manufacturing",
    "Plus Size Clothing Manufacturing",
    "Dress Shirt Manufacturing",
    "Premium Basics Manufacturing",
    "Pet Wear Manufacturing",
    "Tote Bag Manufacturing",
    "Cap Manufacturing",
    "Bucket Hat Manufacturing",
    "Beanie Manufacturing",
    "Backpack Manufacturing",
    "Towel Manufacturing",
    "Blanket Manufacturing",
    "Cushion Cover Manufacturing",
    "Apron Manufacturing",
    "PLM Software Integration",
    "ERP Production Management",
    "Barcode and RFID Tagging",
    "QR Code Labeling",
    "Digital Product Passport",
    "Supply Chain Transparency",
    "Blockchain Traceability",
    "Real Time Production Tracking",
    "AI Quality Control",
    "Automated Cutting Technology",
    "Industry 4.0 Manufacturing",
    "EU Market Compliance",
    "UK Market Compliance",
    "US Market Compliance",
    "Australian Market Compliance",
    "Canadian Market Compliance",
    "Japanese Market Compliance",
    "UAE Market Compliance",
    "CPSC Children Safety Compliance",
    "REACH Chemical Regulation",
    "EU Digital Product Passport Compliance",
    "Carbon Border Adjustment Mechanism",
    "Modern Slavery Act Compliance",
    "California Proposition 65 Compliance",
    "Fashion Brand Sourcing",
    "Apparel Startup Support",
    "Fashion Buyer Relations",
    "Global Apparel Export",
    "Bangladesh Garment Export",
    "RMG Sector Manufacturing",
    "Narayanganj Garment Factory",
    "Chittagong EPZ Factory",
    "Gazipur Garment Factory",
    "Dhaka Clothing Manufacturer"
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
      "url": "https://www.einpresswire.com/article/731723484/clothing-manufacturers-including-sdf-clothing-face-814-million-loss-amidst-bangladesh-unrest",
      "name": "Clothing Manufacturers Including SDF Clothing Face 814 Million Loss Amidst Bangladesh Unrest"
    },
    {
      "@type": "Article",
      "url": "https://www.openpr.com/news/4510478/bangladesh-apparel-manufacturers-sdf-clothing-introduce",
      "name": "Bangladesh Apparel Manufacturers SDF Clothing Introduce"
    },
    {
      "@type": "Article",
      "url": "https://www.salary.com/research/company/sdf-clothing-ltd-overview",
      "name": "SDF Clothing Ltd Company Overview"
    }
  ],

  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.6",
    "reviewCount": "200",
    "bestRating": "5",
    "worstRating": "1"
  },

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
    "https://www.linkedin.com/company/clothing-manufacturers",
    "https://www.facebook.com/ClothingManufacturers/",
    "https://x.com/clothing_makers",
    "https://www.wikidata.org/wiki/Q139678386",
    "https://au.pinterest.com/sdfltdclothingnsw/",
    "https://www.reddit.com/user/clothing-mmakers/",
    "https://www.slideshare.net/sdfashion1",
    "https://www.quora.com/profile/SDF-Clothing-1"
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
        "description": "Custom clothing manufacturing from 300 pieces per style. B2B only — for fashion brands, not individual buyers.",
        "provider": { "@id": SITE_URL + "/#organization" }
      },
      "priceSpecification": {
        "@type": "PriceSpecification",
        "priceCurrency": "USD",
        "price": "300",
        "description": "Starting MOQ — 300 pieces per style"
      },
      "eligibleCustomerType": "http://schema.org/Business"
    },
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": "GOTS Certified Organic Cotton Manufacturing",
        "description": "Organic cotton garment production with GOTS chain-of-custody certification for eco-conscious fashion brands.",
        "provider": { "@id": SITE_URL + "/#organization" }
      },
      "eligibleCustomerType": "http://schema.org/Business"
    }
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
  "description": "Founder and CEO of SDF Clothing, Bangladeshi entrepreneur with 25+ years in garment manufacturing. Award-winning industrialist, philanthropist, and disability rights advocate. Best taxpayer award recipient and Ekushey Padak nominee.",
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
  "award": [
    "Sustainability and Environmental Award",
    "Best Taxpayer Award",
    "Social Compliance Award",
    "Ekushey Padak",
    "National Education Week Award"
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
    "https://www.linkedin.com/in/hubfacebok",
    "https://chowdhury-remon.pages.dev",
    "https://www.wikidata.org/wiki/Q139678426",
    "https://en.wikiquote.org/wiki/Chowdhury_Remon",
    "https://x.com/clothing_makers"
  ]
};
