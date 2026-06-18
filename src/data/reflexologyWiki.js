export const reflexologyWikiIntro =
  "A compact reflexology reference library for learning the maps, terms, gentle techniques and safety basics. This content is educational and complementary; it is not a cure, diagnosis or medical treatment.";

export const reflexologyWikiCategories = [
  {
    key: "basics",
    icon: "📘",
    title: "Reflexology Basics",
    description: "Core ideas, map logic and how to read the hand and foot charts safely.",
    articles: ["what-reflexology-is", "zone-theory"],
  },
  {
    key: "maps",
    icon: "🗺️",
    title: "Maps & Points",
    description: "How left/right maps, organ regions and named relief points are organized.",
    articles: ["left-right-maps", "hand-valley-li4"],
  },
  {
    key: "systems",
    icon: "🫁",
    title: "Body Systems",
    description: "Traditional reflex areas grouped by body system for quick lookup.",
    articles: ["digestive-reflexes", "breathing-reflexes"],
  },
  {
    key: "techniques",
    icon: "🤲",
    title: "Techniques",
    description: "Gentle pressure, thumb walking and short self-care session structure.",
    articles: ["gentle-pressure", "thumb-walking"],
  },
  {
    key: "safety",
    icon: "⚠️",
    title: "Safety & Cautions",
    description: "When to use lighter pressure, skip an area or ask a healthcare professional.",
    articles: ["general-safety", "pregnancy-and-injury"],
  },
  {
    key: "evidence",
    icon: "🔬",
    title: "Research & Evidence",
    description: "Balanced notes on current evidence, comfort care and limits of claims.",
    articles: ["evidence-overview", "complementary-care"],
  },
  {
    key: "glossary",
    icon: "🔤",
    title: "Glossary",
    description: "Plain-language definitions for terms used in the maps and relief-point guide.",
    articles: ["common-terms", "acupressure-vs-reflexology"],
  },
];

export const reflexologyWikiArticles = {
  "what-reflexology-is": {
    title: "What Reflexology Is",
    category: "Reflexology Basics",
    overview:
      "Reflexology is a complementary touch practice that applies pressure to mapped areas of the feet, hands or ears. It is used for relaxation and comfort, not to diagnose or treat disease.",
    location:
      "Not a single point. The practice uses charted areas across the feet, hands and sometimes ears.",
    traditionalUse:
      "Traditional reflexology systems associate mapped areas with body regions and use touch to support relaxation and body awareness.",
    howToApply:
      "Use slow, gentle pressure with a thumb or finger for 20-40 seconds. Keep the pressure comfortable and stop if the area feels sharp, numb or irritated.",
    safety:
      "Avoid injured, swollen, infected or painful tissue. For ongoing symptoms, serious illness, pregnancy or circulation concerns, ask a qualified healthcare professional before using reflexology.",
    related: ["Zone Theory", "Gentle Pressure Method", "General Safety Notes"],
    sources: [
      { label: "NCCIH: Reflexology", url: "https://www.nccih.nih.gov/health/reflexology" },
      {
        label: "Cancer Research UK: Reflexology",
        url: "https://www.cancerresearchuk.org/about-cancer/treatment/complementary-alternative-therapies/individual-therapies/reflexology",
      },
    ],
  },
  "zone-theory": {
    title: "Zone Theory",
    category: "Reflexology Basics",
    overview:
      "Zone theory is the map idea behind many reflexology charts: the body is divided into lengthwise zones, and points on the feet or hands are traditionally linked to areas in those zones.",
    location: "Used across the full hand and foot maps rather than one pressure point.",
    traditionalUse:
      "Practitioners use zones to choose a general area, then work slowly through nearby reflexes instead of pressing one exact medical target.",
    howToApply:
      "Trace a comfortable line through the related area with light thumb pressure, pausing on tender spots without forcing deeper pressure.",
    safety:
      "Tenderness on a map is not a diagnosis. Do not use a sore reflex as proof that an organ or system has a medical problem.",
    related: ["What Reflexology Is", "Left and Right Maps", "Common Reflexology Terms"],
    sources: [{ label: "NCCIH: Reflexology", url: "https://www.nccih.nih.gov/health/reflexology" }],
  },
  "left-right-maps": {
    title: "Left and Right Maps",
    category: "Maps & Points",
    overview:
      "Left and right charts mirror the body's sides. Some traditional maps place side-specific organs on only one hand or foot, such as heart and spleen on the left and liver, gallbladder and appendix on the right.",
    location: "Switch between left and right hand or foot in the Organ Map tab.",
    traditionalUse:
      "Traditional charts use side-specific maps for orientation and for choosing related reflex areas during a relaxation session.",
    howToApply:
      "Start with the matching side, press gently in small circles, then compare with the opposite side only for comfort and balance.",
    safety:
      "Do not use side differences to self-diagnose. Sudden, severe or one-sided symptoms need medical evaluation.",
    related: ["Digestive Reflex Areas", "Breathing and Chest Reflex Areas", "Zone Theory"],
    sources: [{ label: "NCCIH: Reflexology", url: "https://www.nccih.nih.gov/health/reflexology" }],
  },
  "hand-valley-li4": {
    title: "Hand Valley (LI4 / Hegu)",
    category: "Maps & Points",
    overview:
      "Hand Valley is a common acupressure point in the webbing between the thumb and index finger. In this app it appears in Relief Points for comfort-focused self-care.",
    location: "In the firm webbing between the thumb and index finger.",
    traditionalUse:
      "Traditionally used in acupressure for head, face and general tension patterns. It is a comfort practice, not a treatment for headache causes.",
    howToApply:
      "Pinch the webbing with the opposite thumb and index finger. Massage in small circles for 30 seconds to 2 minutes while breathing slowly.",
    safety:
      "Avoid during pregnancy because this point is traditionally cautioned for possible contraction stimulation. Skip if the hand is injured, swollen or painful.",
    related: ["General Safety Notes", "Acupressure vs. Reflexology", "Gentle Pressure Method"],
    sources: [
      { label: "NCCIH: Reflexology", url: "https://www.nccih.nih.gov/health/reflexology" },
      {
        label: "University of Minnesota: Reflexology contraindications",
        url: "https://www.takingcharge.csh.umn.edu/are-there-times-when-i-shouldnt-have-reflexology",
      },
    ],
  },
  "digestive-reflexes": {
    title: "Digestive Reflex Areas",
    category: "Body Systems",
    overview:
      "Digestive reflex areas include traditional map regions for the stomach, liver, gallbladder, pancreas, intestines and colon.",
    location:
      "Usually shown through the middle and lower palm or foot arch, with side-specific organs on left or right maps.",
    traditionalUse:
      "Used traditionally as part of relaxation routines for abdominal comfort and body awareness.",
    howToApply:
      "Use light thumb circles through the mapped area for short passes. Keep pressure broad and gentle rather than poking deeply.",
    safety:
      "Do not use reflexology for severe abdominal pain, vomiting, fever, blood in stool or other urgent symptoms. Seek medical care for concerning digestive symptoms.",
    related: ["Left and Right Maps", "Gentle Pressure Method", "Evidence Overview"],
    sources: [{ label: "NCCIH: Reflexology", url: "https://www.nccih.nih.gov/health/reflexology" }],
  },
  "breathing-reflexes": {
    title: "Breathing and Chest Reflex Areas",
    category: "Body Systems",
    overview:
      "Chest-related reflexes include traditional areas for lungs, diaphragm, thymus, shoulder and solar plexus.",
    location: "Often shown around the ball of the foot or upper palm, depending on the chart.",
    traditionalUse:
      "Traditionally used during calming routines to pair relaxed touch with slower breathing.",
    howToApply:
      "Press softly around the mapped area while taking slow breaths. Keep the session brief and comfortable.",
    safety:
      "Breathing trouble, chest pain, faintness or blue lips are emergency symptoms. Reflexology is not appropriate as first aid for these symptoms.",
    related: ["Gentle Pressure Method", "Complementary Care", "General Safety Notes"],
    sources: [
      { label: "NCCIH: Reflexology", url: "https://www.nccih.nih.gov/health/reflexology" },
      {
        label: "Cancer Research UK: Reflexology",
        url: "https://www.cancerresearchuk.org/about-cancer/treatment/complementary-alternative-therapies/individual-therapies/reflexology",
      },
    ],
  },
  "gentle-pressure": {
    title: "Gentle Pressure Method",
    category: "Techniques",
    overview:
      "Gentle pressure is the default self-care method in this app. The goal is comfort and relaxation, not pain tolerance.",
    location: "Any selected reflex point or mapped region that is healthy, uninjured skin.",
    traditionalUse:
      "Reflexology sessions often use repeated light-to-moderate pressure to encourage relaxation.",
    howToApply:
      "Press with the thumb pad, breathe slowly, hold or circle for 20-40 seconds, then release gradually. Use less pressure on hands, feet, older skin or sensitive areas.",
    safety:
      "Pain, numbness, tingling that worsens, skin color change or sharp tenderness are signs to stop.",
    related: ["Thumb Walking", "General Safety Notes", "What Reflexology Is"],
    sources: [
      {
        label: "Cancer Research UK: Reflexology",
        url: "https://www.cancerresearchuk.org/about-cancer/treatment/complementary-alternative-therapies/individual-therapies/reflexology",
      },
    ],
  },
  "thumb-walking": {
    title: "Thumb Walking",
    category: "Techniques",
    overview:
      "Thumb walking is a common reflexology technique that moves the thumb in small forward bends across a mapped area.",
    location:
      "Best suited to broader areas such as the arch, palm or heel rather than bony or injured spots.",
    traditionalUse: "Used to scan a zone gradually and keep pressure consistent during a session.",
    howToApply:
      "Bend and straighten the thumb in tiny steps, moving slowly across the area. Keep the wrist relaxed and the pressure light.",
    safety:
      "Stop if the thumb, wrist or point becomes sore. People with hand arthritis or wrist pain should keep sessions shorter or avoid this technique.",
    related: ["Gentle Pressure Method", "Zone Theory", "General Safety Notes"],
    sources: [{ label: "NCCIH: Reflexology", url: "https://www.nccih.nih.gov/health/reflexology" }],
  },
  "general-safety": {
    title: "General Safety Notes",
    category: "Safety & Cautions",
    overview:
      "Reflexology is usually discussed as a gentle complementary practice, but pressure work still needs common-sense limits.",
    location: "Applies to all hand and foot points.",
    traditionalUse:
      "Safety screening is part of professional complementary-care practice before touch therapies are used.",
    howToApply:
      "Start lighter than you think you need. Use short sessions, avoid broken skin, and never press through sharp pain.",
    safety:
      "Avoid areas with fractures, open wounds, active infection, burns, severe swelling, suspected clots or recent surgery. Ask a clinician first for diabetes-related foot issues, neuropathy, vascular disease, cancer care or pregnancy.",
    related: [
      "Pregnancy, Injury and Foot Conditions",
      "Evidence Overview",
      "Gentle Pressure Method",
    ],
    sources: [
      {
        label: "University of Minnesota: Reflexology contraindications",
        url: "https://www.takingcharge.csh.umn.edu/are-there-times-when-i-shouldnt-have-reflexology",
      },
      {
        label: "Macmillan Cancer Support: Touch therapies",
        url: "https://www.macmillan.org.uk/cancer-information-and-support/treatment/coping-with-treatment/complementary-therapies/massage-or-other-touch-therapies",
      },
    ],
  },
  "pregnancy-and-injury": {
    title: "Pregnancy, Injury and Foot Conditions",
    category: "Safety & Cautions",
    overview:
      "Some situations call for avoiding reflexology, using only very gentle touch or getting professional guidance first.",
    location:
      "Applies especially to feet, ankles, wrists, hands and acupressure points with pregnancy cautions.",
    traditionalUse:
      "Professional reflexologists usually adapt or postpone sessions when pressure could aggravate an injury or when health status needs clinical clearance.",
    howToApply:
      "If cleared to use reflexology, avoid strong pressure and keep sessions brief. Work around, not on, irritated or vulnerable tissue.",
    safety:
      "Avoid pressure on injured feet or hands, active gout, wounds or infected skin. During pregnancy, ask a qualified maternity clinician before using reflexology or acupressure.",
    related: ["Hand Valley (LI4 / Hegu)", "General Safety Notes", "Gentle Pressure Method"],
    sources: [
      {
        label: "University of Minnesota: Reflexology contraindications",
        url: "https://www.takingcharge.csh.umn.edu/are-there-times-when-i-shouldnt-have-reflexology",
      },
    ],
  },
  "evidence-overview": {
    title: "Evidence Overview",
    category: "Research & Evidence",
    overview:
      "Research on reflexology is mixed and limited. Some studies report symptom comfort or relaxation benefits, but evidence is not strong enough to treat reflexology as a cure or disease treatment.",
    location: "Applies to the practice as a whole rather than one point.",
    traditionalUse:
      "Modern use is often complementary: comfort, relaxation and coping support alongside conventional care.",
    howToApply:
      "Use reflexology as a low-risk relaxation practice when appropriate, while continuing medical care and prescribed treatment plans.",
    safety:
      "Do not delay diagnosis or medical treatment because a reflex point seems tender or because a session temporarily changes symptoms.",
    related: ["Complementary Care", "What Reflexology Is", "General Safety Notes"],
    sources: [
      { label: "NCCIH: Reflexology", url: "https://www.nccih.nih.gov/health/reflexology" },
      {
        label: "Macmillan Cancer Support: Touch therapies",
        url: "https://www.macmillan.org.uk/cancer-information-and-support/treatment/coping-with-treatment/complementary-therapies/massage-or-other-touch-therapies",
      },
    ],
  },
  "complementary-care": {
    title: "Complementary Care",
    category: "Research & Evidence",
    overview:
      "Complementary care means a practice is used alongside, not instead of, standard healthcare. Reflexology fits this category when used for comfort and relaxation.",
    location: "Any appropriate reflexology session or point routine.",
    traditionalUse:
      "Used to support relaxation, mood, coping and a sense of comfort during a broader wellness plan.",
    howToApply:
      "Keep pressure comfortable, tell your healthcare team about complementary practices when you have a medical condition, and follow clinical advice first.",
    safety:
      "Complementary does not mean risk-free. Ask for guidance if symptoms are new, severe, worsening or connected to a diagnosed condition.",
    related: ["Evidence Overview", "General Safety Notes", "Breathing and Chest Reflex Areas"],
    sources: [
      {
        label: "Cancer Research UK: Complementary therapies",
        url: "https://www.cancerresearchuk.org/about-cancer/treatment/complementary-alternative-therapies/individual-therapies/reflexology",
      },
      {
        label: "Blood Cancer UK: Complementary therapies",
        url: "https://bloodcancer.org.uk/understanding-blood-cancer/treatment/treatment-planning-types/complementary-alternative-therapies1/",
      },
    ],
  },
  "common-terms": {
    title: "Common Reflexology Terms",
    category: "Glossary",
    overview:
      "A quick glossary for words used in the app: reflex, zone, map, point, meridian, thumb walking and contraindication.",
    location: "Reference article, not a body point.",
    traditionalUse:
      "Shared vocabulary makes it easier to compare different maps without treating them as medical diagrams.",
    howToApply:
      "Use terms as orientation labels. A reflex label points to a traditional association, not a diagnosis.",
    safety:
      "Be cautious with any source that promises cures, organ detox, guaranteed results or diagnosis from foot tenderness.",
    related: ["Acupressure vs. Reflexology", "Zone Theory", "Evidence Overview"],
    sources: [{ label: "NCCIH: Reflexology", url: "https://www.nccih.nih.gov/health/reflexology" }],
  },
  "acupressure-vs-reflexology": {
    title: "Acupressure vs. Reflexology",
    category: "Glossary",
    overview:
      "Reflexology uses mapped reflex areas, often on feet and hands. Acupressure uses named points from East Asian medicine systems. This app includes both organ-map reflexes and a small relief-point set.",
    location:
      "Reflexology points are on hand and foot maps; acupressure relief points may sit on the hand, wrist or forearm.",
    traditionalUse:
      "Both traditions use touch and pressure, but their map systems and explanations are different.",
    howToApply:
      "Use the same gentle-pressure rules: comfortable pressure, slow breathing and no pressing on injured tissue.",
    safety:
      "Pregnancy cautions are especially important for some acupressure points. When unsure, skip the point and ask a qualified professional.",
    related: ["Hand Valley (LI4 / Hegu)", "General Safety Notes", "What Reflexology Is"],
    sources: [
      { label: "NCCIH: Reflexology", url: "https://www.nccih.nih.gov/health/reflexology" },
      {
        label: "University of Minnesota: Reflexology contraindications",
        url: "https://www.takingcharge.csh.umn.edu/are-there-times-when-i-shouldnt-have-reflexology",
      },
    ],
  },
};
