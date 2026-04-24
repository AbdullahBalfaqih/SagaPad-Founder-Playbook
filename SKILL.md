---
Name: sagapad-founder-playbook
Description: A deterministic Identity Compiler for Solana founders. It maps user inputs to high-leverage ecosystem archetypes (Anatoly, Mert, Armani) to generate a machine-readable 4-week brand strategy.
License: MIT
Compatibility: Requires Next.js 14+, OpenRouter API Access, and React 18+.
Metadata:
  Category: Colosseum Hackathon
  Logic-Type: Deterministic Persona Mapping
Allowed-tools: Bash Read
---

# 🧠 SagaPad Founder Identity Compiler

An elite Web3 Personal Branding Skill designed to transform raw founder data into a high-signal Solana ecosystem identity. Unlike generic content writers, this engine operates as a **Market Agent** in the attention economy.

## 📋 Input Schema (YAML)
```yaml
Founder:
  name: string
  product: string
  background: string
  interests: list[string]
  tone: "Builder" | "Researcher" | "Meme-driven" | "Contrarian"
```

## ⚙️ Engine Logic (Step-by-Step)

1. **Archetype Classification**:
   - Analyzes `tone` and `background` to categorize the founder into one of four Solana personas:
     - **The Architect**: Heavy technical focus, shipping-oriented (Anatoly style).
     - **The Agitator**: Aggressive POV, narrative-driven, zero-filter (Mert style).
     - **The Storyteller**: Ecosystem-wide vision, community-first (Armani style).
     - **The Sage**: Deep-tech researcher, long-form takes, alpha-heavy.

2. **Persona Mapping**:
   - Maps the founder's `interests` against current Solana ecosystem trends (LSTs, AI Agents, ZK, etc.).
   - Identifies the **"Positioning Gap"** — the specific topic the founder can "own" without direct competition.

3. **Simulation Layer**:
   - Simulates the X (Twitter) graph interaction.
   - Evaluates: "If this founder posts X, will $SOL-native accounts (Anatoly, Toly, etc.) engage?"

4. **Identity Synthesis**:
   - Generates a deterministic branding system.

## 📦 Output Spec (JSON Structure)
```json
{
  "identity": {
    "unique_pov": "The single perspective to own.",
    "archetype_match": "The mapped Solana founder archetype.",
    "positioning_gap": "What they are NOT saying yet."
  },
  "content_system": {
    "pillars": ["3-4 recurring topics"],
    "style_rules": ["Tone and structure constraints"],
    "distribution_strategy": "How to insert into Solana conversations."
  },
  "execution": {
    "weekly_rhythm": "Posting frequency and format mix.",
    "simulated_posts": ["Example posts written in the cloned voice."]
  }
}
```

## 🚀 Founder Clone Mode
When active, the engine adopts the specific advisory voice of:
- **Anatoly Yakovenko**: Technical, witty, low-time-preference.
- **Mert Mumtaz**: Direct, high-energy, narrative-aggressive.
- **Armani Ferrante**: Philosophical, ecosystem-storytelling.

## 🧪 Prompt Logic
Powered by GPT-4o-mini / Gemini 1.5 Flash. The prompt uses **Few-Shot Prompting** with real data from top Solana founders to ensure zero-shot generic outputs are minimized.
