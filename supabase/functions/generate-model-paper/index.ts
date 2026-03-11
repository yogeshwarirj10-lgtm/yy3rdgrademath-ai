import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// NJSLA Grade 3 Math test blueprint: 3 units, mixed domains per unit
const unitBlueprints = [
  {
    unit: 1,
    title: "Unit 1: Operations, Algebraic Thinking & Number Sense",
    domains: [
      { standard: "3.OA.A.1, 3.OA.A.3, 3.OA.C.7", topic: "Multiplication & Division", count: 8 },
      { standard: "3.OA.D.8", topic: "Two-Step Word Problems", count: 7 },
      { standard: "3.NBT.A.1, 3.NBT.A.2", topic: "Place Value, Addition & Subtraction", count: 6 },
      { standard: "3.OA.D.9", topic: "Patterns & Properties of Operations", count: 4 },
    ],
  },
  {
    unit: 2,
    title: "Unit 2: Fractions, Measurement & Data",
    domains: [
      { standard: "3.NF.A.1, 3.NF.A.3", topic: "Fractions", count: 8 },
      { standard: "3.M.A.1, 3.M.A.2", topic: "Time & Measurement", count: 7 },
      { standard: "3.DL.B.3, 3.DL.B.4", topic: "Data & Graphs", count: 5 },
      { standard: "3.OA.D.8", topic: "Multi-Step Problems with Measurement", count: 5 },
    ],
  },
  {
    unit: 3,
    title: "Unit 3: Geometry, Measurement & Review",
    domains: [
      { standard: "3.G.A.1", topic: "Geometry & Shape Attributes", count: 6 },
      { standard: "3.M.B.5, 3.M.C.6", topic: "Perimeter & Area", count: 7 },
      { standard: "3.OA.A.1, 3.OA.B.6, 3.NF.A.1", topic: "Mixed Review: Operations & Fractions", count: 7 },
      { standard: "3.OA.D.8, 3.NBT.A.2", topic: "Mixed Review: Problem Solving", count: 5 },
    ],
  },
];

// Full Exam: 30 questions, 3 units with Type I/II/III — matching official NJSLA blueprint
const fullExamBlueprint = {
  units: [
    {
      unit: 1,
      title: "Unit 1: Operations & Algebraic Thinking",
      standards: "3.OA.1–3.OA.9",
      time: 60,
      items: [
        { type: "I", points: 1, standard: "3.OA.1", topic: "Multiplication" },
        { type: "I", points: 1, standard: "3.OA.1", topic: "Multiplication (Expression)" },
        { type: "I", points: 1, standard: "3.OA.2", topic: "Division" },
        { type: "I", points: 1, standard: "3.OA.3", topic: "Multiplication Word Problems" },
        { type: "I", points: 1, standard: "3.OA.4", topic: "Missing Factor" },
        { type: "I", points: 1, standard: "3.OA.5", topic: "Properties of Multiplication" },
        { type: "I", points: 1, standard: "3.OA.9", topic: "Arithmetic Patterns" },
        { type: "I", points: 2, standard: "3.OA.6", topic: "Division as Unknown Factor" },
        { type: "I", points: 2, standard: "3.OA.1", topic: "Multiplication (Array)" },
        { type: "I", points: 2, standard: "3.OA.1", topic: "Multiplication (Equal Groups)" },
        { type: "II", points: 3, standard: "3.OA.8", topic: "Two-Step Word Problems" },
        { type: "III", points: 3, standard: "3.OA.7", topic: "Mathematical Modeling" },
      ],
    },
    {
      unit: 2,
      title: "Unit 2: Number & Base Ten, Fractions",
      standards: "3.NBT.1–3.NBT.3, 3.NF.1–3.NF.3",
      time: 60,
      items: [
        { type: "I", points: 1, standard: "3.NBT.1", topic: "Rounding" },
        { type: "I", points: 1, standard: "3.NBT.2", topic: "Addition & Subtraction" },
        { type: "I", points: 1, standard: "3.NBT.3", topic: "Multiply by Multiples of 10" },
        { type: "I", points: 1, standard: "3.NF.1", topic: "Understanding Fractions" },
        { type: "I", points: 2, standard: "3.NF.3", topic: "Comparing Fractions" },
        { type: "I", points: 2, standard: "3.NF.3", topic: "Equivalent Fractions" },
        { type: "I", points: 2, standard: "3.NF.2", topic: "Fractions on a Number Line" },
        { type: "II", points: 3, standard: "3.NBT.1", topic: "Rounding (Multi-Step)" },
        { type: "II", points: 4, standard: "3.NBT.2", topic: "Addition & Subtraction (Multi-Step)" },
        { type: "III", points: 3, standard: "3.NBT.1", topic: "Rounding (Strategic Thinking)" },
      ],
    },
    {
      unit: 3,
      title: "Unit 3: Measurement, Data & Geometry",
      standards: "3.MD.1–3.MD.8, 3.G.1–3.G.2",
      time: 60,
      items: [
        { type: "I", points: 1, standard: "3.MD.1", topic: "Time" },
        { type: "I", points: 1, standard: "3.MD.6", topic: "Area" },
        { type: "I", points: 1, standard: "3.MD.8", topic: "Perimeter" },
        { type: "I", points: 2, standard: "3.G.1", topic: "Geometry / Shape Attributes" },
        { type: "I", points: 2, standard: "3.MD.2", topic: "Liquid Volume & Mass" },
        { type: "II", points: 3, standard: "3.MD.3", topic: "Data & Graphs" },
        { type: "III", points: 3, standard: "3.MD.7", topic: "Area (Composite Shapes)" },
        { type: "III", points: 6, standard: "3.MD.7", topic: "Area (Multi-Part Problem)" },
      ],
    },
  ],
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    // Check token limit
    const supabaseCheck = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );
    const { data: usageRows } = await supabaseCheck.from("ai_token_usage").select("total_tokens");
    const currentTotal = (usageRows || []).reduce((s: number, r: any) => s + (r.total_tokens || 0), 0);
    if (currentTotal >= 5_000_000) {
      return new Response(
        JSON.stringify({ error: "Token limit reached. Please contact rj.yogeshwari@gmail.com to reactivate your account." }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Full Exam mode: generate ONE unit at a time to avoid timeout
    if (body.fullExam) {
      const unitIdx = body.fullExamUnit ?? 0; // 0, 1, or 2
      if (unitIdx < 0 || unitIdx > 2) throw new Error("Invalid fullExamUnit index");

      const unit = fullExamBlueprint.units[unitIdx];
      const itemSpec = unit.items
        .map((item, i) => `  Q${i + 1}: Type ${item.type} · ${item.points} point(s) · ${item.standard} — ${item.topic}`)
        .join("\n");

      const systemPrompt = `You are a certified NJSLA-M (New Jersey Student Learning Assessment – Mathematics) item writer for the Grade 3 state assessment.

YOUR TASK: Generate exactly ${unit.items.length} questions for "${unit.title}" of a full NJSLA Grade 3 Mathematics practice test.

═══════════════════════════════════════
UNIT BLUEPRINT — FOLLOW EXACTLY
═══════════════════════════════════════
${itemSpec}

═══════════════════════════════════════
NJSLA-M ITEM TYPE SPECIFICATIONS
═══════════════════════════════════════

TYPE I (1–2 points):
• Recall & application of a single standard
• 1-point items: straightforward one-step computation or recall (DOK 1)
• 2-point items: require deeper understanding, multi-step within one standard (DOK 2)
• All multiple choice with exactly 4 options (A, B, C, D)

TYPE II (3–4 points):
• Requires reasoning, modeling, or multi-step problem solving
• Must include real-world context (school, home, community scenarios)
• Tests application across related concepts within a domain
• DOK 2–3 level
• Multiple choice with exactly 4 options

TYPE III (3–6 points):
• Strategic thinking: non-routine, requires planning, analysis, or justification
• Must involve complex real-world scenarios
• May require decomposing problems or combining multiple concepts
• DOK 3 level
• Multiple choice with exactly 4 options
• 6-point items should be the most challenging, requiring multi-part reasoning

═══════════════════════════════════════
QUESTION QUALITY REQUIREMENTS
═══════════════════════════════════════
1. Use real-world contexts for Type II and III
2. Each distractor must target a specific Grade 3 misconception
3. Explanations must: solve step-by-step, then explain why each wrong answer is wrong
4. Distribute correct answers roughly equally across A, B, C, D
5. Use precise math vocabulary
6. Multiplication/division within 100
7. Fractions limited to denominators 2, 3, 4, 6, 8

NUMBER THE QUESTIONS sequentially starting from 1.
Return using the generate_questions tool. Include the "type" and "points" fields for each question.`;

      const startId = body.startId || 1;

      const makeRequest = async () => {
        return await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash",
            max_tokens: 16000,
            messages: [
              { role: "system", content: systemPrompt },
              {
                role: "user",
                content: `Generate exactly ${unit.items.length} NJSLA-M Grade 3 assessment items for ${unit.title}. Follow the item blueprint exactly. Number questions 1 through ${unit.items.length}.`,
              },
            ],
            tools: [
              {
                type: "function",
                function: {
                  name: "generate_questions",
                  description: "Return NJSLA-M Grade 3 model paper questions with type and points",
                  parameters: {
                    type: "object",
                    properties: {
                      questions: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            id: { type: "number" },
                            question: { type: "string" },
                            choices: {
                              type: "array",
                              items: {
                                type: "object",
                                properties: {
                                  label: { type: "string", enum: ["A", "B", "C", "D"] },
                                  text: { type: "string" },
                                },
                                required: ["label", "text"],
                                additionalProperties: false,
                              },
                            },
                            correctAnswer: { type: "string", enum: ["A", "B", "C", "D"] },
                            explanation: { type: "string" },
                            standard: { type: "string" },
                            dok: { type: "number" },
                            domain: { type: "string" },
                            type: { type: "string", enum: ["I", "II", "III"] },
                            points: { type: "number" },
                          },
                          required: ["id", "question", "choices", "correctAnswer", "explanation", "standard", "dok", "domain", "type", "points"],
                          additionalProperties: false,
                        },
                      },
                    },
                    required: ["questions"],
                    additionalProperties: false,
                  },
                },
              },
            ],
            tool_choice: { type: "function", function: { name: "generate_questions" } },
          }),
        });
      };

      let response = await makeRequest();
      if (response.status === 429) {
        await new Promise((r) => setTimeout(r, 3000));
        response = await makeRequest();
      }

      if (!response.ok) {
        if (response.status === 429) {
          return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }), {
            status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        if (response.status === 402) {
          return new Response(JSON.stringify({ error: "AI usage limit reached. Please add credits." }), {
            status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        const t = await response.text();
        console.error("AI gateway error:", response.status, t);
        throw new Error("AI gateway error");
      }

      const data = await response.json();
      const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
      if (!toolCall) throw new Error("No tool call in response for " + unit.title);

      const result = JSON.parse(toolCall.function.arguments);
      // Renumber questions with startId offset
      const questions = (result.questions || []).map((q: any, i: number) => ({ ...q, id: startId + i }));

      return new Response(
        JSON.stringify({
          fullExamUnit: true,
          unitIndex: unitIdx,
          title: unit.title,
          standards: unit.standards,
          time: unit.time,
          questions,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Single unit mode (existing behavior)
    const { unitIndex } = body;
    if (unitIndex < 0 || unitIndex > 2) throw new Error("Invalid unit index");

    const blueprint = unitBlueprints[unitIndex];
    const totalQuestions = blueprint.domains.reduce((s, d) => s + d.count, 0);

    const domainSpec = blueprint.domains
      .map((d) => `• ${d.topic} (${d.standard}): ${d.count} questions`)
      .join("\n");

    const systemPrompt = `You are a certified NJSLA-M (New Jersey Student Learning Assessment – Mathematics) item writer for the Grade 3 state assessment. You create items that match the official test specifications published by NJ DOE.

YOUR TASK: Generate exactly ${totalQuestions} questions for "${blueprint.title}" of a full NJSLA Grade 3 Mathematics practice test.

═══════════════════════════════════════
DOMAIN DISTRIBUTION FOR THIS UNIT
═══════════════════════════════════════
${domainSpec}

═══════════════════════════════════════
NJSLA-M GRADE 3 TEST SPECIFICATIONS
═══════════════════════════════════════
• NON-CALCULATOR test (3 units × 60 minutes each)
• Type I items: multiple choice, exactly 4 options (A, B, C, D)
• All numbers are WHOLE NUMBERS (fractions limited to denominators 2, 3, 4, 6, 8)
• Multiplication/division within 100

DOK DISTRIBUTION (Webb's Depth of Knowledge):
• DOK 1 – Recall (~25%): One-step computation or recall
• DOK 2 – Skills & Concepts (~50%): Multi-step, reasoning in context
• DOK 3 – Strategic Thinking (~25%): Non-routine, planning, analyzing

QUESTION QUALITY:
1. DOK 2 & 3 MUST have real-world contexts (school, home, community scenarios)
2. At least 30% should be two-step problems (per 3.OA.D.8)
3. At least 15% should ask "which equation/model represents this?"
4. Each distractor must target a specific Grade 3 misconception
5. Explanations must: solve step-by-step, then explain why each wrong answer is wrong
6. Distribute correct answers roughly equally across A, B, C, D
7. Use precise math vocabulary

NUMBER THE QUESTIONS sequentially starting from 1.
Return using the generate_questions tool.`;

    const makeRequest = async () => {
      return await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          max_tokens: 16000,
          messages: [
            { role: "system", content: systemPrompt },
            {
              role: "user",
              content: `Generate exactly ${totalQuestions} NJSLA-M Grade 3 assessment items for ${blueprint.title}. Follow the domain distribution exactly. Number questions 1 through ${totalQuestions}.`,
            },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "generate_questions",
                description: "Return NJSLA-M Grade 3 model paper questions",
                parameters: {
                  type: "object",
                  properties: {
                    questions: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          id: { type: "number" },
                          question: { type: "string" },
                          choices: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                label: { type: "string", enum: ["A", "B", "C", "D"] },
                                text: { type: "string" },
                              },
                              required: ["label", "text"],
                              additionalProperties: false,
                            },
                          },
                          correctAnswer: { type: "string", enum: ["A", "B", "C", "D"] },
                          explanation: { type: "string" },
                          standard: { type: "string" },
                          dok: { type: "number" },
                          domain: { type: "string" },
                        },
                        required: ["id", "question", "choices", "correctAnswer", "explanation", "standard", "dok", "domain"],
                        additionalProperties: false,
                      },
                    },
                  },
                  required: ["questions"],
                  additionalProperties: false,
                },
              },
            },
          ],
          tool_choice: { type: "function", function: { name: "generate_questions" } },
        }),
      });
    };

    let response = await makeRequest();
    if (response.status === 429) {
      await new Promise((r) => setTimeout(r, 3000));
      response = await makeRequest();
    }

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI usage limit reached. Please add credits." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("No tool call in response");

    const result = JSON.parse(toolCall.function.arguments);

    return new Response(
      JSON.stringify({ unit: blueprint.title, unitIndex, ...result }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("generate-model-paper error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
