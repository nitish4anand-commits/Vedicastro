interface Props {
  title: string;
  description: string;
  author: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
}

export default function ArticleSchema({
  title,
  description,
  author,
  datePublished,
  dateModified,
  image
}: Props) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description,
    "author": {
      "@type": "Person",
      "name": author || "Nitish Anand"
    },
    "publisher": {
      "@type": "Organization",
      "name": "VedicAstro",
      "logo": {
        "@type": "ImageObject",
        "url": "https://vedicastro.com/logo.png"
      }
    },
    "datePublished": datePublished,
    "dateModified": dateModified || datePublished,
    ...(image && {
      "image": {
        "@type": "ImageObject",
        "url": image
      }
    })
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
