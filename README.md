# VERVE — Creator Monetization & Brand Marketplace

A modern, dynamic creator monetization platform built with **Vanilla HTML5, CSS3, and JavaScript**, featuring full data persistence using **LocalStorage**.

---

## 🌟 Key Platform Features

### 1. Dual Perspective Engine (Role Switcher)
Seamlessly toggle between **Creator Mode** and **Brand/Business Mode** directly in the top navigation bar:
- **Creator Mode** (Logged in as *Elena Vance*, Tech & Lifestyle UGC Specialist):
  - Publish creative drops, behind-the-scenes content, and paywalled digital asset packs.
  - Manage rate cards, service packages, and client case study portfolios.
  - Review incoming brand proposals, accept contracts, submit deliverables for review, and track earnings.
  - View live available wallet balance and request instant bank payouts.
- **Brand / Business Mode** (Logged in as *Apex Brands*):
  - Discover and filter vetted talent across 5 major niches (Tech & AI, Fashion & Beauty, Lifestyle, Gaming & 3D, Fitness & Wellness).
  - Review creator performance metrics (impressions, engagement rate, average rating, starting rates).
  - Submit custom hiring proposals with secured **escrow budget protection**.
  - Inspect submitted deliverables, approve drafts, and release escrow funds directly to creators.

---

### 2. Five Comprehensive Modules

1. **Talent Marketplace (`#marketplace`)**:
   - Filterable creator catalog with search by keywords, niches, and tags.
   - Dynamic sorting by highest rating, audience size, or starting rates.
   - Creator profile cards with bookmarking (save talent to favorites), starting rate indicators, and instant hire triggers.

2. **Feed & Content Drops (`#feed`)**:
   - Creators publish updates, case studies, and digital assets.
   - **Interactive Monetization**:
     - Direct viewer tipping with quick chips ($5, $15, $30, $50) or custom amounts with notes.
     - **Paywalled Assets**: Exclusive Notion templates, DaVinci Resolve LUT packs, or guides that can be unlocked for a fee.
     - Like counters with instant heart state updates and persistent comment threads.

3. **Creator Studio & Portfolio (`#portfolio`)**:
   - Complete digital portfolio for creators:
     - Profile cover, verified badge, bio, location, social channel counters.
     - Sub-tab 1: **Selected Work & Case Studies** (with click-to-inspect modal, view counts, CTR, and ROAS metrics).
     - Sub-tab 2: **Services & Packages** (Transparent rate cards: Bronze, Silver, Gold with turnaround times and revision limits).
     - Sub-tab 3: **Verified Brand Testimonials** (Client reviews and star ratings).
     - Action buttons to **+ Add Portfolio Work** and **+ Add Service Package**.

4. **Brand Deals & Escrow Management (`#deals`)**:
   - Full 5-step contract lifecycle:
     `Proposal Sent` ➔ `Escrow Funded` ➔ `Creator Accepted` ➔ `Draft Submitted` ➔ `Payment Released`
   - Filter deals by status: *All Deals, Pending Offer, In Progress, Under Review, Completed*.
   - Creators can submit deliverable URLs (Drive, Dropbox, Vimeo) for brand review.
   - Brands review assets and click **"Approve & Release Escrow"** which instantly deposits funds into the creator's wallet.

5. **Monetization Dashboard & Wallet (`#wallet`)**:
   - 4 Live KPI Cards: *Available for Payout, Held in Escrow, Lifetime Total Earned, Completed Collabs*.
   - Interactive 6-month revenue trajectory chart.
   - Full ledger table of all financial transactions (Brand Deal Payouts, Viewer Tips, Content Unlocks, Withdrawals).
   - **Withdraw Funds Modal**: Simulate payouts via Stripe Direct Deposit, PayPal, or Wise.

---

## 💾 LocalStorage Persistence

Every user action is saved to the browser's `localStorage` and restored automatically across refreshes:
- `verve_creators_v1`: All creator profiles, portfolio case studies, and service packages.
- `verve_posts_v1`: Content feed drops, likes, tips, unlocked states, and comments.
- `verve_deals_v1`: Active proposals, milestone steps, escrow statuses, and deliverables.
- `verve_transactions_v1`: Credit and debit ledger entries.
- `verve_active_role_v1`: Active viewpoint ('creator' or 'brand').
- `verve_saved_creators_v1`: Saved/bookmarked creator IDs.

> 💡 **Reset Demo Data**: Click the "Reset Demo Data" button in the footer at any time to restore the starter dataset.

---

## 🚀 Running Locally

The local server is already running:
```bash
node server.js
```
Open **[http://localhost:3000/](http://localhost:3000/)** in your web browser.

To run the automated 34-point simulation test suite:
```bash
node tests/test_simulation.js
```
