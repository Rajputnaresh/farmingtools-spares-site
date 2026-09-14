# Design System: KrishiGears Spares & FarmingTools.in

## 1. Principles
- **Sunlight Legibility**: Designed for outdoor reading on budget Android phones in direct sunlight. High-contrast typography, solid backgrounds, no washed-out pastels.
- **Multilingual First**: Vernacular (Hindi, Marathi) is first-class alongside English. Dual-language layout prioritizes legibility without doubling scan fatigue.
- **Strict Stock Integrity**: The business holds no stock — never imply physical inventory where none exists. Proportional status gauges depict exact fulfillment readiness.
- **Ergonomic Touch Targets**: Minimum 44×44px interactive hitboxes across all mobile controls.

## 2. Design Tokens (`:root`)

### Color Palette
- `--green`: `#0F5132` (Primary brand industrial forest green)
- `--green-dark`: `#0A3622` (High-contrast header & active accents)
- `--green-light`: `#E8F5E9` (Subtle selection & highlight wash)
- `--green-mid`: `#A3D9B1` (Active border tint)
- `--green-accent`: `#16A34A` (Fulfillment indicators)
- `--amber`: `#d97706` (Supplier chain / sourcing alert)
- `--danger`: `#DC2626` (Out-of-stock & destructive actions)
- `--border`: `#E2E8F0` (Card & divider lines)
- `--border-dark`: `#CBD5E1` (Input borders)
- `--text`: `#0F172A` (Slate dark body text — WCAG AAA)
- `--muted`: `#475569` (Secondary descriptors — 4.5:1+ contrast)
- `--bg`: `#F8FAFC` (App viewport background)
- `--surface`: `#FFFFFF` (Card surfaces & modal sheets)

### Typography & Hierarchy
- System Font Stack: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`
- Dual-Language Rendering: Primary English / Devanagari labels paired with distinct font weights to eliminate visual scan fatigue.

### Elevation & Touch Radii
- `--r-xs`: `6px`
- `--r-sm`: `8px`
- `--r-md`: `10px`
- `--r-lg`: `14px`
- `--r-pill`: `9999px`
- Touch targets: strictly enforced `min-height: 44px; min-width: 44px;` on all interactive buttons, tabs, chips, and pills.
