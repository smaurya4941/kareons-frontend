/**
 * Renders one or more JSON-LD schema objects (see lib/seo/schema.ts) as
 * <script type="application/ld+json"> tags. JSON.stringify output is safe to
 * inline here because it never contains unescaped "</script>" from our own
 * schema builders, but we still escape "<" defensively since schema values
 * can include admin-authored free text (product names, review bodies).
 */
export function JsonLd({ schema }: { schema: object | object[] }) {
  const schemas = Array.isArray(schema) ? schema : [schema];

  return (
    <>
      {schemas.map((item, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(item).replace(/</g, '\\u003c'),
          }}
        />
      ))}
    </>
  );
}
