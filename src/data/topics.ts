export interface Topic {
  name: string;
  slug: string;
}

export interface Category {
  name: string;
  emoji: string;
  colorClass: string;
  bgClass: string;
  topics: Topic[];
}

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "");

const t = (name: string): Topic => ({ name, slug: slugify(name) });

export const categories: Category[] = [
  {
    name: "Place Values & Number Sense",
    emoji: "🔢",
    colorClass: "text-cat-numbers",
    bgClass: "bg-cat-numbers",
    topics: [
      t("Place Values"), t("Comparing and Ordering Numbers"), t("Numbers in Word Form"),
      t("Roman Numerals"), t("Rounding Numbers"), t("Odd or Even"),
    ],
  },
  {
    name: "Adding & Subtracting",
    emoji: "➕",
    colorClass: "text-cat-operations",
    bgClass: "bg-cat-operations",
    topics: [
      t("Adding 4-Digit Numbers"), t("Adding 5-Digit Numbers"), t("Subtracting 4-Digit Numbers"),
      t("Subtracting 5-Digit Numbers"), t("Estimate Sums"), t("Estimate Differences"),
      t("Rounding and Estimating"), t("Adding Hundreds"),
    ],
  },
  {
    name: "Multiplication & Division",
    emoji: "✖️",
    colorClass: "text-cat-multiply",
    bgClass: "bg-cat-multiply",
    topics: [
      t("Multiplication by 0 to 3"), t("Multiplication by 4 to 7"), t("Multiplication by 8 to 12"),
      t("Division by 0 to 6"), t("Division by 7 to 12"), t("Dividing by Tens"),
      t("Divide and Multiply 3-Digit Numbers"), t("Estimate Products"),
      t("Missing Numbers"), t("Times Table"),
    ],
  },
  {
    name: "Patterns & Algebraic Thinking",
    emoji: "🔄",
    colorClass: "text-cat-patterns",
    bgClass: "bg-cat-patterns",
    topics: [
      t("Repeating Patterns"), t("Growing Patterns"), t("Patterns: Numbers"), t("Algebraic Thinking"),
    ],
  },
  {
    name: "Fractions",
    emoji: "🍕",
    colorClass: "text-cat-fractions",
    bgClass: "bg-cat-fractions",
    topics: [
      t("Fractions of a Number"), t("Order Fractions"), t("Simplifying Fractions"),
      t("Improper Fractions"), t("Comparing Fractions"), t("Add Fractions"),
      t("Subtract Fractions"), t("Add and Subtract Fractions"),
      t("Compare Sums and Differences of Fractions"), t("Add 3 or More Fractions"),
    ],
  },
  {
    name: "Time & Money",
    emoji: "⏰",
    colorClass: "text-cat-time",
    bgClass: "bg-cat-time",
    topics: [
      t("Read Clocks"), t("Telling Time"), t("Digital Clock"), t("Measurement – Time"),
      t("Calendars"), t("Money Amounts"), t("Money: Word Problems"),
    ],
  },
  {
    name: "Geometry",
    emoji: "📐",
    colorClass: "text-cat-geometry",
    bgClass: "bg-cat-geometry",
    topics: [
      t("Identifying Angles"), t("Estimate Angle Measurements"), t("Measure Angles with a Protractor"),
      t("Polygon Names"), t("Classify Triangles"), t("Parallel Sides in Quadrilaterals"),
      t("Identify Rectangles"), t("Missing Side Lengths"),
      t("Perimeter and Area of Squares"), t("Perimeter and Area of Rectangles"),
      t("Area or Missing Side Length of a Rectangle"), t("Word Problems"),
    ],
  },
  {
    name: "Measurement",
    emoji: "📏",
    colorClass: "text-cat-measurement",
    bgClass: "bg-cat-measurement",
    topics: [
      t("Reference Measurement"), t("Metric Length Measurement"), t("Customary Length Measurement"),
      t("Metric Capacity Measurement"), t("Customary Capacity Measurement"),
      t("Metric Weight and Mass Measurement"), t("Customary Weight and Mass Measurement"),
    ],
  },
  {
    name: "Data & Graphs",
    emoji: "📊",
    colorClass: "text-cat-data",
    bgClass: "bg-cat-data",
    topics: [
      t("Bar Graph"), t("Tally and Pictographs"), t("Dot Plots"), t("Stem-and-Leaf Plot"),
    ],
  },
  {
    name: "Symmetry & Transformations",
    emoji: "🦋",
    colorClass: "text-cat-symmetry",
    bgClass: "bg-cat-symmetry",
    topics: [
      t("Line Segments"), t("Identify Lines of Symmetry"), t("Count Lines of Symmetry"),
      t("Parallel, Perpendicular and Intersecting Lines"),
    ],
  },
  {
    name: "Three-Dimensional Figures",
    emoji: "🧊",
    colorClass: "text-cat-3d",
    bgClass: "bg-cat-3d",
    topics: [
      t("Identify Three-Dimensional Figures"), t("Count Vertices, Edges, and Faces"),
      t("Identify Faces of Three-Dimensional Figures"),
    ],
  },
];
