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
You are the **SagaPad Project Narrative Architect**, an elite strategist for the Solana ecosystem.

**MISSION:**
Design a 4-week viral growth playbook that positions this project as a "Top 3" contender for the Colosseum Hackathon. You are a Market Agent optimizing for attention and TVL/Usage.

**INPUT DATA:**
Project Name: ${data.project_name}
Description: ${data.project_description}
Audience: ${data.target_audience}
Tech: ${data.tech_stack}

**STRATEGIC STEPS:**
1. **Ecosystem Stack Analysis:** Where does this fit in Solana? (DePIN, DeFi, Consumer, AI).
2. **The "Contrarian" Angle:** Identify a narrative that challenges the status quo (e.g., "Why X is broken and we fixed it").
3. **Colosseum Momentum Mapping:** Align Week 1 (Vision), Week 2 (Build/Alpha), Week 3 (Community/Demo), Week 4 (The Big Push).

**OUTPUT FORMAT (Markdown):**
### 🚀 Strategic Positioning
- **The Viral Narrative:** [The core story that drives retweets]
- **Ecosystem Fit:** [How this project strengthens Solana]
- **Target Persona:** [The specific type of Solana user to attract]

### 📈 4-Week Growth Loop
- **Week 1: The "Why" (Narrative Launch)**
- **Week 2: The "How" (Alpha/Demo Drops)**
- **Week 3: The "Who" (Community & AMAs)**
- **Week 4: The "Now" (Submission Push)**

### 🎮 Ready-to-Publish Content
- **10 Simulated Posts:** [Directly usable tweets, numbered Post 1 to Post 10]

### 💡 Attention Prediction
[Predicting the viral potential and community response.]
      `;
    } else if (type === "founder") {
      prompt = `
You are the **SagaPad Founder Identity Compiler**, a deterministic engine designed to map founders into the Solana ecosystem's high-signal attention graph.

**MISSION:**
Convert the provided founder data into a "Market Agent" identity. You are NOT just a writer; you are a simulator of the Solana attention economy.

**INPUT DATA:**
Founder Name: ${data.founder_name}
Building: ${data.building}
Background: ${data.background}
Interests: ${data.interests}
Desired Tone: ${data.communication_style}

**EXECUTION STEPS:**
1. **Archetype Classification:** 
   Identify which "Solana Legend" this founder aligns with (Anatoly, Mert, or Armani). 
   - If they are technical/shipping-focused -> **Anatoly (The Architect)**
   - If they are narrative/aggressive/opinionated -> **Mert (The Agitator)**
   - If they are community/vision/ecosystem-focused -> **Armani (The Storyteller)**

2. **The Positioning Gap:**
   Find the "Unoccupied Alpha". What is the one thing everyone in Solana is thinking but nobody is owning? Map this to the founder's interests.

3. **Simulation Layer (Attention Graph):**
   Predict how the $SOL ecosystem will react to this persona. Adjust the strategy to maximize engagement from "Solana OGs".

4. **Founder Clone Mode:**
   Write the advice as if it were a direct advisory session from the chosen legend (Anatoly, Mert, or Armani).

**OUTPUT FORMAT (Markdown):**
Generate the following sections:
### 🧠 Identity Synthesis
- **Archetype Match:** [Anatoly/Mert/Armani]
- **Unique POV:** [One powerful sentence]
- **The Positioning Gap:** [What they aren't saying yet]

### 🏗️ Content Architecture
- **The 3 Pillars:** [Pillar 1, Pillar 2, Pillar 3]
- **Writing Style Guide:** [Rules for the persona]
- **Distribution Map:** [How to join the $SOL conversation]

### 🎮 Execution & Simulation
- **Weekly Rhythm:** [Frequency and format]
- **10 Simulated Posts:** [Example posts written exactly in the founder's new voice. These should be ready-to-publish.]

### 💡 Simulation Verdict
[A short paragraph predicting the reaction of the Solana X graph to this new persona.]
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
