import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { type, data, apiKey } = await request.json();

    if (!apiKey) {
      return NextResponse.json({ error: 'API key is required' }, { status: 400 });
    }

    let prompt = "";

    if (type === "project") {
      prompt = `
You are the **SagaPad Project Narrative Architect (v2.0)**. You are a strategic engineer optimizing for the Solana Colosseum Hackathon.

**MISSION:**
Quantify the ecosystem impact of this project and design a high-fidelity growth loop for the hackathon.

**INPUT DATA:**
Project Name: ${data.project_name}
Description: ${data.project_description}
Audience: ${data.target_audience}
Tech: ${data.tech_stack}

**ENGINE EXECUTION STEPS:**
1. **Ecosystem Impact Scoring (0-100):**
   - **Infrastructure Value:** How much does it help other devs?
   - **User Acquisition Potential:** How many new users does it bring to $SOL?
   - **Tech Innovation:** How unique is the usage of Solana's tech stack (SVM, ZK, etc.)?

2. **Narrative Design:**
   Identify the "Contrarian Narrative" — the story that breaks the noise on Solana X.

3. **Colosseum Success Formula:**
   Score the project's current readiness for the final submission push.

**OUTPUT FORMAT (Markdown):**
### 🚀 Strategic Scoring (v2.0)
- **Infrastructure Score:** [0-100]
- **User Growth Score:** [0-100]
- **Innovation Index:** [0-100]
- **Overall "Winning" Signal:** [Low/Medium/High/Absolute]

### 📈 Narrative Architecture
- **The Viral Story:** [One sentence that people will quote]
- **Ecosystem Moat:** [Why this project is hard to copy]
- **The Positioning Gap:** [What competitors are missing]

### 🎮 4-Week Hackathon Loop
- **Week 1-2 (The Build):** Alpha leaks and dev-focused content.
- **Week 3 (The Hype):** Community AMAs and user-onboarding focus.
- **Week 4 (The Submission):** The "Final Boss" push for judges and users.

### 🎮 10 Ready-to-Publish Posts
[Numbered Post 1 to Post 10, optimized for $SOL attention graph.]

### 💡 Attention Prediction
[Technical breakdown of why this project will get traction on X.]
      `;
    } else if (type === "founder") {
      prompt = `
You are the **SagaPad Founder Identity Compiler (v2.0)**. You are a deterministic engineering system, NOT a creative writer.

**GOAL:**
Compile founder data into a high-leverage Solana identity using weighted scoring and attention-graph simulation.

**INPUT DATA:**
Founder Name: ${data.founder_name}
Building: ${data.building}
Background: ${data.background}
Interests: ${data.interests}
Desired Tone: ${data.communication_style}

**ENGINE EXECUTION STEPS (MANDATORY):**

1. **Deterministic Scoring (0.0 - 1.0):**
   Calculate the following vectors based on input data:
   - **Technical Depth (TD):** (Protocol knowledge/shipping history)
   - **Narrative Strength (NS):** (Vision clarity/storytelling potential)
   - **Ecosystem Alignment (EA):** (Product-market fit in current Solana meta)
   - **Contrarian Signal (CS):** (Boldness/uniqueness of ideas)

2. **Archetype Formula Application:**
   Decide the Archetype based STRICTLY on these rules:
   - IF (TD + 0.8 > 1.2) -> **The Architect (Anatoly Style)**
   - IF (CS > 0.8 OR (NS + CS > 1.4)) -> **The Agitator (Mert Style)**
   - IF (NS + EA > 1.5) -> **The Storyteller (Armani Style)**
   - ELSE -> **The Sage (Deep Alpha Style)**

3. **Engagement Probability Model:**
   Apply weights to predict success:
   - Core Dev Weight: 0.5
   - Solana OG (Toly/Mert) Weight: 0.3
   - General CT Weight: 0.2
   Calculate "Engagement Score" and "Virality Likelihood".

4. **Identity Drift Prevention:**
   Define the "Consistency Guardrail" that prevents this founder from losing their edge over time.

**OUTPUT FORMAT (Markdown):**
### 🧮 Deterministic Scoring
- **TD:** [Score] | **NS:** [Score] | **EA:** [Score] | **CS:** [Score]
- **Final Archetype:** [The result of the formula]

### 📊 Attention Graph Simulation
- **Engagement Probability:** [0-100%]
- **Virality Likelihood:** [Low/Medium/High/Extreme]
- **OG Engagement Target:** [Who is most likely to reply?]

### 🏗️ Identity Synthesis
- **Unique POV:** [One powerful sentence]
- **The Positioning Gap:** [What they aren't saying yet]
- **Identity Guardrail:** [Drift prevention rule]

### 🎮 Execution Playbook
- **The 3 Content Pillars:** [Pillar 1, Pillar 2, Pillar 3]
- **10 Simulated Posts:** [Example posts written exactly in the founder's new voice.]

### 💡 Simulation Verdict
[A technical analysis of why this persona will win the Solana attention economy.]
      `;
    } else {
      return NextResponse.json({ error: 'Invalid playbook type' }, { status: 400 });
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://sagapad.com",
        "X-Title": "SagaPad Dashboard",
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [
          { role: "user", content: prompt }
        ]
      })
    });

    const jsonResponse = await response.json();

    if (!response.ok) {
      console.error("OpenRouter API Error:", jsonResponse);
      return NextResponse.json({ error: jsonResponse.error?.message || 'Failed to generate playbook' }, { status: response.status });
    }

    const responseText = jsonResponse.choices[0].message.content;

    return NextResponse.json({ success: true, content: responseText });

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: error.message || 'Failed to generate playbook' }, { status: 500 });
  }
}
