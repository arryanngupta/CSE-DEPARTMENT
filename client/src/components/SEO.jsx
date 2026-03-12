import { Helmet } from "react-helmet-async";

const SEO = ({
  title,
  description,
  keywords,
  canonical
}) => {
  return (
    <Helmet>
      <title>{title}</title>

      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}

      {canonical && <link rel="canonical" href={canonical} />}

      {/* Open Graph (for sharing) */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
    </Helmet>
  );
};

export default SEO;
