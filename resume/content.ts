// The two résumé PDFs linked from the site, written as data. scripts/resume.ts
// prints them to public/assets. Job titles, dates and facts are shared; the
// headline, summary, skills and some bullets differ between the two versions.
// Text marked **like this** is set in bold.

export interface Feature {
  name: string;
  tag: string;
  stack: string;
  bullets: string[];
}

export interface Role {
  title: string;
  /** Shown in muted type after the title, e.g. "(Part-time)". */
  note?: string;
  company: string;
  place: string;
  dates: string;
  current?: boolean;
  /** A highlighted project, shown above the role's other bullets. */
  feature?: Feature;
  bullets: string[];
}

export interface Resume {
  /** Output path under public/, as linked from content.json. */
  file: string;
  headline: string;
  summary: string;
  skills: [label: string, value: string][];
  experience: Role[];
}

export const contact = {
  name: 'Shehab Mohsen',
  location: 'Cairo, Egypt (UTC+2)',
  email: { label: 'shehabmohsen1995@gmail.com', href: 'mailto:shehabmohsen1995@gmail.com' },
  phone: { label: '+20 100 125 1407', href: 'tel:+201001251407' },
  portfolio: { label: 'shehab20089.github.io', href: 'https://shehab20089.github.io/' },
  github: { label: 'github.com/shehab20089', href: 'https://github.com/shehab20089' },
  linkedin: {
    label: 'linkedin.com/in/shehab-mohsen-6ba984168',
    href: 'https://www.linkedin.com/in/shehab-mohsen-6ba984168/',
  },
};

export const education: [school: string, detail: string, year: string][] = [
  ['Information Technology Institute (ITI)', 'Diploma in Systems Development · Egypt', '2019'],
  ['Pyramids Higher Institute', 'B.S. in Communication & Electronics Engineering · Egypt', '2018'],
];

const aiTools = 'Claude, Codex, OpenCode, Cursor, GitHub Copilot, ChatGPT, Windsurf';

// The current role keeps six items, strongest first: leadership, ownership, impact.
const bitbang = {
  gopay:
    'Owned the **GoPay** frontend, a SADAD-integrated B2B billing platform: refactored its legacy, hard-to-scale codebase into a feature-based architecture, set the standards the team builds on, and revamped the Biller dashboard.',
  amplifidor:
    'Led the **Amplifidor** frontend and two engineers — architecture, task split, and pixel-perfect reviews — and built its profiles, audience insights, wallet, and Arabic RTL; the team out-delivered the mobile and backend teams.',
  shamel:
    'Rebuilt the **Shamel360** warehouse portal from scratch, leading three developers: a feature-based architecture in a monorepo with a shared UI package, virtualized tables, collapsible column groups, and a Jira-style board.',
  uiLibrary:
    'Built a shadcn-inspired shared UI library with a CLI used across BitBang projects, and delivered touch-first tablet interfaces for the Kun admin portal with Persona and Moyasar integrations',
};

const walaplus: Role = {
  title: 'Senior Frontend Developer',
  company: 'Walaplus',
  place: 'Remote',
  dates: 'Mar 2023 – Mar 2024',
  bullets: [
    "Sole frontend developer: modernized every product's frontend onto a current stack — including rebuilding the legacy Blade PHP client portal as a modern SPA — and worked on almost all of the company's products.",
    'Built retailer- and partner-facing portals (offers, vouchers, WalaOne operations) and translated Figma design-system foundations into reusable React and Vue components.',
    'Dockerized frontend projects, defined the frontend stack for new products, and supported hiring through technical interviews.',
  ],
};

const fatura = (bullets: string[]): Role => ({
  title: 'Frontend Developer',
  company: 'Fatura LLC',
  place: 'Cairo',
  dates: 'Jun 2020 – Mar 2023',
  bullets,
});

const earlier: Role[] = [
  {
    title: 'Frontend Developer',
    note: '(Part-time)',
    company: 'Scandiweb',
    place: 'Remote',
    dates: 'Feb 2022 – Nov 2022',
    bullets: [
      'Owned most of the frontend and CMS styling for Magento e-commerce clients — the Møller Auto marketplace (VW & Audi) and the Printerbase storefront.',
    ],
  },
  {
    title: 'Frontend Developer',
    company: 'Andalusia Group',
    place: 'Cairo',
    dates: 'Feb 2020 – Jun 2020',
    bullets: [
      'Built the Andalusia Care website in Nuxt and Bootstrap, improving patient access to healthcare services and information.',
    ],
  },
  {
    title: 'Flutter Developer',
    company: 'Creator X',
    place: 'Cairo',
    dates: 'Sep 2019 – Jan 2020',
    bullets: [
      'Launched a Flutter reservation app that surpassed 1,000 downloads and lifted reservations within its first month.',
    ],
  },
];

const bitbangRole = (rest: Omit<Role, 'title' | 'company' | 'place' | 'dates' | 'current'>): Role => ({
  title: 'Senior Frontend Engineer / Frontend Lead',
  company: 'BitBang',
  place: 'Remote',
  dates: 'Mar 2024 – Present',
  current: true,
  ...rest,
});

export const resumes: Resume[] = [
  {
    file: 'assets/Shehab_Mohsen_Resume_Frontend_2026.pdf',
    headline: 'Senior Frontend Engineer · Full-Stack Capable',
    summary:
      'Senior Frontend Engineer with 6+ years shipping fintech, e-commerce, and healthcare products in **React, Next.js, TypeScript, and Vue/Nuxt**. **Leads a team of 7+ engineers**, owns architecture and design systems, and rebuilds legacy apps into fast, maintainable SPAs, with full-stack range in Node.js, NestJS, and SQL.',
    skills: [
      ['Core stack', 'React.js, Next.js, TypeScript, JavaScript, Vue.js, Nuxt.js'],
      ['State & data', 'TanStack Query, Redux, Zustand, Pinia, GraphQL, Apollo Client, REST APIs'],
      ['UI & styling', 'Tailwind CSS, CSS, SCSS, Framer Motion, shadcn/ui, Storybook'],
      ['Testing', 'Jest, Vitest, React Testing Library, Playwright'],
      ['Tooling & DevOps', 'Vite, Webpack, Docker, GitHub, Bitbucket, Jira'],
      ['Backend', 'Node.js, Express.js, NestJS, SQL, Prisma, Redis'],
      ['Specialties', 'Design systems, developer experience, touch & kiosk-style UI, gesture handling, virtual keyboards'],
      ['AI-assisted dev', aiTools],
    ],
    experience: [
      bitbangRole({
        bullets: [
          "Led frontend architecture across BitBang's products — feature-based structure, TanStack Query caching, schema-generated types, virtualized tables — and mentored a team of 7+ engineers, with an onboarding redesign that cut ramp-up to 2 weeks.",
          bitbang.gopay,
          "Initiated **SparkFlow**, an internal Jira-style platform: gathered the features, wrote the requirements, designed the database, security, and UI/UX, and built it with AI-assisted development; it **replaced BitBang's Jira subscription**.",
          bitbang.amplifidor,
          bitbang.shamel,
          `${bitbang.uiLibrary}.`,
        ],
      }),
      walaplus,
      fatura([
        'Delivered a React credit-service portal that improved client self-service and day-to-day usability.',
        'Built an internal Audit Portal in React and TypeScript for monitoring, investigation, and analysis workflows.',
        "Diagnosed and fixed a major performance issue in the Operations Portal's transaction filters, cutting wait times by ~80% for a portal serving thousands of clients.",
        'Implemented a Vue Collector Portal for payment-collection workflows, and contributed Node.js and Express.js endpoints and database migrations.',
      ]),
      ...earlier,
    ],
  },
  {
    file: 'assets/Shehab_Mohsen_Resume_FullStack_2026.pdf',
    headline: 'Senior Full-Stack Engineer · Frontend-Focused',
    summary:
      'Senior full-stack engineer with a frontend focus and 6+ years across fintech, e-commerce, and healthcare: **React, Next.js, TypeScript, and Vue/Nuxt** on the front, **Node.js, NestJS, Prisma, and PostgreSQL** behind it. **Leads a team of 7+ engineers** and owns architecture, from data-heavy dashboards to realtime systems.',
    skills: [
      ['Core stack', 'React.js, Next.js, TypeScript, JavaScript, Vue.js, Nuxt.js'],
      ['Backend', 'Node.js, NestJS, Express.js, Fastify, REST, GraphQL, Socket.IO, BullMQ'],
      ['Data', 'PostgreSQL, Prisma, MongoDB, SQL, Redis'],
      ['State', 'TanStack Query, Redux, Zustand, Pinia, Apollo Client'],
      ['UI & styling', 'Tailwind CSS, SCSS, Framer Motion, shadcn/ui, Storybook, design systems'],
      ['Testing', 'Jest, Vitest, React Testing Library, Playwright'],
      ['Tooling', 'Vite, Webpack, Docker, GitHub, Bitbucket, Jira'],
      ['AI-assisted dev', aiTools],
    ],
    experience: [
      bitbangRole({
        feature: {
          name: 'SparkFlow',
          tag: 'Initiated · Full-stack',
          stack:
            'React 19 · TypeScript · TanStack Query · NestJS · Fastify · Prisma · PostgreSQL · Redis · Socket.IO · BullMQ',
          bullets: [
            "BitBang's internal task and project-management tool: I initiated it from team bench time, gathered the features, wrote the requirements, and designed the database (ERDs), security, and UI/UX. It **replaced BitBang's Jira subscription** and runs every team project with minimal issues.",
            'Built with AI-assisted development (Claude Code, Codex, Claude Design): workspaces, boards, backlog, sprints, and issues; a rich-text editor with mentions; realtime updates over Socket.IO and Redis; BullMQ workers for notifications.',
            'Production hardening: Microsoft Entra SSO plus email/password auth, tenant and project isolation in queries and database constraints, indexed paginated reads, and virtualized boards.',
          ],
        },
        bullets: [
          "Led frontend architecture across BitBang's products, worked with backend teams on API contracts, and mentored a team of 7+ engineers, with an onboarding redesign that cut ramp-up to 2 weeks.",
          bitbang.gopay,
          bitbang.amplifidor,
          bitbang.shamel,
          `${bitbang.uiLibrary}, supporting the Tasheelat and Face Children initiatives.`,
        ],
      }),
      walaplus,
      fatura([
        'Built a React credit-service portal for client self-service and an internal Audit Portal in React and TypeScript.',
        "Diagnosed and fixed a major performance issue in the Operations Portal's transaction filters, cutting wait times by ~80% for a portal serving thousands of clients.",
        'Implemented a Vue Collector Portal for payment-collection workflows and extended the Vue-based Operations Portal.',
        'Contributed backend endpoints, database migrations, and cross-stack workflow support in Node.js and Express.js.',
      ]),
      ...earlier,
    ],
  },
];
