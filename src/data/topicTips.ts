// Tips and key points for each topic, keyed by slug

export interface TopicTip {
  tip: string;
  points: string[];
}

export const topicTips: Record<string, TopicTip> = {
  // ─── Place Values & Number Sense ───
  "place-values": {
    tip: "Each digit in a number has a value based on its position — ones, tens, hundreds, thousands.",
    points: [
      "The digit on the right is the ones place",
      "Moving left, each place is 10 times bigger",
      "In 735: 7 = 700, 3 = 30, 5 = 5",
      "Expanded form: 700 + 30 + 5",
    ],
  },
  "comparing-and-ordering-numbers": {
    tip: "Compare numbers by looking at digits from left to right, starting with the largest place value.",
    points: [
      "Use symbols: > (greater than), < (less than), = (equal to)",
      "Compare the hundreds digit first, then tens, then ones",
      "The alligator mouth always eats the bigger number!",
      "To order, line up place values and compare step by step",
    ],
  },
  "numbers-in-word-form": {
    tip: "Write numbers using words by reading each group of digits with their place value.",
    points: [
      "456 = four hundred fifty-six",
      "Use hyphens for 21–99 (e.g., twenty-one)",
      "Don't write 'and' between hundreds and tens",
      "Practice reading numbers aloud to build fluency",
    ],
  },
  "roman-numerals": {
    tip: "Roman numerals use letters I, V, X, L, C, D, M to represent numbers.",
    points: [
      "I = 1, V = 5, X = 10, L = 50, C = 100",
      "Smaller numeral before larger means subtract (IV = 4)",
      "Smaller numeral after larger means add (VI = 6)",
      "Never repeat I, X, or C more than 3 times in a row",
    ],
  },
  "rounding-numbers": {
    tip: "Look at the digit to the right of the place you're rounding to — 5 or more rounds up, 4 or less rounds down.",
    points: [
      "Rounding to nearest 10: look at the ones digit",
      "Rounding to nearest 100: look at the tens digit",
      "348 → nearest 10 = 350, nearest 100 = 300",
      "Rounding helps estimate answers quickly",
    ],
  },
  "odd-or-even": {
    tip: "Even numbers end in 0, 2, 4, 6, or 8. Odd numbers end in 1, 3, 5, 7, or 9.",
    points: [
      "Even numbers can be split into 2 equal groups",
      "Odd numbers always have 1 left over when split in 2",
      "Even + Even = Even, Odd + Odd = Even",
      "Even + Odd = Odd",
    ],
  },

  // ─── Adding & Subtracting ───
  "adding-4-digit-numbers": {
    tip: "Add from right to left, starting with the ones place. Regroup (carry) when a column sum is 10 or more.",
    points: [
      "Line up digits by place value before adding",
      "Carry the 1 to the next column when sum ≥ 10",
      "Always double-check by estimating first",
      "Example: 2,456 + 1,378 = 3,834",
    ],
  },
  "adding-5-digit-numbers": {
    tip: "Same rules as 4-digit addition — just one more column! Stay organized and carry carefully.",
    points: [
      "Line up all five place values carefully",
      "Work from ones → tens → hundreds → thousands → ten-thousands",
      "Estimate first to check if your answer makes sense",
      "Use graph paper to keep columns straight",
    ],
  },
  "subtracting-4-digit-numbers": {
    tip: "Subtract from right to left. If the top digit is smaller, borrow from the next place.",
    points: [
      "Borrowing: take 1 from the next column (= 10 in current column)",
      "Always write the larger number on top",
      "Check your work by adding the answer to the bottom number",
      "Example: 5,000 − 1,234 = 3,766",
    ],
  },
  "subtracting-5-digit-numbers": {
    tip: "Follow the same borrowing rules as 4-digit subtraction. Watch out for zeros — you may need to borrow across multiple columns.",
    points: [
      "Zeros require borrowing from the next non-zero digit",
      "Estimate first to see if your answer is reasonable",
      "Check: answer + bottom number = top number",
      "Take your time with regrouping across zeros",
    ],
  },
  "estimate-sums": {
    tip: "Round each number first, then add. This gives you a quick approximate answer.",
    points: [
      "Round to the nearest 10 or 100 before adding",
      "Estimating helps check if exact answers are reasonable",
      "Example: 287 + 412 ≈ 300 + 400 = 700",
      "The word 'about' usually means estimate",
    ],
  },
  "estimate-differences": {
    tip: "Round each number first, then subtract to get an approximate answer.",
    points: [
      "Round both numbers to the same place value",
      "Example: 782 − 319 ≈ 800 − 300 = 500",
      "Estimates don't need to be exact — just close",
      "Use estimation to check if your exact answer makes sense",
    ],
  },
  "rounding-and-estimating": {
    tip: "Rounding and estimating work together — round first, then calculate for a quick answer.",
    points: [
      "Round to the nearest 10 or 100 based on the question",
      "Use estimation for real-world problems (about how many?)",
      "Estimation saves time on multiple-step problems",
      "Always check: is my exact answer close to my estimate?",
    ],
  },
  "adding-hundreds": {
    tip: "When adding hundreds, think of them like ones — 3 + 4 = 7, so 300 + 400 = 700.",
    points: [
      "Count by hundreds: 100, 200, 300...",
      "Use mental math: just add the leading digits",
      "Example: 500 + 300 = 800 (think 5 + 3 = 8)",
      "This skill helps with estimation too",
    ],
  },

  // ─── Multiplication & Division ───
  "multiplication-by-0-to-3": {
    tip: "Anything × 0 = 0 and anything × 1 = itself. For × 2, just double it. For × 3, double and add one more.",
    points: [
      "0 × any number = 0 (zero property)",
      "1 × any number = that number (identity property)",
      "2 × a number = double it",
      "3 × a number = double it, then add the number once more",
    ],
  },
  "multiplication-by-4-to-7": {
    tip: "Break bigger facts into easier ones. For × 4, double twice. For × 5, count by 5s.",
    points: [
      "4 × a number = double it, then double again",
      "5 × a number always ends in 0 or 5",
      "6 × a number = 5 groups + 1 more group",
      "7 × a number = 5 groups + 2 more groups",
    ],
  },
  "multiplication-by-8-to-12": {
    tip: "For × 8, double three times. For × 9, use the 10× trick and subtract one group.",
    points: [
      "8 × a number = double, double, double",
      "9 × a number = 10 groups minus 1 group",
      "10 × a number = add a zero at the end",
      "11 × single digit: repeat the digit (11 × 3 = 33)",
    ],
  },
  "division-by-0-to-6": {
    tip: "Division is the opposite of multiplication. If 3 × 4 = 12, then 12 ÷ 3 = 4.",
    points: [
      "You cannot divide by 0 — it's undefined!",
      "Any number ÷ 1 = itself",
      "Any number ÷ itself = 1",
      "Think: what times the divisor gives the dividend?",
    ],
  },
  "division-by-7-to-12": {
    tip: "Use multiplication facts backwards. If you know 8 × 7 = 56, then 56 ÷ 8 = 7.",
    points: [
      "Practice times tables to make division easier",
      "Dividing by 10: remove the last zero",
      "Check: quotient × divisor = dividend",
      "Remainders mean the number doesn't divide evenly",
    ],
  },
  "dividing-by-tens": {
    tip: "Dividing by 10 moves each digit one place to the right. Dividing by 100 moves two places.",
    points: [
      "240 ÷ 10 = 24 (remove one zero)",
      "3,000 ÷ 100 = 30 (remove two zeros)",
      "Think of it as making the number smaller by groups of 10",
      "This only works cleanly with multiples of 10",
    ],
  },
  "divide-and-multiply-3-digit-numbers": {
    tip: "Break 3-digit multiplication and division into steps using place value.",
    points: [
      "Multiply hundreds, tens, and ones separately, then add",
      "For division, use long division step by step",
      "Estimate first to check your answer",
      "Example: 124 × 3 = (100×3) + (20×3) + (4×3) = 372",
    ],
  },
  "estimate-products": {
    tip: "Round one or both factors to the nearest 10 before multiplying for a quick estimate.",
    points: [
      "Example: 28 × 4 ≈ 30 × 4 = 120",
      "Rounding to 'friendly' numbers makes mental math easier",
      "Use estimation to check if your exact answer is reasonable",
      "The word 'approximately' signals estimation",
    ],
  },
  "missing-numbers": {
    tip: "Use inverse operations to find the missing number. If addition is shown, use subtraction to solve.",
    points: [
      "□ + 5 = 12 → □ = 12 − 5 = 7",
      "□ × 4 = 24 → □ = 24 ÷ 4 = 6",
      "Think: what goes in the box to make this true?",
      "Check by plugging your answer back in",
    ],
  },
  "times-table": {
    tip: "Knowing times tables by heart is the key to fast math! Practice a little every day.",
    points: [
      "Focus on one table at a time until it's automatic",
      "Commutative property: 3 × 7 = 7 × 3",
      "Square numbers: 1, 4, 9, 16, 25, 36, 49, 64, 81, 100",
      "Use skip counting to build up tables",
    ],
  },

  // ─── Patterns & Algebraic Thinking ───
  "repeating-patterns": {
    tip: "A repeating pattern has a core that repeats over and over. Find the core, then predict what comes next.",
    points: [
      "Identify the core unit (e.g., AB, ABC, AABB)",
      "The pattern cycles: after the last element, it starts over",
      "Example: 🔴🔵🔴🔵 — core is 🔴🔵",
      "Use the core to predict the 10th, 20th element etc.",
    ],
  },
  "growing-patterns": {
    tip: "A growing pattern increases by a fixed amount each step. Find the rule to predict the next term.",
    points: [
      "Look at the difference between consecutive terms",
      "Example: 2, 5, 8, 11 — rule is +3",
      "Draw it out if it's a shape pattern",
      "The rule stays the same for every step",
    ],
  },
  "patterns-numbers": {
    tip: "Number patterns follow rules like +2, ×3, or -5. Find the rule by comparing consecutive numbers.",
    points: [
      "Subtract consecutive terms to find an addition rule",
      "Divide consecutive terms to find a multiplication rule",
      "Check your rule works for ALL terms in the pattern",
      "Use the rule to extend the pattern forward or backward",
    ],
  },
  "algebraic-thinking": {
    tip: "Use letters or symbols to represent unknown numbers. Solve by using inverse operations.",
    points: [
      "An equation is like a balanced scale — both sides are equal",
      "To solve, do the same operation on both sides",
      "Example: n + 7 = 15 → n = 15 − 7 = 8",
      "Always check your answer by substituting back",
    ],
  },

  // ─── Fractions ───
  "fractions-of-a-number": {
    tip: "To find a fraction of a number, divide by the denominator and multiply by the numerator.",
    points: [
      "½ of 12 = 12 ÷ 2 = 6",
      "¾ of 20 = (20 ÷ 4) × 3 = 15",
      "Divide first, then multiply",
      "'Of' in math usually means multiply",
    ],
  },
  "order-fractions": {
    tip: "To order fractions, make the denominators the same, then compare the numerators.",
    points: [
      "Same denominator: bigger numerator = bigger fraction",
      "Same numerator: bigger denominator = smaller fraction",
      "Use benchmarks like ½ to help compare quickly",
      "Draw fraction bars to visualize sizes",
    ],
  },
  "simplifying-fractions": {
    tip: "Divide both numerator and denominator by their greatest common factor (GCF).",
    points: [
      "4/8 = 4÷4 / 8÷4 = ½",
      "A fraction is simplest when no number divides both parts evenly",
      "Try dividing by 2, 3, or 5 first",
      "Simplified fractions are easier to compare",
    ],
  },
  "improper-fractions": {
    tip: "An improper fraction has a numerator larger than its denominator. Convert it to a mixed number by dividing.",
    points: [
      "7/4 = 1 whole and 3/4 = 1¾",
      "Divide numerator by denominator: quotient = whole, remainder = new numerator",
      "Mixed to improper: (whole × denominator) + numerator",
      "Example: 2⅓ = (2×3 + 1)/3 = 7/3",
    ],
  },
  "comparing-fractions": {
    tip: "Make denominators the same to compare fractions directly. The one with the bigger numerator is larger.",
    points: [
      "Cross multiply for a quick comparison",
      "Use fraction strips or number lines to visualize",
      "½ is a great benchmark for quick comparisons",
      "Same denominator = same-sized pieces, just count them",
    ],
  },
  "add-fractions": {
    tip: "To add fractions with the same denominator, just add the numerators. Keep the denominator the same.",
    points: [
      "2/5 + 1/5 = 3/5 (add tops, keep bottom)",
      "Different denominators? Find a common denominator first",
      "Simplify the answer if possible",
      "Never add the denominators together!",
    ],
  },
  "subtract-fractions": {
    tip: "To subtract fractions with the same denominator, subtract the numerators. Keep the denominator the same.",
    points: [
      "5/8 − 2/8 = 3/8",
      "Different denominators? Find a common denominator first",
      "Simplify your answer if you can",
      "Check: your answer + the subtracted fraction = the original",
    ],
  },
  "add-and-subtract-fractions": {
    tip: "For mixed operations, find common denominators first, then add or subtract numerators in order.",
    points: [
      "Always find a common denominator before calculating",
      "Follow order of operations: left to right",
      "Simplify the final answer",
      "Estimate first: is the answer more or less than 1?",
    ],
  },
  "compare-sums-and-differences-of-fractions": {
    tip: "Calculate each sum or difference separately, then compare the results.",
    points: [
      "Solve each expression first, then use < > or =",
      "Use estimation to quickly tell which side is bigger",
      "Common denominators help make fair comparisons",
      "Draw models if the fractions are confusing",
    ],
  },
  "add-3-or-more-fractions": {
    tip: "Find a common denominator for all fractions, convert, then add all the numerators.",
    points: [
      "The LCD (least common denominator) works for all fractions at once",
      "Add numerators one at a time if it helps",
      "Simplify the final answer and convert improper fractions",
      "Group fractions that already share a denominator",
    ],
  },

  // ─── Time & Money ───
  "read-clocks": {
    tip: "The short hand shows the hour and the long hand shows the minutes.",
    points: [
      "Hour hand (short): points to the hour",
      "Minute hand (long): each number = 5 minutes",
      "Count by 5s around the clock for minutes",
      "When the minute hand is on 12, it's exactly on the hour",
    ],
  },
  "telling-time": {
    tip: "Read the hour first, then count the minutes. Use 'past' for the first 30 minutes and 'to' for the last 30.",
    points: [
      "Quarter past = 15 minutes, Half past = 30 minutes",
      "Quarter to = 15 minutes before the next hour",
      "A.M. = midnight to noon, P.M. = noon to midnight",
      "Practice with both analog and digital clocks",
    ],
  },
  "digital-clock": {
    tip: "Digital clocks show hours:minutes. The number before the colon is the hour, after is the minutes.",
    points: [
      "3:45 means 3 hours and 45 minutes",
      "Minutes always show two digits (3:05, not 3:5)",
      "12:00 can be noon or midnight — check AM/PM",
      "Convert between analog and digital for practice",
    ],
  },
  "measurement-time": {
    tip: "Elapsed time is the amount of time that passes from start to finish.",
    points: [
      "Count forward from start time to end time",
      "60 minutes = 1 hour, 24 hours = 1 day",
      "Use a number line to count hours, then minutes",
      "Example: 2:30 to 4:15 = 1 hour 45 minutes",
    ],
  },
  "calendars": {
    tip: "Calendars help track days, weeks, and months. There are 12 months and 365 (or 366) days in a year.",
    points: [
      "7 days in a week, about 4 weeks in a month",
      "30 days: April, June, September, November",
      "31 days: Jan, Mar, May, Jul, Aug, Oct, Dec",
      "February: 28 days (29 in a leap year)",
    ],
  },
  "money-amounts": {
    tip: "Count coins from largest to smallest. Add dollars and cents separately.",
    points: [
      "Quarter = 25¢, Dime = 10¢, Nickel = 5¢, Penny = 1¢",
      "Count quarters first, then dimes, nickels, pennies",
      "100 cents = 1 dollar",
      "Use the $ sign and decimal point: $3.50",
    ],
  },
  "money-word-problems": {
    tip: "Read carefully to decide if you need to add, subtract, or compare money amounts.",
    points: [
      "Line up decimal points when adding or subtracting money",
      "Making change = subtract the price from amount paid",
      "Always include the $ sign and two decimal places in your answer",
      "Estimate first to check if your answer is reasonable",
    ],
  },

  // ─── Geometry ───
  "identifying-angles": {
    tip: "An angle is formed where two lines meet. It can be right (90°), acute (< 90°), or obtuse (> 90°).",
    points: [
      "Right angle = exactly 90° (like a corner of a book)",
      "Acute angle = less than 90° (sharp and small)",
      "Obtuse angle = more than 90° (wide open)",
      "Straight angle = exactly 180° (a straight line)",
    ],
  },
  "estimate-angle-measurements": {
    tip: "Use right angles (90°) as a reference point. Is the angle bigger or smaller than a right angle?",
    points: [
      "Compare to 90°: acute is less, obtuse is more",
      "45° is half of a right angle",
      "180° is a straight line",
      "Practice eyeballing angles with a clock face",
    ],
  },
  "measure-angles-with-a-protractor": {
    tip: "Place the protractor's center on the vertex, align one ray with the baseline, and read the degree.",
    points: [
      "Always start from 0° on the baseline",
      "Use the inner or outer scale depending on direction",
      "Acute angles are less than 90°, obtuse are more",
      "Double-check: does your reading match your estimate?",
    ],
  },
  "polygon-names": {
    tip: "Polygons are named by their number of sides: triangle (3), quadrilateral (4), pentagon (5), hexagon (6).",
    points: [
      "Triangle = 3 sides, Quadrilateral = 4 sides",
      "Pentagon = 5, Hexagon = 6, Octagon = 8",
      "All sides must be straight lines (no curves)",
      "Regular polygons have all sides and angles equal",
    ],
  },
  "classify-triangles": {
    tip: "Triangles can be classified by sides (equilateral, isosceles, scalene) or angles (acute, right, obtuse).",
    points: [
      "Equilateral: 3 equal sides, Isosceles: 2 equal sides",
      "Scalene: no equal sides",
      "Right triangle: has one 90° angle",
      "All triangle angles add up to 180°",
    ],
  },
  "parallel-sides-in-quadrilaterals": {
    tip: "Parallel sides never meet — they stay the same distance apart, like train tracks.",
    points: [
      "Parallelogram: 2 pairs of parallel sides",
      "Trapezoid: exactly 1 pair of parallel sides",
      "Rectangle & square: special parallelograms",
      "Use arrows to mark parallel sides in diagrams",
    ],
  },
  "identify-rectangles": {
    tip: "A rectangle has 4 right angles and opposite sides that are equal and parallel.",
    points: [
      "All squares are rectangles, but not all rectangles are squares",
      "A rectangle has 4 sides and 4 right angles (90°)",
      "Opposite sides are equal in length",
      "Diagonals of a rectangle are equal in length",
    ],
  },
  "missing-side-lengths": {
    tip: "Use the perimeter formula or known side lengths to find the missing side.",
    points: [
      "Rectangle: if you know 3 sides, subtract from perimeter",
      "Opposite sides of rectangles are equal",
      "Perimeter = sum of all sides",
      "Set up an equation: P = 2l + 2w, solve for the unknown",
    ],
  },
  "perimeter-and-area-of-squares": {
    tip: "For squares: Perimeter = 4 × side, Area = side × side.",
    points: [
      "All 4 sides of a square are equal",
      "Perimeter is the distance around (measured in units)",
      "Area is the space inside (measured in square units)",
      "Example: side = 5 → P = 20, A = 25",
    ],
  },
  "perimeter-and-area-of-rectangles": {
    tip: "For rectangles: Perimeter = 2 × (length + width), Area = length × width.",
    points: [
      "Perimeter uses addition (distance around)",
      "Area uses multiplication (space inside)",
      "Units: perimeter in cm/m, area in cm²/m²",
      "Example: 6 × 4 rectangle → P = 20, A = 24",
    ],
  },
  "area-or-missing-side-length-of-a-rectangle": {
    tip: "If you know the area and one side, divide the area by that side to find the missing side.",
    points: [
      "Area = length × width → missing side = area ÷ known side",
      "Example: Area = 24, width = 4 → length = 24 ÷ 4 = 6",
      "Check by multiplying both sides to verify the area",
      "Draw and label the rectangle to help visualize",
    ],
  },
  "word-problems": {
    tip: "Read the problem twice. Underline key words and numbers. Decide which operation to use.",
    points: [
      "Key words: total/sum → add, difference/left → subtract",
      "Key words: each/every → multiply, share/split → divide",
      "Draw a picture or diagram to help understand",
      "Always label your answer with the correct unit",
    ],
  },

  // ─── Measurement ───
  "reference-measurement": {
    tip: "Use everyday objects as references: a paperclip ≈ 1 cm, a doorknob height ≈ 1 meter.",
    points: [
      "1 inch ≈ width of a quarter",
      "1 foot ≈ length of a ruler",
      "1 meter ≈ width of a doorway",
      "1 kilogram ≈ weight of a textbook",
    ],
  },
  "metric-length-measurement": {
    tip: "Metric units for length: millimeter (mm), centimeter (cm), meter (m), kilometer (km).",
    points: [
      "10 mm = 1 cm, 100 cm = 1 m, 1000 m = 1 km",
      "Use cm for small objects, m for rooms, km for distances",
      "To convert larger to smaller: multiply",
      "To convert smaller to larger: divide",
    ],
  },
  "customary-length-measurement": {
    tip: "Customary units for length: inch (in), foot (ft), yard (yd), mile (mi).",
    points: [
      "12 inches = 1 foot, 3 feet = 1 yard",
      "5,280 feet = 1 mile",
      "Use a ruler for inches, a yardstick for feet/yards",
      "To convert: multiply (larger → smaller) or divide (smaller → larger)",
    ],
  },
  "metric-capacity-measurement": {
    tip: "Metric capacity measures how much liquid something holds: milliliters (mL) and liters (L).",
    points: [
      "1,000 mL = 1 L",
      "A water bottle ≈ 500 mL, a large jug ≈ 1 L",
      "mL for small amounts, L for large amounts",
      "Multiply by 1,000 to convert L to mL",
    ],
  },
  "customary-capacity-measurement": {
    tip: "Customary capacity: cup, pint, quart, gallon. Remember: 'Gallon man' helps!",
    points: [
      "2 cups = 1 pint, 2 pints = 1 quart, 4 quarts = 1 gallon",
      "8 fluid ounces = 1 cup",
      "A gallon of milk is the big jug!",
      "Memorize: G → 4Q → 8P → 16C",
    ],
  },
  "metric-weight-and-mass-measurement": {
    tip: "Metric mass: grams (g) for light objects, kilograms (kg) for heavier objects.",
    points: [
      "1,000 g = 1 kg",
      "A paperclip ≈ 1 g, a textbook ≈ 1 kg",
      "Use a balance scale to compare weights",
      "To convert kg to g: multiply by 1,000",
    ],
  },
  "customary-weight-and-mass-measurement": {
    tip: "Customary weight: ounces (oz), pounds (lb), tons (T).",
    points: [
      "16 ounces = 1 pound, 2,000 pounds = 1 ton",
      "A slice of bread ≈ 1 oz, a loaf ≈ 1 lb",
      "A small car ≈ 1 ton",
      "Choose the unit that makes sense for the object",
    ],
  },

  // ─── Data & Graphs ───
  "bar-graph": {
    tip: "Bar graphs use bars to show data. The taller the bar, the greater the value.",
    points: [
      "Read the title and axis labels first",
      "Each bar represents a category",
      "Use the scale on the y-axis to read values",
      "Compare bars to find greatest, least, or differences",
    ],
  },
  "tally-and-pictographs": {
    tip: "Tally marks group data in 5s (||||). Pictographs use pictures where each picture = a value.",
    points: [
      "|||| = 5 (four vertical lines with one diagonal)",
      "In pictographs, check the key for each symbol's value",
      "Half symbols = half the value",
      "Count carefully and organize data in a chart",
    ],
  },
  "dot-plots": {
    tip: "A dot plot shows data points on a number line. Each dot represents one data value.",
    points: [
      "Stack dots above the same value",
      "More dots = more frequent value",
      "Easy to find mode (tallest stack) and range",
      "Great for small data sets",
    ],
  },
  "stem-and-leaf-plot": {
    tip: "The stem is the leading digit(s) and the leaf is the last digit. It organizes data by place value.",
    points: [
      "Stem = tens digit, Leaf = ones digit",
      "Example: 35 → stem = 3, leaf = 5",
      "Leaves should be in order from least to greatest",
      "You can read individual values from the plot",
    ],
  },

  // ─── Symmetry & Transformations ───
  "line-segments": {
    tip: "A line segment has two endpoints. A line goes on forever in both directions.",
    points: [
      "Line segment: two endpoints (AB with a bar on top)",
      "Ray: one endpoint, extends forever one direction",
      "Line: no endpoints, extends forever both directions",
      "Measure line segments with a ruler",
    ],
  },
  "identify-lines-of-symmetry": {
    tip: "A line of symmetry divides a shape into two matching halves that are mirror images.",
    points: [
      "Fold the shape along the line — both halves should match",
      "A square has 4 lines of symmetry",
      "A circle has infinite lines of symmetry",
      "Some shapes have no lines of symmetry",
    ],
  },
  "count-lines-of-symmetry": {
    tip: "Count how many different ways you can fold a shape so both halves match perfectly.",
    points: [
      "Rectangle: 2 lines, Square: 4 lines, Circle: infinite",
      "Equilateral triangle: 3 lines",
      "Regular polygons: lines of symmetry = number of sides",
      "Irregular shapes may have 0 or 1 line",
    ],
  },
  "parallel-perpendicular-and-intersecting-lines": {
    tip: "Parallel lines never cross. Perpendicular lines cross at a right angle (90°). Intersecting lines cross at any angle.",
    points: [
      "Parallel lines are like train tracks — always same distance apart",
      "Perpendicular lines form an L shape (90°)",
      "Intersecting lines cross but aren't necessarily perpendicular",
      "Use a square corner to check for perpendicular lines",
    ],
  },

  // ─── Three-Dimensional Figures ───
  "identify-three-dimensional-figures": {
    tip: "3D shapes have length, width, AND height. Common ones: cube, sphere, cylinder, cone, pyramid.",
    points: [
      "Cube: 6 square faces (like a dice)",
      "Sphere: perfectly round (like a ball)",
      "Cylinder: 2 circular faces + curved surface (like a can)",
      "Cone: 1 circular face + pointed top",
    ],
  },
  "count-vertices-edges-and-faces": {
    tip: "Faces are flat surfaces, edges are where faces meet, vertices are corner points.",
    points: [
      "Cube: 6 faces, 12 edges, 8 vertices",
      "Rectangular prism: 6 faces, 12 edges, 8 vertices",
      "Triangular prism: 5 faces, 9 edges, 6 vertices",
      "Use Euler's formula: F + V − E = 2",
    ],
  },
  "identify-faces-of-three-dimensional-figures": {
    tip: "Each face of a 3D shape is a 2D shape. Identify the shape of each face.",
    points: [
      "Cube faces: all squares",
      "Rectangular prism: rectangles (some may be squares)",
      "Triangular prism: 2 triangles + 3 rectangles",
      "Pyramid base can be square or triangle; other faces are triangles",
    ],
  },
};
