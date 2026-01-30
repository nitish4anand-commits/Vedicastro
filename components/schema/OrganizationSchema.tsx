export default function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "VedicAstro",
    "url": "https://vedicastro.com",
    "logo": "https://vedicastro.com/logo.png",
    "description": "Professional Vedic astrology services including birth chart generation, Kundli matching, daily horoscopes, and personalized astrological guidance.",
    "founder": {
      "@type": "Person",
      "name": "Nitish Anand",
      "jobTitle": "Founder"
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Bengaluru",
      "addressRegion": "Karnataka",
      "addressCountry": "IN"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "contact@vedicastro.com",
      "contactType": "Customer Service"
    },
    "sameAs": [
      "https://twitter.com/vedicastro",
      "https://facebook.com/vedicastro",
      "https://instagram.com/vedicastro"
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
