import { getLandingCopy } from "@/components/landing/copy";
import { getPosts } from "@/content/blog/posts";
import type { BlogPost, PostBlock } from "@/content/blog/types";
import { LEGAL_PAGE_LIST } from "@/lib/constants";
import { LOCALES, type Locale } from "@/lib/i18n/config";
import { blogPath, homePath, localizedPath, postPath, postUrl } from "@/lib/i18n/paths";
import { BRAND_ALTERNATE_NAMES, SITE_CONTACT, SITE_NAME, SITE_SOCIAL, SITE_URL } from "@/lib/site";

const FULL_TEXT_PATH = "/llms-full.txt";

const link = (title: string, path: string, note: string): string =>
  `- [${title}](${SITE_URL}${path}): ${note}`;

const blockToMarkdown = (block: PostBlock, locale: Locale): string => {
  const { speakers } = getLandingCopy(locale).client;

  switch (block.type) {
    case "lead":
    case "paragraph":
    case "note":
      return block.text;
    case "heading":
      return `### ${block.text}`;
    case "list":
      return block.items.map((item) => `- ${item}`).join("\n");
    case "quote":
      return `> ${block.text}`;
    case "formula":
      return `\`${block.text}\``;
    case "dialog":
      return block.lines.map((line) => `- ${speakers[line.speaker]}: ${line.text}`).join("\n");
  }
};

const postToMarkdown = (post: BlogPost, locale: Locale): string => {
  const { llms } = getLandingCopy(locale);

  return [
    `## ${post.title}`,
    `URL: ${postUrl(locale, post.slug)}`,
    `${llms.category}: ${post.category}. ${llms.published}: ${post.publishedAt}. ${llms.updated}: ${post.updatedAt}.`,
    ...post.blocks.map((block) => blockToMarkdown(block, locale)),
  ].join("\n\n");
};

const fullTextPath = (locale: Locale): string => localizedPath(locale, FULL_TEXT_PATH);

const buildLocaleSections = (locale: Locale): string[] => {
  const { llms, client, blog } = getLandingCopy(locale);

  return [
    `### ${llms.languageName}`,
    link(SITE_NAME, homePath(locale), [llms.pricing, llms.faq].join(", ")),
    link(client.nav.links.blog, blogPath(locale), blog.index.description),
    ...getPosts(locale).map((post) => link(post.title, postPath(locale, post.slug), post.excerpt)),
    link(llms.fullTitle, fullTextPath(locale), [llms.pricing, llms.faq, llms.blog].join(", ")),
  ];
};

export const buildLlmsTxt = (): string => {
  const english = getLandingCopy("en").llms.summary;
  const others = LOCALES.filter((locale) => locale !== "en").map(
    (locale) => getLandingCopy(locale).llms.summary
  );

  return [
    `# ${SITE_NAME}`,
    `> ${english}`,
    ...others,
    `Also known as: ${BRAND_ALTERNATE_NAMES.join(", ")}.`,
    "## Pages",
    link("Home", "/", "product, demo, pricing, FAQ"),
    link("Sitemap", "/sitemap.xml", "all pages"),
    "## Blog and full text by language",
    ...LOCALES.flatMap(buildLocaleSections),
    "## Legal",
    ...LEGAL_PAGE_LIST.map((page) => link(page.label, page.href, "document (Ukrainian)")),
    "## Contact",
    `- Email: ${SITE_CONTACT.email}`,
    `- Phone: ${SITE_CONTACT.phone}`,
    `- Telegram: ${SITE_CONTACT.telegram}`,
    `- LinkedIn: ${SITE_SOCIAL.linkedin}`,
    `- Instagram: ${SITE_SOCIAL.instagram}`,
  ].join("\n\n");
};

export const buildLlmsFullTxt = (locale: Locale): string => {
  const { llms, pricing, faq } = getLandingCopy(locale);

  return [
    `# ${llms.fullTitle}`,
    `> ${llms.summary}`,
    `## ${llms.pricing}`,
    ...pricing.plans.map(
      (plan) =>
        `### ${plan.name} — ${plan.price} ${plan.period}\n${plan.subtitle}\n${plan.features.map((feature) => `- ${feature}`).join("\n")}`
    ),
    `## ${llms.faq}`,
    ...faq.items.map((item) => `### ${item.question}\n${item.answer}`),
    `# ${llms.blog}`,
    ...getPosts(locale).map((post) => postToMarkdown(post, locale)),
  ].join("\n\n");
};
