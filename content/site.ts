// All the words on the home page. Edit here; the components only lay them out.

export const PERSON = {
  name: 'Ena Otuokon',
  fullName: 'Ena Helena Otuokon',
  /** Cycled on the LCD on the front of the booth. Product Manager first: it's the role she's hiring for. */
  roles: ['Product Manager', 'Software Engineer', 'AI Enthusiast', 'DJ'],
  location: 'London, UK',
  email: 'otuokonhelena@gmail.com',
  cv: '/asset/pdf/ena_cv.pdf',
};

export const SOCIALS = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/ena-otuokon-345b7a1b6' },
  { label: 'GitHub', href: 'https://github.com/helena-byte999' },
  { label: 'Medium', href: 'https://medium.com/@otuokonhelena' },
  { label: 'X', href: 'https://x.com/wrldcr8tive' },
];

export const HERO = {
  greeting: "Hi, I'm",
  lead: 'Product Manager who ',
  /** Shown in blue with a blinking caret, like a line still being typed. */
  accent: 'reads the room',
  intro: 'I build AI, music and consumer products in London, test ideas by building them myself, and DJ and produce events on the side.',
};

/** The six pads on the mixer. Keys 1–6 hit them too. */
// Keycap colours; `ink` is the label colour that reads on each.
export const PADS = [
  { key: '1', label: 'About', target: 'about', color: '#F2C94C', ink: '#161616' },
  { key: '2', label: 'Work', target: 'work', color: '#3557E8', ink: '#ffffff' },
  { key: '3', label: 'Experience', target: 'experience', color: '#E5484D', ink: '#ffffff' },
  { key: '4', label: 'Set list', target: 'setlist', color: '#4FAF5B', ink: '#ffffff' },
  { key: '5', label: 'Writing', target: 'writing', color: '#F08A3C', ink: '#161616' },
  { key: '6', label: 'Contact', target: 'contact', color: '#2B2B2E', ink: '#ffffff' },
] as const;

export const BOOTH_HINT = 'Hit a pad or press 1–6 to jump. Tap a record to play my music. Drag the booth to walk around it.';

export const WORK_INTRO = {
  title: 'Selected work',
  tagline: 'Dig it. Mix it. Drop it ♫',
  text: 'Product case studies first, then the things I built to test an idea before asking anyone else to.',
};

/** Logo tiles. Images come from each organisation's own website (see scripts/build-assets.mjs);
 *  icons from simple-icons; the rest are lettermarks until there's an official logo to use. */
export type LogoSpec = { img?: string; icon?: 'snapchat' | 'google'; letters?: string; bg: string; ink?: string; wide?: boolean };
export const LOGOS: Record<string, LogoSpec> = {
  snap: { icon: 'snapchat', bg: '#FFFC00', ink: '#000000' },
  ariro: { letters: 'A', bg: '#3557E8' },
  aberdeen: { letters: 'AC', bg: '#E5484D' },
  centrifuge: { letters: 'CG', bg: '#4FAF5B' },
  northumbria: { img: '/logos/northumbria.png', bg: 'transparent', wide: true },
  aun: { img: '/logos/aun.png', bg: 'transparent', wide: true },
  google: { icon: 'google', bg: '#ffffff', ink: '#4285F4' },
  gomycode: { letters: 'GMC', bg: '#F08A3C' },
  entrylevel: { img: '/logos/entrylevel.png', bg: '#ffffff' },
};

export const EXPERIENCE = [
  {
    role: 'AR Designer & Product Management Intern',
    org: 'Snap Inc. · Snap Lens Lab',
    logo: 'snap',
    place: 'London, UK',
    dates: 'Jul 2026 – Aug 2026',
    text: 'Led a three-person team from first sketch to a live AR lens in 3 weeks: Kickback, a shared virtual bedroom where friends listen to music together. I owned scope, delivery and success metrics, cut scope twice to protect the deadline (and documented what was dropped and why), and learned Blender from scratch to build 4 in-lens 3D assets. The lens reached 8,000+ users in 4 days, and I pitched it to 50+ people across Snap product and engineering.',
  },
  {
    role: 'Product Manager',
    org: 'Ariro Inc.',
    logo: 'ariro',
    place: 'Remote · Lagos',
    dates: 'Feb 2024 – May 2025',
    text: 'Took a consumer Afrogospel music-streaming app from concept to launch: designed all 13 screens, led go-to-market to 500+ users, and expanded the product into event reminders, blogs and merch. Kept engineering, branding and web teams aligned on one release plan across a 15-person company.',
  },
  {
    role: 'Associate Digital Solutions Intern',
    org: 'Aberdeen Commercial',
    logo: 'aberdeen',
    place: 'Abuja',
    dates: 'Aug 2023 – Apr 2025',
    text: 'Built and launched the company website end to end, and supported 6 delivery cycles across 5 client-facing projects by documenting 40+ requirements and handling solution design and testing. Worked with 4 cross-functional teams on digital solutions that improved workflow efficiency by 30% and cut project rework by 25%, and evaluated 12 tools and platforms to improve operations and user experience. Organised product analytics in Excel for reporting, presented technical findings to 15 stakeholders across 3 departments, and produced 10+ conference brochures for events in 4 countries to brand guidelines.',
  },
  {
    role: 'UI/UX Design Intern',
    org: 'Centrifuge Groups',
    logo: 'centrifuge',
    place: 'Abuja',
    dates: 'May 2022 – Dec 2022',
    text: 'Led user research with 100+ parents, teachers and board members across 2 schools, and turned the gaps it uncovered into requirements for a digital portal that replaced paper communication books and printed letters. Drove adoption at launch with a week of hands-on training for all three user groups.',
  },
];

/** Education, research, volunteering and certifications: one carousel, filtered by kind. */
export const CREDENTIAL_KINDS = [
  { id: 'education', label: 'Education' },
  { id: 'research', label: 'Research' },
  { id: 'volunteering', label: 'Volunteering' },
  { id: 'certification', label: 'Certifications' },
];

export type Credential = {
  kind: 'education' | 'research' | 'volunteering' | 'certification';
  title: string;
  grade?: string;
  org: string;
  dates: string;
  text: string;
  logo: string;
  href?: string;
};

export const CREDENTIALS: Credential[] = [
  {
    kind: 'education',
    title: 'MSc Artificial Intelligence',
    grade: 'Distinction',
    org: 'Northumbria University, Newcastle upon Tyne',
    dates: 'Sep 2025 – Sep 2026',
    text: 'Dissertation graded Distinction, on how the framing of a recommendation changes whether people trust it.',
    logo: 'northumbria',
  },
  {
    kind: 'research',
    title: 'Certainty and Justification Framing in Music Recommendation',
    grade: 'MSc dissertation · Distinction',
    org: 'Northumbria University',
    dates: '2025 – 2026',
    text: 'A 2×2 experiment with 118 listeners, sized in advance and modelled with mixed-effects models in R. Explanations raised trust (p = .009) and willingness to explore (p = .002), but only for listeners who already knew the music.',
    logo: 'northumbria',
  },
  {
    kind: 'education',
    title: 'BSc Software Engineering',
    grade: 'Second Class Upper (2:1)',
    org: 'American University of Nigeria, Yola',
    dates: 'Aug 2019 – May 2023',
    text: 'Final-year project, B+ (89): an elderly care management system for a residential care home, rebuilt in 2026 as ECMS.',
    logo: 'aun',
  },
  {
    kind: 'volunteering',
    title: 'Team Lead, Snap Teen Summit',
    grade: 'Volunteer',
    org: 'Snap Inc.',
    dates: 'Oct 2026',
    text: 'Led a squad of 16–18 year olds alongside a fellow Snap alumnus at a one-day summit, supervising 150+ students from 10 schools.',
    logo: 'snap',
  },
  {
    kind: 'certification',
    title: 'Google AI Specialisation',
    org: 'Google · Coursera',
    dates: '2026',
    text: 'Credential ID 366Z97NI7B82.',
    logo: 'google',
    href: 'https://www.coursera.org/account/accomplishments/specialization/366Z97NI7B82',
  },
  {
    kind: 'certification',
    title: 'Cyber Security Bootcamp: CompTIA Security+ 701',
    org: 'GoMyCode',
    dates: '2024',
    // GoMyCode's diploma site has an expired SSL certificate (Oct 2026), so no link until they fix it.
    text: 'Credential ID 31728828013524747.',
    logo: 'gomycode',
  },
  {
    kind: 'certification',
    title: 'UX Designer, Entry Level',
    org: 'EntryLevel',
    dates: '2023',
    text: 'Credential ID 7581b2c7.',
    logo: 'entrylevel',
    href: 'https://entrylevel-public.s3.amazonaws.com/certificate/05ac5980-a11d-44c2-b7ea-9fa7f8d6d136/7581b2c7-bfe2-40ee-9dc5-03850198fe10_cert.pdf',
  },
  {
    kind: 'certification',
    title: 'Product Management Virtual Experience',
    org: 'EntryLevel',
    dates: '2023',
    text: 'Credential ID 9f92dffa.',
    logo: 'entrylevel',
    href: 'https://entrylevel-public.s3.amazonaws.com/certificate/0007be48-48a4-4dd8-b02d-c56298714594/9f92dffa-da7e-4363-8e12-45185f6842d3_cert.pdf',
  },
];

export const SET_LIST = {
  title: 'The set list',
  tagline: 'Every good set has a plan. So does every product.',
  steps: [
    { name: 'Dig', means: 'Discover', text: 'Crate-digging for the real problem: interviews, usage data, and what people post when they think nobody is listening.' },
    { name: 'Cue', means: 'Define', text: 'Pick the one problem worth solving, and agree what "it worked" looks like before anything gets built.' },
    { name: 'Mix', means: 'Design', text: 'Flows and screens in Figma, blending what users asked for with what the business needs.' },
    { name: 'Preview', means: 'Prototype', text: 'Like checking a track in the headphones first: I build a rough version myself, so we learn before engineering commits.' },
    { name: 'Test the floor', means: 'Test', text: 'Usability sessions, think-alouds and experiments. If the floor isn\'t moving, I change the record.' },
    { name: 'Drop', means: 'Launch', text: 'Ship it, then read the room: metrics, feedback, and what goes in the next cut.' },
  ],
};

export const ABOUT = {
  title: 'Product manager by day, DJ by night, builder in between.',
  quote: 'Most of my product ideas start on the dance floor.',
  paragraphs: [
    "I'm Ena, a product manager based in London. I studied software engineering, worked as a UI/UX designer, and finished an MSc in Artificial Intelligence with Distinction. I use all three in the PM role: I can sketch a flow in Figma, read the code, and design an experiment, so designers, engineers and researchers don't have to translate for me.",
    "I've worked on music, fintech, education and government products across Nigeria and the UK, and won a UI/UX design competition run by the Association for Computing Machinery (ACM).",
    'Outside work I DJ and produce events, which is where most of my product ideas start: music discovery, streaming culture and the tools DJs use. Off the decks: basketball, video games and writing.',
  ],
  stats: [
    { value: '3+', label: 'years in product, design & engineering' },
    { value: '10+', label: 'projects across 3 countries' },
    { value: '1,700+', label: 'Cuepoint downloads' },
  ],
  // Mirrors the CV's Key Skills, plus Blender (from the Snap role) and the hobbies line.
  skills: [
    {
      group: 'Product & research',
      items: ['Strategy & roadmapping', 'Discovery & prioritisation', 'User research', 'Insight synthesis & requirements', 'Agile delivery', 'Metrics & A/B testing', 'Stakeholder management', 'Cross-functional collaboration', 'Creative problem-solving'],
    },
    {
      group: 'Technical',
      items: ['AI/ML & recommender systems', 'Data analysis', 'UX/UI & AR design', 'Software engineering', 'Python 3', 'SQL', 'HTML/CSS'],
    },
    {
      group: 'Tools',
      items: ['Jira', 'Trello', 'Notion', 'Figma', 'Canva', 'Lens Studio', 'Blender', 'Claude Code', 'Gemini AI', 'Codex', 'GitHub', 'Excel', 'Microsoft Office', 'Google Workspace'],
    },
    {
      group: 'Off the clock',
      items: ['DJing', 'Event production', 'Music discovery & streaming culture', 'AI', 'Basketball', 'Writing', 'Video games'],
    },
  ],
};

export const WRITING = {
  title: 'Liner notes',
  text: 'Product teardowns, and how AI is changing the way we find music.',
  // The posts themselves come from Medium (content/writing.json, refreshed on every build).
  more: { label: 'More on Medium', href: 'https://medium.com/@otuokonhelena' },
};

export const CONTACT = {
  title: 'Hiring a product manager? Pass me the aux.',
  text: "I'm open to product manager roles, especially in AI, music and consumer products. Based in London and eligible to work in the UK.",
};

export const FOOTER = '© 2026 Ena Otuokon.';
