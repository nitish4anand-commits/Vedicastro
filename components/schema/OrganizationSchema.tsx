export default function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Zodii",
    "url": "https://zodii.in",
    "logo": "https://zodii.in/logo.png",
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
      "email": "contact@zodii.in",
      "contactType": "Customer Service"
    },
    "sameAs": [
      "https://twitter.com/Zodii",
      "https://facebook.com/Zodii",
      "https://instagram.com/Zodii"
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
