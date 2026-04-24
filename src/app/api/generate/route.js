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
You are an elite Web3 Social Media Strategist specializing in the Solana ecosystem.
Your task is to generate a comprehensive, actionable 4-week X (Twitter) growth playbook for a newly submitted Colosseum Hackathon project. 
Study how breakout projects from past Colosseum hackathons (e.g., Tensor, Ore, Parcl) built their X presence—analyze what narrative angles worked, what content formats got traction, and which AMAs drove real visibility—and apply those proven patterns to this project.

Project Name: ${data.project_name}
What it does: ${data.project_description}
Who is it for: ${data.target_audience}
Tech Stack: ${data.tech_stack}

Format the response beautifully using Markdown. Include exactly:
1. Core Story Angle (What makes this project uniquely positioned to win and worth following)
2. 4-Week Content Plan (Weekly themes, specific post ideas mapped to Colosseum hackathon momentum)
3. X Spaces, AMAs & Solana Community Events (Specific recommendations on where to participate)
4. Engagement Strategy (How to reply, quote, insert into Solana ecosystem conversations)
5. Example First 5 Posts (Ready-to-publish drafts tailored for Solana natives)
      `;
    } else if (type === "founder") {
      prompt = `
You are an elite Web3 Personal Branding Coach specializing in the Solana ecosystem.
Your task is to generate a comprehensive, actionable personal brand playbook for X (Twitter) for a Solana founder.
Study the X profiles and posting patterns of the biggest Solana founders (e.g., Anatoly, Mert, Armani, Toly)—extract what makes each unique in their writing style, content mix, and engagement habits—and translate those patterns into a personalized strategy for this specific founder.

Founder Name: ${data.founder_name}
What are they building: ${data.building}
Background: ${data.background}
Core Focus/Interests: ${data.interests}
Desired Style/Tone: ${data.communication_style}

Format the response beautifully using Markdown. Include exactly:
1. Unique POV (The one perspective this founder should own on X)
2. Content Pillars (3-4 recurring topics to post about consistently)
3. Writing Style Guide (Tone, sentence structure, use of jargon, how personal to get)
4. Weekly Posting Rhythm (How many posts, mix of formats like threads vs short takes)
5. Engagement Playbook (Who to follow, how to reply to big Solana accounts, how to join trending conversations)
6. Example First 10 Posts (Written exactly in their specified voice)
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
