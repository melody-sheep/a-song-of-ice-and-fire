# 📁 Project Structure - Got Game (Corrected)

Based on the updated image, here is the corrected project structure:

```
📁 GOT_GAME/
│
├── 📁 node_modules/                    # Node.js dependencies
│
├── 📁 public/                          # Public static assets
│   └── 📁 assets/                      # Game assets directory
│       ├── 📁 images/                  # All image assets
│       │   ├── cloud1.png              # Cloud texture 1
│       │   ├── cloud2.png              # Cloud texture 2
│       │   ├── cloud3.png              # Cloud texture 3
│       │   │
│       │   ├── 📁 sigils/              # House sigils / game symbols
│       │   │
│       │   └── 📁 ui/                  # UI elements
│       │       ├── background.png      # Main background
│       │       ├── backgroundv2.png    # Background version 2
│       │       └── backgroundv3.jpg    # Background version 3
│       │
│       ├── 📁 music/                   # Audio music files
│       │
│       └── 📁 sounds/                  # Sound effects
│
├── 📄 index.html                       # Main game entry point
├── 📄 main.js                          # Core game logic
├── 📄 map.html                         # Map viewer page
├── 📄 style.css                        # Global styles
├── 📄 test-images.html                 # Image testing page
│
├── 📄 package-lock.json                # Locked dependencies
├── 📄 package.json                     # Project dependencies
├── 📄 scripture_plan.md                # Game documentation/plan
└── 📄 server.js                        # Local development server
```

---

## 📊 File Summary

| Type | Count | Files |
|------|-------|-------|
| **HTML Files** | 3 | index.html, map.html, test-images.html |
| **CSS Files** | 1 | style.css |
| **JavaScript Files** | 2 | main.js, server.js |
| **Image Files** | 3 | cloud1.png, cloud2.png, cloud3.png |
| **Image Directories** | 2 | sigils/, ui/ |
| **Audio Directories** | 2 | music/, sounds/ |
| **Config Files** | 2 | package.json, package-lock.json |
| **Documentation** | 1 | scripture_plan.md |

---

## 📝 Directory Breakdown

### 🖼️ `/public/assets/images/`

| File/Directory | Purpose |
|----------------|---------|
| `cloud1.png` | Cloud texture variant 1 |
| `cloud2.png` | Cloud texture variant 2 |
| `cloud3.png` | Cloud texture variant 3 |
| `sigils/` | House sigils (Stark, Lannister, Targaryen, etc.) |
| `ui/` | UI elements (backgrounds, buttons, HUD) |

### 🎨 UI Backgrounds

| File | Description |
|------|-------------|
| `background.png` | Main game background |
| `backgroundv2.png` | Background variant 2 |
| `backgroundv3.jpg` | Background variant 3 (JPG format) |

### 🎵 Audio Directories

| Directory | Contents |
|-----------|----------|
| `music/` | Background music, theme songs |
| `sounds/` | Sound effects (clicks, battles, notifications) |

---

## 📂 Root Files

| File | Purpose |
|------|---------|
| `index.html` | Main game entry page |
| `main.js` | Core game logic (Phaser/Canvas) |
| `map.html` | Interactive map viewer |
| `style.css` | Global styling |
| `test-images.html` | Asset testing/debug page |
| `server.js` | Local dev server (Node.js/Express) |
| `package.json` | Project dependencies |
| `package-lock.json` | Locked dependency versions |
| `scripture_plan.md` | Game documentation/planning |

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