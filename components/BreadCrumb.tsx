import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadCrumbProps {
  items: BreadcrumbItem[];
}

export default function BreadCrumb({ items }: BreadCrumbProps) {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: `https://cheapflightsfrom.us${item.href}` } : {}),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-4">
        <ol className="flex items-center gap-1 flex-wrap">
          {items.map((item, index) => (
            <li key={index} className="flex items-center gap-1">
              {index > 0 && <span className="text-gray-300">/</span>}
              {item.href ? (
                <Link href={item.href} className="hover:text-brand-primary transition-colors">
                  {item.label}
                </Link>
              ) : (
                <span className="text-gray-700 font-medium">{item.label}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
