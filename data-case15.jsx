// data-case15.jsx — case studies restructured into the v15 format (copy kept verbatim from data.jsx)
window.CASE15 = window.CASE15 || {};
window.CASE15.p1 = {
  tags: ["Notability \u00d7 Berkeley Innovation", "Product Design 2025"],
  sections: [
    { id: "overview", nav: "Overview", eyebrow: "Overview", title: "How could Notability motivate students without turning learning into a game?", blocks: [
      { t: "fig", label: "Final Study Sessions walkthrough", caption: "A short video showing a student selecting notes, generating goals, completing a focused session, and reviewing their progress.", ratio: "16 / 9" },
    ] },
    { id: "problem", nav: "Problem Space", eyebrow: "Problem Space", title: "Notability Learn could do almost everything, but so could every other AI study tool.", blocks: [
      { t: "cols", items: ["Learn already offered summaries, flashcards, transcripts, and AI chat. Competitive products provided many of the same features.", "Adding another AI capability would not create a meaningful advantage. Notability needed to understand something generic tools could not: the student behind the material."] },
      { t: "fig", label: "Competitive landscape", caption: "A focused comparison of Notability Learn, StudyFetch, Knowt, and other competitors. Highlight the shared features and the opportunity around adaptive learning.", ratio: "16 / 8" },
    ] },
    { id: "research", nav: "Research", eyebrow: "Research", title: "Research overturned the original brief.", blocks: [
      { t: "p", body: ["We collected ", ["74 survey responses"], " and conducted interviews, a focus group, and diary studies across different subjects, learning preferences, and accessibility needs."] },
      { t: "p", body: "Students wanted motivation, but rejected nearly every conventional way of providing it." },
      { t: "cards", cols: 4, tone: "reject", items: [{ desc: "Streaks created pressure." }, { desc: "Badges felt childish." }, { desc: "Points rewarded activity instead of understanding." }, { desc: "Automatic answers made students question whether they were learning." }] },
      { t: "quote", text: "\u201cI don\u2019t want points. I want to know I\u2019m actually getting better.\u201d" },
      { t: "statement", body: ["The brief asked for gamification. The research revealed a need for ", ["evidence of progress"], "."] },
      { t: "fig", label: "Research summary", caption: "Three research findings connected directly to the product decisions they changed. Avoid showing an unedited affinity map.", ratio: "16 / 8" },
    ] },
    { id: "opportunity", nav: "Reframing the Brief", eyebrow: "Reframing the Brief", title: "Progress could motivate students without becoming performative.", body: "We reframed the project around four principles:", blocks: [
      { t: "cards", cols: 4, items: [{ n: "01", title: "Active learning", desc: "Help students think." }, { n: "02", title: "Personalization", desc: "Understand how each student learns." }, { n: "03", title: "Trust", desc: "Use material the student has actually studied." }, { n: "04", title: "Progress", desc: "Show improvement without artificial rewards." }] },
      { t: "p", body: "These principles became a filter for every concept, not a checklist added after designing." },
      { t: "fig", label: "Four product principles", caption: "Four concise cards with one supporting student quote or behavior under each principle.", ratio: "16 / 7" },
    ] },
    { id: "exploration", nav: "Exploring Directions", eyebrow: "Exploring Directions", title: "Four directions survived research. Only one connected the system.", body: "We explored:", blocks: [
      { t: "cards", cols: 4, tone: "chips", items: [{ n: "01", title: "Adaptive Learning Profiles" }, { n: "02", title: "AI Visualizations" }, { n: "03", title: "Reading Support" }, { n: "04", title: "Study Sessions", on: true }] },
      { t: "cols", items: ["We evaluated each direction based on student value, differentiation, and feasibility.", "Study Sessions became the primary direction because it acted on all four principles while making meaningful progress visible."] },
      { t: "fig", label: "Concept exploration", caption: "Early sketches or interface fragments for the four concepts.", ratio: "16 / 8" },
      { t: "fig", label: "Prioritization matrix", caption: "A simple matrix showing why Study Sessions scored highest across student value, differentiation, and feasibility.", ratio: "16 / 8" },
    ] },
    { id: "solution", nav: "Solution", eyebrow: "Solution", title: "Study Sessions give studying a beginning, middle, and end.", body: "Instead of rewarding students for opening Notability, Study Sessions turn their own notes into a focused plan.", blocks: [
      { t: "bento", items: [
        { area: "a", n: "01", title: "Start with my material", body: "Learn identifies relevant content from the notes already open.", src: "assets/notability/ss-content.png" },
        { area: "b", n: "02", title: "Help me decide what to do", body: "AI transforms that material into manageable learning goals instead of an unstructured chat.", src: "assets/notability/ss-goals.png" },
        { area: "c", n: "03", title: "Keep me focused", body: "A lightweight timer adds structure without streaks, points, or artificial urgency.", src: "assets/notability/comp-timer.png", tall: true },
        { area: "d", n: "04", title: "Show me what changed", body: "Session summaries connect progress to completed goals and understanding.", label: "Progress summary screen", ratio: "16 / 10", wide: true },
      ] },
      { t: "fig", label: "Four-screen product flow", caption: "Show note selection, generated goals, the active session, and the progress summary in sequence.", ratio: "16 / 7" },
    ] },
    { id: "iteration", nav: "Designing for Autonomy", eyebrow: "Designing for Autonomy", title: "The most important control lets students use less AI.", body: "Our early direction assumed that greater personalization required more AI assistance. Research showed that students sometimes wanted structure without having each step generated for them.", blocks: [
      { t: "p", body: "We added a toggle between AI-enhanced goals and a plain to-do list. Students could retain the session framework while controlling how much responsibility they delegated." },
      { t: "statement", body: "No competitor we reviewed offered an equally clear way to turn the AI down instead of up." },
      { t: "fig", label: "Before and after", caption: "Show the original AI-dependent flow beside the revised experience with manual and AI-assisted options.", ratio: "16 / 8" },
    ] },
    { id: "system", nav: "Building the System", eyebrow: "Building the System", title: "Study Sessions became the foundation for different learning needs.", body: "The remaining concepts strengthened the core experience:", blocks: [
      { t: "numlist", items: ["Learning Profiles provide context about subjects and preferences.", "AI Visualizations offer alternatives when text is insufficient.", "Reading Support restructures difficult passages.", "Study Sessions organize these tools around a specific learning goal."] },
      { t: "fig", label: "Product ecosystem", caption: "A system diagram showing Learning Profiles, Visualizations, and Reading Support feeding into Study Sessions.", ratio: "16 / 8" },
    ] },
    { id: "outcome", nav: "Outcome", eyebrow: "Outcome", title: "We changed the scope from rewarding engagement to supporting growth.", body: "The final direction unified four research-backed concepts into an adaptive learning system centered on student autonomy.", blocks: [
      { t: "p", body: "Because this was a conceptual client engagement, we did not measure shipped-product outcomes. Our contribution was identifying a differentiated opportunity for Notability Learn and translating it into a coherent product strategy and prototype." },
      { t: "img", src: "assets/notability/showcase.png", bg: "#eef2fb", caption: "The strongest three screens shown at a large scale with minimal annotation." },
    ] },
    { id: "reflection", nav: "Reflection", eyebrow: "Reflection", title: "Research matters most when it changes the direction.", blocks: [
      { t: "cards", cols: 3, tone: "reflect", items: [
        { n: "01", desc: "We began with a request to make studying more game-like. Following that brief literally would have produced features students actively disliked." },
        { n: "02", desc: "The harder and more valuable decision was abandoning the expected solution. This project taught me to treat a brief as a hypothesis rather than an answer and to use research to determine what the product should become." },
        { n: "03", desc: "It also changed how I approach AI design. The strongest learning tools do not complete the work for students. They provide structure, context, and alternative ways into difficult material while leaving the thinking to them." },
      ] },
      { t: "note", text: "Built with Berkeley Innovation for Notability alongside Cheyenne Paw, Mikayla Acosta, Grace Zhang, and Karen Pham." },
    ] },
  ],
};

window.CASE15.asus = {
  tags: ["ASUS ProArt", "In progress"],
  status: "To be shipped December 2026",
  cover: "AsusCover",
  sections: [
    { id: "overview", nav: "Overview", eyebrow: "Overview", title: "I\u2019m leading a team exploring how ProArt can reduce friction across fragmented creative tools while preserving user control.", body: "We\u2019re researching:", blocks: [
      { t: "cards", cols: 3, items: [
        { n: "01", title: "What creators are comfortable delegating" },
        { n: "02", title: "Where they need transparency" },
        { n: "03", title: "When an AI agent should step back" },
      ] },
    ] },
    { id: "currently", nav: "Research in Progress", eyebrow: "Research in Progress", title: "Conducting user research and translating findings into product opportunities for a transparent, creator-directed agentic workflow.", blocks: [
      { t: "fig", label: "Research in progress", caption: "Findings and early concepts will be added as the project develops.", ratio: "16 / 7" },
    ] },
  ],
};

window.CASE15.p3 = {
 "tags": [
  "Sand",
  "Speculative Product Design",
  "FigBuild 2026"
 ],
 "sections": [
  {
   "id": "overview",
   "nav": "Overview",
   "eyebrow": "Overview",
   "title": "What if technology helped people feel time instead of merely tracking it?",
   "blocks": [
    {
     "t": "fig",
     "label": "Sand system hero",
     "caption": "A polished composition showing the Sand Shades, biometric ring, and companion app as one connected system.",
     "ratio": "16 / 9"
    }
   ],
   "body": "Sand is a speculative wearable system that translates biological rhythms into ambient AR cues. Through connected glasses, a biometric ring, and a companion app, it helps people recognize periods of focus, fatigue, and rest as they happen."
  },
  {
   "id": "problem",
   "nav": "Problem Space",
   "eyebrow": "Problem Space",
   "title": "Wearables explain fatigue after the moment to respond has passed.",
   "blocks": [
    {
     "t": "p",
     "body": "Existing wearables collect useful information, but primarily communicate it through scores and retrospective dashboards. They can tell someone that they were exhausted yesterday without helping them notice their changing state today."
    },
    {
     "t": "callout",
     "label": "We asked",
     "text": "How might technology help people recognize and respond to their internal rhythms in real time?"
    },
    {
     "t": "fig",
     "label": "Existing experience",
     "caption": "A wearable readiness dashboard contrasted with someone losing track of time during focused work.",
     "ratio": "16 / 8"
    }
   ],
   "body": "People regularly lose track of time while working, scrolling, or socializing. They may not recognize fatigue until their concentration, health, or relationships have already been affected."
  },
  {
   "id": "research",
   "nav": "Research",
   "eyebrow": "Research",
   "title": "People didn’t want more data. They wanted it at the right moment.",
   "blocks": [
    {
     "t": "list",
     "items": [
      [
       "70%",
       " preferred support integrated into their environment in real time."
      ],
      [
       "41%",
       " disliked receiving information after it was too late to act."
      ],
      "Participants described forgetting to eat, underestimating tasks, and recognizing fatigue only after it became physical."
     ]
    },
    {
     "t": "p",
     "body": [
      "Research into ",
      [
       "chronoception"
      ],
      ", the brain’s subjective experience of time, helped us understand why. Attention, emotion, and biological rhythms can make time feel compressed, extended, or nearly invisible."
     ]
    },
    {
     "t": "aside",
     "label": "My role",
     "text": "As a Cognitive Science student, I pushed our team to treat felt time as the design material rather than building another clock."
    },
    {
     "t": "fig",
     "label": "Research-to-decision summary",
     "caption": "Three behavioral findings connected directly to the product opportunities they created.",
     "ratio": "16 / 8"
    }
   ],
   "body": "We surveyed 36 students and professionals about time perception and their experiences with wearable technology."
  },
  {
   "id": "reframe",
   "nav": "Reframing the Question",
   "eyebrow": "Reframing the Question",
   "title": "We started with a better tracker. That became the wrong product.",
   "blocks": [
    {
     "t": "p",
     "body": "That forced a change in direction."
    },
    {
     "t": "p",
     "body": "Instead of asking how we could display time better, we asked how an environment could communicate it naturally."
    },
    {
     "t": "table",
     "head": [
      "Existing wearables",
      "Sand"
     ],
     "rows": [
      [
       "Track and score",
       "Interpret and guide"
      ],
      [
       "Report afterward",
       "Respond in real time"
      ],
      [
       "Live on a dashboard",
       "Blend into the environment"
      ]
     ]
    },
    {
     "t": "fig",
     "label": "Early direction versus reframe",
     "caption": "An early dashboard concept beside the ambient AR direction, with a short explanation of why the first approach was abandoned.",
     "ratio": "16 / 8"
    }
   ],
   "body": "Our early ideas centered on visualizing time and biological data more clearly. But research showed that another dashboard would repeat the central limitation of existing wearables: it would still require users to stop, interpret information, and act after the fact."
  },
  {
   "id": "opportunity",
   "nav": "Opportunity",
   "eyebrow": "Opportunity",
   "title": "Augmented reality could make invisible rhythms perceptible.",
   "blocks": [
    {
     "t": "p",
     "body": "Sand combines:"
    },
    {
     "t": "list",
     "items": [
      [
       "Sand Shades:",
       " AR glasses that adjust visual ambiance"
      ],
      [
       "Biometric ring:",
       " Captures sleep and recovery signals"
      ],
      [
       "Sand app:",
       " Explains the system and gives users control"
      ]
     ]
    },
    {
     "t": "p",
     "body": "The system interprets signals associated with attention and fatigue, then translates them into environmental cues rather than another numerical score."
    },
    {
     "t": "fig",
     "label": "System architecture",
     "caption": "The glasses, ring, and app, with arrows explaining what each component senses, communicates, or controls.",
     "ratio": "16 / 9"
    }
   ],
   "body": "AR allowed us to move the experience beyond a screen and into the user’s surroundings."
  },
  {
   "id": "solution",
   "nav": "Solution",
   "eyebrow": "Solution",
   "title": "Three moments make the future tangible.",
   "blocks": [
    {
     "t": "cards",
     "cols": 3,
     "items": [
      {
       "n": "01",
       "title": "Calibrate my internal clock",
       "desc": "During onboarding, users estimate when ten minutes have passed. Sand compares perceived and actual time to begin learning how that individual experiences duration."
      },
      {
       "n": "02",
       "title": "Support deep focus",
       "desc": "When Sand recognizes focused work, the glasses reduce surrounding visual distractions and emphasize the active task."
      },
      {
       "n": "03",
       "title": "Bring me back to the present",
       "desc": "When focus becomes fatigue, or attention drifts during a social moment, Sand changes its cues to support rest, awareness, or connection."
      }
     ]
    },
    {
     "t": "fig",
     "label": "Three-part storyboard",
     "caption": "One person through calibration, focused work, and an evening with friends. The AR environment changes without requiring a screen.",
     "ratio": "16 / 7"
    }
   ]
  },
  {
   "id": "companion",
   "nav": "Companion Experience",
   "eyebrow": "Companion Experience",
   "title": "The app makes an ambient system understandable.",
   "blocks": [
    {
     "t": "p",
     "body": "Users can:"
    },
    {
     "t": "list",
     "items": [
      "Review their expected energy peaks and dips",
      "Change between Peak, Steady, Fatigue, and Rest modes",
      "Select which biological signals are used",
      "Adjust or override automatic interventions",
      "Manage sleep and time-zone changes"
     ]
    },
    {
     "t": "gallery",
     "cols": 3,
     "items": [
      {
       "label": "Energy curve",
       "caption": "Expected peaks and dips",
       "ratio": "9 / 16"
      },
      {
       "label": "Mode controls",
       "caption": "Peak, Steady, Fatigue, Rest",
       "ratio": "9 / 16"
      },
      {
       "label": "Data permissions",
       "caption": "Choose which signals are used",
       "ratio": "9 / 16"
      }
     ]
    }
   ],
   "body": "An invisible system can easily become confusing or controlling. The Sand app explains what the wearable is sensing and gives users direct control over its behavior."
  },
  {
   "id": "tension",
   "nav": "Design Tension",
   "eyebrow": "Design Tension",
   "title": "The system needed autonomy, but not authority.",
   "blocks": [
    {
     "t": "p",
     "body": "We designed around three principles:"
    },
    {
     "t": "cards",
     "cols": 3,
     "items": [
      {
       "n": "01",
       "title": "Understand",
       "desc": "Users should understand why Sand is intervening."
      },
      {
       "n": "02",
       "title": "Adjust",
       "desc": "Every automatic action should be adjustable or reversible."
      },
      {
       "n": "03",
       "title": "Don’t judge",
       "desc": "The system should guide behavior without judging it."
      }
     ]
    },
    {
     "t": "p",
     "body": [
      "This shifted our goal from maximum automation to ",
      [
       "negotiated control"
      ],
      " between the user and the system."
     ]
    },
    {
     "t": "fig",
     "label": "Autonomy spectrum",
     "caption": "A continuum from fully manual to fully autonomous, showing where Sand’s major interactions sit and when user confirmation is required.",
     "ratio": "16 / 6"
    }
   ],
   "body": "Sand had to respond automatically for ambient guidance to feel useful. But a device that changes someone’s environment could also become invasive."
  },
  {
   "id": "edges",
   "nav": "Designing for Edge Cases",
   "eyebrow": "Designing for Edge Cases",
   "title": "The hardest users exposed the weaknesses in our first concept.",
   "blocks": [
    {
     "t": "p",
     "body": "That excluded people with ADHD, sleep conditions, changing schedules, or anxiety around health tracking."
    },
    {
     "t": "p",
     "body": "We responded with three features:"
    },
    {
     "t": "cards",
     "cols": 3,
     "items": [
      {
       "title": "Personal baselines",
       "desc": "Sand learns an individual’s rhythms instead of comparing everyone with one standardized routine."
      },
      {
       "title": "Sustainable Peak",
       "desc": "When someone tries to sustain intense focus through fatigue, Sand offers a limited session that gradually transitions toward rest."
      },
      {
       "title": "Mist Mode",
       "desc": "Users can hide detailed biological metrics while retaining supportive ambient cues."
      }
     ]
    },
    {
     "t": "aside",
     "label": "What I pushed",
     "text": "I pushed the team to treat these cases as core requirements rather than optional accessibility features. Designing for them made the entire system more flexible and less judgmental."
    },
    {
     "t": "fig",
     "label": "Edge-case features",
     "caption": "Mist Mode and Sustainable Peak beside the specific risk or user need that produced each feature.",
     "ratio": "16 / 8"
    }
   ],
   "body": "Our initial direction assumed predictable routines and users who felt comfortable seeing biological data."
  },
  {
   "id": "ethics",
   "nav": "Designing Ethically",
   "eyebrow": "Designing Ethically",
   "title": "A system that reads the body should not define the person.",
   "blocks": [
    {
     "t": "p",
     "body": "We designed Sand to:"
    },
    {
     "t": "list",
     "items": [
      "Describe temporary states instead of fixed identities",
      "Allow users to hide or disable sensitive measurements",
      "Communicate through gentle cues rather than performance scores",
      "Keep personal biological information private and controlled by the user"
     ]
    },
    {
     "t": "callout",
     "label": "The goal",
     "text": "The goal was not to make people monitor themselves more closely. It was to help them notice what their bodies were already communicating."
    },
    {
     "t": "fig",
     "label": "Ethical risk and response",
     "caption": "Three risks (labeling, self-policing, and data anxiety) paired with the corresponding design response.",
     "ratio": "16 / 7"
    }
   ],
   "body": "Health metrics can easily become labels: productive, distracted, recovered, or unhealthy. Those labels can influence how people understand themselves."
  },
  {
   "id": "outcome",
   "nav": "Outcome",
   "eyebrow": "Outcome",
   "title": "We designed a product vision for ambient, ethical AR.",
   "blocks": [
    {
     "t": "list",
     "items": [
      "A connected wearable ecosystem",
      "An AR interaction model for focus and rest",
      "A companion application with transparent controls",
      "Features addressing burnout, irregular rhythms, and data anxiety",
      "A research-backed vision for designing around chronoception"
     ]
    },
    {
     "t": "p",
     "body": "Because Sand was a speculative concept, we did not claim measured behavioral outcomes. Its value was making a possible future concrete enough to experience, question, and critique."
    },
    {
     "t": "fig",
     "label": "Final product montage",
     "caption": "The strongest AR moment, hardware concept, and app screens in one closing composition.",
     "ratio": "16 / 9"
    }
   ],
   "body": "Within FigBuild, our team produced:"
  },
  {
   "id": "reflection",
   "nav": "Reflection",
   "eyebrow": "Reflection",
   "title": "Speculative design let me prototype a future, not just an interface.",
   "blocks": [
    {
     "t": "p",
     "body": "Designing within a hypothetical future changed how I approached the project. We were not limited to improving an existing wearable or adding another screen. We had to imagine how augmented reality might fit into everyday life, and what new behaviors, risks, and responsibilities could emerge with it."
    },
    {
     "t": "p",
     "body": "AR made the experience immediate, but it also raised harder questions: How much should a system alter someone’s perception? When should it intervene? How can users understand and override technology designed to remain ambient?"
    },
    {
     "t": "p",
     "body": "This project taught me that speculative design is not about predicting the future perfectly. It is a way to make possible futures tangible enough to examine and shape responsibly."
    },
    {
     "t": "p",
     "body": "By prototyping both the promise and the uncomfortable edges of ambient AR, we asked not only what technology could do, but what role it should have in people’s lives."
    }
   ]
  }
 ]
};
