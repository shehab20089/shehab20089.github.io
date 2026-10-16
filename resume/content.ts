// The two résumé PDFs linked from the site, written as data. scripts/resume.ts
// prints them to public/assets. Job titles, dates and facts are shared; only the
// headline, summary, skills and a few bullets differ between the two versions.

export interface Role {
  title: string;
  company: string;
  dates: string;
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
  location: 'Egypt',
  email: 'shehabmohsen1995@gmail.com',
  phone: '+(20) 1001251407',
  github: { label: 'github.com/shehab20089', href: 'https://github.com/shehab20089' },
  linkedin: {
    label: 'linkedin.com/in/shehab-mohsen-6ba984168',
    href: 'https://www.linkedin.com/in/shehab-mohsen-6ba984168/',
  },
};

export const education: [school: string, degree: string, year: string][] = [
  ['Information Technology Institute (ITI), Egypt', 'Diploma in Systems Development', '2019'],
  ['Pyramids Higher Institute, Egypt', 'B.S. in Communication and Electronics Engineering', '2018'],
];

const aiTools = 'Claude, Codex, OpenCode, Cursor, GitHub Copilot, ChatGPT, Windsurf';

const bullets = {
  architecture:
    'Led architecture improvements across multiple fintech and platform products, increasing component reuse, development consistency, and maintainability across data-heavy dashboards.',
  gopay:
    'Revamped the GoPay Biller dashboard to improve performance, workflow clarity, and day-to-day usability across key billing flows.',
  amplifidor:
    'Built core areas of Amplifidor, an influencer and brand platform (React, TypeScript, GraphQL): creator profiles, audience insights, and the wallet, plus English/Arabic localization with full RTL support.',
  shamel:
    'Laid the frontend foundation for the Shamel360 warehouse fulfillment portal (React 19, TanStack Query): routing, layout, and shared table, filter, and form components; built the inventory stock list and the product configuration and approval flows.',
  team: 'Led and mentored a frontend team of 5 engineers across junior, mid, and senior levels; owned code reviews, engineering standards, and delivery quality.',
  kun: 'Contributed to Kun Admin Portal with tablet-optimized, touch-friendly interfaces for in-gym staff operations, and supported Tasheelat and Face Children initiatives.',
  uiLibrary:
    'Created a custom UI library and CLI tooling to streamline component setup and improve development consistency.',
};

const walaplus: Role = {
  title: 'Senior Frontend Developer',
  company: 'Walaplus (Remote)',
  dates: 'Mar 2023 - Mar 2024',
  bullets: [
    'Modernized the client portal UI and refactored legacy frontend logic to improve responsiveness, usability, and maintainability.',
    'Built a retailer portal for offers, vouchers, and data-management workflows, and helped select the frontend stack for new implementations.',
    'Dockerized frontend applications to simplify deployment workflows and improve environment consistency.',
    'Collaborated with product and backend teams to deliver scalable features across client-facing and retailer-facing platforms.',
  ],
};

const fatura = (backendBullet: string): Role => ({
  title: 'Frontend Developer',
  company: 'Fatura LLC, Cairo',
  dates: 'Jun 2020 - Mar 2023',
  bullets: [
    'Delivered a React-based credit service portal that improved client self-service and day-to-day usability.',
    'Built an internal Audit Portal using React and TypeScript to support monitoring, investigation, and analysis workflows.',
    'Enhanced the Vue-based Operations Portal used by thousands of clients, improving reliability and feature delivery.',
    'Implemented the Collector Portal in Vue to support payment collection workflows and operational efficiency.',
    backendBullet,
  ],
});

const earlier: Role[] = [
  {
    title: 'Frontend Developer (Part-time)',
    company: 'Scandiweb (Remote)',
    dates: 'Feb 2022 - Nov 2022',
    bullets: [
      'Implemented features for e-commerce clients across multiple domains, including printer and automotive experiences.',
      'Improved performance and user engagement through targeted frontend optimizations and iterative feature delivery.',
    ],
  },
  {
    title: 'Frontend Developer',
    company: 'Andalusia Group, Cairo',
    dates: 'Feb 2020 - Jun 2020',
    bullets: [
      'Built the Andalusia Care website using Nuxt and Bootstrap to improve patient access to healthcare services and information.',
    ],
  },
  {
    title: 'Flutter Developer',
    company: 'Creator X, Cairo',
    dates: 'Sep 2019 - Jan 2020',
    bullets: [
      'Launched a reservation app in Flutter that exceeded 1,000 downloads and increased reservations in its first month.',
    ],
  },
];

const bitbang = (roleBullets: string[]): Role => ({
  title: 'Senior Frontend Engineer / Frontend Lead',
  company: 'BitBang (Remote)',
  dates: 'Mar 2024 - Present',
  bullets: roleBullets,
});

export const resumes: Resume[] = [
  {
    file: 'assets/Shehab_Mohsen_Resume_Frontend_2026.pdf',
    headline: 'Senior Frontend Engineer · Full-Stack Capable',
    summary:
      'Senior Frontend Engineer with 6+ years of experience building scalable, performant web applications across fintech, e-commerce, and healthcare. Hands-on in React, Next.js, TypeScript, Vue/Nuxt, design systems, data-heavy dashboards, and touch-first large-screen experiences, and comfortable across the stack with Node.js, NestJS, and SQL. Leads teams, mentors engineers, and improves frontend architecture, developer experience, and delivery quality while collaborating closely with product, design, and backend teams.',
    skills: [
      ['Languages', 'JavaScript, TypeScript'],
      ['Frontend', 'React.js, Next.js, Vue.js, Nuxt.js, Redux, Zustand, Pinia, Framer Motion, shadcn/ui'],
      ['Testing & Data', 'Jest, React Testing Library, GraphQL, Apollo Client, REST APIs'],
      ['Styling & Tooling', 'Tailwind CSS, CSS, SCSS, Storybook, Docker, Vite, Webpack, GitHub, Bitbucket, Jira'],
      ['Backend', 'Node.js, Express.js, NestJS, SQL, Prisma, Redis'],
      [
        'Specialties',
        'Design systems, developer experience, touch-optimized UI, gesture handling, kiosk-style interfaces, virtual keyboard components',
      ],
      ['AI-assisted Development', aiTools],
    ],
    experience: [
      bitbang([
        bullets.architecture,
        bullets.gopay,
        "Initiated SparkFlow, an internal Jira-style platform built from team bench time, and helped build it across the React frontend and the NestJS and PostgreSQL backend; it replaced BitBang's Jira subscription, and every team project moved onto it.",
        bullets.amplifidor,
        bullets.shamel,
        bullets.team,
        bullets.kun,
        bullets.uiLibrary,
        'Integrated Persona and Moyasar Payments to support secure onboarding and transaction flows.',
        'Used AI-assisted development tools responsibly to reduce repetitive work and accelerate implementation without compromising quality.',
      ]),
      walaplus,
      fatura('Contributed backend endpoints and database migrations using Node.js and Express.js.'),
      ...earlier,
    ],
  },
  {
    file: 'assets/Shehab_Mohsen_Resume_FullStack_2026.pdf',
    headline: 'Senior Full-Stack Engineer · Frontend-Focused',
    summary:
      'Senior full-stack engineer with a frontend focus and 6+ years of experience building scalable web applications across fintech, e-commerce, and healthcare. Strong in React, Next.js, TypeScript, Vue/Nuxt, Node.js, and API-driven architecture, with practical backend experience across NestJS services, PostgreSQL with Prisma, database migrations, and data workflows. Combines frontend architecture, dashboard-heavy product delivery, and team leadership with hands-on collaboration across the stack.',
    skills: [
      ['Languages', 'JavaScript, TypeScript, SQL'],
      ['Frontend', 'React.js, Next.js, Vue.js, Nuxt.js, Redux, Zustand, Pinia, Framer Motion, shadcn/ui'],
      ['Backend & APIs', 'Node.js, Express.js, NestJS, REST APIs, GraphQL, Apollo Client'],
      ['Databases & ORMs', 'PostgreSQL, MongoDB, Redis, Prisma'],
      ['Testing & Tooling', 'Jest, React Testing Library, Storybook, Docker, Vite, Webpack, GitHub, Bitbucket, Jira'],
      ['Styling & UI Systems', 'Tailwind CSS, CSS, SCSS, design systems, reusable component libraries'],
      [
        'Specialties',
        'Full-stack product development, developer experience, touch-optimized UI, gesture handling, kiosk-style interfaces',
      ],
      ['AI-assisted Development', aiTools],
    ],
    experience: [
      bitbang([
        bullets.architecture,
        bullets.gopay,
        "Initiated SparkFlow, an internal Jira-style platform built from team bench time, and helped build it full-stack (a NestJS API over PostgreSQL and Prisma, Redis and BullMQ jobs, a React frontend); it replaced BitBang's Jira subscription, and every team project moved onto it.",
        bullets.amplifidor,
        bullets.shamel,
        bullets.team,
        bullets.kun,
        bullets.uiLibrary,
        'Integrated Persona and Moyasar Payments in collaboration with backend services to support secure onboarding and transaction flows.',
        'Worked closely with backend and product teams on API contracts, integrations, and end-to-end delivery across multiple product domains.',
      ]),
      walaplus,
      fatura(
        'Contributed backend endpoints, database migrations, and cross-stack workflow support using Node.js and Express.js.',
      ),
      ...earlier,
    ],
  },
];
