# FYB Spotlight

A modern, interactive student spotlight/profile card built with **React, TypeScript, Vite, and Tailwind CSS**.

The project is a web implementation of the **FYB Spotlight** concept created by **Ojo Oluwagbayin**, who also served as the **Concept & Design Lead**, together with the creative contributions of the **UNCHARTED FYB Design Team** and the leadership and support of the **UNCHARTED FYB Chairmen**.

The goal of this project is to transform the original Spotlight concept into a reusable, interactive web experience while preserving its visual identity and creative direction.

---

## ✨ Features

- 🎨 Modern and visually distinctive spotlight card
- ⚛️ Built with React and TypeScript
- ⚡ Powered by Vite
- 🎨 Styled with Tailwind CSS
- 🧩 Modular and reusable React components
- 📱 Responsive design for desktop and mobile
- 📝 Developer-inspired JSON profile sections
- 🖼️ Profile photo and throwback photo support
- 🔗 Social media information
- 🔤 Custom typography
- 📊 Strong TypeScript data structures
- 🔌 Architecture prepared for dynamic data integration
- 📄 Designed to support future Google Sheets/CSV integration

---

# 🛠️ Tech Stack

| Technology     | Purpose                             |
| -------------- | ----------------------------------- |
| React          | User interface                      |
| TypeScript     | Type safety and maintainability     |
| Vite           | Development server and build tool   |
| Tailwind CSS   | Styling and responsive design       |
| JetBrains Mono | Technical and code-style typography |
| Apfel Grotezk  | Display and branding typography     |

---

# 📁 Project Structure

```text
src/
├── components/
│   ├── spotlight/
│   │   ├── Spotlight.tsx
│   │   ├── TopMeta.tsx
│   │   ├── Header.tsx
│   │   ├── PhotoSection.tsx
│   │   ├── Throwback.tsx
│   │   ├── ProfileInfo.tsx
│   │   ├── JsonSection.tsx
│   │   └── Footer.tsx
│   │
│   └── ui/
│       └── SocialIcon.tsx
│
├── data/
│   └── profile.ts
│
├── types/
│   └── profile.ts
│
├── App.tsx
├── main.tsx
└── index.css
```

## Component Responsibilities

### `Spotlight.tsx`

The main container responsible for assembling the complete FYB Spotlight interface.

### `TopMeta.tsx`

Displays the metadata section at the top of the Spotlight card.

### `Header.tsx`

Contains the FYB Spotlight branding and the `[FETCH:USER DATA]` button.

### `PhotoSection.tsx`

Handles the primary profile image and the throwback image.

### `Throwback.tsx`

Displays the throwback image inside the window-style card.

### `ProfileInfo.tsx`

Displays the student's:

- Full name
- Surname
- Nickname
- Birthday
- Social media

### `JsonSection.tsx`

A reusable component responsible for displaying profile information in the developer-inspired JSON format.

### `Footer.tsx`

Contains the UNCHARTED branding and class information.

### `SocialIcon.tsx`

Reusable component for social media icons.

---

# 🚀 Getting Started

## Prerequisites

Make sure you have the following installed:

- Node.js
- npm

Check your installed versions:

```bash
node --version
npm --version
```

---

## 📦 Installation

Clone the repository:

```bash
git clone https://github.com/Osikoya17/UNCHARTED_FYB_SPOTLIGHT.git
```

Navigate into the project:

```bash
cd UNCHARTED_FYB_SPOTLIGHT
```

Install dependencies:

```bash
npm install
```

---

# 🖥️ Development

Start the Vite development server:

```bash
npm run dev
```

Vite will provide a local development URL, usually:

```text
http://localhost:5173
```

Open the URL in your browser to view the application.

---

# 🏗️ Production Build

Create an optimized production build:

```bash
npm run build
```

The production files will be generated inside:

```text
dist/
```

---

# 🔍 Preview Production Build

To preview the production build locally:

```bash
npm run preview
```

---

# 🔤 Fonts

The project uses two primary typefaces to create the visual identity of the Spotlight design.

## Apfel Grotezk

Used primarily for:

- Large headings
- Student names
- Branding
- Display typography

Install it with:

```bash
npm install @fontsource/apfel-grotezk
```

Import the required styles:

```tsx
import '@fontsource/apfel-grotezk/400.css';
import '@fontsource/apfel-grotezk/700.css';
```

---

## JetBrains Mono

Used primarily for:

- JSON-style information
- Metadata
- Technical labels
- Numbers
- Developer-oriented content

Install it with:

```bash
npm install @fontsource/jetbrains-mono
```

Import the required weights:

```tsx
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/500.css';
import '@fontsource/jetbrains-mono/600.css';
import '@fontsource/jetbrains-mono/700.css';
```

---

# 📊 Profile Data

At the moment, profile information is stored locally in:

```text
src/data/profile.ts
```

The data structure is defined using a TypeScript interface located at:

```text
src/types/profile.ts
```

Example:

```tsx
export const profile: Profile = {
  fullName: '',
  surname: '',
  nickname: '',
  birthday: '',

  photo: '',
  throwbackPhoto: '',

  socialMedia: {
    instagram: '',
    x: '',
    linkedin: '',
  },

  funFact: '',
  favCourse: '',
  leastFavCourse: '',
  favLecturer: '',
  favYoutubeTutor: '',

  whatDoYouDo: '',
  bestExpOnCampus: '',
  worstExpOnCampus: '',
  ifNotCSC: '',

  unexpectedExp: '',
  hotTake: '',
  journeyInOneWord: '',
  overallOauExperience: '',

  favQuote: '',
  shoutout: '',
};
```

---

# 🔮 Future Google Sheets Integration

A major planned feature is connecting the Spotlight application to a **Google Sheet**.

Instead of manually editing `profile.ts`, student information can eventually be managed from a centralized Google Sheet.

The planned architecture is:

```text
Google Sheet
     │
     ▼
Published CSV
     │
     ▼
React Fetch / CSV Parser
     │
     ▼
Typed Profile Data
     │
     ▼
Spotlight Component
     │
     ▼
Dynamic Student Profile
```

This would make it possible to update student information directly from the Google Sheet without modifying the React application.

The `[FETCH:USER DATA]` button can eventually be used to retrieve and display the latest profile information.

---

# 🧩 Component Architecture

The application follows a separation-of-concerns architecture.

```text
                         App.tsx
                            │
                            ▼
                      Spotlight.tsx
                            │
          ┌─────────────────┼─────────────────┐
          │                 │                 │
          ▼                 ▼                 ▼
       Header          PhotoSection        Footer
                            │
                            ▼
                        Throwback

                            │
                            ▼
                       ProfileInfo
                            │
                            ▼
                       JsonSection
                            │
                            ▼
                        Profile
                            │
                            ▼
                       Data Source
```

The UI components receive their data through props rather than being tightly coupled to the data source.

For example:

```tsx
<ProfileInfo profile={profile} />
```

This means the `ProfileInfo` component does not need to know whether the data came from:

- Local TypeScript data
- Google Sheets
- A REST API
- Supabase
- Firebase
- A custom backend

This makes the application easier to maintain and extend.

---

# 📱 Responsive Design

The Spotlight is designed to adapt to different screen sizes.

## Desktop

The desktop layout uses two primary columns:

```text
┌──────────────────────┬────────────────────────┐
│                      │                        │
│                      │      PROFILE DATA      │
│       PROFILE        │                        │
│        PHOTO         │      JSON SECTIONS     │
│                      │                        │
│        NAME          │                        │
│                      │                        │
│    PERSONAL INFO     │                        │
│                      │                        │
└──────────────────────┴────────────────────────┘
```

## Mobile

On smaller screens, the layout changes to a single-column structure:

```text
┌──────────────────────┐
│       HEADER         │
├──────────────────────┤
│                      │
│        PHOTO         │
│                      │
├──────────────────────┤
│        NAME          │
├──────────────────────┤
│    PERSONAL INFO     │
├──────────────────────┤
│     PROFILE DATA     │
├──────────────────────┤
│       FOOTER         │
└──────────────────────┘
```

---

# 📜 Available Scripts

| Command           | Description                       |
| ----------------- | --------------------------------- |
| `npm run dev`     | Start the Vite development server |
| `npm run build`   | Create a production build         |
| `npm run preview` | Preview the production build      |
| `npm run lint`    | Run ESLint                        |

---

# 🧹 Code Quality

The project uses TypeScript to improve reliability, maintainability, and developer experience.

Run the build check with:

```bash
npm run build
```

Run ESLint with:

```bash
npm run lint
```

---

# 🌐 Deployment

Because this project is built using Vite, it can be deployed to modern frontend hosting platforms such as:

- Vercel
- Netlify
- Cloudflare Pages
- GitHub Pages

The production build output is generated in:

```text
dist/
```

---

# 🗺️ Roadmap

## Phase 1 — UI

- [x] Create FYB Spotlight design
- [x] Componentize the interface
- [x] Add responsive layout
- [x] Add custom fonts
- [x] Add TypeScript types
- [x] Implement Tailwind CSS styling

## Phase 2 — Dynamic Data

- [ ] Connect Google Sheets
- [ ] Read published CSV data
- [ ] Convert CSV rows into typed profiles
- [ ] Dynamically populate Spotlight profiles
- [ ] Add student selection/search

## Phase 3 — User Experience

- [ ] Implement `[FETCH:USER DATA]`
- [ ] Add loading states
- [ ] Add error states
- [ ] Add profile transitions
- [ ] Add image fallback handling
- [ ] Add shareable profile URLs
- [ ] Add profile search

## Phase 4 — Production

- [ ] Optimize images
- [ ] Improve accessibility
- [ ] Add SEO metadata
- [ ] Add Open Graph previews
- [ ] Add analytics
- [ ] Deploy production version

---

# 🎨 Original Concept & Design

This project is an interactive web implementation of the original **FYB Spotlight** concept and design.

The original concept was created by **Ojo Oluwagbayin**, who also served as the **Concept & Design Lead**.

The visual design and creative execution were developed with contributions from the **UNCHARTED FYB Design Team**, with the support and creative leadership of the **UNCHARTED FYB Chairmen**.

### Original Contributors

| Contribution                  | Contributor                   |
| ----------------------------- | ----------------------------- |
| Concept & Design Lead         | **Ojo Oluwagbayin**           |
| Design & Creative Team        | **UNCHARTED FYB Design Team** |
| Creative Leadership & Support | **UNCHARTED FYB Chairmen**    |
| Web Implementation            | **Osikoya Olaluwa**                 |

> The original FYB Spotlight concept and visual design are credited to Ojo Oluwagbayin and the UNCHARTED FYB Design Team, with the UNCHARTED FYB Chairmen providing creative leadership and support.

This repository contains the **web implementation** of the concept using modern frontend technologies.

---

# 🙏 Acknowledgements

## Ojo Oluwagbayin — Concept & Design Lead

Special appreciation to **Ojo Oluwagbayin** for originating the FYB Spotlight concept and serving as the **Concept & Design Lead** responsible for the creative direction and original visual design.

## UNCHARTED FYB Design Team

Special recognition to the **UNCHARTED FYB Design Team** for their contributions to the visual identity, design development, and creative execution of the original Spotlight concept.

## UNCHARTED FYB Chairmen

Appreciation to the **UNCHARTED FYB Chairmen** for their leadership, support, and contribution to the overall FYB Spotlight initiative.

---

# 👨‍💻 Web Implementation

The interactive web implementation was developed using:

**React + TypeScript + Vite + Tailwind CSS**

The implementation focuses on transforming the original static Spotlight concept into a reusable digital system where student information can eventually be retrieved dynamically from a centralized data source such as Google Sheets.

---

# 🤝 Contributing

Contributions, suggestions, and improvements are welcome.

To contribute:

### 1. Fork the repository

### 2. Create a feature branch

```bash
git checkout -b feature/your-feature
```

### 3. Make your changes

### 4. Commit your changes

```bash
git commit -m "feat: add your feature"
```

### 5. Push your branch

```bash
git push origin feature/your-feature
```

### 6. Open a Pull Request

---

# 📄 Credits & Attribution

The **FYB Spotlight concept and original design** are credited to:

- **Ojo Oluwagbayin** — Concept & Design Lead
- **UNCHARTED FYB Design Team** — Design & Creative Team
- **UNCHARTED FYB Chairmen** — Creative Leadership & Support

The web implementation is a separate software implementation built with **React, TypeScript, Vite, and Tailwind CSS**.

If this project is reused, modified, or redistributed, please retain the original concept and design attribution.

---

# 📜 License

This project is intended for educational and personal project use.

The software implementation and the original FYB Spotlight concept/design should be considered separately. The original concept and design remain credited to their respective creators and contributors.

If this project is distributed publicly, an appropriate software license such as **MIT** may be added while retaining the original concept and design attribution.

---

## ⭐ Built With

**React · TypeScript · Vite · Tailwind CSS · JetBrains Mono · Apfel Grotezk**

Made with ❤️ for **UNCHARTED — Computer Science & Engineering, Class of 2024/25**.
