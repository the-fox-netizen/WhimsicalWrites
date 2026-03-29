import type { Metadata } from 'next';

const siteConfig = {
  name: 'Whimsicalwrites',
  description: 'An editorial exploration of modern design, architecture thoughts, and whimsical engineering moments.',
  url: 'https://whimsicalwrites.com',
};

export function constructMetadata({
  title = siteConfig.name,
  description = siteConfig.description,
  image = `${siteConfig.url}/og.png`,
  noIndex = false,
}: {
  title?: string;
  description?: string;
  image?: string;
  noIndex?: boolean;
} = {}): Metadata {
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || siteConfig.url),
    title: {
      default: title,
      template: `%s | ${siteConfig.name}`,
    },
    description,
    openGraph: {
      title,
      description,
      url: siteConfig.url,
      siteName: siteConfig.name,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
      creator: '@whimsicalwrites'
    },
    alternates: {
      types: {
        'application/rss+xml': [{ url: '/feed.xml', title: 'WhimsicalWrites' }]
      }
    },
    // Adding to other as requested by the user, though alternates is the proper way
    other: {
      'rss-feed': '/feed.xml'
    },
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}
