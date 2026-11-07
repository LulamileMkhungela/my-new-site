/** Public project content from Lulamile Mkhungela's portfolio, fitted to the original my-new-site schema. Refresh with scripts/sync-portfolio.py. */
window.PROJECTS = {
  "product": [
    {
      "kind": "project",
      "slug": "employee-engagement-app-redesign",
      "id": "employee-engagement-app-redesign",
      "title": "Vodacom Engage",
      "client": "Vodacom HRIT · Midrand",
      "year": "2021 — 2023",
      "description": "Rebuilt navigation, search and information architecture for the employee engagement app used across the group — turning a wall of tiles into a product people can find things in.",
      "role": "UI/UX Designer & Design System Lead, via iOCO",
      "team": "Vodacom HRIT · Midrand",
      "duration": "Johannesburg, South Africa",
      "location": "Johannesburg, South Africa",
      "skills": [
        "Enterprise",
        "Mobile app",
        "UX research",
        "Published"
      ],
      "tags": [
        "home",
        "cat-product"
      ],
      "cover": "engage-cover.webp",
      "url": "case-study.html?id=employee-engagement-app-redesign",
      "sourceUrl": "https://lulamilemkhungela.github.io/portfolio.github.io/portfolio/employee-engagement-app-redesign.html",
      "liveUrl": "",
      "category": "Product",
      "status": "Published",
      "sections": [
        {
          "id": "overview",
          "kicker": "Overview",
          "title": "Overview",
          "paragraphs": [
            "Feature discoverability up ~60% after launch.",
            "The Vodacom employee engagement app is the front door for everything people need at work — communications, policies, wellness, campus services, rewards, strategy content and linked apps. The original home screen opened with a branded GIF loader, a scrolling communications banner and then a long, flat wall of tiles. Everything was there. Almost nothing was findable.",
            "My objective was to rebuild the navigation and information architecture so employees could get to a feature, an article or an app in as few steps as possible — and to make the app feel like a tool they choose to open rather than one they have to dig through."
          ],
          "cards": [],
          "steps": [],
          "results": [],
          "images": []
        },
        {
          "id": "problem",
          "kicker": "The problem",
          "title": "Everything was there. Almost nothing was findable.",
          "paragraphs": [],
          "cards": [],
          "steps": [],
          "results": [
            {
              "title": "Key features were buried",
              "body": [
                "Critical tools sat several scrolls deep in an undifferentiated tile grid. Employees often gave up before reaching the thing they opened the app for.",
                "Impact: High-value features were effectively invisible, while the same handful of top tiles absorbed almost all engagement."
              ]
            },
            {
              "title": "No way to search",
              "body": [
                "There was no search across features, articles or tools. Users had to remember where something lived, and recall-based navigation fails fast in a large organisation.",
                "Impact: Routine tasks turned into support calls and \"where do I find…\" messages to HR and IT."
              ]
            },
            {
              "title": "The banner competed with the work",
              "body": [
                "A scrolling communications banner pushed the useful content below the fold and mixed announcements in with navigation, so users could not tell what was action and what was news.",
                "Impact: Announcements were read, features were not used — the opposite of what the product needed."
              ]
            },
            {
              "title": "Nothing was personalised",
              "body": [
                "The app looked identical for a technician on a plant floor, a line manager and an HR administrator. No favourites, no recents, no shortcuts to what each person actually uses.",
                "Impact: No reason to come back — once the novelty wore off, only mandated actions brought people in."
              ]
            }
          ],
          "images": [
            {
              "src": "engage-wireframe.webp",
              "alt": "Vodacom Engage — defining the problem",
              "caption": "Vodacom Engage — defining the problem"
            }
          ]
        },
        {
          "id": "goals",
          "kicker": "Goals",
          "title": "Fewer taps to the thing people opened the app for.",
          "paragraphs": [],
          "cards": [
            {
              "title": "What the business needed",
              "label": "BUSINESS GOALS",
              "body": [],
              "items": [
                "Increase feature discoverability and reduce the number of taps required for common tasks.",
                "Cut internal support volume caused by employees not locating features or content.",
                "Raise voluntary engagement so the app becomes a channel HR can rely on, not just a compliance tool."
              ],
              "tradeoff": ""
            },
            {
              "title": "What people needed",
              "label": "USER GOALS",
              "body": [],
              "items": [
                "Find a feature, policy or tool in seconds — by searching rather than guessing where it lives.",
                "See the things I personally use most, right on the home screen.",
                "Understand the difference between news, tools and updates without having to test everything."
              ],
              "tradeoff": ""
            }
          ],
          "steps": [],
          "results": [],
          "images": []
        },
        {
          "id": "personas",
          "kicker": "Personas",
          "title": "Who it is for",
          "paragraphs": [],
          "cards": [
            {
              "title": "The Frontline Employee",
              "label": "PERSONA 01",
              "body": [
                "Works shifts, opens the app in short bursts on a mid-range Android phone, usually while standing up. Needs policies, payslips, wellness and shift tools — fast.",
                "When something changes on site, I want to pull up the right policy or form in a few seconds from my phone, so I can answer a supervisor or a colleague without walking to a kiosk."
              ],
              "items": [],
              "tradeoff": ""
            },
            {
              "title": "The Line Manager",
              "label": "PERSONA 02",
              "body": [
                "Uses the app to push communications and check team-related content. Cares whether people actually see what the team is being told.",
                "When a message matters, I want to know it was easy for my team to find and read, so I am not chasing people individually."
              ],
              "items": [],
              "tradeoff": ""
            },
            {
              "title": "The Service Desk Administrator",
              "label": "PERSONA 03",
              "body": [
                "Spends the day resolving \"where is this\" questions. Watches the support queue and knows exactly which features people cannot find.",
                "When the same question arrives three times in a week, I want the interface itself to answer it — so my queue stays focused on real problems."
              ],
              "items": [],
              "tradeoff": ""
            }
          ],
          "steps": [],
          "results": [],
          "images": []
        },
        {
          "id": "process",
          "kicker": "Process",
          "title": "I started with why people could not find things.",
          "paragraphs": [],
          "cards": [],
          "steps": [
            {
              "title": "Research & Analysis",
              "body": [
                "I gathered feedback from existing users who had repeatedly reported difficulty navigating the app, and reviewed comparable employee engagement products to see how they handled grouping and discoverability. The pattern across all of it was the same: users do not want more tiles, they want fewer decisions."
              ]
            },
            {
              "title": "Wireframing & Information Architecture",
              "body": [
                "Low-fidelity wireframes mapped the new flow first. Tiles were grouped into meaningful sections — Safety, Health and Wellbeing; Policies and Information; Smart Buildings; Rewards and Benefits; Company Strategy; and Apps. A dedicated search with filters was designed to reach features, content and tools directly, a chatbot section surfaced every available bot in one place, and a favourites row was placed below the communications banner so people could pin what they actually use."
              ]
            },
            {
              "title": "High-Fidelity Design & User Testing",
              "body": [
                "High-fidelity mockups were built and tested with employees. Testing focused on three things: how fast someone could locate a known feature, whether search results matched expectation, and whether the favourites concept was understood without explanation. The profile icon gained a floating menu showing personal detail, app information and usage, and the chatbot section was reworked with icons to make it scannable."
              ]
            },
            {
              "title": "Iteration, Implementation & Launch",
              "body": [
                "Feedback from stakeholders and testers drove small but important refinements to visual hierarchy and consistency. I then worked directly with the development team through implementation — layout, responsiveness and interaction detail — and reviewed builds against design before release.",
                "What the release changed is measured in the impact section below."
              ]
            }
          ],
          "results": [],
          "images": [
            {
              "src": "engage-screens.webp",
              "alt": "Vodacom Engage — High-Fidelity Design & User Testing",
              "caption": "Vodacom Engage — High-Fidelity Design & User Testing"
            }
          ]
        },
        {
          "id": "impact",
          "kicker": "Impact",
          "title": "Validated before rollout, measured after launch.",
          "paragraphs": [
            "The redesign was tested before rollout and measured again after launch. Post-launch task testing reported roughly 60% better discoverability of key features; common-journey task times were about a third shorter. Support requests about finding features also fell after search and grouped sections went live, though I do not have a count to publish.",
            "After launch, search became the main entry point and favourites became the second most-used element on the home screen — the two things the old tile grid could never surface."
          ],
          "cards": [],
          "steps": [],
          "results": [],
          "images": []
        },
        {
          "id": "outcomes",
          "kicker": "Outcomes",
          "title": "Outcomes",
          "paragraphs": [],
          "cards": [],
          "steps": [],
          "results": [
            {
              "title": "About 60% better discoverability",
              "body": [
                "Measured in post-launch task testing against the old home screen."
              ]
            },
            {
              "title": "Search across everything",
              "body": [
                "Features, articles and linked apps in one result list, so nothing depends on remembering where it sits."
              ]
            },
            {
              "title": "The home screen shows your work",
              "body": [
                "Favourites and recents replaced one identical grid for every employee."
              ]
            },
            {
              "title": "News and tools separated",
              "body": [
                "Announcements stopped pushing the useful part below the fold."
              ]
            }
          ],
          "images": []
        },
        {
          "id": "conclusion",
          "kicker": "What I took forward",
          "title": "Search became the main route into the app.",
          "paragraphs": [
            "This project was delivered as part of the Vodacom HRIT employee experience programme. I can walk through the full research, wireframes and testing documentation on a call."
          ],
          "cards": [],
          "steps": [],
          "results": [],
          "images": []
        },
        {
          "id": "vodacom-internal",
          "kicker": "Also delivered at Vodacom",
          "title": "Other internal platforms from the same programme.",
          "paragraphs": [],
          "cards": [
            {
              "title": "Tobby chatbot",
              "label": "Internal · NDA",
              "body": [
                "Conversational assistant interface for Vodacom employees, shipped with multilingual support across the group's systems."
              ],
              "items": [],
              "tradeoff": ""
            },
            {
              "title": "Engage Admin",
              "label": "Internal · NDA",
              "body": [
                "Admin platform behind the Engage employee app — content and operations for the HR-IT teams, delivered and passed testing."
              ],
              "items": [],
              "tradeoff": ""
            },
            {
              "title": "Digital Visitors",
              "label": "Internal · NDA",
              "body": [
                "Visitor management platform for Vodacom campuses, delivered and passed testing."
              ],
              "items": [],
              "tradeoff": ""
            },
            {
              "title": "External Bursary",
              "label": "Internal · NDA",
              "body": [
                "External bursary platform, delivered and passed testing."
              ],
              "items": [],
              "tradeoff": ""
            }
          ],
          "steps": [],
          "results": [],
          "images": []
        },
        {
          "id": "checks",
          "kicker": "How I checked the work",
          "title": "Evidence and boundaries",
          "paragraphs": [
            "Usability testing with employees before release, covering how fast someone could find a known feature, whether search results matched expectations, and whether the favourites concept was understood without explanation.",
            "Post-launch task testing against the old home screen, and time-to-task on the most common journeys.",
            "User acceptance testing (UAT) reached 92%."
          ],
          "cards": [],
          "steps": [],
          "results": [],
          "images": []
        }
      ],
      "caseStudy": {
        "hero": "engage-cover.webp",
        "summary": {
          "title": "Overview",
          "body": "Feature discoverability up ~60% after launch.\n\nThe Vodacom employee engagement app is the front door for everything people need at work — communications, policies, wellness, campus services, rewards, strategy content and linked apps. The original home screen opened with a branded GIF loader, a scrolling communications banner and then a long, flat wall of tiles. Everything was there. Almost nothing was findable.\n\nMy objective was to rebuild the navigation and information architecture so employees could get to a feature, an article or an app in as few steps as possible — and to make the app feel like a tool they choose to open rather than one they have to dig through.",
          "disclaimer": "Usability testing with employees before release, covering how fast someone could find a known feature, whether search results matched expectations, and whether the favourites concept was understood without explanation.\n\nPost-launch task testing against the old home screen, and time-to-task on the most common journeys.\n\nUser acceptance testing (UAT) reached 92%."
        },
        "problem": {
          "title": "Everything was there. Almost nothing was findable.",
          "cards": []
        },
        "blueprint": {
          "title": "",
          "image": "engage-wireframe.webp"
        },
        "goals": {
          "title": "Fewer taps to the thing people opened the app for.",
          "businessTitle": "Business goals",
          "userTitle": "User goals",
          "business": [
            "Increase feature discoverability and reduce the number of taps required for common tasks.",
            "Cut internal support volume caused by employees not locating features or content.",
            "Raise voluntary engagement so the app becomes a channel HR can rely on, not just a compliance tool."
          ],
          "user": [
            "Find a feature, policy or tool in seconds — by searching rather than guessing where it lives.",
            "See the things I personally use most, right on the home screen.",
            "Understand the difference between news, tools and updates without having to test everything."
          ]
        },
        "users": {
          "title": "Who it is for",
          "personas": [
            {
              "name": "The Frontline Employee",
              "body": "",
              "image": ""
            },
            {
              "name": "The Line Manager",
              "body": "",
              "image": ""
            },
            {
              "name": "The Service Desk Administrator",
              "body": "",
              "image": ""
            }
          ]
        },
        "process": {
          "title": "I started with why people could not find things.",
          "steps": [
            {
              "title": "Research & Analysis",
              "body": [
                "I gathered feedback from existing users who had repeatedly reported difficulty navigating the app, and reviewed comparable employee engagement products to see how they handled grouping and discoverability. The pattern across all of it was the same: users do not want more tiles, they want fewer decisions."
              ]
            },
            {
              "title": "Wireframing & Information Architecture",
              "body": [
                "Low-fidelity wireframes mapped the new flow first. Tiles were grouped into meaningful sections — Safety, Health and Wellbeing; Policies and Information; Smart Buildings; Rewards and Benefits; Company Strategy; and Apps. A dedicated search with filters was designed to reach features, content and tools directly, a chatbot section surfaced every available bot in one place, and a favourites row was placed below the communications banner so people could pin what they actually use."
              ]
            },
            {
              "title": "High-Fidelity Design & User Testing",
              "body": [
                "High-fidelity mockups were built and tested with employees. Testing focused on three things: how fast someone could locate a known feature, whether search results matched expectation, and whether the favourites concept was understood without explanation. The profile icon gained a floating menu showing personal detail, app information and usage, and the chatbot section was reworked with icons to make it scannable."
              ]
            },
            {
              "title": "Iteration, Implementation & Launch",
              "body": [
                "Feedback from stakeholders and testers drove small but important refinements to visual hierarchy and consistency. I then worked directly with the development team through implementation — layout, responsiveness and interaction detail — and reviewed builds against design before release.",
                "What the release changed is measured in the impact section below."
              ]
            }
          ]
        },
        "build": {
          "title": "Design decisions & artefacts",
          "sections": [
            {
              "heading": "Tobby chatbot",
              "body": "",
              "image": ""
            },
            {
              "heading": "Engage Admin",
              "body": "",
              "image": ""
            },
            {
              "heading": "Digital Visitors",
              "body": "",
              "image": ""
            },
            {
              "heading": "External Bursary",
              "body": "",
              "image": ""
            },
            {
              "heading": "Vodacom Engage — High-Fidelity Design & User Testing",
              "body": "",
              "image": "engage-screens.webp"
            }
          ]
        },
        "impact": {
          "title": "Validated before rollout, measured after launch.",
          "body": "The redesign was tested before rollout and measured again after launch. Post-launch task testing reported roughly 60% better discoverability of key features; common-journey task times were about a third shorter. Support requests about finding features also fell after search and grouped sections went live, though I do not have a count to publish.\n\nAfter launch, search became the main entry point and favourites became the second most-used element on the home screen — the two things the old tile grid could never surface.",
          "image": ""
        },
        "localisation": {
          "body": "",
          "image": ""
        },
        "expansion": {
          "title": "Outcomes",
          "items": []
        },
        "learned": {
          "title": "What I took forward",
          "items": [
            {
              "heading": "Search became the main route into the app.",
              "body": "This project was delivered as part of the Vodacom HRIT employee experience programme. I can walk through the full research, wireframes and testing documentation on a call."
            }
          ]
        }
      }
    },
    {
      "kind": "project",
      "slug": "foodiezone-pwa",
      "id": "foodiezone-pwa",
      "title": "FoodieZone",
      "client": "FoodieZone · Pimville, Soweto",
      "year": "2025",
      "description": "End-to-end design and build of the live ordering PWA for FoodieZone — a smash-burger and wings kitchen in Pimville, Soweto that was taking every order through WhatsApp and Instagram DMs.",
      "role": "Lead Product Designer & UI Developer, freelance",
      "team": "FoodieZone · Pimville, Soweto",
      "duration": "Pimville, Soweto",
      "location": "Pimville, Soweto",
      "skills": [
        "Small business",
        "PWA",
        "UI development",
        "Live"
      ],
      "tags": [
        "home",
        "cat-impact"
      ],
      "cover": "foodiezone-cover.webp",
      "url": "case-study.html?id=foodiezone-pwa",
      "sourceUrl": "https://lulamilemkhungela.github.io/portfolio.github.io/portfolio/foodiezone-pwa.html",
      "liveUrl": "https://loux91.github.io/foodiezone/",
      "category": "Impact",
      "status": "Live",
      "sections": [
        {
          "id": "overview",
          "kicker": "Overview",
          "title": "Overview",
          "paragraphs": [
            "Customers order, repeat and track — the kitchen runs the menu from a phone.",
            "FoodieZone is a hand-pressed burger and wings kitchen in Pimville, Soweto. Before the PWA, orders came through WhatsApp and Instagram: the owner copied items, quantities and addresses between messages, and had no single order record once food went out.",
            "I designed and built the ordering experience end to end as an installable Progressive Web App. The live site opens on the bestseller — the Cheesey Smash Burger — then moves into the eight categories the kitchen actually sells: Burgers, Smash, Dagwoods, Wingzz, Loaded, Prego, Wraps and Chicken. The live menu lists prices such as Cheesey Smash R95, Death By Bacon R125, 5 Dunked Wings R55, Loaded Chips R45, Chicken Dagwood R75 and Prego Roll R65. The owner updates them from a phone."
          ],
          "cards": [],
          "steps": [],
          "results": [],
          "images": []
        },
        {
          "id": "problem",
          "kicker": "The problem",
          "title": "Every order started as a message.",
          "paragraphs": [],
          "cards": [],
          "steps": [],
          "results": [
            {
              "title": "Orders arrived as unstructured messages",
              "body": [
                "Every order was a conversation: item names in text, quantities guessed, delivery addresses typed out again for each customer, every time.",
                "Impact: Orders were misread, and hours a day went into retyping the same information instead of cooking."
              ]
            },
            {
              "title": "The menu only existed as screenshots",
              "body": [
                "Prices and availability changed constantly, but the menu lived as images inside a chat history that nobody could search.",
                "Impact: Customers ordered sold-out items and asked for prices that had already changed."
              ]
            },
            {
              "title": "Regulars re-typed the same order every week",
              "body": [
                "The best customers — the ones ordering the same two or three meals — did the most work, retyping a familiar order from memory.",
                "Impact: Repeat volume was capped by effort rather than by appetite."
              ]
            },
            {
              "title": "Nothing recorded what actually sold",
              "body": [
                "No data existed on which items moved, at what time of day, or which categories carried the menu.",
                "Impact: Stock, specials and staffing were decided on instinct alone."
              ]
            }
          ],
          "images": [
            {
              "src": "foodiezone-flow.webp",
              "alt": "FoodieZone — defining the problem",
              "caption": "FoodieZone — defining the problem"
            }
          ]
        },
        {
          "id": "goals",
          "kicker": "Goals",
          "title": "Order in seconds. Reorder in a tap.",
          "paragraphs": [],
          "cards": [
            {
              "title": "What the business needed",
              "label": "BUSINESS GOALS",
              "body": [],
              "items": [
                "Move ordering off direct messages into one structured flow the kitchen controls.",
                "Make price and availability changes self-service for the owner.",
                "Turn first-time buyers into repeat customers through an order history."
              ],
              "tradeoff": ""
            },
            {
              "title": "What people needed",
              "label": "USER GOALS",
              "body": [],
              "items": [
                "See the current menu and real prices in under a minute.",
                "Reorder a usual without retyping anything.",
                "Know exactly when the food will be ready."
              ],
              "tradeoff": ""
            }
          ],
          "steps": [],
          "results": [],
          "images": []
        },
        {
          "id": "personas",
          "kicker": "Personas",
          "title": "Who it is for",
          "paragraphs": [],
          "cards": [
            {
              "title": "The Regular",
              "label": "PERSONA 01",
              "body": [
                "Orders the same two or three meals a week, usually on the way home, often on mobile data.",
                "When I am hungry and short on time, I want to repeat last week's order in a couple of taps, so I can eat without a conversation."
              ],
              "items": [],
              "tradeoff": ""
            },
            {
              "title": "The Owner",
              "label": "PERSONA 02",
              "body": [
                "Runs the kitchen, takes the orders and cooks. Has no time to maintain a website and does not want an app store account.",
                "When something sells out at 7pm, I want to mark it unavailable from my phone in seconds, so customers do not order what I cannot make."
              ],
              "items": [],
              "tradeoff": ""
            }
          ],
          "steps": [],
          "results": [],
          "images": []
        },
        {
          "id": "process",
          "kicker": "Process",
          "title": "Seven days behind the phone, then the build.",
          "paragraphs": [],
          "cards": [],
          "steps": [
            {
              "title": "Seven days behind the phone",
              "body": [
                "I reviewed a full week's orders: which channel they came through, what details were missing, where mistakes happened and what the owner had to retype. I also mapped how customers chose what to order and where they left the basket."
              ]
            },
            {
              "title": "A menu with muscles",
              "body": [
                "The kitchen's own list became the structure: Burgers, Smash, Dagwoods, Wingzz, Loaded, Prego, Wraps, Chicken — eight real categories instead of one flat price list. Ordering shrank to menu, cart, checkout, confirmation; quantities step rather than get typed, and checkout asks only what the kitchen actually needs to cook and deliver."
              ]
            },
            {
              "title": "Food first, tested first",
              "body": [
                "The interface leads with food: a hero shot of the smash burger wearing the bestseller badge, then the menu in order, the standard the owner set (no average), and the call to order. Before a line of code, three of the owner's regular customers clicked through the order flow. Quantity editing in the order summary was unclear, so that screen was redesigned around it — fixed before build, not after launch."
              ]
            },
            {
              "title": "Wired to keep working",
              "body": [
                "Built as an installable PWA with a cached shell and menu, so it opens instantly and keeps working when the signal drops on the way to Pimville. Touch targets, contrast and status labels were built to the same rules the design was tested against, and the owner updates the menu from a phone without a developer."
              ]
            },
            {
              "title": "Feeding the funnel",
              "body": [
                "Post-launch I tracked the funnel — category views, cart adds, checkouts, reorders — and reviewed it weekly. When repeat customers proved the strongest signal, the reorder path moved up to the home screen, and category order followed what actually sold instead of what had always been listed first."
              ]
            }
          ],
          "results": [],
          "images": []
        },
        {
          "id": "decisions",
          "kicker": "Key decisions and trade-offs",
          "title": "Key decisions",
          "paragraphs": [],
          "cards": [
            {
              "title": "The kitchen's own list became the structure",
              "label": "1",
              "body": [
                "Eight real categories — Burgers, Smash, Dagwoods, Wingzz, Loaded, Prego, Wraps, Chicken — instead of one flat price list."
              ],
              "items": [],
              "tradeoff": "Trade-off: Eight categories is more to scroll than a single list, and every new item has to be filed into one of them."
            },
            {
              "title": "Quantities step, and checkout asks only what the kitchen needs",
              "label": "2",
              "body": [
                "Ordering shrank to menu, cart, checkout, confirmation. Quantities step rather than get typed, so an order cannot arrive as a misread number."
              ],
              "items": [],
              "tradeoff": "Trade-off: A stepper is slower than typing when someone wants a large quantity."
            },
            {
              "title": "A PWA, not a native app",
              "label": "3",
              "body": [
                "Installable from the browser with a cached shell and menu, so it opens without an app store and keeps working when the signal drops."
              ],
              "items": [],
              "tradeoff": "Trade-off: No app store listing, and iOS treats an installed PWA differently from a native app. The owner did not want a store account, so that cost was acceptable here."
            },
            {
              "title": "Reorder moved up once the data came in",
              "label": "4",
              "body": [
                "Repeat customers proved the strongest signal, so the reorder path moved to the home screen and category order followed what actually sold."
              ],
              "items": [],
              "tradeoff": "Trade-off: Putting reorder first pushes the full menu further down for a first-time customer."
            }
          ],
          "steps": [],
          "results": [],
          "images": []
        },
        {
          "id": "impact",
          "kicker": "Impact",
          "title": "The DMs moved into the app.",
          "paragraphs": [
            "The PWA launched with the existing customer base migrated off DMs. Structured orders replaced the manual back-and-forth, and reorders — a single tap from order history — became a meaningful share of weekly volume. The kitchen now updates prices and marks items sold out from a phone in seconds instead of re-shooting screenshots.",
            "Because it is a PWA there is nothing to install from a store: customers add it to the home screen from the browser, and the shell and menu are cached, so the menu still opens instantly on a weak connection. The Cheesey Smash Burger is pinned as the bestseller the way the kitchen talks about it, not the way a database sorts it."
          ],
          "cards": [],
          "steps": [],
          "results": [],
          "images": []
        },
        {
          "id": "live",
          "kicker": "The live product",
          "title": "Ordering, running in Pimville.",
          "paragraphs": [],
          "cards": [],
          "steps": [],
          "results": [],
          "images": [
            {
              "src": "foodiezone-desktop.webp",
              "alt": "FoodieZone on desktop",
              "caption": "The live menu and cart. Captured from the live site, September 2026."
            },
            {
              "src": "foodiezone-mobile.webp",
              "alt": "FoodieZone on a phone",
              "caption": "The phone view that replaced the DMs."
            }
          ]
        },
        {
          "id": "outcomes",
          "kicker": "Outcomes",
          "title": "Outcomes",
          "paragraphs": [],
          "cards": [],
          "steps": [],
          "results": [
            {
              "title": "One tap to reorder",
              "body": [
                "Order history turns a regular into a single tap instead of a retyped message."
              ]
            },
            {
              "title": "One queue, not two inboxes",
              "body": [
                "Orders arrive in the same place with items, options and totals already correct."
              ]
            },
            {
              "title": "Menu edits without a developer",
              "body": [
                "Prices, sold-out items and specials are handled by staff from a phone."
              ]
            },
            {
              "title": "Live at loux91.github.io/foodiezone",
              "body": [
                "Light enough to install and use on a tight data budget."
              ]
            }
          ],
          "images": []
        },
        {
          "id": "checks",
          "kicker": "How I checked the work",
          "title": "Evidence and boundaries",
          "paragraphs": [
            "Three of the owner's own regulars walked the order flow before any code was written. The thing that broke was quantity editing in the order summary — unclear enough that the screen was rebuilt around it, and fixed before build rather than patched after launch.",
            "After launch I reviewed the funnel weekly — category views, cart adds, checkouts and reorders — and that is what moved the reorder path up and reordered the categories.",
            "The live app is public and taking orders, so the flow can be walked end to end. What I do not have is a count of orders lost to mistyped direct messages before it existed."
          ],
          "cards": [],
          "steps": [],
          "results": [],
          "images": []
        },
        {
          "id": "conclusion",
          "kicker": "What I took forward",
          "title": "The kitchen can run the menu from a phone.",
          "paragraphs": [
            "Live and installable at loux91.github.io/foodiezone. Happy to walk through the research notes, menu architecture and analytics on a call."
          ],
          "cards": [],
          "steps": [],
          "results": [],
          "images": []
        }
      ],
      "caseStudy": {
        "hero": "foodiezone-cover.webp",
        "summary": {
          "title": "Overview",
          "body": "Customers order, repeat and track — the kitchen runs the menu from a phone.\n\nFoodieZone is a hand-pressed burger and wings kitchen in Pimville, Soweto. Before the PWA, orders came through WhatsApp and Instagram: the owner copied items, quantities and addresses between messages, and had no single order record once food went out.\n\nI designed and built the ordering experience end to end as an installable Progressive Web App. The live site opens on the bestseller — the Cheesey Smash Burger — then moves into the eight categories the kitchen actually sells: Burgers, Smash, Dagwoods, Wingzz, Loaded, Prego, Wraps and Chicken. The live menu lists prices such as Cheesey Smash R95, Death By Bacon R125, 5 Dunked Wings R55, Loaded Chips R45, Chicken Dagwood R75 and Prego Roll R65. The owner updates them from a phone.",
          "disclaimer": "Three of the owner's own regulars walked the order flow before any code was written. The thing that broke was quantity editing in the order summary — unclear enough that the screen was rebuilt around it, and fixed before build rather than patched after launch.\n\nAfter launch I reviewed the funnel weekly — category views, cart adds, checkouts and reorders — and that is what moved the reorder path up and reordered the categories.\n\nThe live app is public and taking orders, so the flow can be walked end to end. What I do not have is a count of orders lost to mistyped direct messages before it existed."
        },
        "problem": {
          "title": "Every order started as a message.",
          "cards": []
        },
        "blueprint": {
          "title": "",
          "image": "foodiezone-flow.webp"
        },
        "goals": {
          "title": "Order in seconds. Reorder in a tap.",
          "businessTitle": "Business goals",
          "userTitle": "User goals",
          "business": [
            "Move ordering off direct messages into one structured flow the kitchen controls.",
            "Make price and availability changes self-service for the owner.",
            "Turn first-time buyers into repeat customers through an order history."
          ],
          "user": [
            "See the current menu and real prices in under a minute.",
            "Reorder a usual without retyping anything.",
            "Know exactly when the food will be ready."
          ]
        },
        "users": {
          "title": "Who it is for",
          "personas": [
            {
              "name": "The Regular",
              "body": "",
              "image": ""
            },
            {
              "name": "The Owner",
              "body": "",
              "image": ""
            }
          ]
        },
        "process": {
          "title": "Seven days behind the phone, then the build.",
          "steps": [
            {
              "title": "Seven days behind the phone",
              "body": [
                "I reviewed a full week's orders: which channel they came through, what details were missing, where mistakes happened and what the owner had to retype. I also mapped how customers chose what to order and where they left the basket."
              ]
            },
            {
              "title": "A menu with muscles",
              "body": [
                "The kitchen's own list became the structure: Burgers, Smash, Dagwoods, Wingzz, Loaded, Prego, Wraps, Chicken — eight real categories instead of one flat price list. Ordering shrank to menu, cart, checkout, confirmation; quantities step rather than get typed, and checkout asks only what the kitchen actually needs to cook and deliver."
              ]
            },
            {
              "title": "Food first, tested first",
              "body": [
                "The interface leads with food: a hero shot of the smash burger wearing the bestseller badge, then the menu in order, the standard the owner set (no average), and the call to order. Before a line of code, three of the owner's regular customers clicked through the order flow. Quantity editing in the order summary was unclear, so that screen was redesigned around it — fixed before build, not after launch."
              ]
            },
            {
              "title": "Wired to keep working",
              "body": [
                "Built as an installable PWA with a cached shell and menu, so it opens instantly and keeps working when the signal drops on the way to Pimville. Touch targets, contrast and status labels were built to the same rules the design was tested against, and the owner updates the menu from a phone without a developer."
              ]
            },
            {
              "title": "Feeding the funnel",
              "body": [
                "Post-launch I tracked the funnel — category views, cart adds, checkouts, reorders — and reviewed it weekly. When repeat customers proved the strongest signal, the reorder path moved up to the home screen, and category order followed what actually sold instead of what had always been listed first."
              ]
            }
          ]
        },
        "build": {
          "title": "Design decisions & artefacts",
          "sections": [
            {
              "heading": "The kitchen's own list became the structure",
              "body": "\n\nTrade-off: Eight categories is more to scroll than a single list, and every new item has to be filed into one of them.",
              "image": ""
            },
            {
              "heading": "Quantities step, and checkout asks only what the kitchen needs",
              "body": "\n\nTrade-off: A stepper is slower than typing when someone wants a large quantity.",
              "image": ""
            },
            {
              "heading": "A PWA, not a native app",
              "body": "\n\nTrade-off: No app store listing, and iOS treats an installed PWA differently from a native app. The owner did not want a store account, so that cost was acceptable here.",
              "image": ""
            },
            {
              "heading": "Reorder moved up once the data came in",
              "body": "\n\nTrade-off: Putting reorder first pushes the full menu further down for a first-time customer.",
              "image": ""
            },
            {
              "heading": "The live menu and cart. Captured from the live site, September 2026.",
              "body": "",
              "image": "foodiezone-desktop.webp"
            },
            {
              "heading": "The phone view that replaced the DMs.",
              "body": "",
              "image": "foodiezone-mobile.webp"
            }
          ]
        },
        "impact": {
          "title": "The DMs moved into the app.",
          "body": "The PWA launched with the existing customer base migrated off DMs. Structured orders replaced the manual back-and-forth, and reorders — a single tap from order history — became a meaningful share of weekly volume. The kitchen now updates prices and marks items sold out from a phone in seconds instead of re-shooting screenshots.\n\nBecause it is a PWA there is nothing to install from a store: customers add it to the home screen from the browser, and the shell and menu are cached, so the menu still opens instantly on a weak connection. The Cheesey Smash Burger is pinned as the bestseller the way the kitchen talks about it, not the way a database sorts it.",
          "image": ""
        },
        "localisation": {
          "body": "",
          "image": ""
        },
        "expansion": {
          "title": "Outcomes",
          "items": []
        },
        "learned": {
          "title": "What I took forward",
          "items": [
            {
              "heading": "The kitchen can run the menu from a phone.",
              "body": "Live and installable at loux91.github.io/foodiezone. Happy to walk through the research notes, menu architecture and analytics on a call."
            }
          ]
        }
      }
    },
    {
      "kind": "project",
      "slug": "designops-design-system",
      "id": "designops-design-system",
      "title": "DesignOps",
      "client": "Self-initiated · Lulamile Mkhungela",
      "year": "2026",
      "description": "A design-system pipeline that verifies, not just ships: Figma variables become 41 W3C DTCG tokens, Style Dictionary builds fourteen targets, and @designops/lint keeps shipped code honest — one source of truth, a linter that checks shipped code.",
      "role": "Product designer and developer",
      "team": "Self-initiated · Lulamile Mkhungela",
      "duration": "Built in South Africa",
      "location": "Built in South Africa",
      "skills": [
        "Design systems",
        "Figma",
        "React",
        "Angular",
        "Live preview"
      ],
      "tags": [
        "home",
        "cat-product"
      ],
      "cover": "design-ops-cover.webp",
      "url": "case-study.html?id=designops-design-system",
      "sourceUrl": "https://lulamilemkhungela.github.io/portfolio.github.io/portfolio/designops-design-system.html",
      "liveUrl": "https://6aeb486eccc5e1d03000a127--designopss.netlify.app",
      "category": "Product",
      "status": "Live preview",
      "sections": [
        {
          "id": "overview",
          "kicker": "Overview",
          "title": "Overview",
          "paragraphs": [
            "One source of truth, fourteen targets — a linter that checks shipped code.",
            "DesignOps connects Figma variables, a token file, generated framework outputs and lint checks. The token file is the source of truth; Style Dictionary builds fourteen targets, and @designops/lint checks whether shipped code follows the system. The dashboard puts ten views — tokens, components, the advisory catalogue, demos, lint and requests — in one place without a build step.",
            "Each part has a different job: the advisory suggests, the tokens record and the linter checks. When they disagree, the linter points to what needs fixing before code ships."
          ],
          "cards": [],
          "steps": [],
          "results": [],
          "images": []
        },
        {
          "id": "problem",
          "kicker": "The problem",
          "title": "Design and code drift apart the moment they are handed off.",
          "paragraphs": [],
          "cards": [],
          "steps": [],
          "results": [
            {
              "title": "Design and code drift apart",
              "body": [
                "Tokens get changed in Figma, a value is hard-coded in one app, and within a release or two nobody can say what the real spacing scale is.",
                "Impact: Inconsistent interfaces and design reviews that turn into archaeology."
              ]
            },
            {
              "title": "Every framework needs the same tokens, differently",
              "body": [
                "CSS custom properties, Tailwind config, SCSS maps, TypeScript constants — the same design decision has to be expressed four different ways.",
                "Impact: Manual re-entry, copy-paste errors and values that quietly diverge per platform."
              ]
            },
            {
              "title": "Nobody can find the component they need",
              "body": [
                "Components exist but are scattered across files, stories and tickets, with no single place to search by name, token or framework.",
                "Impact: Teams rebuild what already exists, so the system grows sideways instead of getting stronger."
              ]
            },
            {
              "title": "Documentation is the last thing that gets updated",
              "body": [
                "Component behaviour, states and usage rules live in people’s heads or in a document from two renames ago.",
                "Impact: New team members ship inconsistent work because the rules were never written down."
              ]
            }
          ],
          "images": [
            {
              "src": "design-ops-flow.webp",
              "alt": "DesignOps — defining the problem",
              "caption": "DesignOps — defining the problem"
            }
          ]
        },
        {
          "id": "goals",
          "kicker": "Goals",
          "title": "One token source that every framework can trust.",
          "paragraphs": [],
          "cards": [
            {
              "title": "What the business needed",
              "label": "BUSINESS GOALS",
              "body": [],
              "items": [
                "Make one source of truth authoritative: change the token once, ship it everywhere.",
                "Remove manual translation between design and every framework the team uses.",
                "Give the system a visible pipeline so drift is obvious instead of discovered in review."
              ],
              "tradeoff": ""
            },
            {
              "title": "What people needed",
              "label": "USER GOALS",
              "body": [],
              "items": [
                "Find the right component or token in seconds, by name, token or framework.",
                "See what each framework build will actually output before wiring it in.",
                "Read the usage rules where the component lives, not in a separate document."
              ],
              "tradeoff": ""
            }
          ],
          "steps": [],
          "results": [],
          "images": []
        },
        {
          "id": "personas",
          "kicker": "Three roles I designed for",
          "title": "Who it is for",
          "paragraphs": [],
          "cards": [
            {
              "title": "Design-system maintainer",
              "label": "ROLE 01 · HYPOTHESIS",
              "body": [
                "Potential need: keep token and component definitions aligned across tools and projects.",
                "Generate framework outputs from one token source, rather than asking someone to synchronise each by hand."
              ],
              "items": [],
              "tradeoff": ""
            },
            {
              "title": "UI developer",
              "label": "ROLE 02 · HYPOTHESIS",
              "body": [
                "Potential need: find the right token, framework format and usage guidance while implementing a component.",
                "Make tokens and rules searchable, and expose framework-specific outputs."
              ],
              "items": [],
              "tradeoff": ""
            },
            {
              "title": "Engineering lead",
              "label": "ROLE 03 · HYPOTHESIS",
              "body": [
                "Potential need: review whether interface code follows the shared design system.",
                "Use lint diagnostics to flag deviations before they become review-only conventions."
              ],
              "items": [],
              "tradeoff": ""
            }
          ],
          "steps": [],
          "results": [],
          "images": []
        },
        {
          "id": "process",
          "kicker": "Process",
          "title": "Advise, tokenize, build, verify.",
          "paragraphs": [],
          "cards": [],
          "steps": [
            {
              "title": "Where the handoff breaks",
              "body": [
                "I scoped the tool around four handoff problems: values re-entered across tools, framework-specific token formats, duplicated components and documentation falling out of sync. Each became a requirement. The live product shows the checks and generated outputs I built to address them."
              ]
            },
            {
              "title": "Forty-one tokens, one meaning",
              "body": [
                "The system was audited first: which tokens were real, which had drifted, and which frameworks had quietly invented their own. The model that came out is forty-one W3C DTCG tokens — primitives, semantic roles and component-level values — so a name means the same thing in Figma, in CSS, and in a TypeScript constant."
              ]
            },
            {
              "title": "A direction before a decision",
              "body": [
                "A vendored design-intelligence catalogue — 79 searchable styles, 192 product palettes, 74 font pairings and 119 UX guidelines, searchable offline — turns a direction like \"dark fintech dashboard\" into a W3C DTCG token proposal. Every proposal ships with a provenance map of where each token came from, seven WCAG contrast checks, and a record of what deliberately did not become a token. The advisory proposes; it never writes the source of truth."
              ]
            },
            {
              "title": "One source, fourteen targets",
              "body": [
                "tokens.json stays the single source of truth, and Style Dictionary transforms it into CSS, SCSS, TypeScript and Tailwind artefacts, with components generated for all fourteen framework targets from that one file. The dashboard puts the whole system on screen in ten views with zero build step — tokens, components, frameworks, advisory, demos, a live lint playground, the request board, Storybook and integrations. Dev asks, designer designs, one approval ships it to every target."
              ]
            },
            {
              "title": "Forty sites, zero findings",
              "body": [
                "The proof is a gallery of forty generated sites across twenty categories, built from the components themselves rather than styled by hand. Each page is emitted twice from the same template — the HTML you open and the JSX the linter checks — so a finding is a finding about the page, not about a separate copy. Every site carries its own palette and font pairing, zero lint findings, and its measured contrast, reported rather than quietly fixed."
              ]
            },
            {
              "title": "The linter outranks the catalogue",
              "body": [
                "@designops/lint runs six rules in ESLint and Oxlint — no restyling system components, no raw colours, no arbitrary values, no inline styles, no unknown classes, no unreadable class values. Every diagnostic explains itself and suggests a fix drawn from the team's own theme. Dashboard smoke tests and a freshness gate fail the build if the generated artefacts ever drift from the tokens, so a broken value never reaches production."
              ]
            }
          ],
          "results": [],
          "images": []
        },
        {
          "id": "decisions",
          "kicker": "Key decisions and trade-offs",
          "title": "Key decisions",
          "paragraphs": [],
          "cards": [
            {
              "title": "One token source, fourteen targets",
              "label": "1",
              "body": [
                "tokens.json stays the single source of truth. Style Dictionary generates CSS, SCSS, TypeScript and Tailwind from it, with components for all fourteen framework targets."
              ],
              "items": [],
              "tradeoff": "Trade-off: Every target is generated, so a fix has to be made in the token file or the transform — never hand-edited where it lands."
            },
            {
              "title": "The catalogue advises, it never writes the token file",
              "label": "2",
              "body": [
                "The design-intelligence catalogue turns a direction into a token proposal with a provenance map and seven WCAG contrast checks. A person still approves it."
              ],
              "items": [],
              "tradeoff": "Trade-off: A proposal needs a human approval before it ships, so the catalogue cannot correct a token on its own."
            },
            {
              "title": "Contrast is reported, not quietly fixed",
              "label": "3",
              "body": [
                "Generated sites publish their measured contrast instead of silently correcting a value that fails."
              ],
              "items": [],
              "tradeoff": "Trade-off: A failing value stays visible in the results until someone acts on it, rather than being corrected in the background."
            },
            {
              "title": "The linter outranks the catalogue",
              "label": "4",
              "body": [
                "@designops/lint runs six rules in ESLint and Oxlint, and a freshness gate fails the build if generated artefacts drift from the tokens."
              ],
              "items": [],
              "tradeoff": "Trade-off: A build fails on artefact drift alone, so drift is caught in CI rather than shipped — at the cost of more red builds."
            }
          ],
          "steps": [],
          "results": [],
          "images": []
        },
        {
          "id": "impact",
          "kicker": "Impact",
          "title": "Verifies, not just ships.",
          "paragraphs": [
            "The pipeline starts with forty-one W3C DTCG tokens. Style Dictionary builds each target from that file, and @designops/lint checks code against the system. The dashboard brings token values, components, frameworks and requests together; a mismatch is visible in the lint results before review.",
            "The result is a documented system that reflects the current code and token files, rather than a slide deck that can drift out of date."
          ],
          "cards": [],
          "steps": [],
          "results": [],
          "images": []
        },
        {
          "id": "live",
          "kicker": "The product",
          "title": "Clicked through, live.",
          "paragraphs": [],
          "cards": [],
          "steps": [],
          "results": [],
          "images": [
            {
              "src": "designops-desktop.webp",
              "alt": "DesignOps dashboard overview on desktop",
              "caption": "The Overview view as it loads: 41 tokens in the pipeline, 8 components, 14 targets. Captured from the live product, October 2026."
            },
            {
              "src": "designops-mobile.webp",
              "alt": "DesignOps dashboard on a phone",
              "caption": "The same workspace on a phone."
            },
            {
              "src": "designops-search.webp",
              "alt": "Global search showing results for the query button",
              "caption": "\"button\" typed into global search — the component surfaces before the query is finished."
            },
            {
              "src": "designops-demos.webp",
              "alt": "Demo gallery view with category filters",
              "caption": "Clicking into Demos: forty generated sites, each card a live preview with its measured lint and contrast chips."
            },
            {
              "src": "designops-lint.webp",
              "alt": "Lint view showing the six rules",
              "caption": "The Lint view: six rules across ESLint and Oxlint, every diagnostic explaining its own fix."
            },
            {
              "src": "designops-demo-site.webp",
              "alt": "A generated demo site opened full size",
              "caption": "One of the forty opened full-size — built from the components, linted clean."
            }
          ]
        },
        {
          "id": "outcomes",
          "kicker": "Outcomes",
          "title": "Outcomes",
          "paragraphs": [],
          "cards": [],
          "steps": [],
          "results": [
            {
              "title": "Fourteen targets from one source",
              "body": [
                "Every supported framework is generated from the same forty-one tokens on each change."
              ]
            },
            {
              "title": "Proof in forty sites",
              "body": [
                "A demo gallery built from the components themselves, every site passing the linter with zero findings."
              ]
            },
            {
              "title": "Verifies, not just ships",
              "body": [
                "Six lint rules catch restyles, raw colours and drift in ESLint and Oxlint before review."
              ]
            },
            {
              "title": "Available on request",
              "body": [
                "The Figma file, the working product and the code are shared on request."
              ]
            }
          ],
          "images": []
        },
        {
          "id": "checks",
          "kicker": "How I checked the work",
          "title": "Evidence and boundaries",
          "paragraphs": [
            "Nothing in the gallery is styled by hand: all forty sites are generated from the components, and each one is emitted twice from a single template. The HTML a browser opens and the JSX the linter reads are the same page, so a finding cannot be waved away as an artefact of a second copy.",
            "Six lint rules run in both ESLint and Oxlint. Every diagnostic carries its own explanation, and the fix it suggests comes from the team's theme rather than a generic default.",
            "Drift is caught in CI. Smoke tests run against the dashboard, and a freshness gate breaks the build once the generated artefacts stop matching the token file.",
            "The dashboard, the gallery and the linter are live and clickable, so every claim on this page can be checked against the product itself."
          ],
          "cards": [],
          "steps": [],
          "results": [],
          "images": []
        },
        {
          "id": "conclusion",
          "kicker": "What I took forward",
          "title": "Tokens, components and code that stay in sync.",
          "paragraphs": [
            "The Figma file, the working product and the full codebase are available on request — no links on this page by design. Happy to walk through the token model, the advise-to-verify loop and how it would fit an existing codebase on a call."
          ],
          "cards": [],
          "steps": [],
          "results": [],
          "images": []
        }
      ],
      "caseStudy": {
        "hero": "design-ops-cover.webp",
        "summary": {
          "title": "Overview",
          "body": "One source of truth, fourteen targets — a linter that checks shipped code.\n\nDesignOps connects Figma variables, a token file, generated framework outputs and lint checks. The token file is the source of truth; Style Dictionary builds fourteen targets, and @designops/lint checks whether shipped code follows the system. The dashboard puts ten views — tokens, components, the advisory catalogue, demos, lint and requests — in one place without a build step.\n\nEach part has a different job: the advisory suggests, the tokens record and the linter checks. When they disagree, the linter points to what needs fixing before code ships.",
          "disclaimer": "Nothing in the gallery is styled by hand: all forty sites are generated from the components, and each one is emitted twice from a single template. The HTML a browser opens and the JSX the linter reads are the same page, so a finding cannot be waved away as an artefact of a second copy.\n\nSix lint rules run in both ESLint and Oxlint. Every diagnostic carries its own explanation, and the fix it suggests comes from the team's theme rather than a generic default.\n\nDrift is caught in CI. Smoke tests run against the dashboard, and a freshness gate breaks the build once the generated artefacts stop matching the token file.\n\nThe dashboard, the gallery and the linter are live and clickable, so every claim on this page can be checked against the product itself."
        },
        "problem": {
          "title": "Design and code drift apart the moment they are handed off.",
          "cards": []
        },
        "blueprint": {
          "title": "",
          "image": "design-ops-flow.webp"
        },
        "goals": {
          "title": "One token source that every framework can trust.",
          "businessTitle": "Business goals",
          "userTitle": "User goals",
          "business": [
            "Make one source of truth authoritative: change the token once, ship it everywhere.",
            "Remove manual translation between design and every framework the team uses.",
            "Give the system a visible pipeline so drift is obvious instead of discovered in review."
          ],
          "user": [
            "Find the right component or token in seconds, by name, token or framework.",
            "See what each framework build will actually output before wiring it in.",
            "Read the usage rules where the component lives, not in a separate document."
          ]
        },
        "users": {
          "title": "Who it is for",
          "personas": [
            {
              "name": "Design-system maintainer (ROLE 01 · HYPOTHESIS)",
              "body": "",
              "image": ""
            },
            {
              "name": "UI developer (ROLE 02 · HYPOTHESIS)",
              "body": "",
              "image": ""
            },
            {
              "name": "Engineering lead (ROLE 03 · HYPOTHESIS)",
              "body": "",
              "image": ""
            }
          ]
        },
        "process": {
          "title": "Advise, tokenize, build, verify.",
          "steps": [
            {
              "title": "Where the handoff breaks",
              "body": [
                "I scoped the tool around four handoff problems: values re-entered across tools, framework-specific token formats, duplicated components and documentation falling out of sync. Each became a requirement. The live product shows the checks and generated outputs I built to address them."
              ]
            },
            {
              "title": "Forty-one tokens, one meaning",
              "body": [
                "The system was audited first: which tokens were real, which had drifted, and which frameworks had quietly invented their own. The model that came out is forty-one W3C DTCG tokens — primitives, semantic roles and component-level values — so a name means the same thing in Figma, in CSS, and in a TypeScript constant."
              ]
            },
            {
              "title": "A direction before a decision",
              "body": [
                "A vendored design-intelligence catalogue — 79 searchable styles, 192 product palettes, 74 font pairings and 119 UX guidelines, searchable offline — turns a direction like \"dark fintech dashboard\" into a W3C DTCG token proposal. Every proposal ships with a provenance map of where each token came from, seven WCAG contrast checks, and a record of what deliberately did not become a token. The advisory proposes; it never writes the source of truth."
              ]
            },
            {
              "title": "One source, fourteen targets",
              "body": [
                "tokens.json stays the single source of truth, and Style Dictionary transforms it into CSS, SCSS, TypeScript and Tailwind artefacts, with components generated for all fourteen framework targets from that one file. The dashboard puts the whole system on screen in ten views with zero build step — tokens, components, frameworks, advisory, demos, a live lint playground, the request board, Storybook and integrations. Dev asks, designer designs, one approval ships it to every target."
              ]
            },
            {
              "title": "Forty sites, zero findings",
              "body": [
                "The proof is a gallery of forty generated sites across twenty categories, built from the components themselves rather than styled by hand. Each page is emitted twice from the same template — the HTML you open and the JSX the linter checks — so a finding is a finding about the page, not about a separate copy. Every site carries its own palette and font pairing, zero lint findings, and its measured contrast, reported rather than quietly fixed."
              ]
            },
            {
              "title": "The linter outranks the catalogue",
              "body": [
                "@designops/lint runs six rules in ESLint and Oxlint — no restyling system components, no raw colours, no arbitrary values, no inline styles, no unknown classes, no unreadable class values. Every diagnostic explains itself and suggests a fix drawn from the team's own theme. Dashboard smoke tests and a freshness gate fail the build if the generated artefacts ever drift from the tokens, so a broken value never reaches production."
              ]
            }
          ]
        },
        "build": {
          "title": "Design decisions & artefacts",
          "sections": [
            {
              "heading": "One token source, fourteen targets",
              "body": "\n\nTrade-off: Every target is generated, so a fix has to be made in the token file or the transform — never hand-edited where it lands.",
              "image": ""
            },
            {
              "heading": "The catalogue advises, it never writes the token file",
              "body": "\n\nTrade-off: A proposal needs a human approval before it ships, so the catalogue cannot correct a token on its own.",
              "image": ""
            },
            {
              "heading": "Contrast is reported, not quietly fixed",
              "body": "\n\nTrade-off: A failing value stays visible in the results until someone acts on it, rather than being corrected in the background.",
              "image": ""
            },
            {
              "heading": "The linter outranks the catalogue",
              "body": "\n\nTrade-off: A build fails on artefact drift alone, so drift is caught in CI rather than shipped — at the cost of more red builds.",
              "image": ""
            },
            {
              "heading": "The Overview view as it loads: 41 tokens in the pipeline, 8 components, 14 targets. Captured from the live product, October 2026.",
              "body": "",
              "image": "designops-desktop.webp"
            },
            {
              "heading": "The same workspace on a phone.",
              "body": "",
              "image": "designops-mobile.webp"
            },
            {
              "heading": "\"button\" typed into global search — the component surfaces before the query is finished.",
              "body": "",
              "image": "designops-search.webp"
            },
            {
              "heading": "Clicking into Demos: forty generated sites, each card a live preview with its measured lint and contrast chips.",
              "body": "",
              "image": "designops-demos.webp"
            },
            {
              "heading": "The Lint view: six rules across ESLint and Oxlint, every diagnostic explaining its own fix.",
              "body": "",
              "image": "designops-lint.webp"
            },
            {
              "heading": "One of the forty opened full-size — built from the components, linted clean.",
              "body": "",
              "image": "designops-demo-site.webp"
            }
          ]
        },
        "impact": {
          "title": "Verifies, not just ships.",
          "body": "The pipeline starts with forty-one W3C DTCG tokens. Style Dictionary builds each target from that file, and @designops/lint checks code against the system. The dashboard brings token values, components, frameworks and requests together; a mismatch is visible in the lint results before review.\n\nThe result is a documented system that reflects the current code and token files, rather than a slide deck that can drift out of date.",
          "image": ""
        },
        "localisation": {
          "body": "",
          "image": ""
        },
        "expansion": {
          "title": "Outcomes",
          "items": []
        },
        "learned": {
          "title": "What I took forward",
          "items": [
            {
              "heading": "Tokens, components and code that stay in sync.",
              "body": "The Figma file, the working product and the full codebase are available on request — no links on this page by design. Happy to walk through the token model, the advise-to-verify loop and how it would fit an existing codebase on a call."
            }
          ]
        }
      }
    },
    {
      "kind": "project",
      "slug": "forma-design-system",
      "id": "forma-design-system",
      "title": "Forma Design System",
      "client": "Self-initiated · Lulamile Mkhungela",
      "year": "Work in progress · awaiting Figma review",
      "description": "Forma is a work-in-progress design system that connects Figma variables and typed tokens to React and Angular components, with local-first review and Storybook verification.",
      "role": "Product designer and developer",
      "team": "Self-initiated · Lulamile Mkhungela",
      "duration": "Built in South Africa",
      "location": "Built in South Africa",
      "skills": [
        "Design systems",
        "Figma plugin",
        "React",
        "Angular",
        "In progress"
      ],
      "tags": [
        "home",
        "cat-product"
      ],
      "cover": "forma-cover.svg",
      "url": "case-study.html?id=forma-design-system",
      "sourceUrl": "https://lulamilemkhungela.github.io/portfolio.github.io/portfolio/forma-design-system.html",
      "liveUrl": "https://formaplugin.netlify.app",
      "category": "Product",
      "status": "In progress",
      "sections": [
        {
          "id": "problem",
          "kicker": "The problem",
          "title": "Design decisions need to survive the move from Figma to code.",
          "paragraphs": [],
          "cards": [],
          "steps": [],
          "results": [
            {
              "title": "Design intent can fall between tools",
              "body": [
                "A named decision in Figma needs to survive token generation, framework code and component documentation. Forma makes that path explicit rather than treating the handoff as the end of the work."
              ]
            },
            {
              "title": "One system has two framework paths",
              "body": [
                "React and Angular need to use the same design decisions. Forma builds both from the shared token source."
              ]
            },
            {
              "title": "Token changes need a review trail",
              "body": [
                "A primitive can affect aliases, themes and contrast. The Review Lab is designed to trace those effects before a change is accepted."
              ]
            }
          ],
          "images": []
        },
        {
          "id": "role",
          "kicker": "My role and boundaries",
          "title": "My role",
          "paragraphs": [
            "I designed and built Forma as a personal product: the system's foundations, token workflow, Figma plugin, React and Angular libraries, documentation experience and local review concept. The work is ongoing. The supplied screens show implementation and product direction; they do not establish user adoption or business impact."
          ],
          "cards": [],
          "steps": [],
          "results": [],
          "images": []
        },
        {
          "id": "decisions",
          "kicker": "Key decisions",
          "title": "Key decisions",
          "paragraphs": [],
          "cards": [
            {
              "title": "Keep one typed token source",
              "label": "01",
              "body": [
                "The current overview lists 170 tokens. The token package can build CSS, Tokens Studio JSON and a distributable package, keeping downstream outputs tied to the same decisions."
              ],
              "items": [],
              "tradeoff": ""
            },
            {
              "title": "Build native Figma artifacts from the tokens",
              "label": "02",
              "body": [
                "The plugin creates variables, Light and Dark semantic modes, text styles and component sets, instead of asking a designer to recreate each value by hand."
              ],
              "items": [],
              "tradeoff": ""
            },
            {
              "title": "Treat React and Angular as peer outputs",
              "label": "03",
              "body": [
                "Both libraries use the same tokens and design decisions, so framework choice does not create a second visual system."
              ],
              "items": [],
              "tradeoff": ""
            },
            {
              "title": "Keep the plugin local-first",
              "label": "04",
              "body": [
                "The design file stays on the designer's machine; the plugin does not send it to a service. This keeps the workflow usable offline and avoids account sync."
              ],
              "items": [],
              "tradeoff": ""
            },
            {
              "title": "Make verification part of the handoff",
              "label": "05",
              "body": [
                "Storybook exposes variants, interactions and accessibility checks for the real framework components, while Review Lab traces token aliases and contrast."
              ],
              "items": [],
              "tradeoff": ""
            }
          ],
          "steps": [],
          "results": [],
          "images": []
        },
        {
          "id": "checks",
          "kicker": "Checks on the current build",
          "title": "Evidence and boundaries",
          "paragraphs": [
            "The supplied Review Lab screen shows 32 of 32 selected contrast pairs passing in both Light and Dark themes. This is an implementation check for the selected pairs, not a full accessibility audit or user test.",
            "The documented workflow builds token outputs, runs the React workspace and opens separate Storybooks for the framework libraries. Broader coverage and release readiness remain in progress."
          ],
          "cards": [],
          "steps": [],
          "results": [],
          "images": []
        },
        {
          "id": "tradeoffs",
          "kicker": "Current limitations",
          "title": "Current limitations",
          "paragraphs": [],
          "cards": [
            {
              "title": "Review stays local",
              "label": "01",
              "body": [
                "Review Lab snapshots stay in the browser; they are not shared team history."
              ],
              "items": [],
              "tradeoff": ""
            },
            {
              "title": "The plugin is still in review",
              "label": "02",
              "body": [
                "The Figma Community listing is awaiting approval, and the native design-library file still needs a reviewed share link."
              ],
              "items": [],
              "tradeoff": ""
            },
            {
              "title": "Keep both framework libraries aligned",
              "label": "03",
              "body": [
                "React and Angular use the same token source, but both component libraries need to stay in sync as they change."
              ],
              "items": [],
              "tradeoff": ""
            }
          ],
          "steps": [],
          "results": [],
          "images": []
        },
        {
          "id": "outcomes",
          "kicker": "Outcome and evidence",
          "title": "Outcomes",
          "paragraphs": [],
          "cards": [],
          "steps": [],
          "results": [
            {
              "title": "170 typed tokens",
              "body": [
                "The current overview screen lists the shared token set."
              ]
            },
            {
              "title": "16 core components",
              "body": [
                "The current overview screen lists 16 components."
              ]
            },
            {
              "title": "Two framework paths",
              "body": [
                "React and Angular libraries share the token source."
              ]
            },
            {
              "title": "32/32 selected contrast pairs pass",
              "body": [
                "The supplied Review Lab screen shows the selected pairs passing in both themes. No user or adoption figures have been supplied."
              ]
            },
            {
              "title": "Submitted, awaiting Figma review",
              "body": [
                "The plugin has been submitted to the Figma Community and is waiting on Figma's approval, so there is no public listing yet. The generated native design-library file still needs its own reviewed share link."
              ]
            }
          ],
          "images": []
        },
        {
          "id": "work",
          "kicker": "Selected screens",
          "title": "Selected screens",
          "paragraphs": [],
          "cards": [],
          "steps": [],
          "results": [],
          "images": [
            {
              "src": "forma-workflow.svg",
              "alt": "Forma design-to-code workflow",
              "caption": "The four-step path from Figma decisions through token generation and framework code to Storybook verification."
            },
            {
              "src": "forma-review.svg",
              "alt": "Forma Review Lab contrast checks",
              "caption": "The supplied Review Lab screen reports 32 of 32 selected contrast pairs passing in both themes; the graphic is a diagram, not a product capture."
            }
          ]
        },
        {
          "id": "conclusion",
          "kicker": "What I took forward",
          "title": "What I took forward",
          "paragraphs": [
            "What I would do next: Review and share the native Figma design-library file, expand component and interaction coverage, and validate the React and Angular outputs with more consuming examples before calling the system complete.",
            "Forma connects Figma, typed tokens, React and Angular components, and Storybook in one design-to-code workflow. It is an active work in progress, not a finished or adoption-validated product."
          ],
          "cards": [],
          "steps": [],
          "results": [],
          "images": []
        }
      ],
      "caseStudy": {
        "hero": "forma-cover.svg",
        "summary": {
          "title": "My role",
          "body": "I designed and built Forma as a personal product: the system's foundations, token workflow, Figma plugin, React and Angular libraries, documentation experience and local review concept. The work is ongoing. The supplied screens show implementation and product direction; they do not establish user adoption or business impact.",
          "disclaimer": "The supplied Review Lab screen shows 32 of 32 selected contrast pairs passing in both Light and Dark themes. This is an implementation check for the selected pairs, not a full accessibility audit or user test.\n\nThe documented workflow builds token outputs, runs the React workspace and opens separate Storybooks for the framework libraries. Broader coverage and release readiness remain in progress."
        },
        "problem": {
          "title": "Design decisions need to survive the move from Figma to code.",
          "cards": []
        },
        "blueprint": {
          "title": "",
          "image": ""
        },
        "goals": {
          "title": "",
          "businessTitle": "Business goals",
          "userTitle": "User goals",
          "business": [],
          "user": []
        },
        "users": {
          "title": "",
          "personas": []
        },
        "process": {
          "title": "Key decisions",
          "steps": [
            {
              "heading": "Keep one typed token source",
              "body": ""
            },
            {
              "heading": "Build native Figma artifacts from the tokens",
              "body": ""
            },
            {
              "heading": "Treat React and Angular as peer outputs",
              "body": ""
            },
            {
              "heading": "Keep the plugin local-first",
              "body": ""
            },
            {
              "heading": "Make verification part of the handoff",
              "body": ""
            }
          ]
        },
        "build": {
          "title": "Design decisions & artefacts",
          "sections": [
            {
              "heading": "Review stays local",
              "body": "",
              "image": ""
            },
            {
              "heading": "The plugin is still in review",
              "body": "",
              "image": ""
            },
            {
              "heading": "Keep both framework libraries aligned",
              "body": "",
              "image": ""
            },
            {
              "heading": "The four-step path from Figma decisions through token generation and framework code to Storybook verification.",
              "body": "",
              "image": "forma-workflow.svg"
            },
            {
              "heading": "The supplied Review Lab screen reports 32 of 32 selected contrast pairs passing in both themes; the graphic is a diagram, not a product capture.",
              "body": "",
              "image": "forma-review.svg"
            }
          ]
        },
        "impact": {
          "title": "Outcomes",
          "body": "",
          "image": ""
        },
        "localisation": {
          "body": "",
          "image": ""
        },
        "expansion": {
          "title": "",
          "items": []
        },
        "learned": {
          "title": "What I took forward",
          "items": [
            {
              "heading": "What I took forward",
              "body": "What I would do next: Review and share the native Figma design-library file, expand component and interaction coverage, and validate the React and Angular outputs with more consuming examples before calling the system complete.\n\nForma connects Figma, typed tokens, React and Angular components, and Storybook in one design-to-code workflow. It is an active work in progress, not a finished or adoption-validated product."
            },
            {
              "heading": "Review stays local",
              "body": ""
            },
            {
              "heading": "The plugin is still in review",
              "body": ""
            },
            {
              "heading": "Keep both framework libraries aligned",
              "body": ""
            }
          ]
        }
      }
    },
    {
      "kind": "project",
      "slug": "prodops",
      "id": "prodops",
      "title": "ProdOps",
      "client": "Self-initiated · Lulamile Mkhungela",
      "year": "Ongoing",
      "description": "My in-progress product-planning workspace: shape the product, design the experience and export a handoff a coding agent can build from.",
      "role": "Product designer and developer",
      "team": "Self-initiated · Lulamile Mkhungela",
      "duration": "Built in South Africa",
      "location": "Built in South Africa",
      "skills": [
        "Product planning",
        "Agent workflows",
        "Handoff",
        "In progress"
      ],
      "tags": [
        "home",
        "cat-product"
      ],
      "cover": "archive-portfolio.svg",
      "url": "https://lulamilemkhungela.github.io/ProdOps/",
      "sourceUrl": "https://lulamilemkhungela.github.io/portfolio.github.io/",
      "liveUrl": "https://lulamilemkhungela.github.io/ProdOps/",
      "category": "Product",
      "status": "In progress",
      "sections": [],
      "caseStudy": {
        "hero": null,
        "summary": {
          "title": "Overview",
          "body": "My in-progress product-planning workspace: shape the product, design the experience and export a handoff a coding agent can build from.",
          "disclaimer": ""
        },
        "problem": {
          "title": "The problem",
          "cards": []
        },
        "blueprint": {
          "title": "",
          "image": ""
        },
        "goals": {
          "title": "",
          "businessTitle": "Business goals",
          "userTitle": "User goals",
          "business": [],
          "user": []
        },
        "users": {
          "title": "",
          "personas": []
        },
        "process": {
          "title": "",
          "steps": []
        },
        "build": {
          "title": "",
          "sections": []
        },
        "impact": {
          "title": "",
          "body": "",
          "image": ""
        },
        "localisation": {
          "body": "",
          "image": ""
        },
        "expansion": {
          "title": "",
          "items": []
        },
        "learned": {
          "title": "",
          "items": []
        }
      }
    },
    {
      "kind": "project",
      "slug": "toyota-mobility-brand",
      "id": "toyota-mobility-brand",
      "title": "Toyota Mobility Brand",
      "client": "Toyota South Africa · via iOCO",
      "year": "2023 — 2025",
      "description": "Toyota South Africa was preparing KINTO, the Toyota App and Toyota Remote for market, but each had its own identity. I worked on the positioning and a shared identity system, then applied it across the product UI. The Lexus app was part of the wider connected-apps work.",
      "role": "Senior UI/UX Designer on the brand programme, via iOCO",
      "team": "Toyota South Africa · via iOCO",
      "duration": "South Africa",
      "location": "South Africa",
      "skills": [
        "Brand strategy",
        "Design systems",
        "Mobility",
        "Published"
      ],
      "tags": [
        "home",
        "cat-brand"
      ],
      "cover": "brand-strategy-cover.webp",
      "url": "case-study.html?id=toyota-mobility-brand",
      "sourceUrl": "https://lulamilemkhungela.github.io/portfolio.github.io/portfolio/toyota-mobility-brand.html",
      "liveUrl": "https://www.toyota.co.za/kinto-personal",
      "category": "Brand",
      "status": "Published",
      "sections": [
        {
          "id": "problem",
          "kicker": "The problem",
          "title": "Three mobility products needed one identity system.",
          "paragraphs": [],
          "cards": [],
          "steps": [],
          "results": [
            {
              "title": "Every product spoke its own language",
              "body": [
                "Three customer-facing expressions of one business, with different type, colour, tone and words for the same thing."
              ]
            },
            {
              "title": "Positioning was a product list",
              "body": [
                "Each brand explained what the service did, not who it was for or why it mattered against the alternatives."
              ]
            }
          ],
          "images": []
        },
        {
          "id": "role",
          "kicker": "My role and boundaries",
          "title": "My role",
          "paragraphs": [
            "I was the senior designer on the programme. I led the identity update, built the design system and implemented the UI changes in the Figma files and Ionic/Angular monorepos. The available records do not name every component or confirm which teams later adopted the system."
          ],
          "cards": [],
          "steps": [],
          "results": [],
          "images": []
        },
        {
          "id": "decisions",
          "kicker": "Key decisions",
          "title": "Key decisions",
          "paragraphs": [],
          "cards": [
            {
              "title": "Rebuild the identity around a shared position",
              "label": "01",
              "body": [
                "I reviewed KINTO, the Toyota App and Toyota Remote, then set the positioning and updated the logo lock-ups, colours, typography and motion rules."
              ],
              "items": [],
              "tradeoff": ""
            },
            {
              "title": "Align the rules before launch",
              "label": "02",
              "body": [
                "I worked through the identity rules with Toyota's global brand team and the product design teams before launch."
              ],
              "items": [],
              "tradeoff": ""
            },
            {
              "title": "Turn the identity into a working design system",
              "label": "03",
              "body": [
                "I built colour, type and spacing tokens, product components and guidance for using them."
              ],
              "items": [],
              "tradeoff": ""
            },
            {
              "title": "Fill gaps in the existing component set",
              "label": "04",
              "body": [
                "I compared product screens with the system, designed missing components, reviewed them with the design teams and added usage notes."
              ],
              "items": [],
              "tradeoff": ""
            },
            {
              "title": "Apply the system in design and code",
              "label": "05",
              "body": [
                "I updated Figma and the Ionic/Angular UI monorepos so the product screens and implementation used the same tokens and components."
              ],
              "items": [],
              "tradeoff": ""
            },
            {
              "title": "Write rules for teams beyond product design",
              "label": "06",
              "body": [
                "I agreed usage guidance with marketing, product and retail, then checked the work against those rules."
              ],
              "items": [],
              "tradeoff": ""
            },
            {
              "title": "Design for reuse across Toyota mobility work",
              "label": "07",
              "body": [
                "The system was designed to support KINTO, the Toyota App, Toyota Remote and AutoMark. The records I have do not confirm adoption by each team."
              ],
              "items": [],
              "tradeoff": ""
            }
          ],
          "steps": [],
          "results": [],
          "images": []
        },
        {
          "id": "checks",
          "kicker": "What is documented",
          "title": "Evidence and boundaries",
          "paragraphs": [
            "Project notes say the design teams reviewed new components before they were added. The records do not list the components, identify each updated monorepo or confirm adoption by individual teams."
          ],
          "cards": [],
          "steps": [],
          "results": [],
          "images": []
        },
        {
          "id": "outcomes",
          "kicker": "Outcome and evidence",
          "title": "Outcomes",
          "paragraphs": [],
          "cards": [],
          "steps": [],
          "results": [
            {
              "title": "The apps are publicly listed",
              "body": [
                "The Play Store listings show 500K+ downloads for MyToyota and 1K+ for Toyota Remote (Africa). Those are product-level counts, not evidence that this work caused adoption."
              ]
            },
            {
              "title": "The programme page reports a shared identity",
              "body": [
                "It says launches no longer had to rebuild the identity. I do not have a measured time-saved figure."
              ]
            }
          ],
          "images": []
        },
        {
          "id": "work",
          "kicker": "Selected screens",
          "title": "Selected screens",
          "paragraphs": [],
          "cards": [],
          "steps": [],
          "results": [],
          "images": [
            {
              "src": "toyota-app-cover.webp",
              "alt": "MyToyota listing on Google Play",
              "caption": "MyToyota on Google Play, the Toyota App's published listing."
            },
            {
              "src": "toyota-remote-cover.webp",
              "alt": "Toyota Remote listing on Google Play",
              "caption": "Toyota Remote (Africa) on Google Play, the connected-car app."
            }
          ]
        },
        {
          "id": "conclusion",
          "kicker": "What I took forward",
          "title": "What I took forward",
          "paragraphs": [
            "What I would do next: I would add the component inventory, the list of updated monorepos and a note on how the brand guide is maintained.",
            "The programme produced shared identity rules and a design system for Toyota's mobility work. I have not confirmed adoption by every team or measured launch-time savings."
          ],
          "cards": [],
          "steps": [],
          "results": [],
          "images": []
        }
      ],
      "caseStudy": {
        "hero": "brand-strategy-cover.webp",
        "summary": {
          "title": "My role",
          "body": "I was the senior designer on the programme. I led the identity update, built the design system and implemented the UI changes in the Figma files and Ionic/Angular monorepos. The available records do not name every component or confirm which teams later adopted the system.",
          "disclaimer": "Project notes say the design teams reviewed new components before they were added. The records do not list the components, identify each updated monorepo or confirm adoption by individual teams."
        },
        "problem": {
          "title": "Three mobility products needed one identity system.",
          "cards": []
        },
        "blueprint": {
          "title": "",
          "image": ""
        },
        "goals": {
          "title": "",
          "businessTitle": "Business goals",
          "userTitle": "User goals",
          "business": [],
          "user": []
        },
        "users": {
          "title": "",
          "personas": []
        },
        "process": {
          "title": "Key decisions",
          "steps": [
            {
              "heading": "Rebuild the identity around a shared position",
              "body": ""
            },
            {
              "heading": "Align the rules before launch",
              "body": ""
            },
            {
              "heading": "Turn the identity into a working design system",
              "body": ""
            },
            {
              "heading": "Fill gaps in the existing component set",
              "body": ""
            },
            {
              "heading": "Apply the system in design and code",
              "body": ""
            },
            {
              "heading": "Write rules for teams beyond product design",
              "body": ""
            },
            {
              "heading": "Design for reuse across Toyota mobility work",
              "body": ""
            }
          ]
        },
        "build": {
          "title": "Design decisions & artefacts",
          "sections": [
            {
              "heading": "MyToyota on Google Play, the Toyota App's published listing.",
              "body": "",
              "image": "toyota-app-cover.webp"
            },
            {
              "heading": "Toyota Remote (Africa) on Google Play, the connected-car app.",
              "body": "",
              "image": "toyota-remote-cover.webp"
            }
          ]
        },
        "impact": {
          "title": "Outcomes",
          "body": "",
          "image": ""
        },
        "localisation": {
          "body": "",
          "image": ""
        },
        "expansion": {
          "title": "",
          "items": []
        },
        "learned": {
          "title": "What I took forward",
          "items": [
            {
              "heading": "What I took forward",
              "body": "What I would do next: I would add the component inventory, the list of updated monorepos and a note on how the brand guide is maintained.\n\nThe programme produced shared identity rules and a design system for Toyota's mobility work. I have not confirmed adoption by every team or measured launch-time savings."
            }
          ]
        }
      }
    }
  ],
  "graphic": {},
  "amazon": {},
  "archive": [
    {
      "id": "lulamile-portfolio",
      "title": "Earlier work & portfolio",
      "client": "Lulamile Mkhungela",
      "year": "Portfolio",
      "cover": "archive-portfolio.svg",
      "url": "https://lulamilemkhungela.github.io/portfolio.github.io/"
    }
  ]
};
