# 📁 Complete Project Structure - GOT: Westeros Rising

```
📁 GOT_GAME/
│
├── 📁 node_modules/                        # Node.js dependencies (auto-generated)
│
├── 📁 data/                                # NEW - Game data (JSON files)
│   ├── houses.json                         # House data backup
│   ├── locations.json                      # Location data backup
│   └── lore.json                           # Lore snippets backup
│
├── 📁 public/                              # Public static assets
│   │
│   ├── 📁 assets/                          # Game assets directory
│   │   └── 📁 images/                      # All image assets
│   │       ├── cloud1.png                  # Cloud texture 1
│   │       ├── cloud2.png                  # Cloud texture 2
│   │       ├── cloud3.png                  # Cloud texture 3
│   │       │
│   │       ├── 📁 sigils/                  # House sigils / game symbols
│   │       │
│   │       └── 📁 ui/                      # UI elements
│   │           ├── background.png          # Main background
│   │           ├── backgroundv2.png        # Background version 2
│   │           ├── backgroundv3.jpg        # MODIFIED - Background version 3
│   │           ├── backgroundv3.png        # NEW - Background version 3 (PNG)
│   │           └── map1.png                # NEW - Westeros map
│   │
│   ├── 📁 css/                             # NEW - Stylesheets
│   │   ├── style.css                       # Core theme (colors, variables, reset)
│   │   ├── landing.css                     # Landing page specific styles
│   │   ├── map.css                         # Map page specific styles
│   │   └── transitions.css                 # Transition animations
│   │
│   ├── 📁 js/                              # NEW - JavaScript files
│   │   ├── main.js                         # Landing page logic
│   │   ├── map.js                          # Map page logic
│   │   ├── clouds.js                       # Cloud system
│   │   ├── transitions.js                  # Transition system
│   │   ├── utils.js                        # Utility functions
│   │   │
│   │   └── 📁 data/                        # JavaScript data files
│   │       ├── houses.js                   # House data
│   │       ├── locations.js                # Map coordinates
│   │       └── lore.js                     # Lore snippets
│   │
│   ├── 📄 index.html                       # MODIFIED - Main game entry point
│   ├── 📄 main.js                          # MODIFIED - Core game logic
│   ├── 📄 map.html                         # MODIFIED - Map viewer page
│   ├── 📄 style.css                        # Global styles
│   └── 📄 test-images.html                 # MODIFIED - Image testing page
│
├── 📁 music/                               # Audio music files
│
├── 📁 sounds/                              # Sound effects
│
├── 📄 package-lock.json                    # Locked dependencies
├── 📄 package.json                         # Project dependencies
├── 📄 scripture_plan.md                    # Game documentation/plan
├── 📄 server.js                            # Local development server
└── 📄 .gitignore                           # Git ignore file
```

---

## 📊 File Summary

| Type | Count | Files |
|------|-------|-------|
| **HTML Files** | 3 | index.html, map.html, test-images.html |
| **CSS Files** | 4 | style.css, landing.css, map.css, transitions.css |
| **JavaScript Files** | 7 | main.js, map.js, clouds.js, transitions.js, utils.js, houses.js, locations.js, lore.js |
| **Data Files** | 3 | houses.json, locations.json, lore.json |
| **Image Files** | 5 | cloud1.png, cloud2.png, cloud3.png, backgroundv3.png, map1.png |
| **Image Directories** | 2 | sigils/, ui/ |
| **Audio Directories** | 2 | music/, sounds/ |
| **Config Files** | 2 | package.json, package-lock.json |
| **Documentation** | 1 | scripture_plan.md |

---

## 📝 File Status (from git status)

### Modified Files
| File | Description |
|------|-------------|
| `public/assets/images/ui/backgroundv3.jpg` | Updated background image |
| `public/index.html` | Updated with new CSS/JS paths |
| `public/main.js` | Updated landing page logic |
| `public/map.html` | Updated with glassmorphism, return button |
| `public/test-images.html` | Updated test page |

### New Files (Untracked)
| File | Description |
|------|-------------|
| `data/` | New data folder |
| `data/houses.json` | House data backup |
| `data/locations.json` | Location data backup |
| `data/lore.json` | Lore snippets backup |
| `public/assets/images/ui/backgroundv3.png` | Background PNG version |
| `public/assets/images/ui/map1.png` | Westeros map image |
| `public/css/` | New CSS folder |
| `public/css/style.css` | Core theme |
| `public/css/landing.css` | Landing styles |
| `public/css/map.css` | Map styles (glassmorphism, zoom) |
| `public/css/transitions.css` | Transition styles |
| `public/js/` | New JS folder |
| `public/js/main.js` | Landing logic |
| `public/js/map.js` | Map logic |
| `public/js/clouds.js` | Cloud system |
| `public/js/transitions.js` | Transition system |
| `public/js/utils.js` | Utilities |
| `public/js/data/` | Data folder |
| `public/js/data/houses.js` | House data |
| `public/js/data/locations.js` | Location data |
| `public/js/data/lore.js` | Lore data |

---

## 📂 Directory Breakdown

### 🖼️ `/public/assets/images/`

| File/Directory | Status | Purpose |
|----------------|--------|---------|
| `cloud1.png` | Existing | Cloud texture variant 1 |
| `cloud2.png` | Existing | Cloud texture variant 2 |
| `cloud3.png` | Existing | Cloud texture variant 3 |
| `sigils/` | Existing | House sigils (Stark, Lannister, Targaryen, etc.) |
| `ui/` | Existing | UI elements (backgrounds, buttons, HUD) |
| `ui/backgroundv3.jpg` | **MODIFIED** | Background version 3 (JPG format) |
| `ui/backgroundv3.png` | **NEW** | Background version 3 (PNG format) |
| `ui/map1.png` | **NEW** | Westeros map (interactive) |

### 🎨 UI Backgrounds

| File | Status | Description |
|------|--------|-------------|
| `background.png` | Existing | Main game background |
| `backgroundv2.png` | Existing | Background variant 2 |
| `backgroundv3.jpg` | **MODIFIED** | Background variant 3 (JPG format) |
| `backgroundv3.png` | **NEW** | Background variant 3 (PNG format) |
| `map1.png` | **NEW** | Westeros map (interactive) |

### 🎵 Audio Directories

| Directory | Contents |
|-----------|----------|
| `music/` | Background music, theme songs |
| `sounds/` | Sound effects (clicks, battles, notifications) |

---

## 📂 Root Files

| File | Status | Purpose |
|------|--------|---------|
| `index.html` | **MODIFIED** | Main game entry page |
| `main.js` | **MODIFIED** | Core game logic (Phaser/Canvas) |
| `map.html` | **MODIFIED** | Interactive map viewer |
| `style.css` | Existing | Global styling |
| `test-images.html` | **MODIFIED** | Asset testing/debug page |
| `server.js` | Existing | Local dev server (Node.js/Express) |
| `package.json` | Existing | Project dependencies |
| `package-lock.json` | Existing | Locked dependency versions |
| `scripture_plan.md` | Existing | Game documentation/planning |
| `.gitignore` | Existing | Git ignore file |

---

## 🔧 Quick Start

```bash
# Install dependencies
npm install

# Start development server
node server.js

# Or if using nodemon
npm run dev
```

---

**Winter is Coming! ❄️🔥**