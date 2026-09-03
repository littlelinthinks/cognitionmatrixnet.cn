import { Helmet, HelmetProvider } from 'react-helmet-async';

interface PageMetaProps {
  title: string;
  description: string;
  keywords?: string[] | string;
  noindex?: boolean;
}

export const PageMeta: React.FC<PageMetaProps> = (props) => {
  const {
    title,
    description,
    keywords,
    noindex = false,
  } = props;
  const keywordsContent = Array.isArray(keywords)
    ? keywords.join(', ')
    : keywords;

  return (
    <Helmet defer={false}>
      <title>{title}</title>
      <meta name='description' content={description} />
      {!!keywords?.length && <meta name='keywords' content={keywordsContent} />}
      <meta
        name='robots'
        content={noindex ? 'noindex, nofollow' : 'index, follow'}
      />
      <meta property='og:title' content={title} />
      <meta property='og:description' content={description} />
    </Helmet>
  );
};

export const HelmetProviderWrapper: React.FC<React.PropsWithChildren> = (
  props,
) => {
  return <HelmetProvider>{props.children}</HelmetProvider>;
};
