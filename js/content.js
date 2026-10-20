/* =============================================================================
   PORTFOLIO CONTENT — edit this one file to update everything on the site.

   • Text wrapped in [square brackets] is a placeholder. It is shown on the site
     with a dashed "placeholder" style until you replace it.
   • Leave a url empty ("") to hide its button (case studies, live projects,
     resume, social links).
   • Images: put files in assets/images/ and reference them like
     "assets/images/visit-health-cover.jpg". Empty image = labeled placeholder.
   • Don't change workplace ids — each one is tied to a building on the map.
   • Deep links: yoursite/#/visit-health opens that window, #/visit-health/2
     opens its 2nd project, #/home and #/future work too.
   ========================================================================== */

window.PORTFOLIO = {
  person: {
    name: "Shubhangi Sharma",
    title: "Product Designer",
    experience: "5+ years",
    resumeUrl: "https://drive.google.com/file/d/1aO04Zy1ZIdRG37FtXN1p9bG4LeK8wnMf/view?usp=drive_link",
    email: "shubhisharma304@gmail.com",
    links: [
      { label: "LinkedIn", url: "https://www.linkedin.com/in/shubhangi-sharma-product/" },
      { label: "Behance", url: "https://www.behance.net/Shubhangi_sharma" },
      { label: "Dribbble", url: "https://dribbble.com/Menameshubhi" },
      { label: "Medium", url: "https://medium.com/@menameshubhi" },
      { label: "Instagram", url: "https://www.instagram.com/thatuiperson/" }
    ]
  },

  /* ---------------------------------------------------------------- Home -- */
  home: {
    about:
      "Hi, I'm Shubhangi, a Product Designer based in Bengaluru with 5+ years of experience scaling 0-to-1 platforms " +
      "and enterprise ecosystems. I turn complex problems into intuitive, empathetic designs, with a focus on AI-driven " +
      "experiences and strategic design systems. I currently craft products at Interview Kickstart, and I also build " +
      "independent products with engineering friends.",
    portrait: "",           // optional photo, e.g. "assets/images/shubhangi.jpg"
    paintings: [
      { title: "[Painting title]", caption: "[Medium · Year]", image: "", alt: "" },
      { title: "[Painting title]", caption: "[Medium · Year]", image: "", alt: "" },
      { title: "[Painting title]", caption: "[Medium · Year]", image: "", alt: "" },
      { title: "[Painting title]", caption: "[Medium · Year]", image: "", alt: "" },
      { title: "[Painting title]", caption: "[Medium · Year]", image: "", alt: "" }
    ],
    illustrations: [
      { title: "Cute animal illustrations", caption: "Three art forms · Figma Community", image: "", alt: "" },
      { title: "[Illustration title]", caption: "[Tool · Year]", image: "", alt: "" },
      { title: "[Illustration title]", caption: "[Tool · Year]", image: "", alt: "" },
      { title: "[Illustration title]", caption: "[Tool · Year]", image: "", alt: "" },
      { title: "[Illustration title]", caption: "[Tool · Year]", image: "", alt: "" }
    ],
    // icon: brush, book, plant, music, camera, plane, coffee, sparkle
    hobbies: [
      { icon: "brush", title: "Illustration", text: "Cute animal illustrations in three art forms, shared on Figma Community." },
      { icon: "book", title: "Writing", text: "Essays on design, dashboards and AI on Medium." },
      { icon: "sparkle", title: "Tarot", text: "A tarot reading file and a tarot web app built with Figma Make." },
      { icon: "coffee", title: "Building products", text: "Making independent products together with engineering friends." }
    ],
    liveProjects: [
      {
        title: "Cooklie",
        description: "An all-in-one kitchen companion and recipe customizer: ingredient scaling, substitutes, hands-free play-along cooking and a chef community.",
        tags: ["0-to-1", "Mobile app", "Product design"], image: "",
        url: "https://shubhangisharma.framer.website/personal-project/cooklie"
      },
      {
        title: "AI-Ready Atomic Design System",
        description: "An atomic design system with responsive tokens and light/dark themes that works in Figma and with AI coding assistants like Claude Code.",
        tags: ["Design system", "Figma tokens", "AI"], image: "",
        url: "https://shubhangisharma.framer.website/personal-project/design-system"
      },
      {
        title: "Margg",
        description: "A learning partner for recent graduates: personalized career roadmaps, tiered courses and AI-powered mock interviews for tech roles.",
        tags: ["0-to-1", "EdTech", "Design leadership"], image: "",
        url: "https://shubhangisharma.framer.website/personal-project/margg"
      }
    ]
  },

  /* ---------------------------------------------------------- Workplaces -- */
  // Project fields: title, description, role, skills[], metrics[{value,label}],
  // image, imageAlt, caseStudyUrl. Empty projects[] shows an "in progress" state.
  workplaces: [
    {
      id: "visit-health",
      name: "Visit Health",
      role: "Product Designer",
      dates: "Oct 2022 – Apr 2025 · Noida",
      intro: "Designed across the Visit Health mobile and web products, internal dashboards and employee wellness campaigns.",
      projects: [
        {
          title: "Mobile and web app revamp, with onboarding",
          description: "Revamped the Visit Health mobile and web apps and designed new onboarding experiences for members.",
          role: "Product Designer",
          skills: ["Mobile design", "Web design", "Onboarding"],
          metrics: [{ value: "18%", label: "boost in enrollments" }, { value: "17%", label: "gain in operational efficiency" }],
          image: "", imageAlt: "", caseStudyUrl: ""
        },
        {
          title: "AI-backed internal dashboards",
          description: "Designed internal dashboards backed by AI to help teams work with their data.",
          role: "Product Designer",
          skills: ["Dashboard design", "AI-assisted tools"],
          metrics: [],
          image: "", imageAlt: "", caseStudyUrl: ""
        },
        {
          title: "Stepathon and Wellness Saga",
          description: "Designed the gamified wellness campaigns Stepathon and Wellness Saga.",
          role: "Product Designer",
          skills: ["Gamification", "Campaign design"],
          metrics: [{ value: "30%", label: "increase in engagement" }],
          image: "", imageAlt: "", caseStudyUrl: ""
        }
      ]
    },
    {
      id: "interview-kickstart",
      name: "Interview Kickstart",
      role: "Product Designer 2",
      dates: "Sep 2025 – Present · Remote, Bengaluru",
      intro: "Crafting career products for Interview Kickstart, from learner tools to the design system behind them.",
      projects: [
        {
          title: "Mobile app for career tools",
          description: "A mobile app that brings Interview Kickstart's career tools to learners.",
          role: "Product Designer 2",
          skills: ["Mobile design", "Product design"],
          metrics: [],
          image: "", imageAlt: "", caseStudyUrl: ""
        },
        {
          title: "AI resume analyser and job finder",
          description: "AI-driven tools that analyse a resume and help learners find relevant jobs.",
          role: "Product Designer 2",
          skills: ["AI experiences", "Product design"],
          metrics: [],
          image: "", imageAlt: "", caseStudyUrl: ""
        },
        {
          title: "Design system",
          description: "A design system that keeps Interview Kickstart's products consistent.",
          role: "Product Designer 2",
          skills: ["Design systems", "Figma"],
          metrics: [],
          image: "", imageAlt: "", caseStudyUrl: ""
        },
        {
          title: "AI-assisted landing page generation",
          description: "A tool that uses AI to help generate landing pages.",
          role: "Product Designer 2",
          skills: ["AI experiences", "Web design"],
          metrics: [],
          image: "", imageAlt: "", caseStudyUrl: ""
        }
      ]
    },
    {
      id: "affixious",
      name: "Affixious Consultancy",
      role: "UI/UX Designer",
      dates: "Dec 2021 – Oct 2022 · Noida",
      intro: "Designed travel booking experiences for MyHolidays and looked after design system governance.",
      projects: [
        {
          title: "MyHolidays train and flight booking redesigns",
          description: "Redesigned the train and flight booking experiences for MyHolidays.",
          role: "UI/UX Designer",
          skills: ["UI design", "UX design", "Travel booking"],
          metrics: [],
          image: "", imageAlt: "", caseStudyUrl: ""
        },
        {
          title: "Design system governance",
          description: "Managed and governed the design system on Zeroheight.",
          role: "UI/UX Designer",
          skills: ["Design systems", "Zeroheight"],
          metrics: [],
          image: "", imageAlt: "", caseStudyUrl: ""
        }
      ]
    }
  ],

  /* ------------------------------------------- Future workplace / Contact -- */
  future: {
    headline: "The next building could be yours.",
    text: "I'm based in Bengaluru and love turning complex problems into intuitive, empathetic designs. If you're building a 0-to-1 platform or an AI-driven experience, let's talk."
  }
};
