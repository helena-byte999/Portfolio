// Every project on the site. Order here is the order of the work deck ("Track 01 / 08").
// Images live in public/work/<slug>/NN.webp and are built by scripts/build-assets.mjs.

export type Link = { label: string; href: string };
export type Slide = { src: string; title: string; text: string };
/** A looping prototype recording. `phone` clips are one portrait screen; `wide` ones hold several. */
export type Clip = { src: string; poster: string; title: string; text: string; shape: 'phone' | 'wide'; sound?: boolean };

/** How the card's cover is drawn. */
export type Cover =
  | { kind: 'laptop'; src: string; phone?: string }
  | { kind: 'slide'; src: string }
  | { kind: 'stat'; value: string; label: string; icon: 'lens' | 'paper' }
  | { kind: 'terminal'; lines: string[] };

export type Shelf = 'product' | 'built' | 'research';

/** The filter pills above the work deck. */
export const SHELVES: { id: Shelf | 'all'; label: string }[] = [
  { id: 'all', label: 'All tracks' },
  { id: 'product', label: 'Product' },
  { id: 'built', label: 'Built & shipped' },
  { id: 'research', label: 'Design & research' },
];

export type Track = {
  slug: string;
  shelves: Shelf[];
  title: string;
  kicker: string;
  year?: string;
  summary: string;
  role: string;
  body: string[];
  tags: string[];
  meta: { label: string; value: string }[];
  links: Link[];
  cover: Cover;
  /** Tall image behind the work-deck card; tracks without one get a designed background. */
  card?: string;
  /** Prototype recordings, shown before the liner notes. */
  clips?: Clip[];
  slides: Slide[];
  /** Short line under the cover; numbers only, no fluff. */
  stat?: string;
};

const img = (slug: string, n: number) => `/work/${slug}/${String(n).padStart(2, '0')}.webp`;

export const TRACKS: Track[] = [
  {
    slug: 'kickback',
    shelves: ['product'],
    title: 'Kickback',
    kicker: 'Product Management · AR · Snap Lens Lab',
    year: '2026',
    summary: 'A shared virtual bedroom where friends listen to music together. First sketch to live AR lens in 3 weeks.',
    role: 'Product Manager & AR Designer · Team of 3',
    stat: '8,000+ users in 4 days',
    body: [
      'A shared virtual bedroom where friends listen to music together, with surface detection, tappable objects, a mood and scene system, and a placement model for artists and labels.',
      'I owned the scope, the delivery plan and the success metrics the concept was judged against. When time got tight I cut scope twice and documented what was dropped and why, so it could be built later rather than lost.',
      'I learned Blender from scratch to make the 4 in-lens 3D assets the team had no time to source, and gave the closing pitch to 50+ people across Snap product and engineering. The lens reached 8,000+ users in its first 4 days.',
    ],
    tags: ['Scope Trade-offs', 'Success Metrics', 'Delivery Planning', 'Pitching', 'Lens Studio', 'Blender'],
    meta: [
      { label: 'Role', value: 'Product Manager & AR Designer' },
      { label: 'Team', value: 'with Melissa Nhau (Brand Manager) and Jabaar Hussain (AR Designer & Creative Director)' },
      { label: 'Timeline', value: '3 weeks · July–August 2026' },
    ],
    links: [],
    cover: { kind: 'slide', src: img('kickback', 1) },
    card: img('kickback', 1),
    clips: [
      {
        src: '/work/kickback/kickback-how-it-works.mp4',
        poster: '/work/kickback/kickback-how-it-works.webp',
        title: 'How it works',
        text: 'Open the lens, tap the screen, and the bedroom drops into the world around you.',
        shape: 'wide',
      },
      {
        src: '/work/kickback/kickback-inside.mp4',
        poster: '/work/kickback/kickback-inside.webp',
        title: 'Inside the room',
        text: 'Step in and look around: the disco ball, the photo wall, the bed and the desk, with your Bitmoji in the room.',
        shape: 'wide',
      },
      {
        src: '/work/kickback/kickback-demo.mp4',
        poster: '/work/kickback/kickback-demo.webp',
        title: 'The live lens',
        text: 'The room placed in a park, then explored up close with the on-screen joystick.',
        shape: 'phone',
        sound: true,
      },
    ],
    slides: [],
  },
  {
    slug: 'discovery-gap',
    shelves: ['product', 'research'],
    title: 'Discovery Gap',
    kicker: 'Product Analysis · Music Streaming',
    year: '2026',
    summary: 'Does streaming discovery fail smaller artists? 1.44M plays say yes, so I proposed a fix.',
    role: 'Independent product case study · Python · SQL',
    stat: '12% vs 19% still played a month later',
    body: [
      "I analysed 1.44M plays from 10 listeners' Spotify histories against Last.fm data to test whether discovery works worse for smaller artists.",
      'It does: only 12% of lesser-known artists were still being played 30–90 days after discovery, against 19% of big artists, and all 10 listeners showed the gap.',
      'The write-up turns that into a product proposal, "Second Listen", a feature to give a liked first listen of a smaller artist a second chance. All 10 listeners consented to their data being published.',
    ],
    tags: ['Problem Framing', 'Data Analysis', 'Feature Proposal', 'Python', 'SQL'],
    meta: [
      { label: 'Type', value: 'Independent product case study' },
      { label: 'Data', value: '1.44M plays · 10 listeners' },
      { label: 'Tools', value: 'Python · SQL / MySQL' },
    ],
    links: [
      { label: 'Read the case study', href: 'https://helena-byte999.github.io/discovery-gap/' },
      { label: 'Data & analysis', href: 'https://github.com/helena-byte999/discovery-gap-analysis' },
    ],
    cover: { kind: 'laptop', src: img('discovery-gap', 1), phone: img('discovery-gap', 2) },
    card: img('discovery-gap', 1),
    slides: [],
  },
  {
    slug: 'ecms',
    shelves: ['product', 'built'],
    title: 'ECMS',
    kicker: 'Product Ownership · Health & Care',
    year: '2026',
    summary: 'My final-year project, relaunched as a live product: care records, family access, invoices and analytics.',
    role: 'Product Owner · React · Node.js · Express · MongoDB',
    stat: '100 automated tests',
    body: [
      'Started as my final-year team project (B+), where I led the design and owned the requirements, UML, database design and front end.',
      'In 2026 I relaunched it as product owner. I set the scope for care records by benchmarking a commercial care app, then shipped a care log, medicine rounds, doctor\'s visits, a read-only family login, invoices and a care analytics dashboard, backed by 100 automated tests. Every scope decision is written up in the repo.',
      'The demo signs you in with one click; the first load can take up to a minute while the free server wakes up.',
    ],
    tags: ['Product Ownership', 'Requirements', 'Competitive Benchmark', 'Role-based Access', 'Full-Stack'],
    meta: [
      { label: 'Role', value: 'Product Owner' },
      { label: 'Stack', value: 'React · Node.js · Express · MongoDB' },
      { label: 'Origin', value: 'BSc final-year project, relaunched 2026' },
    ],
    links: [
      { label: 'Live demo', href: 'https://ecms-omega.vercel.app' },
      { label: 'GitHub', href: 'https://github.com/helena-byte999/ecms' },
    ],
    cover: { kind: 'laptop', src: img('ecms', 1) },
    card: img('ecms', 1),
    slides: [
      { src: img('ecms', 2), title: 'Admin dashboard', text: 'Doses given, incidents, residents and outstanding invoices on one screen, with today\'s medicine round underneath.' },
    ],
  },
  {
    slug: 'movierec',
    shelves: ['built'],
    title: 'MOV.IE REC',
    kicker: 'Built Solo · AI · Python / Flask',
    year: '2026',
    summary: 'A Netflix-style movie and TV recommender I scoped, built and shipped to a live public site on my own.',
    role: 'Product & Engineering, solo · Live web app',
    stat: 'Similarity index cut 97% (1.24 GB → 30 MB)',
    body: [
      'A live movie and TV recommender I took from idea to public launch on my own. Recommendations come from a two-stage pipeline: TF-IDF content matching finds candidates, then reranking for quality, recency and collaborative filtering orders them.',
      'It covers 20+ genres, 5 languages and 22+ regional markets, with Google sign-in, a personal watchlist and live TMDB data.',
      'The biggest constraint was size: I cut the similarity index by 97% (1.24 GB to 30 MB) so it could run on Render with PostgreSQL.',
    ],
    tags: ['Python · Flask', 'Recommender Systems', 'TF-IDF', 'Collaborative Filtering', 'PostgreSQL', 'Google OAuth'],
    meta: [
      { label: 'Role', value: 'Product & engineering, solo' },
      { label: 'Stack', value: 'Python · Flask · scikit-learn · PostgreSQL · Render · TMDB API' },
      { label: 'Live site', value: 'movierec-gzsa.onrender.com' },
    ],
    links: [
      { label: 'Live demo', href: 'https://movierec-gzsa.onrender.com' },
      { label: 'GitHub', href: 'https://github.com/helena-byte999/MovieRec' },
    ],
    cover: { kind: 'laptop', src: img('movierec', 1) },
    card: img('movierec', 1),
    slides: [
      { src: img('movierec', 1), title: 'Project overview', text: 'Search any title and get recommendations instantly, browse curated genre rows (Action, K-Drama, Romance, Bollywood and more), and save titles to a personal Watchlist. The live site supports 5 languages and 22 global regions.' },
      { src: img('movierec', 2), title: 'Watchlist & user features', text: 'Signed-in users get a personal Watchlist: save any title, mark it as watched, and recommendations improve from that history. Guest Watchlists transfer to the account on sign-up. Google OAuth and email/password login.' },
      { src: img('movierec', 3), title: 'Stage 1: content retrieval', text: 'TF-IDF vectorisation over genres, cast, keywords and overview builds a sparse cosine-similarity index, compressed from 1.24 GB to 30 MB so it runs on a free server. The top 300 candidates come back per query in milliseconds.' },
      { src: img('movierec', 4), title: 'Stage 2: reranking & personalisation', text: 'Candidates are reranked on a blended score: content similarity, Bayesian quality weighting (Rotten Tomatoes and Metacritic) and a recency boost for 2022+ titles. For signed-in users, item-based collaborative filtering blends in a personal affinity vector.' },
    ],
  },
  {
    slug: 'cuepoint',
    shelves: ['built'],
    title: 'Cuepoint',
    kicker: 'Built & Published · Music Tech · Python',
    year: '2026',
    summary: 'An open-source DJ tool that tells you what to play next and the exact bar to bring it in.',
    role: 'Product & Engineering, solo · Open source',
    stat: '1,700+ downloads on PyPI',
    body: [
      'DJ tools say two records match because they share a key and tempo, then the mix falls apart live. This one came straight out of my own sets.',
      'Cuepoint reads an already-analysed rekordbox library (read-only), recommends the next track and the exact mix-in point, and plays the transition back so the DJ can hear the call instead of trusting it.',
      'Each suggestion is scored across 7 weighted components, with thresholds measured from real audio rather than guessed. Published as open source on PyPI, where it has 1,700+ downloads.',
    ],
    tags: ['User Problem from DJing', 'Recommendation', 'Audio / DSP', 'Open Source'],
    meta: [
      { label: 'Role', value: 'Product & engineering, solo' },
      { label: 'Stack', value: 'Python · NumPy · SciPy' },
      { label: 'Install', value: 'pip install git+https://github.com/helena-byte999/cuepoint' },
    ],
    links: [
      { label: 'GitHub', href: 'https://github.com/helena-byte999/cuepoint' },
      { label: 'PyPI', href: 'https://pypi.org/project/cuepoint/' },
    ],
    cover: {
      kind: 'terminal',
      lines: [
        '$ cuepoint next "Ten to Eleven"',
        '1. #########. 0.92  Find Your Corner',
        '   126.0 BPM   C (8B)',
        '   out at 2:17 (peak) -> in at 0:30 (build)  4 bars',
        '   tempo 1.00  groove 1.00  vocal 0.98  harmonic 1.00',
      ],
    },
    slides: [],
  },
  {
    slug: 'peerpods',
    shelves: ['research'],
    title: 'PeerPods',
    kicker: 'Product Definition · User Research · MSc AI',
    year: '2025',
    summary: 'An AI-powered music community product, taken from user needs to an evaluated prototype.',
    role: 'Product & IUI Designer · KV7005 Intelligent User Interfaces',
    stat: '3 personas · 6 platforms benchmarked',
    body: [
      'A context-aware product for music reflection and community. I found user needs through social listening on X, benchmarked 6 competing platforms, and built 3 personas and a requirements traceability map.',
      'From there I took it from lo-fi wireframes to a hi-fi Figma prototype, tested in think-aloud sessions with 3 participants.',
      'The AI features include adaptive writing prompts, context-aware feed re-weighting, an onboarding-driven recommender, and personalisation signals the user controls.',
    ],
    tags: ['User Research', 'Competitive Analysis', 'Requirements Traceability', 'Figma Prototype', 'Think-Aloud Evaluation'],
    meta: [
      { label: 'Role', value: 'IUI Designer · UX Researcher · Prototype Designer' },
      { label: 'Tools', value: 'Figma · X (social listening) · Think-aloud protocol' },
      { label: 'Module', value: 'KV7005 Intelligent User Interfaces · MSc AI · 2025' },
    ],
    links: [{ label: 'Full presentation (PDF)', href: '/asset/pdf/PeerPods_Presentation.pdf' }],
    cover: { kind: 'slide', src: img('peerpods', 1) },
    card: img('peerpods', 1),
    slides: [
      ['PeerPods', 'A context-aware intelligent user interface for music reflection and community, designed as a calm companion layer alongside existing music platforms for writing, discovery and peer connection.'],
      ['Problem statement', 'Music reflection is already happening on Substack, Reddit, X and Medium, but scattered across platforms not built for it. Six public X posts surfaced four recurring needs: structured listening, long-form review spaces, contextual playlist sharing and like-minded community.'],
      ['What is PeerPods?', 'Reflective writing with adaptive prompts, guided listening parties and clubs, playlist sharing with context, and onboarding-driven recommendations with visible, adjustable signals.'],
      ['Intelligence', 'Four intelligent behaviours: adaptive writing prompts that evolve with the draft and listening history; content visibility that adapts to release cycles and reading behaviour; a recommender with explicit onboarding signals; and user control as a first-class feature, with every toggle visible.'],
      ['Research approach', 'Three strands: social listening on X (6 posts coded), competitive analysis across 6 platforms (Letterboxd, Medium, Substack, Reddit, Spotify, SoundCloud), and synthesis into 3 personas.'],
      ['Persona 1: Amara Johnson', 'Amara, 23, is a Creative Arts student in London. She listens daily and sometimes writes about music, but finds apps overwhelming. She needs a dedicated space for reflections, context-aware prompts and interest-based communities she controls.'],
      ['Persona 2: Daniel Ekong', 'Daniel, 25, works in technical support in Port Harcourt. He shares playlists actively, but his posts get lost in fast-moving feeds. He needs playlist sharing with context and messaging built into the music discussion.'],
      ['Persona 3: Munachi Umeh', 'Munachi, 35, is a Product Designer in Lagos. She listens 5+ hours a day and is highly aware of AI behaviour. She wants transparent, diverse recommendations beyond mainstream trends, and control over personalisation before she trusts it.'],
      ['Requirements', 'Every functional requirement traces to a user statement: F1 structured reflections, F2 context-aware writing prompts, F3 listening parties, F4 music clubs, F5 playlist sharing with context, F6 onboarding-driven For You with opt-out. No feature without evidence.'],
      ['Primary scenario: Amara', 'Amara plays a track on Spotify. PeerPods detects it and offers a dismissable prompt, "Pod your thought?" She taps Write now, the song attaches, she drafts a paragraph, and Smart Prompts appear, grounded in her draft. She posts to her fan club.'],
      ['Lo-fi wireframes', 'Listening detection triggers a gentle notification; tapping opens compose with the track attached; Smart Prompts appear after the first paragraph with an on/off toggle; the finished pod lands in the For You feed.'],
      ['Breadth scenarios', 'Daniel\'s feed re-weights as a Tyler, the Creator drop approaches and 14 members join a synced Listen Together session. Munachi long-presses a mainstream rec, asks for more underground, adjusts her feed sliders, and the feed re-reasons immediately.'],
      ['Information architecture', 'Five top-level sections: Home (For You / Following), Community, Listening Parties (Live / Upcoming), Compose (Reflection / Playlist / Tracks) and Profile (Settings / Opt-outs).'],
      ['Hi-fi prototype', 'Five high-fidelity Figma screens: Home with Smart Prompts drawer, Compose with adaptive prompts, a Listening Party with synced playback and chat, Community discovery, and the Personalisation settings panel.'],
      ['The intelligence, made visible', 'Track auto-attached when listening is detected; Smart Prompts after the first paragraph with a toggle; a global off switch; signal sliders showing what shapes the feed; "Not for me" with reason capture; and live feed re-reasoning.'],
      ['Evaluation: think-aloud', 'Think-aloud sessions over Teams with 3 participants mapped to the personas. Six tasks: onboarding, writing a reflection, joining a community, hosting a listening party, dismissing a rec and adjusting feed signals.'],
      ['Findings', 'Smart Prompts were moved to after the first paragraph ("why is it interrupting me before I\'ve even started?"), a long-press hint was added, and the listening-party invite went from 3 steps to 1. The personalisation panel earned trust.'],
      ['Reflection', 'Strong on context recognition, scaffolded writing and transparent control. Weak on cold-start recommendations in week 1, and writing-first excludes voice or photo reflectors. Three participants can\'t measure long-term engagement. Traceability forced every feature to be evidence-backed.'],
    ].map(([title, text], i) => ({ src: img('peerpods', i + 1), title, text })),
  },
  {
    slug: 'kuda-teens',
    shelves: ['product'],
    title: 'Kuda Teens',
    kicker: 'Product Discovery · Fintech · Concept',
    year: '2023',
    summary: 'A concept case study: a teen debit card taken from riskiest assumptions to a scoped MVP and user stories.',
    role: 'Product Manager · UX Researcher · Market Analyst',
    stat: '5 parents + 3 teens interviewed',
    body: [
      'A product discovery case study for a teen feature at Kuda, the Nigerian digital bank: a prepaid debit card that gives teenagers spending independence while keeping parents in control.',
      'I ranked the riskiest assumptions by importance and risk, researched the market, interviewed both parents and teens, prioritised features with MoSCoW and a value-versus-effort map, and wrote the MVP\'s user stories.',
      'This is a concept study, not a shipped Kuda product.',
    ],
    tags: ['Assumption Mapping', 'User Interviews', 'MoSCoW', 'MVP Scoping', 'User Stories'],
    meta: [
      { label: 'Role', value: 'Product Manager · UX Researcher · Market Analyst' },
      { label: 'Tools', value: 'Figma · Canva · Google Forms · Photoshop' },
      { label: 'Timeline', value: 'July 2023' },
    ],
    links: [],
    cover: { kind: 'slide', src: img('kuda-teens', 1) },
    card: img('kuda-teens', 1),
    slides: [
      ['Problem statement', 'Teens in Nigeria lacked a safe, controlled way to access and manage money, and parents had no visibility into their spending. Kuda Teens is a prepaid debit card and banking experience for teens aged 11–18 and their parents.'],
      ['Market research', 'Research segmented by demographics, geography, psychographics and behaviour identified tech-savvy, budget-conscious parents and financially curious teens as the core audience, across urban and rural Nigeria.'],
      ['Assumption mapping', 'I scored assumptions by importance and risk to decide what to validate first. The top one, that parents need controls to regulate teen spending, scored 10 on importance and drove early design decisions.'],
      ['Risk vs importance', 'Plotting assumptions on a risk-importance matrix surfaced the critical unknowns. High-risk, high-importance items such as merchant acceptance and parental controls were validated first.'],
      ['User research: parents', 'I interviewed 5 parents and 3 teens with a structured survey. Parents prioritised transparency and control; teens wanted independence and customisable card designs.'],
      ['User research: teens', 'Teens wanted financial independence, personalised card aesthetics and the ability to buy digital goods, which mapped to virtual card customisation and gift card support.'],
      ['Key findings', 'Two distinct needs: parents wanted oversight and financial literacy tools; teens wanted autonomy, personalisation and easy access to money for everyday purchases, gift cards and gaming.'],
      ['Feature prioritisation', 'MoSCoW plus T-shirt sizing across four pillars (Security & Privacy, Digital Experience, Card Design, Parent Controls) kept the MVP achievable without losing core value.'],
      ['MVP definition', 'A value vs effort map defined the MVP. Quick wins like data privacy, login and virtual card activation came first; social features and interactive budgeting tools were scoped for later releases.'],
      ['User stories', 'User stories for both personas covered transaction visibility, spending limits, real-time notifications and financial education, forming the backlog.'],
    ].map(([title, text], i) => ({ src: img('kuda-teens', i + 1), title, text })),
  },
  {
    slug: 'ufit',
    shelves: ['research'],
    title: 'UFit',
    kicker: 'UX Research & Design · Design Thinking',
    summary: 'A fitness and nutrition app taken through a full design-thinking cycle, from interviews to a usability-tested prototype.',
    role: 'UX Designer · User Researcher · Prototype Designer',
    stat: '2 usability-tested flows',
    body: [
      'A full design-thinking cycle for UFit, a mobile fitness and nutrition app.',
      'User interviews and affinity mapping found the real problem; low-fi wireframes and a Whimsical prototype explored the solution; structured usability testing checked it before anything was built.',
    ],
    tags: ['User Interviews', 'Affinity Mapping', 'Prototyping', 'Usability Testing'],
    meta: [
      { label: 'Role', value: 'UX Designer · User Researcher · Prototype Designer' },
      { label: 'Tools', value: 'Whimsical · Google Forms · Figma · Canva' },
      { label: 'Method', value: 'Design Thinking · Interviews · Affinity Mapping · Usability Testing' },
    ],
    links: [],
    cover: { kind: 'slide', src: img('ufit', 1) },
    card: img('ufit', 1),
    slides: [
      ['Project overview', 'UFit helps people track workouts, set goals and get personalised meal recommendations. I led the full UX process, from user research to prototype testing.'],
      ['User research', 'Scripted interviews covered fitness habits, nutrition tracking, pain points with existing apps, and interest in personalised coaching.'],
      ['Affinity map', 'Responses were grouped into eight themes, from exercise preferences and workout frequency to nutritional goals, to find patterns and prioritise features.'],
      ['User persona', 'Sarah Jones, 27, a software engineer and fitness enthusiast who struggles to fit her routine around a busy career and needs a flexible, personalised app.'],
      ['Problem statement', 'How might we help busy professionals like Sarah reach their fitness and nutrition goals with flexible plans, full nutrition tracking and incentives that keep them on track?'],
      ['Lightning demo', 'A rapid review of competing fitness apps covered metrics, personalisation, goal setting, workout plans and meal preferences, and showed where UFit could stand out.'],
      ['Brainstorming', 'Ideas included AI food analysis, personalised workouts, a social feed, challenges, allergy detection, wearables and progress sharing, each judged on feasibility and user value.'],
      ['Lo-fi wireframes, part 1', 'Hand sketches mapped the core flows (dashboard, meal plan, workout tracker, community, wearables, coach, profile, settings) to test the information architecture.'],
      ['Lo-fi wireframes, part 2', 'A second round refined login, plan selection and progress logging, converging on a flow with fewer steps that still captured personalisation data up front.'],
      ['Whimsical prototype', 'A mid-fidelity prototype of five key screens (dashboard, plan selector, workout plan, logged confirmation and weekly progress) used directly in usability testing.'],
      ['Usability testing: flow 1', 'Participants were asked where they would log a workout. Most went straight to the plus icon on the nav bar, validating the navigation pattern.'],
      ['Usability testing: flow 2', 'Participants identified the plan screen and where to log workouts. The workout card labels proved intuitive and fed the final copy and icon decisions.'],
    ].map(([title, text], i) => ({ src: img('ufit', i + 2), title, text })),
  },
];

/** Work that doesn't need a full case study page. */
export const B_SIDES = [
  {
    title: 'Human-AI Collaboration in Music Streaming & Production',
    kicker: 'AI Research · Academic paper · MSc AI · 2025',
    text: 'How collaborative filtering (the engine behind Spotify recommendations) and GANs (MuseGAN, GANSynth) shape music streaming and production, evaluated with NDCG and Recall@N, and what that means for creativity and authorship.',
    link: { label: 'Read the paper (PDF)', href: '/asset/pdf/HAIC_Music_Streaming_Production_Ena_Helena_Otuokon.pdf' },
  },
];
