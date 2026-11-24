/* =========================================================
   ✏️  TOUT TON CONTENU EST ICI — modifie juste ce fichier
   ========================================================= */
const SITE = {
  name: "Kylian Maton",
  avatar: "",            // ex: "assets/img/photo.webp" (vide = initiale)
  initial: "K",

  /* ---------- Textes traduits ---------- */
  i18n: {
    fr: {
      tagline: "Biotech · Code · Science",
      "nav.me": "Moi",
      "nav.work": "Mes projets",
      "nav.contact": "Contact",
      "nav.links": "Liens utiles",
      "side.lang": "Langue",
      "side.music": "Musique",
      "side.bg": "Fond",
      "side.style": "Style",
      "side.theme": "Thème",
      "theme.white": "Blanc",
      "theme.green": "Vert",
      "side.offline": "Version hors ligne",
      "side.offlineSub": "Tout le site en un fichier",
      "style.term": "Terminal",
      "style.normal": "Normal",
      "bg.matrix": "Matrix",
      "bg.life": "Vie",
      "bg.lightning": "Éclairs",
      "bg.neutral": "Neutre",
      "music.empty": "Bientôt de la musique",
      about: "Étudiant en Master Biotechnologie à Toulouse, entre paillasse, modélisation et code. Mon parcours complet est sur la page CV.",
      copied: "Copié !",
      "igem.name": "Wiki iGEM 2026",
      "cv.visit": "Voir le wiki",
      "cv.open": "CV",
      "cv.openSub": "Version interactive",
      "cv.back": "← Retour",
      "cv.print": "🖨 Imprimer",
      "cv.summary": "Profil",
      "cv.interests": "Centres d'intérêt",
      "cv.download": "Télécharger le PDF",
      "cv.experience": "Expériences",
      "cv.education": "Formation",
      "cv.skills": "Compétences",
      "cv.languages": "Langues",
      "contact.intro": "Le meilleur moyen de me joindre :",
      "links.intro": "Des liens que je trouve utiles ou que j'utilise souvent.",
    },
    en: {
      tagline: "Biotech · Code · Science",
      "nav.me": "About me",
      "nav.work": "My work",
      "nav.contact": "Contact",
      "nav.links": "Useful links",
      "side.lang": "Language",
      "side.music": "Music",
      "side.bg": "Background",
      "side.style": "Style",
      "side.theme": "Theme",
      "theme.white": "White",
      "theme.green": "Green",
      "side.offline": "Offline version",
      "side.offlineSub": "The whole site in one file",
      "style.term": "Terminal",
      "style.normal": "Normal",
      "bg.matrix": "Matrix",
      "bg.life": "Life",
      "bg.lightning": "Lightning",
      "bg.neutral": "Plain",
      "music.empty": "Music coming soon",
      about: "Biotechnology Master's student in Toulouse, between the bench, modelling and code. My full background is on the resume page.",
      copied: "Copied!",
      "igem.name": "iGEM 2026 wiki",
      "cv.visit": "See the wiki",
      "cv.open": "Resume",
      "cv.openSub": "Interactive version",
      "cv.back": "← Back",
      "cv.print": "🖨 Print",
      "cv.summary": "Profile",
      "cv.interests": "Interests",
      "cv.download": "Download PDF",
      "cv.experience": "Experience",
      "cv.education": "Education",
      "cv.skills": "Skills",
      "cv.languages": "Languages",
      "contact.intro": "The best ways to reach me:",
      "links.intro": "Links I find useful or use a lot.",
    },
  },

  /* PDF à télécharger selon la langue (chemins depuis la racine du site) */
  cvPdf: {
    fr: { file: "assets/files/CV.pdf", name: "CV_Kylian_Maton.pdf" },
    en: { file: "assets/files/CV_EN.pdf", name: "Resume_Kylian_Maton.pdf" },
  },

  /* ---------- CV (texte {fr, en} ou simple texte) ---------- */
  cv: {
    fullName: "Kylian Maton",
    title: { fr: "Étudiant en Master Biotechnologie", en: "Biotechnology Master's student" },
    location: "Toulouse",
    summary: {
      fr: "Étudiant en biologie structurale et biotechnologie, passionné par la modélisation computationnelle, l'informatique et la recherche.",
      en: "Structural biology and biotechnology student, passionate about computational modelling, computing and research.",
    },
    facts: [
      { icon: "🎂", text: { fr: "23 ans", en: "23 years old" } },
      { icon: "📍", text: "Toulouse" },
      { icon: "🚗", text: { fr: "Permis B", en: "Driving licence" } },
      { icon: "🇫🇷", text: { fr: "Français", en: "French" } },
    ],
  },

  experience: [
    {
      date: { fr: "Jan. 2026 — Nov. 2026", en: "Jan. 2026 — Nov. 2026" },
      title: { fr: "Compétition iGEM", en: "iGEM Competition" },
      place: "iGEM Toulouse INSA-UT",
      link: "https://2026.igem.wiki/toulouse-insa-ut/",
      bullets: [
        { fr: "Responsable de la modélisation computationnelle du projet", en: "Led the project's computational modelling" },
        { fr: "Développement et architecture du wiki scientifique", en: "Designed and built the scientific wiki" },
        { fr: "Manipulations de biologie moléculaire en laboratoire (wet lab)", en: "Molecular biology lab work (wet lab)" },
        { fr: "Recherche de financements", en: "Fundraising" },
      ],
      tags: [{ fr: "Modélisation", en: "Modelling" }, "Web", "Wet lab"],
    },
    {
      date: { fr: "Oct. 2025 — Déc. 2025", en: "Oct. 2025 — Dec. 2025" },
      title: { fr: "Stage de recherche (2 mois)", en: "Research internship (2 months)" },
      place: { fr: "IPBS — Institut de Pharmacologie et de Biologie Structurale, Toulouse", en: "IPBS — Institute of Pharmacology and Structural Biology, Toulouse" },
      bullets: [
        { fr: "Équipe « RMN biologique intégrative »", en: "Integrative Biological NMR team" },
      ],
      tags: [{ fr: "RMN", en: "NMR" }],
    },
    {
      date: { fr: "Depuis avr. 2022", en: "Since Apr. 2022" },
      title: { fr: "Caporal — Réserve opérationnelle de l'Armée de Terre", en: "Corporal — French Army operational reserve" },
      place: { fr: "3ème RPIMa, Carcassonne", en: "3rd Marine Infantry Parachute Regiment (3e RPIMa), Carcassonne" },
      bullets: [
        { fr: "40 à 50 jours de service par an en moyenne", en: "40–50 days of service per year on average" },
        { fr: "Missions de sécurité intérieure (Opération Sentinelle, dont JO Paris 2024)", en: "Homeland security missions (Operation Sentinelle, incl. Paris 2024 Olympics)" },
        { fr: "Encadrement et direction d'un groupe sur le terrain", en: "Led a team in the field" },
        { fr: "Formation et accompagnement des réservistes", en: "Trained and mentored reservists" },
        { fr: "Secourisme et intervention en situation d'urgence", en: "First aid and emergency response" },
      ],
      tags: ["Leadership", { fr: "Secourisme", en: "First aid" }],
    },
  ],
  education: [
    {
      date: { fr: "Depuis 2025", en: "Since 2025" },
      title: { fr: "Master Biotechnologie", en: "Master's in Biotechnology" },
      place: { fr: "Université de Toulouse", en: "University of Toulouse" },
      bullets: [{ fr: "Parcours Biomolecular Sciences : Mechanisms and Therapeutic Targets", en: "Biomolecular Sciences: Mechanisms and Therapeutic Targets track" }],
    },
    {
      date: "2022 — 2025",
      title: { fr: "Licence Sciences de la Vie", en: "Bachelor's in Life Sciences" },
      place: { fr: "Université de Toulouse", en: "University of Toulouse" },
      bullets: [
        { fr: "Parcours Biochimie, Biologie Moléculaire et Microbiologie", en: "Biochemistry, Molecular Biology and Microbiology track" },
        { fr: "Options : techniques d'identification structurale (L2), études structure/fonction des biomolécules (L3)", en: "Electives: structural identification techniques (2nd year), structure–function studies of biomolecules (3rd year)" },
      ],
    },
    {
      date: "2021 — 2022",
      title: { fr: "1ère année de BTS Gestion et Protection de la Nature", en: "First year of a two-year technical degree (BTS) in Nature Management and Protection" },
      place: { fr: "Lycée Agricole Charlemagne, Carcassonne", en: "Charlemagne Agricultural High School, Carcassonne" },
    },
    {
      date: "2018 — 2021",
      title: { fr: "Baccalauréat Général", en: "French Baccalaureate (high school diploma)" },
      place: { fr: "Lycée Jean Pierre Vernant, Pins-Justaret", en: "Jean-Pierre Vernant High School, Pins-Justaret" },
      bullets: [{ fr: "Physique-Chimie, SVT, Maths complémentaires, EPS", en: "Physics & Chemistry, Life & Earth Sciences, Advanced Maths, PE" }],
    },
  ],
  skills: [
    { group: { fr: "Analyse & purification", en: "Analysis & purification" }, items: ["HPLC", "GC-MS", { fr: "RMN", en: "NMR" }, { fr: "Chromatographie d'affinité (IMAC)", en: "Affinity chromatography (IMAC)" }] },
    { group: { fr: "Informatique", en: "Computing" }, items: [{ fr: "Modélisation computationnelle", en: "Computational modelling" }, { fr: "Développement web", en: "Web development" }, "Linux", "Git"] },
    { group: { fr: "Savoir-être", en: "Soft skills" }, items: ["Leadership", { fr: "Travail en équipe", en: "Teamwork" }, { fr: "Gestion du stress", en: "Stress management" }, { fr: "Transmission", en: "Training & mentoring" }] },
  ],
  languages: [
    { name: { fr: "Français", en: "French" }, level: { fr: "Langue maternelle", en: "Native" }, value: 100 },
    { name: { fr: "Anglais", en: "English" }, level: "TOEIC 800", value: 80 },
  ],
  interests: [
    { icon: "💻", text: { fr: "Informatique", en: "Computing" } },
    { icon: "🔬", text: { fr: "Science", en: "Science" } },
    { icon: "🏃", text: { fr: "Sports d'équipe & individuels", en: "Team & individual sports" } },
    { icon: "📜", text: { fr: "Histoire", en: "History" } },
  ],

  /* ---------- Contact ---------- */
  contact: [
    /* icon = clé de assets/js/icons.js · sub vide = l'URL s'affiche
       copy: "texte" = un clic copie le texte au lieu d'ouvrir un lien */
    { name: "Email", url: "mailto:kylian.maton@protonmail.com", icon: "mail" },
    { name: { fr: "Téléphone", en: "Phone" }, sub: "+33 7 82 85 72 15", url: "tel:+33782857215", icon: "phone" },
    { name: "LinkedIn", url: "https://www.linkedin.com/in/kykyuwu/", icon: "linkedin" },
    { name: "Discord", sub: "kykyuwu", copy: "kykyuwu", icon: "discord" },
  ],

  /* ---------- Mes projets ---------- */
  work: [
    { name: "GitHub", url: "https://github.com/kykyUwU", icon: "github" },
    { name: { fr: "Chiralys — Wiki iGEM 2026", en: "Chiralys — iGEM 2026 wiki" }, url: "https://2026.igem.wiki/toulouse-insa-ut/", icon: "dna" },
  ],

  /* ---------- Liens utiles ---------- */
  links: [
    { name: "stggege", url: "https://stggege.com/", icon: "link" },
    { name: "squid.wtf", url: "https://squid.wtf/", icon: "link" },
    { name: "Skidrow Codex", url: "https://www.skidrowcodex.net/", icon: "link" },
    { name: "Bonjour la fuite", url: "https://bonjourlafuite.eu.org/", icon: "link" },
  ],

  /* ---------- Musique (on remplira plus tard) ----------
     ex: { title: "Titre", artist: "Artiste", src: "assets/music/son.mp3", cover: "assets/img/cover.webp" } */
  music: [
    { title: "Goosebumps", artist: "Caspro", src: "assets/music/goosebumps.mp3" },
    { title: "Dreamfish", artist: "Martin Galway", src: "assets/music/dreamfish.mp3" },
    { title: "Pump", artist: "Lost Years", src: "assets/music/pump.mp3" },
  ],
};
