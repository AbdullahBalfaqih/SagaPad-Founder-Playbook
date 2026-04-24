---
Name: sagapad-founder-playbook
Description: A high-fidelity Identity Engineering System for Solana founders. It uses a weighted scoring engine and engagement probability models to build and protect a deterministic ecosystem persona.
License: MIT
Compatibility: Requires Next.js 14+, OpenRouter API Access (LLM as a Reasoning Engine).
Metadata:
  Category: Colosseum Hackathon
  Logic-Type: Weighted Deterministic Scoring
  Feature: Identity Drift Prevention
Allowed-tools: Bash Read
---

# 🧠 SagaPad Founder Identity Compiler (v2.0 - Engineering Grade)

This is a **Deterministic Skill Engine** designed to compile founder data into a high-leverage Solana identity. It replaces AI guessing with a rigorous scoring model and attention-graph simulation.

## 🛠️ Deterministic Scoring Engine
The engine evaluates the input against four primary vectors (0-1 scale):
1. **Technical Depth (TD)**: Measured by background in protocol/dev research.
2. **Narrative Strength (NS)**: Measured by clarity of vision and storytelling.
3. **Ecosystem Alignment (EA)**: Measured by product fit within current Solana priorities.
4. **Contrarian Signal (CS)**: Measured by the uniqueness/boldness of the POV.

### ⚖️ Archetype Formulas:
- **IF (TD + Shipping_Focus > 1.2)** → **The Architect** (Anatoly Archetype)
- **IF (CS > 0.8 OR (NS + CS > 1.4))** → **The Agitator** (Mert Archetype)
- **IF (NS + EA > 1.5)** → **The Storyteller** (Armani Archetype)
- **ELSE** → **The Sage** (Deep Research Archetype)

## 📊 Simulation Layer (Engagement Probability Model)
The engine predicts interaction likelihood based on ecosystem attention weights:
- **Core Dev Engagement Weight**: 0.5
- **Solana OG (Toly/Mert) Weight**: 0.3
- **General Crypto Twitter (CT) Weight**: 0.2

### 📈 Metrics Output:
- **Engagement Probability Score**: Combined weighted likelihood of interaction.
- **Virality Likelihood**: Predictive score for "Retweet-ability" on the Solana graph.

## 🛡️ Identity Drift Prevention (Killer Feature)
A monitoring layer that evaluates content consistency.
- **Function**: Compares proposed content against the compiled Archetype.
- **Action**: Generates a "Drift Alert" if content exceeds a 0.3 variance from the core Identity System.

## 📦 Output Spec (Structured Schema)
```json
{
  "scores": { "TD": 0.0, "NS": 0.0, "EA": 0.0, "CS": 0.0 },
  "identity": {
    "archetype": "string",
    "unique_pov": "string",
    "positioning_gap": "string"
  },
  "simulation": {
    "engagement_score": 0.0,
    "virality_likelihood": 0.0,
    "target_og_engagement": "string"
  },
  "prevention": {
    "drift_boundary": "string",
    "consistency_rules": []
  }
}
```

## 🚀 System Boundary
- **What it IS**: A deterministic identity compiler and strategic evaluator.
- **What it IS NOT**: A generic chatbot, a basic content rewriter, or a general-purpose assistant. It is a specialized execution system for the Solana Attention Economy.
