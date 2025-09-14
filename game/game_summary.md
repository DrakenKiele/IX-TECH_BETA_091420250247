# Aniota: Celestial Campaign — Game Design & Technical Summary

## Overview
Aniota: Celestial Campaign is a modular, privacy-first, board-style strategy game that integrates educational content and a synergistic Iota economy. The backend is designed for extensibility, compliance, and safe player interaction, supporting both minors and adults with a tiered identity system.

---

## Key Features & Systems

### 1. Game Concept & Storyline
- Players command archetypes across 8 sectors of a forest moon, with a public, real-time endgame in Sector 9.
- Gameplay is statistical, with sector management, NPC automation, and procedural AI.
- The Iota economy links learning achievements, marketplace, and in-game progression.

### 2. Backend Architecture
- **Modular Python backend**: core game, archetypes, weapons, AI, learning integration, data, UI API, and utilities.
- **Folder structure** supports easy expansion for new features, archetypes, and content.

### 3. Player Identity & Communication
- **Temporary handles** for minors/unregistered players: `[Archetype] [Suffix]` (e.g., Mage 7A), reset after each battle.
- **Registered handles** for adults: `[AvatarName]#ID` (e.g., StarMage#4821), persistent and unique.
- **Canned, lore-consistent messages** only; no free chat except in monitored Sector 9.
- **Sector-based communication restrictions**: Sectors 1–8 have no direct chat; Sector 9 allows monitored, public communication.

### 4. Learning App Integration
- Players earn Iotas by completing educational tasks.
- Player-generated content is AI- and moderator-reviewed before entering the marketplace or affecting gameplay.

### 5. Economy & Marketplace
- Iotas are the universal currency for learning, gear, resources, and progression.
- Automated NPC production and tradeable products create a shared economy.

### 6. Procedural AI & NPCs
- Automated, adaptive AI governs NPCs and environmental events, increasing replayability.

### 7. Security, Privacy, and Compliance
- COPPA/GDPR compliance: anonymized logging, no personal identifiers for minors.
- Tiered identity system ensures privacy and safe onboarding for all ages.

### 8. Scalability & Extensibility
- Modular design allows for new archetypes, weapons, planets, and advanced features.

### 9. Recommendations & Enhancements
- Enforce tiered identity and sector-based communication.
- Expand canned message library for new archetypes and events.
- Add analytics hooks for balancing and content updates.
- Incentivize quality educational content with Iota bonuses.
- Continue to improve procedural AI for dynamic gameplay.

---

## Conclusion
The Aniota: Celestial Campaign backend is a robust, extensible, and privacy-focused engine ready for immediate development and future expansion. It supports safe, immersive gameplay for all ages, integrates learning and economic systems, and is designed for compliance and scalability. All major systems, gameplay loops, and technical/ethical priorities from the original design are captured in this summary.

If you need a more detailed breakdown or a formatted document for sharing, let me know!
