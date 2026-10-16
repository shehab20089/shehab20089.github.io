// content.json is the verbatim copy from the design handoff and the site's only
// source of copy and data. These types describe it; assigning the import to
// `Content` makes the compiler check the file's shape on every build.
import data from './content.json';

export interface Link {
  label: string;
  href: string;
}

export interface Screenshot {
  src: string;
  caption: string;
  alt: string;
  width: number;
  height: number;
}

export interface Project {
  slug: string;
  number: string;
  name: string;
  sector: string;
  blurb: string;
  problem: string;
  solution: string;
  impact: string;
  role: string;
  stack: string[];
  live: { url: string; label: string } | null;
  images: Screenshot[];
}

export interface Cta {
  label: string;
  icon: string;
  href: string;
  variant: string;
  download?: boolean;
}

export interface Fact {
  label: string;
  value?: string;
  links?: Link[];
}

export interface Role {
  when: string;
  current: boolean;
  role: string;
  company: string;
  tag: string | null;
  description: string;
}

export interface FormField {
  name: string;
  label: string;
  type: string;
  required: boolean;
  autocomplete?: string;
  placeholder: string;
  rows?: number;
}

export interface PaletteCommand {
  label: string;
  hint: string;
  action: string;
  target?: string;
}

interface SectionCopy {
  number: string;
  label: string;
  heading: string;
}

interface Card {
  kicker: string;
  title: string;
  description: string;
}

export interface Content {
  meta: {
    title: string;
    description: string;
    ogTitle: string;
    ogDescription: string;
    twitterCard: string;
    lang: string;
  };
  person: {
    name: string;
    email: string;
    location: string;
    timezone: string;
    links: { github: string; linkedin: string };
    resumes: { frontend: string; fullstack: string };
  };
  header: {
    logo: string;
    nav: Link[];
    clockLabel: string;
    themeToggleLabel: { whenLight: string; whenDark: string };
    menuButton: string;
  };
  hero: {
    eyebrow: string;
    status: string;
    nameLines: string[];
    lead: string;
    ctas: Cta[];
    facts: Fact[];
  };
  work: SectionCopy & {
    intro: string;
    tableColumns: string[];
    rowCta: string;
    alsoShippedLabel: string;
  };
  projects: Project[];
  alsoShipped: (Card & { meta: string })[];
  about: SectionCopy & {
    paragraphs: string[];
    portrait: {
      src: string;
      alt: string;
      badge: string;
      captionLeft: string;
      captionRight: string;
      width: number;
      height: number;
    };
    chips: string[];
  };
  experience: SectionCopy & {
    roles: Role[];
    educationLabel: string;
    education: { title: string; where: string }[];
  };
  principles: SectionCopy & {
    intro: string;
    items: { number: string; title: string; description: string }[];
    codeSample: string[];
  };
  stack: SectionCopy & {
    groups: { category: string; items: string[] }[];
  };
  beyond: SectionCopy & {
    items: Card[];
  };
  contact: SectionCopy & {
    emailLabel: string;
    copyButton: string;
    details: { label: string; text: string; href?: string }[];
    resumeLabel: string;
    resumeLinks: { text: string; href: string }[];
    form: {
      fields: FormField[];
      submit: string;
      note: string;
    };
    footer: { copyright: string; backToTop: string };
  };
  caseStudy: {
    counter: string;
    prev: string;
    next: string;
    close: string;
    closeAria: string;
    labels: { problem: string; solution: string; impact: string; role: string; stack: string; live: string };
    imageCounter: string;
    tallHint: string;
    nextProject: string;
  };
  palette: {
    placeholder: string;
    escHint: string;
    empty: string;
    commands: PaletteCommand[];
  };
  toast: { emailCopied: string };
}

export const content: Content = data;

/** Narrows a free-form string from content.json to a known set, failing the build on anything else. */
export function oneOf<const T extends string>(value: string, options: readonly T[]): T {
  const match = options.find((option) => option === value);
  if (match === undefined) throw new Error(`content.json: "${value}" is not one of ${options.join(', ')}`);
  return match;
}

/** Fills {placeholders} in a content.json template, e.g. "Case study {number} / 06". */
export function format(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (placeholder, key: string) => String(values[key] ?? placeholder));
}

/** A project's first screenshot doubles as its cover. */
export function coverOf(project: Project): Screenshot {
  const cover = project.images[0];
  if (!cover) throw new Error(`content.json: project "${project.slug}" has no images`);
  return cover;
}
