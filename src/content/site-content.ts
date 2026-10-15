/** Site identity and page copy belong to the application, not the project database. */
export const siteContent = {
  "name": "Mike Angelo",
  "role": "Multimedia Designer & Art Director",
  "url": "https://mikeangelo.art",
  "description": "Art direction, brand identities, integrated campaigns, and digital experiences by Mike Angelo. Based in New Jersey and working across the New York area.",
  "ogImage": "https://cdn.mikeangelo.art/og-default.png",
  "homePage": {
    "projectsIntro": "Alongside client work, I’m building apps, a game, and tools for my own creative workflow.",
    "contactIntro": "Looking for a hands-on art director or multidisciplinary designer? Let’s talk about your team, brand, or next campaign."
  },
  "aboutPage": {
    "description": "Brand identity, campaign design, video editing, motion, and web design by Mike Angelo, an art director and multidisciplinary designer based in New Jersey.",
    "intro": "I’m Mike Angelo, an art director and multidisciplinary designer based in New Jersey. I work across brand identity, advertising, motion, and web design.",
    "sections": [
      {
        "id": "how-i-work",
        "title": "How I Work",
        "paragraphs": [
          "My work spans automotive, food, fitness, and wellness. I develop visual design for brands and campaigns, edit commercial and social video, create motion graphics, and design and build landing pages.",
          "I like projects where the same idea has to work in several forms. I move between layout, motion, and code, collaborating with creative, production, and development teams to keep the result consistent."
        ]
      },
      {
        "id": "why-i-do-it",
        "title": "Why I Do It",
        "paragraphs": [
          "I’m interested in how images, movement, and interaction change the way something feels. Personal apps, games, and visual experiments let me explore those connections outside a client brief.",
          "Away from the screen, I like to hike and get lost in nature, write electric guitar songs that I immediately forget, attempt to skateboard, and stay endlessly curious about engineering, philosophy, and the universe."
        ]
      }
    ]
  },
  "personalPage": {
    "title": "Projects",
    "description": "Cruio, RAID, and Indigo: apps and a game in development by Mike Angelo, followed by Solobook, R2D2, and visual experiments.",
    "intro": "Apps, a game, and tools shaped by how I like to work. Ongoing projects, smaller builds, and visual experiments.",
    "projectsHeading": "Passion projects",
    "supportingHeading": "Smaller builds",
    "supportingDescription": "Focused tools for reading, editing, and keeping a creative workflow moving.",
    "mosaicHeading": "Odds & ends",
    "mosaicDescription": "Blender renders, sketches, GIFs, and whatever else I’m experimenting with.",
    "emptyMosaic": "More things are on the way."
  }
} as const;
