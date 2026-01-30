interface Props {
  serviceName: string;
  description: string;
  serviceType: string;
}

export default function ServiceSchema({ serviceName, description, serviceType }: Props) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": serviceName,
    "description": description,
    "serviceType": serviceType,
    "provider": {
      "@type": "Organization",
      "name": "Zodii",
      "founder": "Nitish Anand"
    },
    "areaServed": {
      "@type": "Place",
      "name": "Worldwide"
    },
    "category": "Astrology Services"
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
