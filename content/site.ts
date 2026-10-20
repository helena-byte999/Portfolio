// All the words on the home page. Edit here; the components only lay them out.

export const PERSON = {
  name: 'Ena Otuokon',
  fullName: 'Ena Helena Otuokon',
  roles: ['Product Manager', 'DJ', 'Builder'],
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
  eyebrow: 'Now playing',
  line: 'Product manager for AI, music and consumer products. I read the room before I drop the track.',
  proof: ['8,000+ lens users in 4 days', '500+ users at launch', 'MSc AI, Distinction'],
};

/** The six pads on the mixer. Keys 1–6 hit them too. */
export const PADS = [
  { key: '1', label: 'Work', target: 'work', color: '#FFCF3F' },
  { key: '2', label: 'Experience', target: 'experience', color: '#B65CFF' },
  { key: '3', label: 'Set list', target: 'setlist', color: '#FF5FA2' },
  { key: '4', label: 'About', target: 'about', color: '#38D6FF' },
  { key: '5', label: 'Writing', target: 'writing', color: '#7CF26B' },
  { key: '6', label: 'Contact', target: 'contact', color: '#FF8A3D' },
] as const;

export const BOOTH_HINT = 'Hit a pad to jump there, or press 1–6.';

export const WORK_INTRO = {
  title: 'Selected work',
  tagline: 'Dig it. Mix it. Drop it ♫',
  text: 'Product case studies first, then the things I built to test an idea before asking anyone else to.',
};

export const EXPERIENCE = [
  {
    role: 'AR Designer & Product Management Intern',
    org: 'Snap Inc. · Snap Lens Lab',
    place: 'London, UK',
    dates: 'Jul 2026 – Aug 2026',
    text: 'Led a three-person team from first sketch to a live AR lens in 3 weeks: Kickback, a shared virtual bedroom where friends listen to music together. I owned scope, delivery and success metrics, cut scope twice to protect the deadline (and documented what was dropped and why), and learned Blender from scratch to build 4 in-lens 3D assets. The lens reached 8,000+ users in 4 days, and I pitched it to 50+ people across Snap product and engineering.',
  },
  {
    role: 'Product Manager',
    org: 'Ariro Inc.',
    place: 'Remote · Lagos',
    dates: 'Feb 2024 – May 2025',
    text: 'Took a consumer Afrogospel music-streaming app from concept to launch: designed all 13 screens, led go-to-market to 500+ users, and expanded the product into event reminders, blogs and merch. Kept engineering, branding and web teams aligned on one release plan across a 15-person company.',
  },
  {
    role: 'Associate Digital Solutions Intern',
    org: 'Aberdeen Commercial',
    place: 'Abuja',
    dates: 'Aug 2023 – Apr 2025',
    text: 'Built and launched the company website end to end, and supported 6 delivery cycles across 5 client-facing projects by documenting 40+ requirements and handling solution design and testing. Worked with 4 cross-functional teams on digital solutions that improved workflow efficiency by 30% and cut project rework by 25%, and evaluated 12 tools and platforms to improve operations and user experience. Organised product analytics in Excel for reporting, presented technical findings to 15 stakeholders across 3 departments, and produced 10+ conference brochures for events in 4 countries to brand guidelines.',
  },
  {
    role: 'UI/UX Design Intern',
    org: 'Centrifuge Groups',
    place: 'Abuja',
    dates: 'May 2022 – Dec 2022',
    text: 'Led user research with 100+ parents, teachers and board members across 2 schools, and turned the gaps it uncovered into requirements for a digital portal that replaced paper communication books and printed letters. Drove adoption at launch with a week of hands-on training for all three user groups.',
  },
];

export const VOLUNTEERING = {
  role: 'Team Lead (Volunteer), Snap Teen Summit',
  org: 'Snap Inc.',
  dates: 'Oct 2026',
  text: 'Led a squad of 16–18 year olds alongside a fellow Snap alumnus at a one-day summit, supervising 150+ students from 10 schools and keeping them organised throughout the event.',
};

export const RESEARCH = {
  title: 'Certainty and Justification Framing in Music Recommendation',
  org: 'MSc dissertation · Northumbria University · Distinction',
  text: 'Does the way a recommendation is framed change whether people trust it? I ran a 2×2 between-subjects experiment (certainty × justification) with 60 tracks across 14 genres, sized the sample in advance with a simulation-based power analysis, and modelled 118 responses with linear mixed-effects models in R. Justification raised trust (p = .009) and willingness to explore (p = .002), but only for listeners already familiar with the music. The product takeaway: explanations don\'t help every user equally, so test them per audience instead of assuming.',
};

export const EDUCATION = [
  {
    title: 'MSc Artificial Intelligence, Distinction',
    org: 'Northumbria University, Newcastle upon Tyne',
    dates: 'Sep 2025 – Sep 2026',
    note: 'Dissertation graded Distinction: how certainty and justification framing change trust in music recommendations.',
  },
  {
    title: 'BSc Software Engineering, Second Class Upper (2:1)',
    org: 'American University of Nigeria, Yola',
    dates: 'Aug 2019 – May 2023',
    note: 'Final-year project, B+ (89): an elderly care management system for a residential care home, rebuilt in 2026 as ECMS.',
  },
];

export const CERTIFICATIONS = [
  { title: 'Google AI Specialisation', org: 'Google · Coursera · 2026', href: 'https://www.coursera.org/account/accomplishments/specialization/366Z97NI7B82' },
  // GoMyCode's diploma site has an expired SSL certificate (Oct 2026), so no link until they fix it.
  { title: 'Cyber Security Bootcamp: CompTIA Security+ 701', org: 'GoMyCode · 2024 · Credential ID 31728828013524747' },
  { title: 'UX Designer, Entry Level', org: 'EntryLevel · 2023', href: 'https://entrylevel-public.s3.amazonaws.com/certificate/05ac5980-a11d-44c2-b7ea-9fa7f8d6d136/7581b2c7-bfe2-40ee-9dc5-03850198fe10_cert.pdf' },
  { title: 'Product Management Virtual Experience', org: 'EntryLevel · 2023', href: 'https://entrylevel-public.s3.amazonaws.com/certificate/0007be48-48a4-4dd8-b02d-c56298714594/9f92dffa-da7e-4363-8e12-45185f6842d3_cert.pdf' },
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
  articles: [
    {
      title: 'AI is DJing Too, But Can It Read the Room?',
      text: 'How recommendation algorithms shape what we listen to, and what that means for music discovery.',
      href: 'https://medium.com/@otuokonhelena/youre-not-discovering-music-ai-is-deciding-it-for-you-a22f27cf9921',
    },
    {
      title: 'Killing Circle Was a Mistake. X Keeps Proving It',
      text: 'What one removed feature reveals about confusing low adoption with low value.',
      href: 'https://medium.com/@otuokonhelena/x-deleted-circle-three-years-ago-its-still-rebuilding-it-476eaa82a486',
    },
  ],
  more: { label: 'More on Medium', href: 'https://medium.com/@otuokonhelena' },
};

export const CONTACT = {
  title: 'Hiring a product manager? Pass me the aux.',
  text: "I'm open to product manager roles, especially in AI, music and consumer products. Based in London and eligible to work in the UK.",
};

export const FOOTER = '© 2026 Ena Otuokon. Mixed & mastered with Claude Code.';
