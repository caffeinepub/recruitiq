# Design Brief

## Direction

**Police Exam Authority** — Dark navy and gold badge-inspired interface conveying official certification, professional preparation, and achievement progression through structured visual hierarchy.

## Tone

Authoritative and trustworthy. Deep navy grounds the interface with gravitas while gold accents signal achievement, progression, and official badge status. No playful elements — this is serious exam preparation.

## Differentiation

Badge-centered gamification system with visual tier progression (Rookie → Ready → Academy Bound → Top Candidate). Every design choice reinforces official examination aesthetic: crisp shadows, structured card layouts, and gold highlight progression.

## Color Palette

| Token      | OKLCH       | Role                        |
|------------|-------------|------------------------------|
| background | 0.13 0.025 265  | Dark navy dark mode         |
| foreground | 0.92 0.01 265   | High-contrast text          |
| card       | 0.17 0.028 265  | Exam/section cards          |
| primary    | 0.72 0.2 80     | Gold accents, achievements  |
| accent     | 0.72 0.2 80     | Gold highlights, progress   |
| muted      | 0.22 0.03 265   | Secondary sections          |
| destructive| 0.65 0.19 22    | Incomplete/failed states    |

## Typography

- Display: Space Grotesk — geometric, confident, modern professional. Exam titles, section headers, badge tier names.
- Body: Plus Jakarta Sans — clean, readable, structured. Question text, explanations, category labels.
- Scale: hero `text-6xl md:text-7xl`, h2 `text-4xl md:text-5xl`, label `text-sm font-semibold tracking-widest`, body `text-base`

## Elevation & Depth

Crisp, structured elevation hierarchy using consistent shadows. Cards lift slightly off background with `shadow-card`. Badges use `shadow-badge` for emphasis. No soft/blurred shadows — precision matches official aesthetic.

## Structural Zones

| Zone     | Background        | Border                | Notes                          |
|----------|-------------------|----------------------|--------------------------------|
| Header   | card (0.17L)      | gold accent bottom   | Police badge logo, exam selector |
| Content  | background (0.13L)| none                 | Dark navy, card-based sections  |
| Sidebar  | card (0.17L)      | subtle divider       | Badge tier progress, navigation |
| Footer   | background (0.13L)| gold accent top      | Results export, support links  |

## Spacing & Rhythm

Section gaps 2rem, card padding 1.5rem, micro-spacing 0.5rem. Alternating card backgrounds (card + muted) create visual rhythm. Dense information grouped in 8px increments for structured scanning.

## Component Patterns

- **Buttons**: Medium radius (0.5rem), gold for primary/achievements, muted for secondary. Hover: darkened gold (0.65L).
- **Cards**: 0.5rem radius, shadow-card, navy background with gold accent border-top for exam sections.
- **Badges**: Circular or pill-shaped, tier-specific colors (Rookie: secondary, Ready/Academy/Top: accent with shine effect).
- **Progress**: Gold fill on muted background, striped animation on active exams.

## Motion

- **Entrance**: Cards fade in 0.3s ease-out on page load.
- **Hover**: Button primary color darkens 0.3s smooth transition. Badge badges pulse gently (badge-pulse).
- **Decorative**: Score reveal animation (score-count 0.6s bounce). Category chart bars slide in 0.4s stagger.

## Constraints

- Dark mode only (exam focus context).
- Maximum 2 fonts active (display + body).
- Gold accent used sparingly for progress/achievements — never more than 20% of UI.
- No bright colors or gradients; navy/gold only.
- Card-based layout minimum 320px mobile width.

## Signature Detail

Gold shine effect on badge tier elements creating a subtle light-catch, reinforcing the official police badge aesthetic and elevating achievement moments with refined, not-cheap-looking detail.
