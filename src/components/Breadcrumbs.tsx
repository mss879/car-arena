import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";

// Simple breadcrumb generator based on path segments
// Injects JSON-LD BreadcrumbList for enhanced SERP rich snippets
const labelMap: Record<string,string> = {
  'cars-for-sale': 'Cars for Sale',
  'used-cars': 'Used Cars',
  'japanese-car-import': 'Japanese Car Import',
  'brand-new-cars': 'Brand New Cars',
  'services': 'Services',
  'testimonials': 'Testimonials',
  'about': 'About',
  'contact': 'Contact',
};

export const Breadcrumbs = () => {
  const { pathname } = useLocation();
  const segments = pathname.split('/').filter(Boolean);

  useEffect(() => {
    const base = 'https://cararenaceylon.com';
    const items = [{
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: base + '/',
    }];
    segments.forEach((seg, idx) => {
      const url = base + '/' + segments.slice(0, idx + 1).join('/');
      items.push({
        '@type': 'ListItem',
        position: idx + 2,
        name: labelMap[seg] || seg.replace(/-/g,' '),
        item: url,
      });
    });
    const data = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items };
    const id = 'dynamic-breadcrumbs';
    const existing = document.getElementById(id);
    if (existing) existing.remove();
    const s = document.createElement('script');
    s.id = id; s.type='application/ld+json'; s.text = JSON.stringify(data);
    document.head.appendChild(s);
    return () => { const ex = document.getElementById(id); if (ex) ex.remove(); };
  }, [segments.join('|')]);

  if (!segments.length) return null;
  let cumulative: string[] = [];
  return (
    <nav aria-label="Breadcrumb" className="mt-4 mb-6 text-sm text-white/60">
      <ol className="flex flex-wrap items-center gap-1">
        <li>
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <span className="px-1">/</span>
        </li>
        {segments.map((seg, idx) => {
          cumulative.push(seg);
          const path = '/' + cumulative.join('/');
          const label = labelMap[seg] || seg.replace(/-/g,' ');
          const isLast = idx === segments.length - 1;
          return (
            <li key={path} className="flex items-center">
              {isLast ? (
                <span className="text-white" aria-current="page">{label}</span>
              ) : (
                <>
                  <Link to={path} className="hover:text-white transition-colors">{label}</Link>
                  <span className="px-1">/</span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
