# 🐺 GOT: WESTEROS RISING - Complete Game Development Specification

## 📋 Project Overview

**Project Name:** GOT: Westeros Rising (Working Title)  
**Project Type:** Interactive Web-Based Strategy/Management Game  
**Theme:** Game of Thrones / A Song of Ice and Fire  
**Development Timeline:** 6 Months (Vibe Coding & Chill Pace)  
**Team Size:** 1 Developer (You!)  
**Current Experience:** Full-Stack Web/Mobile Developer (React Native, Supabase, Node.js)  
**Primary Motivation:** Fulfill your love for GoT lore & experience game development

---

## 🎯 Project Vision Statement

*"To create an immersive, lore-accurate Game of Thrones experience where players can explore the continent of Westeros, manage their own noble house, build armies, and engage in strategic gameplay—all within a lightweight, browser-based interface that prioritizes atmosphere and storytelling over complex mechanics."*

---

## 🏰 Core Game Pillars

### 1. **Atmosphere & Immersion**
- Rich GoT aesthetic (medieval parchment, dark fantasy tones)
- Lore-accurate locations, houses, and terminology
- Emotional connection to the world of Westeros

### 2. **Strategic Depth (Light)**
- Resource management (Wood, Food, Gold/Dragonglass)
- Building construction & village development
- Army training & basic combat

### 3. **Exploration & Discovery**
- Interactive Westeros map with hover/click functionality
- Kingdom-specific content and bonuses
- Lore snippets and references throughout

### 4. **Social (Limited)**
- 5-10 friends can play together
- Basic trading and raiding
- Shared world experience

---

## 📅 6-Month Development Roadmap

### **MONTH 1: FOUNDATION & LANDING EXPERIENCE**  
*(Weeks 1-4)*

#### Week 1-2: Project Setup & Landing Page
**Objective:** Create an atmospheric entry point that immediately establishes the GoT theme

**Detailed Tasks:**
- [ ] Set up project structure (HTML/CSS/JS with Node.js backend)
- [ ] Create dark medieval-themed landing page
- [ ] Design and implement parallax cloud animation system:
  - Generate 3-5 cloud PNGs using Gemini
  - Layer clouds at different depths (3 layers minimum)
  - Animate at different speeds (parallax effect)
- [ ] Add particle effects (floating embers/sparks - 20-30 dots)
- [ ] Implement "Begin Your Conquest" button with smooth transitions
- [ ] Add atmospheric background music (optional - use free medieval music)
- [ ] Create loading screen with GoT-style title animation

**Assets Needed:**
- [ ] Cloud PNGs (transparent, soft edges) - Generate with Gemini
- [ ] Parchment background texture
- [ ] Gold/iron UI elements
- [ ] House sigils (placeholder)

**Technical Implementation:**
- Cloud animations using CSS `@keyframes` or `requestAnimationFrame`
- Particle system with canvas or pure CSS
- Smooth fade transitions between states

---

#### Week 3-4: Interactive Westeros Map
**Objective:** Build the central navigation hub—an interactive map of Westeros

**Detailed Tasks:**
- [ ] Generate high-quality Westeros map using Gemini:
  - Prompt: *"Detailed fantasy map of Westeros, Game of Thrones style, parchment background, labeled regions, top-down view, clean line art, subtle colors, 1920x1080"*
- [ ] Create 9 interactive hotspots (kingdoms):
  1. Winterfell (Stark) - North
  2. King's Landing (Baratheon/Targaryen) - South
  3. Casterly Rock (Lannister) - West
  4. Highgarden (Tyrell) - Southwest
  5. Sunspear (Martell) - Far South
  6. The Wall (Night's Watch) - Very North
  7. Riverrun (Tully) - Central
  8. Pyke (Greyjoy) - Islands West
  9. Dragonstone (Targaryen) - East
- [ ] Implement hotspot hover effects:
  - Cursor changes to pointer
  - Glowing outline appears
  - Tooltip displays region name, house, and fun fact
- [ ] Implement click effects:
  - Smooth zoom transition into kingdom
  - Background music/atmosphere shift
- [ ] Create location data structure (JavaScript object)
- [ ] Add subtle animations (floating sigils, moving clouds over map)

**Data Structure:**
```javascript
const LOCATIONS = {
  winterfell: {
    id: 'winterfell',
    name: 'Winterfell',
    house: 'Stark',
    sigil: 'assets/sigils/stark.png',
    coordinates: { x: 350, y: 200 },
    description: 'The ancient seat of House Stark, where winter is always coming.',
    color: '#808080', // Grey
    bonuses: { food: 0.2 }, // +20% food production
    quotes: [
      'Winter is coming.',
      'The North remembers.'
    ]
  },
  // ... 8 more locations
}
```

---

### **MONTH 2: KINGDOM MANAGEMENT CORE**  
*(Weeks 5-8)*

#### Week 5-6: Village Grid System
**Objective:** Build the Clash of Clans-style village view

**Detailed Tasks:**
- [ ] Design 8x8 or 10x10 grid layout (each cell = 60px)
- [ ] Create grass/terrain background tiles
- [ ] Implement grid click system:
  - Click empty cell → open building menu
  - Click existing building → show building info
- [ ] Building placement validation (can't place on occupied cells)
- [ ] Building removal/upgrade system
- [ ] Pre-place starting buildings:
  - Keep/Castle (center of grid, pre-built)
  - 2 Houses (starter)
  - 1 Farm (starter)

**Building Assets (Generate with Gemini):**
- [ ] Castle/Keep (main building)
- [ ] House (small hut) 
- [ ] Farm (crop fields)
- [ ] Hunting Lodge (cabin in clearing)
- [ ] Barracks (training grounds)
- [ ] Wall sections (stone walls)
- [ ] Gold/Dragonglass Mine
- [ ] Lumber Mill

**Building Data:**
```javascript
const BUILDINGS = {
  house: {
    name: 'House',
    icon: 'assets/buildings/house.png',
    size: { width: 1, height: 1 },
    cost: { wood: 30, food: 10 },
    production: { population: 2 },
    description: 'Shelters your people. Increases population capacity.'
  },
  farm: {
    name: 'Farm',
    icon: 'assets/buildings/farm.png',
    size: { width: 2, height: 2 },
    cost: { wood: 20, food: 5 },
    production: { food: 5 }, // per tick
    description: 'Grows crops. Produces food every 10 seconds.'
  },
  // ... 5 more building types
}
```

---

#### Week 7-8: Resource System & Backend
**Objective:** Implement the economy and server-side data persistence

**Detailed Tasks:**
- [ ] Set up Node.js + Express server
- [ ] Create JSON file database structure:
```javascript
{
  "kingdoms": {
    "winterfell": {
      "playerName": "NedStarkFan23",
      "house": "Stark",
      "resources": {
        "wood": 100,
        "food": 80,
        "gold": 50,
        "dragonglass": 0 // GoT-themed premium resource
      },
      "buildings": [
        { "type": "castle", "x": 4, "y": 4, "level": 1 },
        { "type": "house", "x": 2, "y": 3, "level": 1 },
        { "type": "farm", "x": 6, "y": 2, "level": 1 }
      ],
      "population": 10,
      "populationCap": 15,
      "soldiers": 5,
      "defense": 10,
      "lastActive": "2026-01-17T10:00:00Z"
    }
  }
}
```
- [ ] Implement API endpoints:
  - `GET /api/kingdom/:name` - Get kingdom data
  - `POST /api/build` - Place building
  - `POST /api/hunt` - Hunting action (instant food)
  - `POST /api/train` - Train soldiers
  - `POST /api/upgrade` - Upgrade building
- [ ] Create auto-generation loop (runs every 5-10 seconds)
- [ ] Implement resource caps (prevent hoarding)
- [ ] Add production calculations:
  - Farms produce food
  - Mines produce gold
  - Lumber Mills produce wood
  - Population consumes food (slight drain)

**Resource Production Formula:**
```
Food Per Tick = (Number of Farms × 2) + (Hunting Lodge × 1) - (Population × 0.1)
Gold Per Tick = (Number of Gold Mines × 1)
Wood Per Tick = (Number of Lumber Mills × 1)
```

---

### **MONTH 3: ARMY & COMBAT**  
*(Weeks 9-12)*

#### Week 9-10: Army Training System
**Objective:** Allow players to build and manage their armies

**Detailed Tasks:**
- [ ] Create Barracks building with training functionality
- [ ] Implement 3 unit types:
  - **Infantry** (Cheap, numerous)
    - Cost: 10 Food, 5 Gold
    - Training Time: Instant
    - Attack Power: 1
  - **Cavalry** (Expensive, powerful)
    - Cost: 30 Food, 20 Gold
    - Training Time: Instant
    - Attack Power: 3
  - **Archers** (Medium cost, defense bonus)
    - Cost: 20 Food, 15 Gold
    - Training Time: Instant
    - Attack Power: 2
- [ ] Display army size visually (icons + numbers)
- [ ] Implement army maintenance:
  - Each soldier consumes 0.5 food per tick
  - If food runs out, soldiers desert (-1 per tick)
- [ ] Create army management UI:
  - Show army composition
  - View total attack power
  - View total defense

**Army Data Structure:**
```javascript
{
  "army": {
    "infantry": 5,
    "cavalry": 2,
    "archers": 3,
    "totalAttack": 5 + (2 * 3) + (3 * 2), // = 17
    "totalDefense": 5 + (2 * 2) + (3 * 3) // = 18
  }
}
```

---

#### Week 11-12: Raiding & PvP Combat
**Objective:** Implement basic player vs player interactions

**Detailed Tasks:**
- [ ] Create "Raid" system:
  - Player selects target kingdom from list of friends
  - Shows target's army size and defense
  - Confirmation dialog before attack
- [ ] Combat calculation:
  ```
  Attacker Power = (Infantry × 1) + (Cavalry × 3) + (Archers × 2)
  Defender Power = (Infantry × 1) + (Cavalry × 2) + (Archers × 3) + (Walls × 5) + (Castle Level × 10)
  
  If Attacker Power > Defender Power:
    - Victory!
    - Steal 20-40% of target's resources
    - Lose 10-20% of your attacking army
  Else:
    - Defeat!
    - Lose 20-30% of your army
    - Target gains 10% of your resources (defense bonus)
  ```
- [ ] Implement raid cooldown (can't attack same player within 1 hour)
- [ ] Create battle log/history
- [ ] Add visual feedback:
  - Battle animation (simple)
  - Victory/Defeat messages with GoT theme
  - Resource theft visualization

---

### **MONTH 4: LORE & THEMATIC CONTENT**  
*(Weeks 13-16)*

#### Week 13-14: House-Specific Content
**Objective:** Make each house feel unique and authentic

**Detailed Tasks:**
- [ ] Create house-specific bonuses:
  - **Stark**: +20% Food production, +10% Defense
  - **Lannister**: +20% Gold production, -10% Build cost
  - **Targaryen**: +20% Army attack power, +10% Raid rewards
  - **Baratheon**: +15% Defense, +15% Army size
  - **Greyjoy**: +20% Raid rewards, +10% Raid speed
  - **Tyrell**: +15% Food production, +15% Gold production
  - **Martell**: +10% all production, resistance to raids
  - **Tully**: +10% Defense, +10% Population growth
  - **Night's Watch**: -50% Raid rewards, +50% Defense
- [ ] Add house-specific unit names:
  - Stark: "Northern Swordsmen" instead of "Infantry"
  - Lannister: "Lion Guard" instead of "Cavalry"
  - Targaryen: "Dragonspawn" instead of "Archers"
- [ ] Implement house sigil display (player profile, buildings)
- [ ] Create house-specific color schemes for UI

---

#### Week 15-16: Maester Advisor & Lore Integration
**Objective:** Deepen immersion with GoT knowledge and atmosphere

**Detailed Tasks:**
- [ ] Create Maester Advisor system:
  - Random tips that appear periodically
  - GoT quotes and wisdom
  - Historical context for actions
- [ ] Implement lore pop-ups:
  - When building specific structures
  - When reaching certain milestones
  - Seasonal events (Winter, Spring, Summer, Fall)
- [ ] Add seasonal system:
  - Rotates every 30 minutes (or 10 minutes for testing)
  - **Winter**: Food production -50%, Defense +20%
  - **Spring**: All production +10%
  - **Summer**: Best production (+20% all resources)
  - **Fall**: Wood production +20%, Food -10%
- [ ] Create atmospheric effects:
  - Snow particles in Winter
  - Golden glow in Summer
  - Leaf particles in Fall

**Lore Snippets Database:**
```javascript
const LORE_SNIPPETS = [
  {
    building: 'castle',
    text: '"A king who sits on the Iron Throne does not rule. The king who rules is the one who holds the sword." — Tywin Lannister',
    context: 'Build your keep strong, for winter is coming.'
  },
  {
    season: 'winter',
    text: '"Winter is coming. You know the words. You\'ve known them all your life." — Old Nan',
    effect: 'Food stores must last through the harsh months ahead.'
  },
  // ... 20+ more snippets
]
```

---

### **MONTH 5: POLISH & USER EXPERIENCE**  
*(Weeks 17-20)*

#### Week 17-18: UI/UX Refinement
**Objective:** Make the game look and feel polished

**Detailed Tasks:**
- [ ] Create unified medieval UI theme:
  - Dark backgrounds (#1a1410)
  - Gold accents (#d4a74a)
  - Parchment text (#f0e6d2)
  - Iron/steel for UI borders
- [ ] Implement smooth transitions between screens
- [ ] Add hover animations to all interactive elements
- [ ] Create loading states and skeletons
- [ ] Add sound effects (use free medieval SFX):
  - Building construction
  - Resource collection
  - Battle sounds
  - UI clicks
- [ ] Implement responsive design:
  - Desktop: Full experience
  - Tablet: Adapted layout
  - Mobile: Simplified view (read-only for now)
- [ ] Add keyboard shortcuts for power users

---

#### Week 19-20: Tutorial & Onboarding
**Objective:** Help new players understand the game

**Detailed Tasks:**
- [ ] Create interactive tutorial:
  - Step-by-step guide for first 5 minutes
  - Highlighted UI elements
  - Forced actions (build first house, hunt, train soldier)
- [ ] Add tooltips to all UI elements
- [ ] Create help/info panels
- [ ] Write game manual/documents
- [ ] Add achievement system:
  - "The Builder" - Build 10 buildings
  - "The Lord" - Reach 50 population
  - "The Conqueror" - Win 5 raids
  - "The Wealthy" - Accumulate 1000 gold
  - "Winter is Coming" - Survive 3 winters
  - "The Dragon" - Train 100 soldiers

---

### **MONTH 6: TESTING & DEPLOYMENT**  
*(Weeks 21-24)*

#### Week 21-22: Comprehensive Testing
**Objective:** Ensure everything works properly

**Detailed Tasks:**
- [ ] Full feature testing (all buttons, all screens)
- [ ] Resource calculation verification
- [ ] Combat testing (win/lose scenarios)
- [ ] Multiplayer testing with 2-3 friends
- [ ] Performance testing (load times, memory usage)
- [ ] Cross-browser testing (Chrome, Firefox, Safari)
- [ ] Mobile responsiveness testing
- [ ] Bug tracking and fixing
- [ ] Balance testing (resource rates, combat fairness)

**Bug Tracking System:**
- [ ] Create simple bug tracker (Google Sheets or GitHub Issues)
- [ ] Priority system: Critical, High, Medium, Low
- [ ] Regular bug triage sessions

---

#### Week 23-24: Deployment & Launch
**Objective:** Get the game live and playable

**Detailed Tasks:**
- [ ] Deploy to Render.com (free tier):
  - Connect GitHub repository
  - Set build command: `npm install`
  - Set start command: `node server.js`
  - Environment variables (passphrase, etc.)
- [ ] Configure custom domain (optional)
- [ ] Set up SSL certificate (Render provides free)
- [ ] Create landing page explaining game
- [ ] Write launch announcement for friends
- [ ] Set up passphrase system:
  - Generate unique passphrase: "WinterIsComing2026"
  - Hardcode into server or use environment variable
  - Share only with 5-10 friends
- [ ] Final launch celebration! 🎉

---

## 🛠️ Detailed Technical Specifications

### **Tech Stack (Revised for This Project)**

| Layer | Technology | Version | Why This Choice |
|-------|------------|---------|-----------------|
| **Frontend** | HTML5 + CSS3 | - | Lightweight, no framework overhead |
| | Vanilla JavaScript | ES6+ | You already know it, runs everywhere |
| **Backend** | Node.js | 18.x+ | Same language as frontend, lightweight |
| | Express | 4.18.x | Minimal, fast, easy to deploy |
| **Database** | JSON File (fs module) | - | No external DB setup, fits this scale |
| **Hosting** | Render.com | Free Tier | 0.5GB RAM, free SSL, auto-deploy |
| **Graphics** | Gemini AI | Free Tier | Generate custom assets instantly |
| | TinyPNG | Free | Compress images for faster loading |
| | Remove.bg | Free | Clean backgrounds from images |
| **Version Control** | GitHub | Free | Code backup, version history |
| **Code Editor** | Replit (or VS Code) | Free | Works in browser (broken laptop friendly!) |
| **Animations** | CSS Transitions + requestAnimationFrame | - | GPU-accelerated, smooth performance |
| **Fonts** | Google Fonts: Cinzel, Lora | Free | Medieval aesthetic without downloads |

---

### **Why NOT C/C++ or Heavy Frameworks?**

| Reason | Explanation |
|--------|-------------|
| **Browser-based** | Your game runs in a browser. C++ doesn't run in browsers (without WebAssembly, which is overkill). |
| **Deployment Simplicity** | JavaScript: drag files to server, done. C++: compile for each OS, handle memory, crashes, etc. |
| **Learning Curve** | You already know JavaScript from your social media app. C++ would require months of learning. |
| **Development Speed** | JavaScript: change code, refresh browser. C++: change code, compile (5-30 seconds), run. |
| **Resource Usage** | Your game is light. C++ is over-engineering. |
| **Libraries** | JavaScript has everything you need built-in or via simple npm packages. |

---

### **Server Requirements (Render.com Free Tier)**

- **RAM:** 512 MB (You'll use ~60 MB)
- **CPU:** 1 Core (More than enough)
- **Storage:** 10 GB (You'll use < 100 MB)
- **Concurrency:** Can handle 50+ simultaneous players
- **Uptime:** ~600 hours/month free (sleeps when inactive, perfect for small game)

---

### **Database Structure (data.json)**

```json
{
  "kingdoms": {
    "winterfell": {
      "playerName": "NedStarkFan23",
      "house": "Stark",
      "sigil": "assets/sigils/stark.png",
      "resources": {
        "wood": 150,
        "food": 120,
        "gold": 80,
        "dragonglass": 5
      },
      "buildings": [
        { "id": "castle_1", "type": "castle", "x": 4, "y": 4, "level": 1 },
        { "id": "house_1", "type": "house", "x": 2, "y": 3, "level": 1 },
        { "id": "house_2", "type": "house", "x": 3, "y": 3, "level": 1 },
        { "id": "farm_1", "type": "farm", "x": 6, "y": 2, "level": 1 },
        { "id": "farm_2", "type": "farm", "x": 7, "y": 2, "level": 1 },
        { "id": "barracks_1", "type": "barracks", "x": 1, "y": 6, "level": 1 },
        { "id": "mine_1", "type": "mine", "x": 6, "y": 6, "level": 1 }
      ],
      "army": {
        "infantry": 5,
        "cavalry": 2,
        "archers": 3
      },
      "population": 15,
      "populationCap": 25,
      "defense": 12,
      "lastActive": "2026-01-17T10:00:00Z",
      "achievements": ["builder", "lord"],
      "season": "summer",
      "battleLog": [
        { "date": "2026-01-16T14:30:00Z", "type": "raid", "target": "casterlyRock", "result": "victory", "loot": 45 }
      ],
      "maesterQuotes": []
    }
  },
  "server": {
    "startTime": "2026-01-01T00:00:00Z",
    "totalRaids": 127,
    "totalBuildingsBuilt": 342,
    "totalResourcesCollected": 12450
  }
}
```

---

## 📁 Complete File Structure

```
got-westeros-rising/
├── server.js                    # Main backend (Node.js + Express)
├── package.json                 # Dependencies (express only)
├── data.json                    # All game data (database)
├── .env                         # Environment variables (passphrase)
├── .gitignore                   # Security exclusions
├── README.md                    # Project documentation
├── CHANGELOG.md                 # Development log
├── TO_DO_TASKS.md              # Task tracking
│
├── public/                      # All frontend files (served to players)
│   ├── index.html              # Landing page (clouds intro)
│   ├── map.html                # Westeros interactive map
│   ├── kingdom.html            # Village management view
│   ├── profile.html            # Player profile & stats
│   ├── style.css               # Global styles (medieval theme)
│   ├── main.js                 # Landing page logic
│   ├── map.js                  # Map interactions
│   ├── game.js                 # Kingdom game logic
│   ├── profile.js              # Profile management
│   │
│   ├── assets/
│   │   ├── buildings/
│   │   │   ├── castle.png
│   │   │   ├── house.png
│   │   │   ├── farm.png
│   │   │   ├── hunting-lodge.png
│   │   │   ├── barracks.png
│   │   │   ├── wall.png
│   │   │   ├── gold-mine.png
│   │   │   └── lumber-mill.png
│   │   │
│   │   ├── icons/
│   │   │   ├── wood.png
│   │   │   ├── food.png
│   │   │   ├── gold.png
│   │   │   ├── dragonglass.png
│   │   │   ├── soldier.png
│   │   │   ├── infantry.png
│   │   │   ├── cavalry.png
│   │   │   └── archer.png
│   │   │
│   │   ├── sigils/
│   │   │   ├── stark.png
│   │   │   ├── lannister.png
│   │   │   ├── targaryen.png
│   │   │   ├── baratheon.png
│   │   │   ├── greyjoy.png
│   │   │   ├── tyrell.png
│   │   │   ├── martell.png
│   │   │   ├── tully.png
│   │   │   └── nightswatch.png
│   │   │
│   │   ├── map/
│   │   │   ├── westeros-map.png      # Main map
│   │   │   └── regions/              # Region overlays (if needed)
│   │   │
│   │   ├── clouds/
│   │   │   ├── cloud1.png
│   │   │   ├── cloud2.png
│   │   │   └── cloud3.png
│   │   │
│   │   ├── ui/
│   │   │   ├── parchment-bg.png
│   │   │   ├── gold-border.png
│   │   │   ├── iron-border.png
│   │   │   ├── raven-icon.png
│   │   │   └── maester-icon.png
│   │   │
│   │   └── effects/
│   │       ├── fire.png
│   │       ├── sparkle.png
│   │       ├── snow.png
│   │       └── gold-sparkle.png
│   │
│   ├── sounds/                     # Optional (free medieval SFX)
│   │   ├── build.mp3
│   │   ├── collect.mp3
│   │   ├── battle.mp3
│   │   ├── click.mp3
│   │   └── winter-wind.mp3
│   │
│   └── fonts/
│       ├── Cinzel.ttf
│       └── Lora.ttf
│
└── docs/                          # Documentation
    ├── game-design.md
    ├── building-stats.md
    ├── resource-calculations.md
    ├── combat-formulas.md
    ├── lore-database.md
    ├── house-bonuses.md
    └── map-coordinates.md
```

---

## 🎨 Gemini Image Generation Prompts (Ready to Copy)

### Buildings
```
1. "Isometric pixel art medieval house with wooden walls and red roof, warm earthy colors, 2D game asset, 200x200px, transparent background, top-down view"
2. "Isometric pixel art wheat farm with golden crops, brown soil, medieval game tile, 200x200px, transparent background"
3. "Isometric pixel art stone castle with gray walls, blue banners, medieval fantasy game asset, 200x200px, transparent background"
4. "Isometric pixel art wooden hunting lodge in forest clearing, game asset, 200x200px, transparent background"
5. "Isometric pixel art medieval barracks with training grounds, game asset, 200x200px, transparent background"
6. "Isometric pixel art gold mine entrance, rocky terrain, game tile, 200x200px, transparent background"
7. "Isometric pixel art lumber mill with wooden logs, game asset, 200x200px, transparent background"
8. "Isometric pixel art stone wall section, medieval fortress wall, game tile, 200x200px, transparent background"
```

### Resource Icons
```
1. "Pile of wooden logs, game resource icon, simple flat style, brown, transparent background, 100x100px"
2. "Plate of medieval food, meat and bread, game icon, simple flat art, 100x100px"
3. "Pile of gold coins, game icon, shiny yellow, simple flat style, 100x100px"
4. "Glowing black obsidian shards, fantasy dragonglass icon, 100x100px"
5. "Medieval soldier silhouette, game unit icon, simple flat style, 100x100px"
```

### Map Elements
```
1. "Detailed fantasy map of Westeros, Game of Thrones style, parchment background, labeled regions, top-down view, clean line art, subtle colors, 1920x1080"
2. "Interactive map region marker, glowing gold border, Game of Thrones style, 50x50px"
3. "Medieval compass rose, game UI element, gold and iron, 100x100px, transparent background"
```

### UI Elements
```
1. "Medieval parchment background texture, old paper, subtle creases, warm beige, 800x600px"
2. "Gold ornate border, medieval frame, fantasy UI element, transparent background, 100x100px"
3. "Iron and steel UI button, medieval fantasy, simple 2D game asset, 200x80px"
4. "Medieval scroll icon, game UI element, gold seal, transparent background, 64x64px"
```

### Atmospheric Assets
```
1. "Translucent white clouds, PNG with transparent background, soft edges, dreamy fantasy style, 500x300px"
2. "Floating fire embers, magical sparkles, fantasy effect, transparent background, 100x100px"
3. "Snow particles, white dots, winter effect, transparent background, 50x50px"
4. "Golden sparkle particle, magical effect, transparent background, 50x50px"
```

### Character/Sigils
```
1. "Grey direwolf on white field, Game of Thrones Stark house sigil, simple heraldic design, 200x200px"
2. "Golden lion on red field, Game of Thrones Lannister house sigil, simple heraldic design, 200x200px"
3. "Red three-headed dragon on black field, Game of Thrones Targaryen sigil, simple heraldic, 200x200px"
4. "Black stag on golden field, Game of Thrones Baratheon sigil, simple heraldic design, 200x200px"
5. "Medieval peasant character, simple game sprite, front view, cute pixel art style, wearing tunic, 64x64px"
```

---

## 📋 Detailed Feature Specifications

### Landing Page Features
| Feature | Description | Priority |
|---------|-------------|----------|
| Cloud Animation | 3-layer parallax clouds drifting across screen | Must-Have |
| Particle System | Floating embers/sparks (20-30 particles) | Must-Have |
| Theme Music | Atmospheric medieval music (optional) | Nice-to-Have |
| Title Animation | GoT-style title with gold shimmer | Must-Have |
| Begin Button | Transitions to map with fade effect | Must-Have |
| House Selection | Pre-select your house before entering | Could Add |
| Sound Toggle | Mute/unmute button | Nice-to-Have |

### Map Features
| Feature | Description | Priority |
|---------|-------------|----------|
| 9 Interactive Hotspots | Clickable regions with hover effects | Must-Have |
| Tooltips | Show region info on hover | Must-Have |
| Zoom Transition | Smooth zoom into selected kingdom | Must-Have |
| Floating Sigils | Animated house sigils over regions | Nice-to-Have |
| Region Facts | Display lore on click | Must-Have |
| Map Filter | Show only explored regions | Could Add |
| Travel Animation | Ravens flying between regions | Nice-to-Have |

### Kingdom Management Features
| Feature | Description | Priority |
|---------|-------------|----------|
| Grid System | 8x8 building placement grid | Must-Have |
| Building Placement | Click empty cell → select building | Must-Have |
| Resource Display | Real-time resource counters | Must-Have |
| Auto-Generation | Resources produce every 5-10s | Must-Have |
| Building Info | Click building → view details | Must-Have |
| Upgrade System | Upgrade buildings for better production | Must-Have |
| Construction Animations | Building phases in/fades in | Nice-to-Have |
| Resource Animations | Particles float up from production buildings | Nice-to-Have |

### Army Features
| Feature | Description | Priority |
|---------|-------------|----------|
| Unit Training | Train infantry, cavalry, archers | Must-Have |
| Army Display | Visual army composition | Must-Have |
| Maintenance | Soldiers consume food | Must-Have |
| Raid System | Attack other players | Must-Have |
| Combat Calculation | Math-based battle outcomes | Must-Have |
| Battle Log | History of all raids | Must-Have |
| Raid Cooldown | 1-hour wait between attacks | Must-Have |
| Defense Bonus | Walls and castle add defense | Must-Have |

### Lore Features
| Feature | Description | Priority |
|---------|-------------|----------|
| House Bonuses | Unique bonuses per house | Must-Have |
| Maester Advisor | Random lore tips and quotes | Must-Have |
| Seasons | Winter/Spring/Summer/Fall cycle | Must-Have |
| Seasonal Effects | Resource production changes | Must-Have |
| Lore Pop-ups | Show lore on specific actions | Must-Have |
| Achievements | 10+ achievements to unlock | Nice-to-Have |
| Quote Database | 50+ GoT quotes | Nice-to-Have |

### Social Features
| Feature | Description | Priority |
|---------|-------------|----------|
| Limited Access | Passphrase system (5-10 friends) | Must-Have |
| Player List | See all active players | Must-Have |
| Raiding | Attack other players | Must-Have |
| Trading | Trade resources between players | Nice-to-Have |
| Leaderboard | Compare resources/armies | Nice-to-Have |
| Chat System | Simple in-game chat | Could Add |

---

## 🎯 Development Milestones & Checkpoints

### Month 1 Checkpoints
- [ ] Landing page functional with clouds
- [ ] Map with 9 interactive regions
- [ ] Basic data structures defined

### Month 2 Checkpoints
- [ ] 10x10 grid system working
- [ ] 5+ building types implemented
- [ ] Resource system functional
- [ ] Server + database working

### Month 3 Checkpoints
- [ ] 3 unit types trainable
- [ ] Army maintenance working
- [ ] Raid system functional
- [ ] Combat math verified

### Month 4 Checkpoints
- [ ] All house bonuses implemented
- [ ] Maester advisor active
- [ ] Seasons cycling
- [ ] 20+ lore snippets added

### Month 5 Checkpoints
- [ ] UI theme unified
- [ ] All transitions smooth
- [ ] Sound effects added
- [ ] Responsive design working

### Month 6 Checkpoints
- [ ] All features tested
- [ ] Critical bugs fixed
- [ ] Game deployed to Render
- [ ] 5 friends playing!

---

## 💡 Key Learning Objectives (Game Dev Experience)

By building this game, you'll learn:

1. **Game Loop Design** - Understanding the update/render cycle
2. **State Management** - Keeping game state in sync across clients
3. **Asset Pipeline** - Generating, optimizing, and using game assets
4. **UI/UX for Games** - Making interfaces feel responsive and fun
5. **Game Balance** - Tuning resource rates and combat formulas
6. **Player Psychology** - What makes actions feel rewarding
7. **Lore Integration** - Weaving story into gameplay mechanics
8. **Scope Management** - Building a complete game within constraints
9. **Deployment** - Getting a game online and playable
10. **Community** - Sharing with friends and getting feedback

---

## 🚀 Getting Started (Your First Week)

### Day 1-2: Setup
1. Create GitHub repository
2. Set up Replit (or use library computer)
3. Generate cloud PNGs with Gemini
4. Create `index.html` with "Welcome to Westeros"

### Day 3-4: Basic Animation
1. Add cloud images
2. Implement CSS animation for clouds
3. Add particle system (embers)

### Day 5-6: Begin Button
1. Add "Begin Your Conquest" button
2. Implement fade transition
3. Simple dark/light toggle for testing

### Day 7: Map Generation
1. Generate Westeros map with Gemini
2. Place map in HTML
3. Add first hotspot (Winterfell)

---

## 📚 Resources for Learning

### Free Tools
- **Replit** - Code in your browser (free)
- **GitHub** - Version control (free)
- **Gemini** - AI image generation (free tier)
- **Render** - Hosting (free tier)
- **TinyPNG** - Image compression (free)
- **Remove.bg** - Background removal (free)
- **Google Fonts** - Cinzel, Lora (free)

### Free Assets
- **Freesound.org** - Free sound effects
- **Unsplash** - Free textures
- **FontAwesome** - Free icons

### Learning Resources
- **MDN Web Docs** - HTML/CSS/JS reference
- **CSS-Tricks** - Animation tutorials
- **Node.js Docs** - Backend reference
- **Game Design Concepts** - YouTube tutorials

---

## 💭 Final Thoughts

You've already built a complex social media app with 45+ screens. This game is **simpler** but will teach you completely new skills.

**Your advantage:**
- You know JavaScript
- You know Supabase/backend
- You know UI/UX
- You have Gemini for art
- You have 6 months (chill pace)

**Your challenge:**
- Thinking in game loops
- Managing state differently
- Creating engaging feedback loops
- Balancing gameplay

**Your motivation:**
- You love GoT
- You want to experience game dev
- You're already a developer (you just need to shift context)

---

**Start with the clouds. Make them drift. See them clear. And when they do, you'll see Westeros waiting for you.**

*"The North remembers."* 🐺

---

*Specification Version 2.0*  
*Created: January 17, 2026*  
*Developer: GoT Fan & Full-Stack Developer*  
*Timeline: 6 Months (Chill Vibe Coding)*