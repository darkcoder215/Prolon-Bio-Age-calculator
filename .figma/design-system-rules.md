# Thmanyah Commentator Tool -- Design System Rules

> For use with Figma MCP integration. Governs all UI decisions.

## Project Context

- **Stack:** Vanilla HTML, CSS, JavaScript (no frameworks)
- **Styling:** Plain CSS with CSS custom properties (`:root` variables)
- **Layout direction:** RTL (Right-to-Left) primary
- **Fonts:** Custom Thmanyah font families (Serif Display, Serif Text, Sans)
- **No build system** -- static files served directly

## Color Tokens

### Primary
| Token | Hex | Usage |
|---|---|---|
| `--color-black` | `#000000` | Primary text, dark backgrounds, logo |
| `--color-white` | `#FFFFFF` | Clean surfaces, modals |
| `--color-green` | `#00C17A` | Brand accent, CTAs, success, section headers |
| `--color-green-light` | `#B5E8BE` | Light green backgrounds, highlight style |
| `--color-off-white` | `#F7F4EE` | Page background |
| `--color-warm-white` | `#F2EDEA` | Subtle backgrounds, dividers |

### Accent
| Token | Hex | Usage |
|---|---|---|
| `--color-blue` | `#0072F9` | Links, interactive elements |
| `--color-red` | `#F24935` | Alerts, low scores, critical |

### Extended
| Token | Hex | Usage |
|---|---|---|
| `--color-burgundy` | `#82003A` | Deep accent, critical warnings |
| `--color-amber` | `#FFBC0A` | Warnings, medium scores |
| `--color-peach` | `#FF9172` | Below-average indicators |
| `--color-mint` | `#B2E2BA` | Positive indicators |
| `--color-sky-blue` | `#84DBE5` | Info states |
| `--color-lavender` | `#D1C4E2` | Light decorative accent |
| `--color-pale-yellow` | `#F9E59E` | Highlight backgrounds |
| `--color-blush` | `#FFD1C4` | Soft warm backgrounds |
| `--color-rose` | `#FFC9D8` | Soft pink backgrounds |

### Neutrals
| Token | Hex | Usage |
|---|---|---|
| `--color-dark-slate` | `#111421` | Deep backgrounds |
| `--color-charcoal` | `#2B2D3F` | Dark cards, nav |
| `--color-muted` | `#494C6B` | Secondary text, placeholders |
| `--color-warm-gray` | `#EFEDE2` | Borders, dividers |
| `--color-cream` | `#F4F2ED` | Card backgrounds |

### Semantic (Score Gradation)
| State | Color | Hex |
|---|---|---|
| Excellent | Thmanyah Green | `#00C17A` |
| Good | Mint | `#B2E2BA` |
| Average | Amber | `#FFBC0A` |
| Below Average | Peach | `#FF9172` |
| Poor | Thmanyah Red | `#F24935` |
| Info | Sky Blue | `#84DBE5` |
| Interactive | Thmanyah Blue | `#0072F9` |

## Typography

### Font Families
| Family | Purpose | Figma Fallback |
|---|---|---|
| **Thmanyah Serif Display** | Headlines, hero text, scores | Georgia, serif |
| **Thmanyah Serif Text** | Body text, long-form content | Georgia, serif |
| **Thmanyah Sans** | UI elements, buttons, labels, data | Inter, sans-serif |

### Type Scale
| Element | Font | Weight | Size |
|---|---|---|---|
| Page Title / Hero | Serif Display | Bold/Black (700-900) | 36-48px |
| Section Heading (H1) | Serif Display | Bold (700) | 28-32px |
| Sub-heading (H2) | Serif Display | Medium (500) | 22-26px |
| Card Title (H3) | Sans | Bold (700) | 18-20px |
| Body Text | Serif Text | Regular (400) | 16-18px |
| Small Body / Caption | Sans | Regular (400) | 14px |
| Label / Tag | Sans | Medium (500) | 12-13px |
| Button Text | Sans | Bold (700) | 14-16px |
| Data / Numbers | Sans | Medium/Bold | 14-24px |
| Score Display (large) | Serif Display | Black (900) | 48-72px |

### Numeral System
Always use Western Arabic numerals (0-9). Never use Arabic-Indic numerals.

## Spacing

8px base grid. All values multiples of 4 or 8.

| Token | Value |
|---|---|
| `--space-1` | 4px |
| `--space-2` | 8px |
| `--space-3` | 12px |
| `--space-4` | 16px |
| `--space-5` | 20px |
| `--space-6` | 24px |
| `--space-8` | 32px |
| `--space-10` | 40px |
| `--space-12` | 48px |
| `--space-16` | 64px |

## Border Radius

| Token | Value | Usage |
|---|---|---|
| `--radius-sm` | 8px | Small elements |
| `--radius-md` | 12px | Default cards, inputs |
| `--radius-lg` | 16px | Large cards, containers |
| `--radius-xl` | 24px | Prominent surfaces |
| `--radius-full` | 9999px | Buttons (pill), badges |

**Rule:** No sharp 90-degree corners on cards, buttons, or containers.

## Shadows

| Token | Value |
|---|---|
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` |
| `--shadow-md` | `0 4px 12px rgba(0,0,0,0.08)` |
| `--shadow-lg` | `0 8px 24px rgba(0,0,0,0.12)` |

## Component Patterns

### Buttons
All buttons are pill-shaped (`border-radius: 9999px`), padding `10px 24px`, Sans Bold 14px.

| Type | Background | Text | Border |
|---|---|---|---|
| Primary | `#000000` | `#FFFFFF` | none |
| Secondary | `#FFFFFF` | `#000000` | 1px `#EFEDE2` |
| Accent | `#00C17A` | `#FFFFFF` | none |
| Danger | `#F24935` | `#FFFFFF` | none |
| Ghost | transparent | `#000000` | none |

### Cards
- Background: `#FFFFFF`
- Shadow: `--shadow-sm`
- Border-radius: 16px
- Internal padding: 24px
- Sit on `#F7F4EE` page background

### Score Cards
- Large number: Serif Display Black, 48-72px
- Colored highlight behind score using `#B5E8BE`
- Color-coded by semantic score mapping

### Metric / Progress Bars
- Rounded ends (`border-radius: 9999px`)
- Height: 8px
- Filled: `#00C17A`, Empty: `#EFEDE2`

### Data Tables
- Header: `#000000` bg, white text, Sans Bold
- Rows: alternating `#FFFFFF` and `#F7F4EE`
- Padding: 12-16px per cell
- Outer container: 12px border-radius
- No visible cell borders

### Navigation Sidebar
- Background: `#000000` or `#111421`
- Active: `#00C17A` accent border/tint
- Icons: white, 24px
- Text: Sans Medium, white, 14px
- Width: 260px fixed

### Highlight Style (Signature Brand Element)
Colored background behind key text:
- Colors: `#B5E8BE`, `#F9E59E`, `#FFD1C4`, `#FFA5C6`
- Padding: 2px 8px
- Border-radius: 4px
- Use for: score labels, key metrics, important findings

## Surface Colors

| Surface | Color |
|---|---|
| Page background | `#F7F4EE` or `#FFFFFF` |
| Sidebar / Nav | `#000000` or `#111421` |
| Cards | `#FFFFFF` + shadow |
| Section headers | `#00C17A` + white text |
| Modal overlays | `rgba(0,0,0,0.5)` |
| Data tables | Alternating `#FFFFFF` / `#F7F4EE` |

## Layout

- **Direction:** RTL primary
- **Grid:** 12-column, 16px gutters
- **Max content width:** 1280px
- **Sidebar:** 260px fixed
- **Card gap:** 16-24px
- **Section gaps:** 48-64px

## Breakpoints

| Name | Width | Layout |
|---|---|---|
| Desktop Large | >= 1280px | Sidebar + 3-column |
| Desktop | >= 1024px | Sidebar + 2-column |
| Tablet | >= 768px | Collapsible sidebar + single column |
| Mobile | < 768px | Bottom nav + stacked cards |

## Iconography

- Line icons, 2px stroke weight
- Rounded terminals
- Sizes: 20px (small), 24px (default), 32px (large)

## Brand Rules

### Do
- Generous whitespace
- Highlight style for key metrics
- Rounded corners (12-16px) on all containers
- Restrained palette: neutrals + green/blue/red accents
- RTL layout with Arabic typography
- High contrast text/background

### Don't
- Sharp corners on interactive elements
- Colors outside the defined palette
- Crowded interfaces
- Decorative elements without purpose
- More than 2-3 accent colors per screen
- Mixed font families in a single text block

## Voice & Tone

- **Direct:** "Score: 82/100" not verbose descriptions
- **Warm:** "Great performance" not "PASS"
- **Constructive:** "Room for improvement" not "Failed"
- **Arabic first:** All labels and UI copy in Arabic
