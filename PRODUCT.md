# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

1. **Local Retail Shopkeepers & Counter Dealers**: Searching 1,746 SKUs at high speed while a farmer/customer is standing in front of the counter. Needs rapid part fitment identification, instant diagram exploded views, customer retail markup calculation (MRP vs Net), and one-tap Counter Billing.
2. **Rural Indian Farmers & Walk-in Customers**: Browsing for replacement parts for broken brush cutters, sprayers, chainsaws, or weeders in field distress or outdoor sunlight on budget Android phones (often metered 3G/4G). Comfort in Hindi/Marathi over English; requires high-contrast tactile visibility and zero-ambiguity fitment assurance.
3. **Regional Distributors**: Managing downline dealer requests, tracking network inventory distribution, approving drop-ship dispatches, checking supplier ledgers, and issuing delivery challans.
4. **Platform Importer / Master Admin**: Multi-tenant supplier catalog governance, bulk pricing imports, master stock reallocations, and cross-tier order routing.

## Product Purpose

KrishiGears Spares (`farmingtools-spares-site`) is the dedicated progressive web application (PWA) and trade platform for agricultural machinery fitment-checked spare parts across India, operated by KrishiGears (Jaipur, GSTIN 08EQLPD7160R1Z2). It enables instant exploded catalog discovery, zero-friction PO generation, offline outbox queuing, and real-time inventory ledger transparency across the supplier-dealer-farmer network.

Success means:
- Rapid, error-free part identification (zero wrong-part dispatches).
- Counter-speed billing and PO generation in under 30 seconds.
- 100% offline-first resilience on patchy rural networks via IndexedDB outbox.

## Positioning

The only dedicated agricultural machinery spares platform in India combining interactive subsystem schematics, verified fitment diagrams, multilingual Hindi/English workshop vocabulary aliases, and live multi-tier supply chain ledger tracking.

## Operating Context

- **Environment**: Counter desks with customer queues, repair workshops, and open outdoor fields in harsh midday glare.
- **Devices**: Budget Android phones (e.g. Redmi, Realme), low-end tablets, and counter laptops.
- **Network**: Patchy 3G/4G rural connectivity; requires complete offline catalog lookup and resilient IndexedDB queue flushing upon reconnect.
- **Languages**: Vernacular first-class support (Hindi, Marathi, English) with colloquial workshop transliteration aliases (`carbutor`, `dori`, `chidiya`, `chakki`).

## Capabilities and Constraints

- **Holding Model**: Multi-node inventory distribution across importer, regional distributors, and local dealers. Real-time stock distinction between "Ready in warehouse / तैयार", "Orderable from supplier / मंगाया जा सकता है", and "Out of stock / स्टॉक नहीं".
- **Exploded Schematics**: Page scan diagrams for every machine model linked directly to part lines.
- **Counter Mode**: Dynamic retail multiplier toggle for dealers to bill farmers at counter without exposing wholesale net supplier rates.
- **Never Invent a Promise**: Missing stock or pricing data renders explicit "Ask shop" states rather than fabricated numbers.

## Brand Commitments

- **Brand**: KrishiGears Spares & FarmingTools.in
- **Personality**: Grounded, utilitarian, transparent, fast, vernacular, respectful of farmer & dealer working reality.
- **Palette & Tokens**: High-contrast agricultural forest green (`#0F5132`, `#198754`), high-visibility status amber (`#d97706`), tactile terracotta alerts, and crisp white surfaces.
- **Typography & Targets**: Strict touch targets >= 44px, high-contrast outdoor typography, and zero decorative visual fluff.

## Evidence on Hand

- 1,746 cataloged genuine SKUs across 4 primary machine groups (Brush Cutters, Tillers/Weeders, Chainsaws, Sprayers/Engines).
- High-resolution catalogue schematics and extracted part crops in `pages/`.
- Live Supabase backend for pricing RPCs (`my_prices`, `my_balances`, `fulfill_enduser_order`).

## Product Principles

1. **Legible in Sunlight on a Cheap Phone**: High WCAG AA contrast (5:1+), prominent gauges, and tactile borders outrank subtle gradients or low-contrast corporate aesthetics.
2. **Never Invent a Promise**: Missing inventory or pricing data renders honest requests rather than guessed numbers.
3. **Speed at the Counter Beats Everything**: Instant sub-second search, colloquial phonetics, and 1-tap PO generation.
4. **The Ledger is the Truth**: Quantities, receivables, and payables reflect actual stock and money movement.
5. **Say it in the Trader's Language**: First-class Hindi and Marathi representation for every subsystem, part title, and action.

## Accessibility & Inclusion

- Outdoor high-contrast visibility standard (WCAG 2.1 AA+).
- Minimum 44x44px touch targets across all interactive buttons, pills, gauges, and stepper controls.
- Vernacular Devanagari font rendering paired with Latin numerals and English specifications.
