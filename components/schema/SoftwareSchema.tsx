export default function SoftwareSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Jyoti - AI Astrology Chatbot",
    "applicationCategory": "LifestyleApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "INR"
    },
    "creator": {
      "@type": "Organization",
      "name": "Zodii",
      "founder": "Nitish Anand"
    },
    "description": "AI-powered Vedic astrology chatbot providing personalized astrological guidance, birth chart analysis, and life coaching."
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
