const SITE_URL = import.meta.env.VITE_SITE_URL?.trim();

function upsertMetaAttribute(selector: string, attribute: 'content' | 'href', value: string, tagName: 'meta' | 'link') {
  let element = document.querySelector(selector) as HTMLMetaElement | HTMLLinkElement | null;

  if (!element) {
    element = document.createElement(tagName) as HTMLMetaElement | HTMLLinkElement;

    if (tagName === 'meta') {
      const propertyMatch = selector.match(/property="([^"]+)"/);
      const nameMatch = selector.match(/name="([^"]+)"/);

      if (propertyMatch) {
        element.setAttribute('property', propertyMatch[1]);
      }

      if (nameMatch) {
        element.setAttribute('name', nameMatch[1]);
      }
    }

    if (tagName === 'link') {
      const relMatch = selector.match(/rel="([^"]+)"/);

      if (relMatch) {
        element.setAttribute('rel', relMatch[1]);
      }
    }

    document.head.appendChild(element);
  }

  element.setAttribute(attribute, value);
}

export function applyRuntimeSeo() {
  if (typeof window === 'undefined' || !SITE_URL) {
    return;
  }

  const normalizedUrl = SITE_URL.replace(/\/$/, '');
  const canonicalUrl = new URL(window.location.pathname || '/', `${normalizedUrl}/`).toString();
  const ogImageUrl = new URL('/og-cover.png', `${normalizedUrl}/`).toString();

  upsertMetaAttribute('link[rel="canonical"]', 'href', canonicalUrl, 'link');
  upsertMetaAttribute('meta[property="og:url"]', 'content', canonicalUrl, 'meta');
  upsertMetaAttribute('meta[property="og:image"]', 'content', ogImageUrl, 'meta');
  upsertMetaAttribute('meta[name="twitter:image"]', 'content', ogImageUrl, 'meta');
}
