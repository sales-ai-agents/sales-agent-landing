export type PostCover = "five" | "econ" | "vs";

export interface BlogPost {
  readonly slug: string;
  readonly category: string;
  readonly readTime: string;
  readonly cover: PostCover;
  readonly title: string;
  readonly excerpt: string;
}

export const BLOG_BASE_PATH = "/blog";

export const BLOG_POSTS: readonly BlogPost[] = [
  {
    slug: "scenarios",
    category: "Гайди",
    readTime: "6 хв",
    cover: "five",
    title: "5 сценаріїв дзвінків, які варто віддати ШІ-агенту вже сьогодні",
    excerpt:
      "Підтвердження записів, нагадування, уточнення замовлень — розбираємо, які розмови агент веде без участі менеджера і як запустити їх за один день.",
  },
  {
    slug: "missed-calls",
    category: "Економіка",
    readTime: "5 хв",
    cover: "econ",
    title: "Скільки коштує пропущений дзвінок і як порахувати втрати бізнесу",
    excerpt:
      "Проста формула з чотирьох цифр, яка показує, скільки грошей щомісяця йде разом із дзвінками, на які ніхто не відповів.",
  },
  {
    slug: "agent-vs-admin",
    category: "Порівняння",
    readTime: "6 хв",
    cover: "vs",
    title: "ШІ-агент чи адміністратор: чесне порівняння для салону та клініки",
    excerpt:
      "Де людина незамінна, а де агент працює швидше, точніше і без вихідних. І чому найкраща схема — разом.",
  },
] as const;
