import jsPDF from "jspdf";

interface Choice {
  label: string;
  text: string;
}

interface Question {
  id: number;
  question: string;
  choices: Choice[];
  correctAnswer: string;
  explanation: string;
  standard?: string;
  dok?: number;
  domain?: string;
  type?: string;
  points?: number;
}

interface UnitData {
  title: string;
  questions: Question[];
}

interface FullExamOptions {
  isFullExam?: boolean;
  timeMinutes?: number;
  studentName?: string;
  schoolName?: string;
}

// NJSLA Brand Colors (as RGB for jsPDF)
const NJSLA_NAVY = { r: 0, g: 51, b: 102 };
const NJSLA_LIGHT_BLUE = { r: 230, g: 240, b: 250 };
const NJSLA_GOLD = { r: 180, g: 150, b: 50 };

export function generateModelPaperPdf(
  units: UnitData[],
  filename = "NJSLA_Grade3_Model_Paper.pdf",
  options: FullExamOptions = {}
) {
  const { isFullExam = true, timeMinutes = 60 } = options;
  const doc = new jsPDF({ unit: "mm", format: "letter" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentW = pageW - margin * 2;
  let y = margin;

  const totalQ = units.reduce((s, u) => s + u.questions.length, 0);

  // Helper: Add page if needed
  const addPageIfNeeded = (needed: number) => {
    if (y + needed > pageH - margin) {
      doc.addPage();
      y = margin;
      return true;
    }
    return false;
  };

  // Helper: Draw header bar
  const drawHeaderBar = () => {
    doc.setFillColor(NJSLA_NAVY.r, NJSLA_NAVY.g, NJSLA_NAVY.b);
    doc.rect(0, 0, pageW, 18, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("NEW JERSEY STUDENT LEARNING ASSESSMENT", margin, 11);
    doc.text("MATHEMATICS GRADE 3", pageW - margin, 11, { align: "right" });
    doc.setTextColor(0, 0, 0);
  };

  // Helper: Draw footer
  const drawFooter = (pageNum: number, totalPages?: number) => {
    doc.setFontSize(8);
    doc.setTextColor(120);
    doc.text(`Page ${pageNum}`, pageW / 2, pageH - 8, { align: "center" });
    doc.setDrawColor(200);
    doc.line(margin, pageH - 15, pageW - margin, pageH - 15);
    doc.setTextColor(0);
  };

  // ===== COVER PAGE =====
  // Navy header block
  doc.setFillColor(NJSLA_NAVY.r, NJSLA_NAVY.g, NJSLA_NAVY.b);
  doc.rect(0, 0, pageW, 75, "F");

  // State seal placeholder (circle)
  doc.setFillColor(255, 255, 255);
  doc.circle(pageW / 2, 30, 12, "F");
  doc.setFillColor(NJSLA_NAVY.r, NJSLA_NAVY.g, NJSLA_NAVY.b);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("NJ", pageW / 2, 32, { align: "center" });

  // Title text on navy
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("NEW JERSEY STUDENT LEARNING ASSESSMENT", pageW / 2, 52, { align: "center" });
  doc.setFontSize(28);
  doc.text("MATHEMATICS", pageW / 2, 65, { align: "center" });

  // Grade badge
  doc.setFillColor(NJSLA_GOLD.r, NJSLA_GOLD.g, NJSLA_GOLD.b);
  doc.roundedRect(pageW / 2 - 25, 80, 50, 18, 3, 3, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.text("GRADE 3", pageW / 2, 92, { align: "center" });

  // Practice Test subtitle
  doc.setTextColor(NJSLA_NAVY.r, NJSLA_NAVY.g, NJSLA_NAVY.b);
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(isFullExam ? "Full-Length Practice Test" : "Unit Practice Test", pageW / 2, 108, { align: "center" });

  // Test info box
  const boxY = 118;
  doc.setFillColor(NJSLA_LIGHT_BLUE.r, NJSLA_LIGHT_BLUE.g, NJSLA_LIGHT_BLUE.b);
  doc.roundedRect(margin + 20, boxY, contentW - 40, 55, 3, 3, "F");
  doc.setDrawColor(NJSLA_NAVY.r, NJSLA_NAVY.g, NJSLA_NAVY.b);
  doc.setLineWidth(0.5);
  doc.roundedRect(margin + 20, boxY, contentW - 40, 55, 3, 3, "S");

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(NJSLA_NAVY.r, NJSLA_NAVY.g, NJSLA_NAVY.b);
  const unitCount = units.length;
  const infoLines = [
    `Units: ${unitCount} (60 minutes each)`,
    `Total Questions: ${totalQ}`,
    `Time Allowed: ${timeMinutes} minutes total`,
    `Calculator: Not Permitted`,
    `Item Types: Type I (1–2 pts), Type II (3–4 pts), Type III (3–6 pts)`
  ];
  let infoY = boxY + 12;
  infoLines.forEach((line) => {
    doc.text(line, pageW / 2, infoY, { align: "center" });
    infoY += 9;
  });

  // Student info section
  const studentY = 175;
  doc.setFillColor(250, 250, 250);
  doc.roundedRect(margin, studentY, contentW, 40, 2, 2, "F");
  doc.setDrawColor(180);
  doc.roundedRect(margin, studentY, contentW, 40, 2, 2, "S");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(80);
  doc.text("STUDENT INFORMATION", margin + 5, studentY + 8);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(0);
  doc.text("Name: ___________________________________________", margin + 5, studentY + 20);
  doc.text("School: __________________________________________", margin + 5, studentY + 32);
  doc.text("Date: _______________", pageW - margin - 50, studentY + 20);

  // Domain coverage section
  const domainY = 225;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(NJSLA_NAVY.r, NJSLA_NAVY.g, NJSLA_NAVY.b);
  doc.text("DOMAINS ASSESSED", margin, domainY);

  const domains = [
    { code: "3.OA", name: "Operations & Algebraic Thinking" },
    { code: "3.NBT", name: "Number & Operations in Base Ten" },
    { code: "3.NF", name: "Number & Operations—Fractions" },
    { code: "3.MD", name: "Measurement & Data" },
    { code: "3.G", name: "Geometry" }
  ];

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  let domainCol = 0;
  let domainRow = 0;
  domains.forEach((d, i) => {
    const dx = margin + (domainCol * 85);
    const dy = domainY + 8 + (domainRow * 12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(NJSLA_NAVY.r, NJSLA_NAVY.g, NJSLA_NAVY.b);
    doc.text(d.code, dx, dy);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60);
    doc.text(` — ${d.name}`, dx + 14, dy);
    domainCol++;
    if (domainCol >= 2) {
      domainCol = 0;
      domainRow++;
    }
  });

  // Footer notice
  doc.setFontSize(8);
  doc.setTextColor(120);
  doc.text("This practice test is aligned with 2023 New Jersey Student Learning Standards — Mathematics.", pageW / 2, pageH - 30, { align: "center" });
  doc.text("For practice purposes only. Not for official assessment use.", pageW / 2, pageH - 24, { align: "center" });
  doc.setTextColor(0);

  // ===== DIRECTIONS PAGE =====
  doc.addPage();
  drawHeaderBar();
  y = 30;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(NJSLA_NAVY.r, NJSLA_NAVY.g, NJSLA_NAVY.b);
  doc.text("GENERAL DIRECTIONS", pageW / 2, y, { align: "center" });
  y += 12;

  doc.setFillColor(NJSLA_LIGHT_BLUE.r, NJSLA_LIGHT_BLUE.g, NJSLA_LIGHT_BLUE.b);
  doc.roundedRect(margin, y, contentW, 90, 3, 3, "F");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(0);
  const directions = [
    "1. Read each question carefully before choosing your answer.",
    "2. Each question has four answer choices labeled A, B, C, and D.",
    "3. Choose the ONE best answer for each question.",
    "4. Mark your answer by filling in the circle on your answer sheet.",
    "5. If you want to change an answer, erase it completely first.",
    "6. You may use scratch paper to work out problems.",
    "7. Calculators are NOT permitted for this test.",
    "8. If you finish early, go back and check your work.",
    "9. When you reach the STOP sign, do not go on until told to do so."
  ];

  let dirY = y + 10;
  directions.forEach((dir) => {
    doc.text(dir, margin + 8, dirY);
    dirY += 9;
  });

  y = dirY + 15;

  // Helpful reminders box
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(NJSLA_NAVY.r, NJSLA_NAVY.g, NJSLA_NAVY.b);
  doc.text("HELPFUL REMINDERS", margin, y);
  y += 8;

  doc.setFillColor(255, 250, 240);
  doc.setDrawColor(NJSLA_GOLD.r, NJSLA_GOLD.g, NJSLA_GOLD.b);
  doc.setLineWidth(0.5);
  doc.roundedRect(margin, y, contentW, 50, 3, 3, "FD");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(60);
  const reminders = [
    "• Underline key words in word problems.",
    "• Draw pictures or diagrams to help you visualize problems.",
    "• Estimate your answer before solving to check reasonableness.",
    "• Use inverse operations to check your work.",
    "• Eliminate obviously wrong answers first."
  ];
  let remY = y + 10;
  reminders.forEach((r) => {
    doc.text(r, margin + 8, remY);
    remY += 9;
  });

  drawFooter(2);

  // ===== ANSWER SHEET (BUBBLE SHEET) =====
  doc.addPage();
  drawHeaderBar();
  y = 30;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(NJSLA_NAVY.r, NJSLA_NAVY.g, NJSLA_NAVY.b);
  doc.text("ANSWER SHEET", pageW / 2, y, { align: "center" });
  y += 6;
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(80);
  doc.text("Fill in the circle completely. Use a No. 2 pencil only.", pageW / 2, y, { align: "center" });
  y += 12;

  // Draw bubble grid
  const bubbleStartX = margin + 10;
  const bubbleStartY = y;
  const qPerCol = Math.ceil(totalQ / 4);
  const colWidth = (contentW - 20) / 4;
  const rowHeight = 9;

  doc.setFontSize(9);

  for (let i = 0; i < totalQ; i++) {
    const col = Math.floor(i / qPerCol);
    const row = i % qPerCol;
    const bx = bubbleStartX + col * colWidth;
    const by = bubbleStartY + row * rowHeight;

    // Question number
    doc.setFont("helvetica", "bold");
    doc.setTextColor(NJSLA_NAVY.r, NJSLA_NAVY.g, NJSLA_NAVY.b);
    doc.text(`${i + 1}.`, bx, by + 3);

    // Bubbles A B C D
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0);
    const labels = ["A", "B", "C", "D"];
    labels.forEach((label, li) => {
      const cx = bx + 12 + li * 12;
      doc.setDrawColor(100);
      doc.setLineWidth(0.3);
      doc.circle(cx, by + 1.5, 3, "S");
      doc.setFontSize(7);
      doc.text(label, cx, by + 2.5, { align: "center" });
    });
  }

  y = bubbleStartY + qPerCol * rowHeight + 15;
  drawFooter(3);

  // ===== QUESTIONS SECTION =====
  let globalQ = 0;
  let questionPageNum = 4;

  units.forEach((unit, unitIdx) => {
    doc.addPage();
    drawHeaderBar();
    y = 28;

    // Unit header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(NJSLA_NAVY.r, NJSLA_NAVY.g, NJSLA_NAVY.b);
    if (isFullExam && units.length > 1) {
      doc.text(unit.title, margin, y);
      y += 6;
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(80);
      doc.text(`${unit.questions.length} Questions • Non-Calculator`, margin, y);
    } else if (isFullExam && units.length === 1) {
      doc.text("MATHEMATICS TEST QUESTIONS", margin, y);
      y += 6;
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(80);
      doc.text(`${unit.questions.length} Questions`, margin, y);
    } else {
      doc.text(unit.title, margin, y);
      y += 6;
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(80);
      doc.text(`${unit.questions.length} Questions`, margin, y);
    }
    y += 4;
    doc.setDrawColor(NJSLA_NAVY.r, NJSLA_NAVY.g, NJSLA_NAVY.b);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageW - margin, y);
    y += 10;

    unit.questions.forEach((q, qIdx) => {
      globalQ++;

      // Check if we need a new page
      if (addPageIfNeeded(55)) {
        questionPageNum++;
        drawHeaderBar();
        y = 28;
      }

      // Question number badge
      doc.setFillColor(NJSLA_NAVY.r, NJSLA_NAVY.g, NJSLA_NAVY.b);
      doc.roundedRect(margin, y - 4, 10, 8, 1, 1, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(255, 255, 255);
      doc.text(`${globalQ}`, margin + 5, y + 1, { align: "center" });

      // Type & Points tag (if available)
      let tagX = margin + 13;
      if (q.type) {
        const typeLabel = `Type ${q.type} · ${q.points || 1} pt${(q.points || 1) > 1 ? "s" : ""}`;
        doc.setFillColor(
          q.type === "III" ? 220 : q.type === "II" ? 245 : NJSLA_LIGHT_BLUE.r,
          q.type === "III" ? 200 : q.type === "II" ? 230 : NJSLA_LIGHT_BLUE.g,
          q.type === "III" ? 200 : q.type === "II" ? 200 : NJSLA_LIGHT_BLUE.b
        );
        const typeWidth = doc.getTextWidth(typeLabel) + 6;
        doc.roundedRect(tagX, y - 4, typeWidth, 7, 1, 1, "F");
        doc.setFontSize(7);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(
          q.type === "III" ? 150 : q.type === "II" ? 140 : NJSLA_NAVY.r,
          q.type === "III" ? 30 : q.type === "II" ? 100 : NJSLA_NAVY.g,
          q.type === "III" ? 30 : q.type === "II" ? 0 : NJSLA_NAVY.b
        );
        doc.text(typeLabel, tagX + 3, y, { align: "left" });
        tagX += typeWidth + 3;
      }

      // Standard tag (if available)
      if (q.standard) {
        doc.setFillColor(NJSLA_LIGHT_BLUE.r, NJSLA_LIGHT_BLUE.g, NJSLA_LIGHT_BLUE.b);
        const tagWidth = doc.getTextWidth(q.standard) + 6;
        doc.roundedRect(tagX, y - 4, tagWidth, 7, 1, 1, "F");
        doc.setFontSize(7);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(NJSLA_NAVY.r, NJSLA_NAVY.g, NJSLA_NAVY.b);
        doc.text(q.standard, tagX + 3, y, { align: "left" });
      }

      y += 8;

      // Question text
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.setTextColor(0);
      const qLines = doc.splitTextToSize(q.question, contentW - 5);
      doc.text(qLines, margin + 2, y);
      y += qLines.length * 5.5 + 4;

      // Choice options with circles
      doc.setFontSize(10);
      q.choices.forEach((c) => {
        if (addPageIfNeeded(10)) {
          questionPageNum++;
          drawHeaderBar();
          y = 28;
        }

        // Circle for answer
        doc.setDrawColor(100);
        doc.setLineWidth(0.3);
        doc.circle(margin + 8, y - 1, 3, "S");

        // Choice label
        doc.setFont("helvetica", "bold");
        doc.setTextColor(NJSLA_NAVY.r, NJSLA_NAVY.g, NJSLA_NAVY.b);
        doc.text(c.label, margin + 8, y, { align: "center" });

        // Choice text
        doc.setFont("helvetica", "normal");
        doc.setTextColor(0);
        const cLines = doc.splitTextToSize(c.text, contentW - 22);
        doc.text(cLines, margin + 16, y);
        y += cLines.length * 5 + 3;
      });

      y += 8;
    });

    drawFooter(questionPageNum);
    questionPageNum++;
  });

  // ===== STOP PAGE =====
  doc.addPage();
  y = pageH / 2 - 40;

  // Large STOP sign
  doc.setFillColor(200, 30, 30);
  doc.setDrawColor(150, 20, 20);
  doc.setLineWidth(2);

  // Octagon path (simplified as rounded rect)
  doc.roundedRect(pageW / 2 - 35, y - 10, 70, 45, 5, 5, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(32);
  doc.setTextColor(255, 255, 255);
  doc.text("STOP", pageW / 2, y + 20, { align: "center" });

  y += 55;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(NJSLA_NAVY.r, NJSLA_NAVY.g, NJSLA_NAVY.b);
  doc.text("END OF TEST", pageW / 2, y, { align: "center" });

  y += 15;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(60);
  const endMsg = [
    "You have completed the mathematics practice test.",
    "",
    "If time remains:",
    "• Review your answers",
    "• Check your work on scratch paper",
    "• Make sure all answers are marked on your answer sheet",
    "",
    "Do not go back to any previous section.",
    "Wait for your teacher's instructions."
  ];
  endMsg.forEach((line) => {
    doc.text(line, pageW / 2, y, { align: "center" });
    y += 7;
  });

  // ===== ANSWER KEY & EXPLANATIONS =====
  doc.addPage();
  drawHeaderBar();
  y = 28;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(NJSLA_NAVY.r, NJSLA_NAVY.g, NJSLA_NAVY.b);
  doc.text("ANSWER KEY", pageW / 2, y, { align: "center" });
  y += 12;

  // Quick reference answer grid
  doc.setFillColor(NJSLA_LIGHT_BLUE.r, NJSLA_LIGHT_BLUE.g, NJSLA_LIGHT_BLUE.b);
  const gridHeight = Math.ceil(totalQ / 10) * 8 + 10;
  doc.roundedRect(margin, y, contentW, gridHeight, 3, 3, "F");

  doc.setFontSize(9);
  let gridY = y + 8;
  let gridX = margin + 8;
  globalQ = 0;

  units.forEach((unit) => {
    unit.questions.forEach((q) => {
      globalQ++;
      if ((globalQ - 1) % 10 === 0 && globalQ > 1) {
        gridY += 8;
        gridX = margin + 8;
      }

      doc.setFont("helvetica", "bold");
      doc.setTextColor(NJSLA_NAVY.r, NJSLA_NAVY.g, NJSLA_NAVY.b);
      doc.text(`${globalQ}.`, gridX, gridY);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0);
      doc.text(q.correctAnswer, gridX + 7, gridY);
      gridX += 17;
    });
  });

  y += gridHeight + 12;

  // Detailed explanations
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(NJSLA_NAVY.r, NJSLA_NAVY.g, NJSLA_NAVY.b);
  doc.text("DETAILED EXPLANATIONS", margin, y);
  y += 8;

  globalQ = 0;
  units.forEach((unit) => {
    unit.questions.forEach((q) => {
      globalQ++;

      if (addPageIfNeeded(40)) {
        drawHeaderBar();
        y = 28;
      }

      // Question number and answer
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(NJSLA_NAVY.r, NJSLA_NAVY.g, NJSLA_NAVY.b);
      const answerLine = `${globalQ}. Correct Answer: ${q.correctAnswer}`;
      doc.text(answerLine, margin, y);

      // Standard, DOK, Type
      if (q.standard || q.dok || q.type) {
        y += 5;
        doc.setFontSize(8);
        doc.setTextColor(100);
        const metaParts = [
          q.type ? `Type ${q.type} · ${q.points || 1} pt${(q.points || 1) > 1 ? "s" : ""}` : "",
          q.standard,
          q.dok ? `DOK ${q.dok}` : ""
        ].filter(Boolean);
        doc.text(metaParts.join("  |  "), margin + 5, y);
      }

      y += 6;

      // Explanation
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(40);
      const expLines = doc.splitTextToSize(q.explanation, contentW - 10);
      doc.text(expLines, margin + 5, y);
      y += expLines.length * 4.5 + 8;
    });
  });

  // Final page footer
  doc.setFontSize(8);
  doc.setTextColor(120);
  doc.text("© 2024 Practice Test — Aligned with NJSLS-Mathematics", pageW / 2, pageH - 10, { align: "center" });

  doc.save(filename);
}
