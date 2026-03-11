import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Exact 2023 NJSLS-Mathematics Grade 3 standards text from nj.gov/education/standards/math/2023/3.shtml
const topicStandardsMap: Record<string, string> = {
  // ── Place Values & Number Sense ──
  "Place Values": `3.NBT.A.1 – Use place value understanding to round whole numbers to the nearest 10 or 100.
3.NBT.A – Understand that the three digits of a three-digit number represent amounts of hundreds, tens, and ones (e.g., 706 = 7 hundreds, 0 tens, 6 ones).`,
  "Comparing and Ordering Numbers": `3.NBT.A – Use place value understanding to compare and order multi-digit whole numbers using >, =, < symbols.`,
  "Numbers in Word Form": `3.NBT.A – Read and write multi-digit whole numbers in expanded form, word form, and standard form.`,
  "Roman Numerals": `Supporting Content – Read, interpret, and convert Roman numerals (I, V, X, L, C) to and from standard form.`,
  "Rounding Numbers": `3.NBT.A.1 – Use place value understanding to round whole numbers to the nearest 10 or 100.`,
  "Odd or Even": `Supporting Content – Determine whether a group of objects (up to 20) has an odd or even number of members; write an equation to express an even number as a sum of two equal addends.`,

  // ── Adding & Subtracting ──
  "Adding 4-Digit Numbers": `3.NBT.A.2 – With accuracy and efficiency, add within 1000 using strategies and algorithms based on place value, properties of operations, and/or the relationship between addition and subtraction. Extended to 4-digit numbers.`,
  "Adding 5-Digit Numbers": `3.NBT.A.2 extended – Add multi-digit whole numbers using place value strategies, regrouping across multiple places.`,
  "Subtracting 4-Digit Numbers": `3.NBT.A.2 – With accuracy and efficiency, subtract within 1000 using strategies and algorithms based on place value. Extended to 4-digit numbers with regrouping across zeros.`,
  "Subtracting 5-Digit Numbers": `3.NBT.A.2 extended – Subtract multi-digit whole numbers with regrouping across multiple place values.`,
  "Estimate Sums": `3.NBT.A.1 + 3.OA.D.8 – Round each addend to the nearest 10 or 100, then add to estimate. Assess reasonableness of answers using mental computation and estimation strategies.`,
  "Estimate Differences": `3.NBT.A.1 + 3.OA.D.8 – Round to the nearest 10 or 100, then subtract to estimate differences. Assess reasonableness.`,
  "Rounding and Estimating": `3.NBT.A.1 + 3.OA.D.8 – Round whole numbers to nearest 10 or 100 and use estimation to solve problems and check reasonableness of exact answers.`,
  "Adding Hundreds": `3.NBT.A.2, 3.NBT.A.3 – Add multiples of 100 using place value understanding and properties of operations.`,

  // ── Multiplication & Division ──
  "Multiplication by 0 to 3": `3.OA.A.1 – Interpret products of whole numbers, e.g., interpret 5 × 7 as the total number of objects in 5 groups of 7 objects each.
3.OA.C.7 – With accuracy and efficiency, multiply within 100. By end of Grade 3, know from memory all products of two one-digit numbers.
3.OA.A.3 – Use multiplication within 100 to solve word problems in situations involving equal groups, arrays, and measurement quantities.`,
  "Multiplication by 4 to 7": `3.OA.A.1, 3.OA.A.3, 3.OA.C.7 – Interpret products using equal groups and arrays. Fluently multiply within 100 (facts 4–7). Solve word problems involving equal groups and arrays.`,
  "Multiplication by 8 to 12": `3.OA.A.1, 3.OA.B.5, 3.OA.C.7 – Apply properties of operations (commutative, associative, distributive) as strategies to multiply. Fluently multiply within 100 (facts 8–12).`,
  "Division by 0 to 6": `3.OA.A.2 – Interpret whole-number quotients, e.g., interpret 56 ÷ 8 as the number of objects in each share when 56 objects are partitioned equally into 8 shares.
3.OA.B.6 – Understand division as an unknown-factor problem (find 32 ÷ 8 by finding the number that makes 32 when multiplied by 8).
3.OA.C.7 – Fluently divide within 100.`,
  "Division by 7 to 12": `3.OA.A.2, 3.OA.B.6, 3.OA.C.7 – Fluently divide within 100 (divisors 7–12). Understand division as partitioning and as an unknown-factor problem.`,
  "Dividing by Tens": `3.NBT.A.3 – Multiply one-digit whole numbers by multiples of 10 in the range 10–90. Apply inverse to divide by tens.`,
  "Divide and Multiply 3-Digit Numbers": `3.NBT.A.3 – Multiply one-digit whole numbers by multiples of 10 in the range 10–90 (e.g., 9 × 80, 5 × 60) using strategies based on place value and properties of operations.`,
  "Estimate Products": `3.OA.D.8 – Assess the reasonableness of products using mental computation and estimation strategies including rounding.`,
  "Missing Numbers": `3.OA.A.4 – Determine the unknown whole number in a multiplication or division equation relating three whole numbers (e.g., 8 × ? = 48, 5 = ? ÷ 3, 6 × 6 = ?).`,
  "Times Table": `3.OA.C.7 – By end of Grade 3, know from memory all products of two one-digit numbers. Fluently multiply and divide within 100.`,

  // ── Patterns & Algebraic Thinking ──
  "Repeating Patterns": `3.OA.D.9 – Identify arithmetic patterns (including patterns in the addition table or multiplication table) and explain them using properties of operations.`,
  "Growing Patterns": `3.OA.D.9 – Identify and extend growing patterns. Explain why a pattern works using properties of operations.`,
  "Patterns: Numbers": `3.OA.D.9 – Identify arithmetic patterns and explain them. For example, observe that 4 times a number is always even, and explain why 4 times a number can be decomposed into two equal addends.`,
  "Algebraic Thinking": `3.OA.D.8 – Solve two-step word problems using the four operations. Represent problems using equations with a letter standing for the unknown quantity. Assess reasonableness of answers using mental computation and estimation strategies.`,

  // ── Fractions ──
  "Fractions of a Number": `3.NF.A.1 – Understand a fraction 1/b as the quantity formed by 1 part when a whole is partitioned into b equal parts; understand a/b as the quantity formed by a parts of size 1/b. (Denominators limited to 2, 3, 4, 6, 8.)`,
  "Order Fractions": `3.NF.A.3d – Compare two fractions with the same numerator or same denominator by reasoning about their size. Record results with >, =, <. Recognize comparisons are valid only when referring to the same whole. (Denominators: 2, 3, 4, 6, 8.)`,
  "Simplifying Fractions": `3.NF.A.3b – Recognize and generate simple equivalent fractions (e.g., 1/2 = 2/4, 4/6 = 2/3). Explain why fractions are equivalent with support of a visual fraction model (tape diagrams, number lines, area models).`,
  "Improper Fractions": `3.NF.A.3c – Express whole numbers as fractions (3 = 3/1). Recognize fractions equivalent to whole numbers (6/1 = 6). Locate 4/4 and 1 at the same point on a number line.`,
  "Comparing Fractions": `3.NF.A.3d – Compare two fractions with the same numerator or the same denominator by reasoning about their size. Justify conclusions with a visual fraction model. (Denominators: 2, 3, 4, 6, 8.)`,
  "Add Fractions": `3.NF.A – Add fractions with like denominators using visual fraction models (tape diagrams, number lines, area models). (Denominators: 2, 3, 4, 6, 8.)`,
  "Subtract Fractions": `3.NF.A – Subtract fractions with like denominators using visual models. (Denominators: 2, 3, 4, 6, 8.)`,
  "Add and Subtract Fractions": `3.NF.A – Add and subtract fractions with like denominators in mixed operations using visual models.`,
  "Compare Sums and Differences of Fractions": `3.NF.A.3 – Compare sums and differences of fractions by reasoning about their size using visual models and number lines.`,
  "Add 3 or More Fractions": `3.NF.A – Add three or more fractions with like denominators. (Denominators: 2, 3, 4, 6, 8.)`,

  // ── Time & Money ──
  "Read Clocks": `3.M.A.1 – Tell and write time to the nearest minute using analog and digital clocks.`,
  "Telling Time": `3.M.A.1 – Tell and write time to the nearest minute and measure time intervals in minutes. Solve word problems involving addition and subtraction of time intervals in minutes (e.g., by representing the problem on a number line diagram).`,
  "Digital Clock": `3.M.A.1 – Read and interpret digital clock displays to the nearest minute.`,
  "Measurement – Time": `3.M.A.1 – Measure time intervals in minutes. Solve word problems involving addition and subtraction of time intervals in minutes, e.g., by representing the problem on a number line diagram.`,
  "Calendars": `3.M.A.1 – Use calendars to solve problems involving elapsed time across days, weeks, and months.`,
  "Money Amounts": `3.OA.D.8 – Solve problems involving dollar bills, quarters, dimes, nickels, and pennies using the four operations. (Whole-number answers only.)`,
  "Money: Word Problems": `3.OA.D.8 – Solve two-step word problems involving money using the four operations. Represent problems using equations with a letter for the unknown quantity.`,

  // ── Geometry ──
  "Identifying Angles": `3.G.A.1 – Understand that shapes may share attributes. Identify right angles, acute angles, and obtuse angles in two-dimensional figures.`,
  "Estimate Angle Measurements": `3.G.A – Estimate angle measurements by comparing to benchmark angles (right angle = 90°).`,
  "Measure Angles with a Protractor": `3.G.A – Use a protractor to measure angles in whole-number degrees.`,
  "Polygon Names": `3.G.A.1 – Recognize and name polygons by number of sides: triangle (3), quadrilateral (4), pentagon (5), hexagon (6), octagon (8).`,
  "Classify Triangles": `3.G.A.1 – Classify triangles by angles (right, acute, obtuse) and by sides (equilateral, isosceles, scalene). Understand that shapes in different categories may share attributes.`,
  "Parallel Sides in Quadrilaterals": `3.G.A.1 – Recognize rhombuses, rectangles, and squares as examples of quadrilaterals. Draw examples of quadrilaterals that do not belong to these subcategories. Identify parallel sides.`,
  "Identify Rectangles": `3.G.A.1 – Recognize rectangles and squares. Understand that squares are special rectangles with four equal sides and four right angles.`,
  "Missing Side Lengths": `3.M.C.6 – Solve problems involving perimeters of polygons, including finding an unknown side length given the perimeter.`,
  "Perimeter and Area of Squares": `3.M.B.5 + 3.M.C.6 – Relate area to multiplication (side × side for squares). Find perimeter by adding all side lengths. Distinguish between area and perimeter.`,
  "Perimeter and Area of Rectangles": `3.M.B.5.b + 3.M.C.6 – Multiply side lengths to find areas of rectangles with whole-number side lengths in context of real-world problems. Solve real-world problems involving perimeters of polygons.`,
  "Area or Missing Side Length of a Rectangle": `3.M.B.5 + 3.M.C.6 – Given area and one side, find missing side length. Exhibit rectangles with same perimeter and different areas or same area and different perimeters.`,
  "Word Problems": `3.M.C.6 + 3.OA.D.8 – Solve real-world and mathematical problems involving perimeters and areas of polygons. Two-step problems using equations with a letter for the unknown.`,

  // ── Measurement ──
  "Reference Measurement": `3.M.A.2 – Measure and estimate liquid volumes and masses of objects using standard units of grams (g), kilograms (kg), and liters (l). Use reference points for estimation.`,
  "Metric Length Measurement": `3.M.A.2 + 3.DL.B.4 – Measure lengths using metric units (centimeters, meters). Generate measurement data using rulers marked with halves and fourths.`,
  "Customary Length Measurement": `3.DL.B.4 – Generate measurement data by measuring lengths using rulers marked with halves and fourths of an inch. Show the data by making a line plot.`,
  "Metric Capacity Measurement": `3.M.A.2 – Measure and estimate liquid volumes using standard units of liters (l). Solve one-step word problems involving volumes given in the same units.`,
  "Customary Capacity Measurement": `3.M.A.2 – Measure and estimate liquid volumes using customary units (cups, pints, quarts, gallons).`,
  "Metric Weight and Mass Measurement": `3.M.A.2 – Measure and estimate masses of objects using standard units of grams (g) and kilograms (kg). Solve one-step word problems involving masses.`,
  "Customary Weight and Mass Measurement": `3.M.A.2 – Measure and estimate weights using customary units (ounces, pounds).`,

  // ── Data & Graphs ──
  "Bar Graph": `3.DL.B.3 – Draw a scaled bar graph to represent a data set with several categories. Solve one- and two-step "how many more" and "how many less" problems using information presented in scaled bar graphs. For example, draw a bar graph in which each square might represent 5 pets.`,
  "Tally and Pictographs": `3.DL.B.3 – Draw a scaled picture graph to represent a data set. Each picture may represent more than one object. Solve problems using information from pictographs.`,
  "Dot Plots": `3.DL.B.4 – Generate measurement data by measuring lengths using rulers marked with halves and fourths of an inch. Show the data by making a line plot (dot plot), where the horizontal scale is marked off in whole numbers, halves, or quarters.`,
  "Stem-and-Leaf Plot": `3.DL.B – Organize and interpret data using stem-and-leaf plots.`,

  // ── Symmetry & Transformations ──
  "Line Segments": `3.G.A – Identify and describe line segments as parts of lines with two endpoints.`,
  "Identify Lines of Symmetry": `3.G.A – Identify lines of symmetry in two-dimensional figures.`,
  "Count Lines of Symmetry": `3.G.A – Determine the number of lines of symmetry in regular and irregular polygons.`,
  "Parallel, Perpendicular and Intersecting Lines": `3.G.A – Identify and distinguish between parallel, perpendicular, and intersecting lines.`,

  // ── Three-Dimensional Figures ──
  "Identify Three-Dimensional Figures": `3.G.A.1 – Identify three-dimensional figures: cubes, rectangular prisms, spheres, cones, cylinders, pyramids. Understand that shapes may share attributes.`,
  "Count Vertices, Edges, and Faces": `3.G.A – Count and identify vertices, edges, and faces of three-dimensional figures.`,
  "Identify Faces of Three-Dimensional Figures": `3.G.A – Identify the shapes of faces of three-dimensional figures (e.g., a cube has 6 square faces, a rectangular prism has rectangular faces).`,
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

    const { topic, category, count = 20 } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const standard = topicStandardsMap[topic] || "";

    const systemPrompt = `You are a certified New Jersey mathematics assessment specialist and NJSLA (New Jersey Student Learning Assessment) item writer. You have authored items for the official NJSLA-M Grade 3 exam administered by NJ DOE / Pearson.

YOUR TASK: Generate exactly ${count} NJSLA-standard multiple-choice test questions for Grade 3, topic "${topic}" under "${category}".

═══════════════════════════════════════════
STANDARD ALIGNMENT (2023 NJSLS-Mathematics)
═══════════════════════════════════════════
${standard ? standard : `Topic: ${topic}, Category: ${category}`}

═══════════════════════════════════════════
NJSLA-M GRADE 3 TEST SPECIFICATIONS
═══════════════════════════════════════════
Source: NJ DOE NJSLA-Mathematics Companion Guide & 2023 NJSLS

FORMAT:
• Grade 3 NJSLA-M is NON-CALCULATOR (3 units × 60 minutes each)
• Type I items: machine-scored, multiple choice with exactly 4 options (A, B, C, D)
• Items assess BOTH content standards AND Standards for Mathematical Practice (SMP)

CONTENT EMPHASIS (Grade 3 Major Work):
• Major: 3.OA (all), 3.NF (all), 3.M.B & 3.M.C
• Supporting: 3.NBT (supports 3.OA), 3.M.A (supports 3.M.B/C)
• Additional: 3.DL, 3.G

═══════════════════════════════════════════
DEPTH OF KNOWLEDGE (DOK) DISTRIBUTION
═══════════════════════════════════════════
You MUST distribute questions across DOK levels:
• DOK 1 – Recall & Reproduction (~25%): Recall a fact, term, or procedure. One-step, straightforward computation in a simple context.
  Example: "What is 7 × 8?" or "Round 482 to the nearest hundred."
• DOK 2 – Skills & Concepts (~50%): Requires reasoning, interpretation, or multi-step within a context. Student must decide WHAT to do, not just HOW.
  Example: "Marcus has 4 bags with 6 apples in each bag. He gives 9 apples to his sister. Which equation shows how to find the number of apples Marcus has left?"
• DOK 3 – Strategic Thinking (~25%): Non-routine problem, requires planning, justifying, or analyzing. Multiple valid approaches. Student must synthesize information.
  Example: "Sara wants to build a rectangular garden with an area of 24 square feet. She wants the garden to have the smallest possible perimeter. What should the length and width of the garden be? Explain how you know."

═══════════════════════════════════════════
CRITICAL QUESTION QUALITY REQUIREMENTS
═══════════════════════════════════════════

1. REAL-WORLD CONTEXT IS MANDATORY FOR DOK 2 & 3:
   Every DOK 2 and DOK 3 question MUST be embedded in a realistic Grade 3 scenario:
   - School scenarios: classroom supplies, library books, field trips, lunch count
   - Home/community: baking, gardening, shopping, sports teams, pet care
   - Measurement: building projects, recipes, playground dimensions
   DO NOT write bare computation questions like "What is 345 + 278?" for DOK 2/3.

2. MULTI-STEP PROBLEMS (per 3.OA.D.8):
   At least 30% of questions should require TWO operations to solve.
   Example: "Mrs. Chen buys 3 boxes of pencils with 12 pencils in each box. She already has 15 pencils. How many pencils does she have in all?"

3. EQUATION/MODEL IDENTIFICATION:
   At least 15% of questions should ask students to identify WHICH equation, expression, or model represents a situation (not just compute an answer).
   Example: "Which equation can be used to find the total number of chairs in 7 rows with 9 chairs in each row?"
   A) 7 + 9 = □  B) 7 × 9 = □  C) 9 − 7 = □  D) 9 ÷ 7 = □

4. CONCEPTUAL UNDERSTANDING QUESTIONS:
   At least 15% should test understanding of WHY, not just HOW.
   Example: "Which statement about 3/4 and 3/8 is true?"
   A) 3/4 < 3/8 because 4 < 8  B) 3/4 > 3/8 because fourths are larger than eighths  C) 3/4 = 3/8 because they have the same numerator  D) Cannot compare because denominators differ

5. DATA/VISUAL INTERPRETATION:
   When the topic involves data/graphs, describe the data set IN THE QUESTION STEM. 
   Example: "The bar graph shows the number of books read by 4 students. Amy read 12, Ben read 8, Cara read 15, Dan read 6. How many more books did Cara read than Ben?"

6. VOCABULARY PRECISION:
   Use exact math vocabulary: "product," "quotient," "sum," "difference," "equation," "expression," "equivalent," "partition," "unit fraction," "area," "perimeter," "square unit," "number line."

═══════════════════════════════════════════
DISTRACTOR DESIGN (NJSLA QUALITY STANDARD)
═══════════════════════════════════════════
Each wrong answer MUST target a specific, documented Grade 3 misconception:

COMMON GRADE 3 MISCONCEPTIONS TO TARGET:
• Forgetting to regroup when adding/subtracting across place values
• Using the wrong operation in a word problem (adding instead of multiplying)
• Confusing perimeter and area (adding sides vs. multiplying)
• Place value errors: treating digits in wrong place (e.g., 506 has 5 ones)
• Fraction misconception: larger denominator = larger fraction (3/8 > 3/4)
• Rounding errors: rounding to wrong place or rounding down when digit ≥ 5
• Off-by-one errors in counting or skip-counting
• Reading a graph scale incorrectly (not accounting for scale factor)
• Forgetting to complete the second step in a two-step problem
• Confusing rows × columns in arrays
• Treating remainders incorrectly in division contexts

For EACH distractor, design it so a student who makes ONE specific error would choose it.

═══════════════════════════════════════════
EXAMPLE NJSLA-QUALITY QUESTIONS (MODEL THESE)
═══════════════════════════════════════════

EXAMPLE 1 (DOK 2, 3.OA.A.3):
"A pet store has 6 fish tanks. Each tank has 8 fish. The store sells 13 fish on Monday. Which expression shows how many fish are left in the store?"
A) 6 + 8 − 13  [wrong operation: adds instead of multiplies]
B) 6 × 8 + 13  [adds sold fish instead of subtracting]
C) 6 × 8 − 13  [CORRECT]
D) 8 × 13 − 6  [uses wrong numbers in wrong operation]

EXAMPLE 2 (DOK 2, 3.NF.A.3d):
"Lisa ate 2/6 of a pizza. Tom ate 2/4 of the same size pizza. Who ate more pizza?"
A) Lisa, because 6 is greater than 4  [larger denominator = more misconception]
B) Tom, because fourths are larger pieces than sixths  [CORRECT]
C) They ate the same amount because both numerators are 2  [same numerator = same amount misconception]
D) Cannot be determined  [gives up rather than reasoning]

EXAMPLE 3 (DOK 3, 3.M.C.6):
"Mr. Rivera has 24 feet of fencing to build a rectangular dog pen. He wants the pen to have the greatest possible area. Which dimensions should he use?"
A) Length 10 ft, Width 2 ft  [perimeter = 24 but small area]
B) Length 8 ft, Width 4 ft  [perimeter = 24, area = 32]
C) Length 6 ft, Width 6 ft  [CORRECT: perimeter = 24, area = 36, square maximizes area]
D) Length 7 ft, Width 5 ft  [perimeter = 24, area = 35, close but not max]

EXAMPLE 4 (DOK 2, 3.OA.D.8 two-step):
"Maya has $5. She buys 3 erasers that cost $0.75 each. How much money does Maya have left? (Hint: $0.75 × 3 = $2.25)"
Wait – this is Grade 3 non-calculator with whole numbers only. CORRECTED:
"Maya has 20 stickers. She gives 3 stickers to each of her 4 friends. How many stickers does Maya have left?"
A) 8  [CORRECT: 3 × 4 = 12, 20 − 12 = 8]
B) 12  [forgot second step, just computed 3 × 4]
C) 17  [subtracted 3 instead of 3 × 4]
D) 7  [computational error]

═══════════════════════════════════════════
ABSOLUTE RULES
═══════════════════════════════════════════
• ALL numbers must be WHOLE NUMBERS appropriate for Grade 3 (per NJSLA: whole number answers only for word problems)
• Fractions: denominators limited to 2, 3, 4, 6, and 8 ONLY (per 2023 NJSLS)
• NO decimals except in money contexts (and even money should use whole-dollar amounts when possible per 3.OA.D.8 clarification)
• NO negative numbers
• Multiplication/division within 100 (one-digit × one-digit per 3.OA.C.7)
• Multi-digit arithmetic: addition/subtraction within 1,000 (per 3.NBT.A.2), extended to 4-5 digits for enrichment
• Multiply one-digit by multiples of 10 up to 90 (per 3.NBT.A.3)
• Every question must have EXACTLY 4 choices labeled A, B, C, D
• Correct answer should be distributed roughly equally across A, B, C, D
• Question stems should be 2-4 sentences for DOK 2/3

═══════════════════════════════════════════
ANSWER VERIFICATION (CRITICAL - DO THIS FOR EVERY QUESTION)
═══════════════════════════════════════════
Before finalizing EACH question, you MUST:
1. SOLVE the problem yourself step-by-step to find the correct numerical answer.
2. VERIFY that the choice marked as correctAnswer EXACTLY matches your computed answer.
3. VERIFY that ALL three wrong choices have DIFFERENT values from the correct answer.
4. DOUBLE-CHECK your arithmetic: re-compute additions, subtractions, multiplications, and divisions.
5. For multi-step problems: show EACH step and verify intermediate results.
6. For fractions: verify numerator and denominator are correct after any operations.
7. If you find ANY mismatch between your computed answer and the marked correctAnswer, FIX IT before outputting.

COMMON AI MISTAKES TO AVOID:
• Marking the wrong letter as correct (e.g., computing 48 but marking B=42 as correct instead of A=48)
• Arithmetic errors in the distractors that accidentally equal the correct answer
• Two choices having the same value
• The explanation describing a different answer than what is marked correct
• Off-by-one errors in counting problems

THE CORRECT ANSWER MUST BE MATHEMATICALLY VERIFIED AND ABSOLUTELY CORRECT. A WRONG "CORRECT ANSWER" IS THE WORST POSSIBLE ERROR.

Return your response using the generate_questions tool.`;

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
              content: `Generate exactly ${count} NJSLA-M Grade 3 assessment items for the topic "${topic}" (${category}).

CHECKLIST before generating each question:
✓ Is this embedded in a real-world context? (DOK 2/3 must be)
✓ Does each distractor target a specific misconception?
✓ Are numbers grade-appropriate (whole numbers, fractions with denominators 2/3/4/6/8)?
✓ Does the explanation identify WHICH misconception each distractor targets?
✓ Is the DOK level accurate per Webb's framework?
✓ Is the NJSLS standard code correct?

Distribute DOK levels: ~${Math.round(count * 0.25)} questions at DOK 1, ~${Math.round(count * 0.5)} at DOK 2, ~${Math.round(count * 0.25)} at DOK 3.
Distribute correct answers roughly equally across A, B, C, D.
Include at least ${Math.max(2, Math.round(count * 0.3))} two-step problems and at least ${Math.max(2, Math.round(count * 0.15))} "which equation/model" questions.`,
            },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "generate_questions",
                description: "Return NJSLA-M Grade 3 standard assessment items with standard alignment, DOK levels, and misconception-targeted distractors",
                parameters: {
                  type: "object",
                  properties: {
                    questions: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          id: { type: "number" },
                          question: { type: "string", description: "Full question stem with real-world context (2-4 sentences for DOK 2/3)" },
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
                          explanation: { type: "string", description: "Explain the correct solution step-by-step. Then for EACH wrong answer, state: '[Letter] is wrong because it reflects [specific misconception].' Example: 'B is wrong because the student added instead of multiplying, a common error when interpreting equal groups.'" },
                          standard: { type: "string", description: "NJSLS standard code, e.g. 3.OA.A.1, 3.NF.A.3d, 3.M.C.6" },
                          dok: { type: "number", description: "Webb's Depth of Knowledge: 1, 2, or 3" },
                        },
                        required: ["id", "question", "choices", "correctAnswer", "explanation", "standard", "dok"],
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

    // Retry logic with delay on rate limit
    let response = await makeRequest();
    if (response.status === 429) {
      await new Promise((r) => setTimeout(r, 3000));
      response = await makeRequest();
    }

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI usage limit reached. Please add credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("No tool call in response");

    const questions = JSON.parse(toolCall.function.arguments);

    // Log token usage
    const usage = data.usage;
    if (usage) {
      try {
        const supabaseAdmin = createClient(
          Deno.env.get("SUPABASE_URL")!,
          Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
        );

        // Extract user_id from auth header if available
        const authHeader = req.headers.get("authorization");
        let userId = null;
        if (authHeader) {
          const supabaseUser = createClient(
            Deno.env.get("SUPABASE_URL")!,
            Deno.env.get("SUPABASE_ANON_KEY") || Deno.env.get("SUPABASE_PUBLISHABLE_KEY")!
          );
          const { data: { user } } = await supabaseUser.auth.getUser(authHeader.replace("Bearer ", ""));
          userId = user?.id || null;
        }

        await supabaseAdmin.from("ai_token_usage").insert({
          user_id: userId,
          topic,
          category,
          model: data.model || "google/gemini-2.5-flash",
          input_tokens: usage.prompt_tokens || 0,
          output_tokens: usage.completion_tokens || 0,
          total_tokens: usage.total_tokens || 0,
          question_count: questions.questions?.length || count,
        });
      } catch (logErr) {
        console.error("Failed to log token usage:", logErr);
      }
    }

    return new Response(JSON.stringify(questions), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-questions error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
