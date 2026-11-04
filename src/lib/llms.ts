import { BLOG_BASE_PATH, BLOG_POSTS, getPostPath } from "@/content/blog/posts";
import type { BlogPost, PostBlock } from "@/content/blog/types";
import { FAQ_ITEMS, PRICING_PLANS } from "@/components/landing/content";
import { LEGAL_PAGE_LIST } from "@/lib/constants";
import { BRAND_ALTERNATE_NAMES, SITE_CONTACT, SITE_NAME, SITE_URL } from "@/lib/site";

const SUMMARY_UK =
  "Calls4U — голосовий ШІ-агент, який телефонує клієнтам за бізнес: підтверджує записи, нагадує про візити, уточнює замовлення, кваліфікує ліди та передає результат у CRM. Запуск за 1 день, без програмістів.";
const SUMMARY_RU =
  "Calls4U — голосовой ИИ-агент, который звонит клиентам вместо менеджера: подтверждает записи, напоминает о визитах, уточняет заказы, квалифицирует лиды и передаёт результат в CRM. Запуск за 1 день, без программистов.";
const SUMMARY_EN =
  "Calls4U is a voice AI agent that phones your customers for you: it confirms appointments, sends visit reminders, clarifies orders, qualifies leads and writes the outcome to your CRM. Launch in one day, no developers needed.";

const link = (title: string, path: string, note: string): string =>
  `- [${title}](${SITE_URL}${path}): ${note}`;

const blockToMarkdown = (block: PostBlock): string => {
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
      return block.lines
        .map((line) => `- ${line.speaker === "agent" ? "ШІ-агент" : "Клієнт"}: ${line.text}`)
        .join("\n");
  }
};

const postToMarkdown = (post: BlogPost): string =>
  [
    `## ${post.title}`,
    `URL: ${SITE_URL}${getPostPath(post)}`,
    `Категорія: ${post.category}. Опубліковано: ${post.publishedAt}. Оновлено: ${post.updatedAt}.`,
    ...post.blocks.map(blockToMarkdown),
  ].join("\n\n");

export const buildLlmsTxt = (): string =>
  [
    `# ${SITE_NAME}`,
    `> ${SUMMARY_EN}`,
    SUMMARY_UK,
    SUMMARY_RU,
    `Також відомий як / Also known as: ${BRAND_ALTERNATE_NAMES.join(", ")}.`,
    "## Pages",
    link("Головна", "/", "продукт, демо, тарифи, FAQ"),
    link("Блог", BLOG_BASE_PATH, "гайди, економіка, інструкції"),
    link("Sitemap", "/sitemap.xml", "усі сторінки сайту"),
    "## Blog",
    ...BLOG_POSTS.map((post) => link(post.title, getPostPath(post), post.excerpt)),
    "## Legal",
    ...LEGAL_PAGE_LIST.map((page) => link(page.label, page.href, "документ")),
    "## Optional",
    link("Повний текст для LLM", "/llms-full.txt", "FAQ, тарифи та статті блогу"),
    "## Contact",
    `- Email: ${SITE_CONTACT.email}`,
    `- Phone: ${SITE_CONTACT.phone}`,
    `- Telegram: ${SITE_CONTACT.telegram}`,
  ].join("\n\n");

export const buildLlmsFullTxt = (): string =>
  [
    `# ${SITE_NAME} — повний опис`,
    `> ${SUMMARY_UK}`,
    SUMMARY_RU,
    SUMMARY_EN,
    "## Тарифи",
    ...PRICING_PLANS.map(
      (plan) =>
        `### ${plan.name} — ${plan.price}/міс\n${plan.subtitle}\n${plan.features.map((feature) => `- ${feature}`).join("\n")}`
    ),
    "## Часті питання",
    ...FAQ_ITEMS.map((item) => `### ${item.question}\n${item.answer}`),
    "# Блог",
    ...BLOG_POSTS.map(postToMarkdown),
  ].join("\n\n");
