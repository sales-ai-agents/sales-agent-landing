import Link from "next/link";

import { LegalHeader } from "@/components/legal/legal-header";
import type { LegalBlock, LegalDocument, LegalInline } from "@/content/legal/types";

const isInternalHref = (href: string): boolean => href.startsWith("/");

const renderInline = (content: readonly LegalInline[]) =>
  content.map((part, index) => {
    if (typeof part === "string") return part;

    if (isInternalHref(part.href)) {
      return (
        <Link key={index} href={part.href} className="text-primary hover:underline">
          {part.label}
        </Link>
      );
    }

    return (
      <a key={index} href={part.href} className="text-primary hover:underline">
        {part.label}
      </a>
    );
  });

const renderBlock = (block: LegalBlock, index: number) => {
  switch (block.type) {
    case "paragraph":
      return (
        <p key={index} className="text-muted-foreground leading-relaxed">
          {renderInline(block.content)}
        </p>
      );
    case "list": {
      const className = "text-muted-foreground ml-5 flex flex-col gap-2 leading-relaxed";
      const items = block.items.map((item, itemIndex) => (
        <li key={itemIndex}>{renderInline(item)}</li>
      ));

      return block.ordered ? (
        <ol key={index} className={`${className} list-decimal`}>
          {items}
        </ol>
      ) : (
        <ul key={index} className={`${className} list-disc`}>
          {items}
        </ul>
      );
    }
    case "contacts":
      return (
        <dl key={index} className="grid gap-2 sm:grid-cols-[max-content_1fr] sm:gap-x-6">
          {block.rows.map((row) => (
            <div key={row.label} className="contents">
              <dt className="text-foreground font-medium">{row.label}</dt>
              <dd className="text-muted-foreground">{row.value}</dd>
            </div>
          ))}
        </dl>
      );
    case "table":
      return (
        <div key={index} className="overflow-x-auto">
          <table className="text-muted-foreground w-full text-sm">
            <thead>
              <tr className="border-border border-b">
                {block.head.map((cell) => (
                  <th
                    key={cell}
                    className="text-foreground py-2 pr-4 text-left font-semibold last:pr-0"
                  >
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-border border-b last:border-0">
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="py-2 pr-4 align-top last:pr-0">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    default:
      return null;
  }
};

const BACK_LABEL: Record<string, string> = {
  en: "Back",
};

const resolveLocale = (doc: LegalDocument, locale: string | undefined): LegalDocument => {
  if (!locale || !doc.translations?.[locale]) return doc;
  return { slug: doc.slug, ...doc.translations[locale], translations: doc.translations };
};

interface LegalDocumentViewProps {
  document: LegalDocument;
  locale?: string;
}

export function LegalDocumentView({ document, locale }: LegalDocumentViewProps) {
  const resolved = resolveLocale(document, locale);
  const backLabel = (locale && BACK_LABEL[locale]) ?? "Назад";

  return (
    <>
      <LegalHeader backLabel={backLabel} />
      <article className="mx-auto w-full max-w-3xl px-6 py-16 sm:py-20">
        <header className="mb-10">
          <h1 className="font-display text-3xl font-bold sm:text-4xl">{resolved.title}</h1>
          {resolved.updatedNote && (
            <p className="text-muted-foreground mt-3 text-sm">{resolved.updatedNote}</p>
          )}
          {resolved.intro && (
            <p className="text-muted-foreground mt-6 leading-relaxed">
              {renderInline(resolved.intro)}
            </p>
          )}
        </header>

        <div className="flex flex-col gap-10">
          {resolved.sections.map((sectionItem, sectionIndex) => (
            <section key={sectionIndex} className="flex flex-col gap-4">
              {sectionItem.heading && (
                <h2 className="text-foreground text-xl font-semibold">{sectionItem.heading}</h2>
              )}
              {sectionItem.blocks.map(renderBlock)}
            </section>
          ))}
        </div>
      </article>
    </>
  );
}
