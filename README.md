# D3 Linking — Treemap ↔ Sankey from Free-Text 🧩

Interactive character analytics built with **D3 v7**:  
Type any text, then explore a **Treemap** of character frequencies and a linked **Sankey** that shows which characters commonly appear **before** and **after** a selected character.

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=fff)](#)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5-7952B3?logo=bootstrap&logoColor=fff)](#)
[![D3.js](https://img.shields.io/badge/D3.js-7.x-F9A03C?logo=d3dotjs&logoColor=000)](#)
[![d3-sankey](https://img.shields.io/badge/d3--sankey-0.12.x-FF6F00)](#)

---

## 🚀 Live Demo
- **Website:** <https://<your-username>.github.io/<repo-name>/>  
- **Code:** You’re here!

> Enable GitHub Pages: **Settings → Pages → Deploy from branch → `main`**.

---

## ✨ Features

- **Type to analyze**: Paste or type any text (letters + `. , ! ? ; :`) and click **Submit**.
- **Treemap** of **character frequency**, grouped by:
  - Vowels: `a e i o u y`
  - Consonants: `b..z` (except vowels)
  - Special: `. , ! ? ; :`
- **Click a Treemap cell** → renders a **Sankey** for that character:
  - **Incoming** flows = characters that appear **before** it
  - **Outgoing** flows = characters that appear **after** it
- **Cross-highlighting**: hover on either chart highlights the corresponding items in the other.
- **Tooltips**: frequency on Treemap; plain-English flow explanations on Sankey nodes.
- **Re-runnable**: submitting new text wipes prior marks and recomputes both charts.

---

## 🧠 What I Learned

- **D3 Hierarchies & Layouts**: building a `d3.hierarchy` and rendering a **Treemap** with custom padding and color scales.
- **Network Flow with d3-sankey**: translating adjacency into **nodes & links**, and drawing curved links with `d3.sankeyLinkHorizontal()`.
- **Linked Views**: cross-filter/cross-highlight patterns (Treemap ↔ Sankey) with D3 selections and transitions.
- **Interactive UX**: dynamic **tooltips**, absolute-positioned labels, and controlled re-render (cleanup before redraw).
- **Data wrangling in the browser**: tokenization, case-folding, frequency counts, and **before/after** pair extraction from raw text.

---

## 🗺️ How It Works (Algorithm)

1. **Ingest text** from the textarea.  
2. **Normalize**: strip spaces, convert to lowercase (capitals are accepted but analyzed in lowercase).  
3. **Count** occurrences for `a..z` plus `. , ! ? ; :`.  
4. **Build before/after pairs** for each character:
   - Start of string → `_<next>`  
   - End of string → `<prev>_`  
   - Middle → `<prev><next>`
5. **Treemap data**:  
   - Root: `children = [vowels, consonants, special]`  
   - Leaves: `{ name, value, group }` per character.
6. **When a user clicks a Treemap cell**:
   - Construct **Sankey nodes**: the clicked character, plus “before” nodes (`<char>-b`) and “after” nodes (`<char>-a`).  
   - Construct **links** with counts as values, convert names → indices, and run `d3.sankey(...)` to compute layout.
7. **Link & node rendering** with cross-highlight and tooltips across both charts.

---

## 🧱 Tech Stack

- **HTML + Bootstrap 5** for layout and quick styling
- **D3 v7** for Treemap, color scales, transitions, events
- **d3-sankey 0.12.x** for Sankey layout and link paths
- **Vanilla JS** (no framework) for data prep & UI wiring

---

## ▶️ Quick Start

**Option A — Open file**
- Open `index.html` directly in a modern browser.

**Option B — Live Server (recommended)**
- Install VS Code extension **Live Server** → Right-click `index.html` → **Open with Live Server**.



