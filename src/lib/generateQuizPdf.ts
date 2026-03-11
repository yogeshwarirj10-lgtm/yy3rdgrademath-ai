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
}

export function generateQuizPdf(
  questions: Question[],
  topicName: string,
  categoryName: string
) {
  const doc = new jsPDF({ unit: "mm", format: "letter" });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 18;
  const contentW = pageW - margin * 2;
  let y = margin;

  const addPageIfNeeded = (needed: number) => {
    if (y + needed > doc.internal.pageSize.getHeight() - margin) {
      doc.addPage();
      y = margin;
    }
  };

  // Title page header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(`${categoryName}: ${topicName}`, margin, y);
  y += 8;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`NJSLA Practice Test — ${questions.length} Questions`, margin, y);
  y += 4;
  doc.setDrawColor(180);
  doc.line(margin, y, pageW - margin, y);
  y += 10;

  // ---- QUESTIONS SECTION ----
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Questions", margin, y);
  y += 8;

  questions.forEach((q, idx) => {
    addPageIfNeeded(40);

    // Question number + text
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    const qLines = doc.splitTextToSize(`${idx + 1}. ${q.question}`, contentW);
    doc.text(qLines, margin, y);
    y += qLines.length * 5 + 3;

    // Choices
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    q.choices.forEach((c) => {
      addPageIfNeeded(8);
      const cLines = doc.splitTextToSize(`    ${c.label}. ${c.text}`, contentW - 6);
      doc.text(cLines, margin + 4, y);
      y += cLines.length * 4.5 + 1.5;
    });

    // Standard & DOK tags
    if (q.standard || q.dok) {
      doc.setFontSize(8);
      doc.setTextColor(120);
      const tags = [q.standard, q.dok ? `DOK ${q.dok}` : ""].filter(Boolean).join("  |  ");
      doc.text(tags, margin + 4, y);
      doc.setTextColor(0);
      y += 5;
    }

    y += 6;
  });

  // ---- ANSWER KEY SECTION ----
  doc.addPage();
  y = margin;
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Answer Key", margin, y);
  y += 10;

  questions.forEach((q, idx) => {
    addPageIfNeeded(30);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text(`${idx + 1}. Correct Answer: ${q.correctAnswer}`, margin, y);
    y += 5;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    const expLines = doc.splitTextToSize(q.explanation, contentW - 6);
    doc.text(expLines, margin + 4, y);
    y += expLines.length * 4 + 6;
  });

  doc.save(`NJSLA_Grade3_${topicName.replace(/\s+/g, "_")}_Practice.pdf`);
}
