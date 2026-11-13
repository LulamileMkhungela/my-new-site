/**
 * Work added after the source-portfolio rebuild.
 *
 * Three kinds of entry live here, all written in this site's own case-study
 * shape (`caseStudy: { summary, problem, goals, users, process, build, impact }`)
 * so case-study.js renders them like every other study:
 *
 *   case study   FoodieZone and Africa Cuisine — full studies, lifted from the
 *                portfolio at lulamilemkhungela.github.io/portfolio.github.io
 *   redirects    SK Finds, Nerdma, SnB and ProdOps — one card each that sends
 *                the visitor straight to the live product / repo, no study page
 *   coming soon  Lawmania (Lekgotla), LulaFind and AI-LifeOS — mobile apps in
 *                the build, with Android / iOS download buttons waiting on URLs
 *
 * Drop an APK / TestFlight / App Store URL into `downloads` and the button
 * turns itself on; an empty string keeps it in its "Not yet" state.
 */
window.EXTRA = {
  /* ---- Full case studies ------------------------------------------------- */
  caseStudies: [
    {
      kind: 'project',
      slug: 'foodiezone',
      id: 'foodiezone',
      title: 'From DMs to a live menu',
      client: 'FoodieZone',
      year: '2025',
      description:
        'A smash-burger and wings kitchen in Pimville was taking every order through WhatsApp and Instagram. I designed and built an installable ordering PWA that gave the kitchen one queue and its regulars a one-tap reorder.',
      role: 'Lead Product Designer & UI Developer',
      team: 'FoodieZone, Pimville, Soweto',
      duration: 'Ordering PWA · 2025',
      skills: ['Product Strategy', 'UX Research', 'UI Design', 'PWA Build', 'Menu Architecture', 'Analytics'],
      tags: ['home', 'product-design', 'cat-ecommerce', 'cat-saas-ops'],
      cover: 'foodiezone-cover.webp',
      url: 'https://loux91.github.io/foodiezone/',
      urlLabel: 'Open the live app',
      caseStudy: {
        hero: 'foodiezone-desktop.webp',
        summary: {
          title: 'Introduction',
          body: "FoodieZone is a hand-pressed burger and wings kitchen in Pimville, Soweto. Before the PWA, orders came through WhatsApp and Instagram: the owner copied items, quantities and addresses between messages, and had no single order record once food went out.\n\nI designed and built the ordering experience end to end as an installable Progressive Web App. The live site opens on the bestseller — the Cheesey Smash Burger — then moves into the eight categories the kitchen actually sells: Burgers, Smash, Dagwoods, Wingzz, Loaded, Prego, Wraps and Chicken. Prices live in the menu (Cheesey Smash R95, Death By Bacon R125, 5 Dunked Wings R55, Loaded Chips R45) and the owner updates them from a phone.\n\nLive product. Designed and hand-coded end to end.",
          disclaimer:
            'Client: FoodieZone, Pimville, Soweto · Industry: hospitality. Order-accuracy and reorder-share figures are not published, so this study does not claim them.',
        },
        problem: {
          title: 'The problem',
          cards: [
            {
              heading: '#1 Every order started as a message',
              body: 'Every order was a conversation: item names in text, quantities guessed, delivery addresses typed out again for each customer, every time.',
              noteHeading: 'Impact',
              note: 'Orders were misread, and hours a day went into retyping the same information instead of cooking.',
            },
            {
              heading: '#2 The menu only existed as screenshots',
              body: 'Prices and availability changed constantly, but the menu lived as images inside a chat history that nobody could search.',
              noteHeading: 'Impact',
              note: 'Customers ordered sold-out items and asked for prices that had already changed.',
            },
            {
              heading: '#3 Regulars re-typed the same order every week',
              body: 'The best customers — the ones ordering the same two or three meals — did the most work, retyping a familiar order from memory.',
              noteHeading: 'Impact',
              note: 'Repeat volume was capped by effort rather than by appetite.',
            },
            {
              heading: '#4 Nothing recorded what actually sold',
              body: 'No data existed on which items moved, at what time of day, or which categories carried the menu.',
              noteHeading: 'Impact',
              note: 'Stock, specials and staffing were decided on instinct alone.',
            },
          ],
        },
        blueprint: { title: '', image: 'foodiezone-flow.webp' },
        goals: {
          title: 'Order in seconds. Reorder in a tap.',
          businessTitle: 'Business goals',
          business: [
            'Move ordering off direct messages into one structured flow the kitchen controls.',
            'Make price and availability changes self-service for the owner.',
            'Turn first-time buyers into repeat customers through an order history.',
          ],
          userTitle: 'User goals',
          user: [
            'See the current menu and real prices in under a minute.',
            'Reorder a usual without retyping anything.',
            'Know exactly when the food will be ready.',
          ],
        },
        users: {
          title: 'Who I designed for',
          body: 'Built for the two people who actually use the product — the customer ordering, and the owner running the kitchen.',
          personas: [
            {
              image: '',
              name: '#1 The Regular',
              body: 'Orders the same two or three meals a week, usually on the way home, often on mobile data.\n\nJOBS-TO-BE-DONE\nWhen I am hungry and short on time, I want to repeat last week\'s order in a couple of taps, so I can eat without a conversation.',
            },
            {
              image: '',
              name: '#2 The Owner',
              body: 'Runs the kitchen, takes the orders and cooks. Has no time to maintain a website and does not want an app store account.\n\nJOBS-TO-BE-DONE\nWhen something sells out at 7pm, I want to mark it unavailable from my phone in seconds, so customers do not order what I cannot make.',
            },
          ],
        },
        process: {
          title: 'Process',
          steps: [
            {
              heading: '01 · Discovery — seven days behind the phone',
              body: "I reviewed a full week's orders: which channel they came through, what details were missing, where mistakes happened and what the owner had to retype. I also mapped how customers chose what to order and where they left the basket.",
              image: '',
            },
            {
              heading: '02 · Structure & flows — a menu with muscles',
              body: "The kitchen's own list became the structure: Burgers, Smash, Dagwoods, Wingzz, Loaded, Prego, Wraps, Chicken — eight real categories instead of one flat price list. Ordering shrank to menu, cart, checkout, confirmation; quantities step rather than get typed, and checkout asks only what the kitchen actually needs to cook and deliver.",
              image: '',
            },
            {
              heading: '03 · Interface design & testing — food first, tested first',
              body: "The interface leads with food: a hero shot of the smash burger wearing the bestseller badge, then the menu in order, the standard the owner set, and the call to order. Before a line of code, three of the owner's regular customers clicked through the order flow. Quantity editing in the order summary was unclear, so that screen was redesigned around it — fixed before build, not after launch.",
              image: '',
            },
            {
              heading: '04 · PWA build — wired to keep working',
              body: 'Built as an installable PWA with a cached shell and menu, so it opens instantly and keeps working when the signal drops on the way to Pimville. Touch targets, contrast and status labels were built to the same rules the design was tested against, and the owner updates the menu from a phone without a developer.',
              image: 'foodiezone-mobile.webp',
              ratio: 'portrait',
            },
            {
              heading: '05 · Launch & iterate — feeding the funnel',
              body: 'Post-launch I tracked the funnel — category views, cart adds, checkouts, reorders — and reviewed it weekly. When repeat customers proved the strongest signal, the reorder path moved up to the home screen, and category order followed what actually sold instead of what had always been listed first.',
              image: '',
            },
          ],
        },
        build: {
          title: 'Key decisions and trade-offs',
          body: '',
          sections: [
            {
              heading: '1 · The kitchen\'s own list became the structure',
              body: "Eight real categories — Burgers, Smash, Dagwoods, Wingzz, Loaded, Prego, Wraps, Chicken — instead of one flat price list.\n\n**Trade-off:** eight categories is more to scroll than a single list, and every new item has to be filed into one of them.",
              image: '',
            },
            {
              heading: '2 · Quantities step, and checkout asks only what the kitchen needs',
              body: 'Ordering shrank to menu, cart, checkout, confirmation. Quantities step rather than get typed, so an order cannot arrive as a misread number.\n\n**Trade-off:** a stepper is slower than typing when someone wants a large quantity.',
              image: '',
            },
            {
              heading: '3 · A PWA, not a native app',
              body: 'Installable from the browser with a cached shell and menu, so it opens without an app store and keeps working when the signal drops.\n\n**Trade-off:** no app store listing, and iOS treats an installed PWA differently from a native app. The owner did not want a store account, so that cost was acceptable here.',
              image: '',
            },
            {
              heading: '4 · Reorder moved up once the data came in',
              body: 'Repeat customers proved the strongest signal, so the reorder path moved to the home screen and category order followed what actually sold.\n\n**Trade-off:** putting reorder first pushes the full menu further down for a first-time customer.',
              image: '',
            },
          ],
        },
        impact: {
          body: 'The DMs moved into the app. Structured orders replaced the manual back-and-forth, and reorders — a single tap from order history — became a meaningful share of weekly volume. The kitchen now updates prices and marks items sold out from a phone in seconds instead of re-shooting screenshots.\n\nBecause it is a PWA there is nothing to install from a store: customers add it to the home screen from the browser, and the shell and menu are cached, so the menu still opens instantly on a weak connection. The Cheesey Smash Burger is pinned as the bestseller the way the kitchen talks about it, not the way a database sorts it.',
          image: '',
        },
        learned: {
          title: 'What would settle it',
          items: [
            {
              heading: 'The evidence I have',
              body: 'Three of the owner\'s own regulars walked the order flow before any code was written. After launch I reviewed the funnel weekly — category views, cart adds, checkouts and reorders — and that is what moved the reorder path up and reordered the categories. The live app is public and taking orders, so the flow can be walked end to end.',
              image: '',
            },
            {
              heading: 'The evidence I do not have',
              body: 'Order accuracy and the share of orders that are reorders, measured against the old direct-message flow. I have the funnel; I do not have a before-and-after comparison, and I do not have a count of orders lost to mistyped messages before the PWA existed.',
              image: '',
            },
          ],
        },
        thanks:
          'The kitchen can run the menu from a phone. Happy to walk through the research notes, menu architecture and analytics on a call.',
      },
    },

    {
      kind: 'project',
      slug: 'africa-cuisine',
      id: 'africa-cuisine',
      title: 'A restaurant menu that takes the order',
      client: 'Africa Cuisine & Restaurant',
      year: '2026',
      description:
        'A Braamfontein restaurant whose site now carries the menu, prices, the daily special, trading hours, the address and an online ordering path — in one place, on the phone.',
      role: 'Design & build',
      team: 'Africa Cuisine & Restaurant, Braamfontein',
      duration: 'Restaurant website & ordering PWA',
      skills: ['UI Design', 'Front-end Build', 'Menu Architecture', 'Local SEO'],
      tags: ['home', 'website-design', 'cat-marketingwebsite'],
      cover: 'africa-cuisine-cover.webp',
      url: 'https://africa-cuisine-pro.vercel.app',
      urlLabel: 'Visit the live site',
      caseStudy: {
        hero: 'africa-cuisine-cover.webp',
        summary: {
          title: 'Introduction',
          body: 'Africa Cuisine & Restaurant is a flame-grill kitchen in Braamfontein, Johannesburg. The site now shows the menu, the daily special, all seven days of trading hours, the address and an online ordering path — where a customer previously had to phone to find any of it.',
          disclaimer:
            'This page describes what the live site does. I have not confirmed the original brief, exact delivery scope or project dates, so it makes no measured business claim.',
        },
        problem: {
          title: 'The problem',
          cards: [
            {
              heading: '#1 The menu lived in a phone call',
              body: 'Dishes and prices were only available by asking — nothing on the web told a hungry passer-by what the kitchen actually sells or what it costs.',
              noteHeading: 'Impact',
              note: 'Anyone deciding where to eat at 13:00 could not decide with confidence.',
            },
            {
              heading: '#2 The daily special was invisible',
              body: 'The breakfast special and the day\'s offer changed constantly but had nowhere to live, so they only reached people already in the room.',
              noteHeading: 'Impact',
              note: 'A time-limited offer reached the fewest possible people.',
            },
            {
              heading: '#3 Hours and location were not on the page',
              body: 'Whether the kitchen was open, and where in Braamfontein it sits, had to be asked rather than read.',
              noteHeading: 'Impact',
              note: 'The two questions every walk-in asks first were unanswered online.',
            },
            {
              heading: '#4 Ordering had no starting point',
              body: 'There was no way to begin an order from the food itself — every order started with a phone call or a walk-in.',
              noteHeading: 'Impact',
              note: 'Demand that arrived online had nowhere to convert.',
            },
          ],
        },
        blueprint: { title: '', image: '' },
        goals: {
          title: 'Menu, hours and ordering in one place',
          businessTitle: 'What the business needed',
          business: [
            'Show the full menu and prices without an extra click.',
            'Give the daily special and bestsellers somewhere to live.',
            'Put hours and location where a first-time visitor looks.',
          ],
          userTitle: 'What customers needed',
          user: [
            'See what the kitchen sells and what it costs at a glance.',
            'Know whether it is open, and where it is.',
            'Start an order from the dish itself.',
          ],
        },
        users: {
          title: '',
          body: '',
          personas: [],
        },
        process: {
          title: 'What the live site does',
          steps: [
            {
              heading: '01 · The home page opens with the menu',
              body: 'The flame-grilled menu appears with the daily special and bestsellers on the same screen, so the first scroll answers "what do they cook?"',
              image: '',
            },
            {
              heading: '02 · Add actions sit beside the food',
              body: 'Customers can start an order from a menu item or from a bestseller card — the order path begins at the dish, not in a separate form.',
              image: '',
            },
            {
              heading: '03 · Hours and address appear on the home page',
              body: 'All seven days of opening hours and the Braamfontein address sit on the home page itself, not buried behind a contact link.',
              image: '',
            },
            {
              heading: '04 · The breakfast special has a time window',
              body: 'A dedicated card shows when the offer is available, so a time-limited special reads as time-limited.',
              image: '',
            },
          ],
        },
        build: {
          title: 'Design decisions',
          body: '',
          sections: [
            {
              heading: 'Menu and prices appear together',
              body: 'Every dish carries its price on the card it sits on. The daily special and bestsellers share the home page with the full menu, so nothing needs a second click to be believed.',
              image: '',
            },
            {
              heading: 'One ordering path, started at the food',
              body: 'Add actions live beside menu items and bestseller cards and lead into a single basket, rather than a contact form that asks the customer to retype the order.',
              image: '',
            },
            {
              heading: 'The phone is the restaurant\'s front door',
              body: 'Most visits arrive on a phone from a map or a search. The menu, hours and address are laid out to be read on one thumb, in the order someone decides.',
              image: '',
            },
          ],
        },
        impact: {
          body: 'The live site puts the menu, daily special, hours, location and online ordering together in one place. I do not have verified figures for visits, orders or revenue, so this study does not claim any — what would settle it is order and visit data from the business.',
          image: '',
        },
        learned: {
          title: 'What I could verify',
          items: [
            {
              heading: 'Checked on the live site',
              body: 'The menu and prices, the ordering path, the daily special, the seven days of trading hours and the Braamfontein address were all checked on the live site.',
              image: '',
            },
            {
              heading: 'Not claimed',
              body: 'I do not have mobile-test or performance results to report, and I have not confirmed the original brief or delivery scope. Those are the next things I would ask the business for before repeating any claim about sales or traffic.',
              image: '',
            },
          ],
        },
        thanks: 'The menu now takes the order. Happy to walk through the menu structure and the ordering path on a call.',
      },
    },
  ],

  /* ---- Cards that are a redirect only ------------------------------------ */
  redirects: [
    {
      kind: 'redirect',
      slug: 'sk-finds',
      id: 'sk-finds',
      title: 'SK Finds',
      client: 'SK Finds, Thembisa',
      year: '2025',
      description:
        'A WhatsApp-order storefront for a car-accessories and plush-toy shop in Thembisa: prices in rand, products grouped by category, hours and a collection point, and an order path that opens a pre-filled chat.',
      role: 'WhatsApp storefront PWA',
      skills: ['UI Design', 'PWA Build', 'WhatsApp Ordering'],
      tags: ['home', 'website-design', 'cat-marketingwebsite', 'cat-ecommerce'],
      cover: 'skfinds-cover.webp',
      url: 'https://skautos.vercel.app/',
      urlLabel: 'Visit the live store',
      note: 'Opens the live storefront — this card is a link, not a study.',
    },
    {
      kind: 'redirect',
      slug: 'nerdma',
      id: 'nerdma',
      title: 'Nerdma',
      client: 'Nerdma Systems',
      year: '2023',
      description:
        'Five governance, risk and sustainability products that only make sense together. I rebuilt the site around the ecosystem story and designed the NerdScore, NerdGrid and NerdGrow dashboards so the product shows what the site promises.',
      role: 'UI/UX Designer & Developer',
      skills: ['Information Architecture', 'UI Design', 'Dashboards', 'Front-end Build'],
      tags: ['home', 'website-design', 'cat-saas-ops', 'cat-marketingwebsite'],
      cover: 'nerdma-cover.webp',
      url: 'https://www.nerdma.co.za',
      urlLabel: 'Visit nerdma.co.za',
      note: 'Opens the live site — this card is a link, not a study.',
    },
    {
      kind: 'redirect',
      slug: 'snb',
      id: 'snb',
      title: 'SnB Chartered Accountants',
      client: 'SnB Chartered Accountants & Auditors',
      year: '2019',
      description:
        'A first proper website for a 100% black-owned firm of chartered accountants: services written for the sub-services clients search for, credentials near the top, and a CMS the firm could run itself.',
      role: 'UI/UX, build & CMS handover',
      skills: ['Content Structure', 'UI Design', 'Responsive Build', 'CMS Handover'],
      tags: ['home', 'website-design', 'cat-marketingwebsite'],
      cover: 'snb-cover.webp',
      url: 'https://www.snbconsultancy.co.za',
      urlLabel: 'Visit snbconsultancy.co.za',
      note: 'Opens the live site — this card is a link, not a study.',
    },
    {
      kind: 'redirect',
      slug: 'prodops',
      id: 'prodops',
      title: 'ProdOps',
      client: 'ProdOps — product owner: Lulamile Mkhungela',
      year: '2025 — now',
      description:
        'A role-based product workspace where business, product/UX/UI/CX, development, QA and delivery each get their own stage, approvals and exportable specs — with AI drafting and Figma frame imports where a provider is configured.',
      role: 'Product owner & builder',
      skills: ['Product Strategy', 'Workflow Design', 'AI Interfaces', 'React'],
      tags: ['home', 'product-design', 'cat-saas-ops'],
      cover: '',
      url: 'https://lulamilemkhungela.github.io/ProdOps/',
      urlLabel: 'Open ProdOps',
      note: 'Opens the live workspace — this card is a link, not a study.',
    },
  ],

  /* ---- Mobile apps coming soon ------------------------------------------- */
  comingSoon: {
    title: 'Mobile apps, in the build',
    lede:
      'Three apps I am building now. Each one gets an Android APK and an iOS build at launch — the buttons are wired and waiting for their URLs.',
    apps: [
      {
        id: 'lawmania',
        name: 'Lawmania',
        aka: 'Lekgotla',
        tagline: 'Legal matters, gathered in one place.',
        description:
          'A mobile home for South African legal practice — matters, documents and client updates in one app, so the admin lives in one place instead of a phone full of threads.',
        status: 'In development',
        platforms: ['Android', 'iOS'],
        skills: ['Legal tech', 'Mobile app'],
        downloads: { android: '', ios: '' },
      },
      {
        id: 'lulafind',
        name: 'LulaFind',
        aka: 'Find',
        tagline: 'Find lost items, lost and missing people.',
        description:
          'The Find app, carried forward. Post a lost item, a found item or a missing person; browse what others have posted; message the person who posted it and give proof that what was found is yours. Safety guidance is built into the flow — the app advises meeting at the nearest police station to collect anything that was found, rather than meeting a stranger alone.',
        status: 'In development',
        platforms: ['Android', 'iOS'],
        skills: ['Community', 'Mobile app', 'Trust & safety'],
        downloads: { android: '', ios: '' },
      },
      {
        id: 'ai-lifeos',
        name: 'AI-LifeOS',
        aka: 'LifeOS',
        tagline: 'One operating system for a whole life.',
        description:
          'Goals, habits, money, focus and the people who matter, held in one AI-assisted system instead of six apps that never speak to each other.',
        status: 'In design',
        platforms: ['Android', 'iOS'],
        skills: ['AI product', 'Mobile app'],
        downloads: { android: '', ios: '' },
      },
    ],
  },
};
