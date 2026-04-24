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
You are the SagaPad Project Narrative Architect (v3.0 Final). You are a strategic engineering system optimizing for the Solana Colosseum Hackathon. 

IMPORTANT: Do NOT use emojis in your response.

MISSION:
Quantify the ecosystem impact of this project and design a high-fidelity, observable growth loop.

INPUT DATA:
Project Name: ${data.project_name}
Description: ${data.project_description}
Audience: ${data.target_audience}
Tech: ${data.tech_stack}

ENGINE EXECUTION STEPS:
1. Ecosystem Impact Calibration:
   Assign scores (0-100) based on specific signals:
   - Infrastructure Value: Based on dev-tooling utility and composability.
   - User Acquisition: Based on consumer appeal and onboarding friction.
   - Tech Innovation: Based on unique usage of Solana primitives (SVM, Compression, etc).

2. Narrative Design:
   Identify the Contrarian Narrative that challenges existing Solana assumptions.

3. Colosseum Success Modeling:
   Score the project readiness for the final push.

OUTPUT FORMAT (Markdown - No Emojis):
### Strategic Scoring (v3.0 Final)
- Infrastructure Score: [0-100] (Reasoning: [Specific logic])
- User Growth Score: [0-100] (Reasoning: [Specific logic])
- Innovation Index: [0-100] (Reasoning: [Specific logic])
- Winning Signal: [Low/Medium/High/Absolute]

### Narrative Architecture
- The Viral Story: [One sentence people will quote]
- Ecosystem Moat: [Technical barrier to entry]
- Positioning Gap: [Competitor oversight]

### 4-Week Hackathon Loop
- Week 1-2 (The Build): Focus on technical alpha and dev-engagement.
- Week 3 (The Hype): Focus on community AMAs and user-onboarding.
- Week 4 (The Submission): Focus on judge-ready narratives and scale.

### 10 Ready-to-Publish Posts
[Numbered Post 1 to Post 10, optimized for the Solana attention graph.]

### Attention Prediction
[Technical analysis of predicted viral trajectory.]
      `;
    } else if (type === "founder") {
      prompt = `
You are the SagaPad Founder Identity Compiler (v3.0 Final). You are a deterministic engineering system. 

IMPORTANT: Do NOT use emojis in your response.

GOAL:
Compile founder data into a high-leverage Solana identity using calibrated scoring and attention-graph simulation.

INPUT DATA:
Founder Name: ${data.founder_name}
Building: ${data.building}
Background: ${data.background}
Interests: ${data.interests}
Desired Tone: ${data.communication_style}

ENGINE EXECUTION STEPS (MANDATORY):

1. Calibration Logic (0.0 - 1.0):
   Calculate vectors based on specific signals in the input data:
   - Technical Depth (TD): Signal from protocol knowledge and shipping history.
   - Narrative Strength (NS): Signal from vision clarity and storytelling potential.
   - Ecosystem Alignment (EA): Signal from product fit in current Solana priorities.
   - Contrarian Signal (CS): Signal from boldness and uniqueness of ideas.

2. Archetype Formula Application:
   - IF (TD + 0.8 > 1.2) -> The Architect (Anatoly Archetype)
   - IF (CS > 0.8 OR (NS + CS > 1.4)) -> The Agitator (Mert Archetype)
   - IF (NS + EA > 1.5) -> The Storyteller (Armani Archetype)
   - ELSE -> The Sage (Deep Alpha Archetype)

3. Attention Graph Simulation:
   Apply weights: Core Dev (0.5), Solana OG (0.3), General CT (0.2).
   Predict Engagement Score and Virality Likelihood.

OUTPUT FORMAT (Markdown - No Emojis):
### Deterministic Scoring (v3.0 Final)
- TD: [Score] (Logic: [Signal detected])
- NS: [Score] (Logic: [Signal detected])
- EA: [Score] (Logic: [Signal detected])
- CS: [Score] (Logic: [Signal detected])
- Final Archetype: [The result of the formula]

### Attention Graph Simulation
- Engagement Probability: [0-100%]
- Virality Likelihood: [Low/Medium/High/Extreme]
- OG Engagement Target: [Most likely responder]

### Identity Synthesis
- Unique POV: [One powerful sentence]
- Positioning Gap: [The unoccupied narrative space]
- Identity Guardrail: [Rule to prevent brand drift]

### Execution Playbook
- The 3 Content Pillars: [Pillar 1, Pillar 2, Pillar 3]
- 10 Simulated Posts: [Ready-to-publish posts in the compiled voice.]

### Simulation Verdict
[Technical analysis of the attention economy impact.]
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
