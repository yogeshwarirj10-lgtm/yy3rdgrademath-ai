interface AnalogClockProps {
  hours: number;
  minutes: number;
  size?: number;
}

const AnalogClock = ({ hours, minutes, size = 120 }: AnalogClockProps) => {
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.42;

  // Angles (0° = 12 o'clock, clockwise)
  const minuteAngle = (minutes / 60) * 360;
  const hourAngle = ((hours % 12) / 12) * 360 + (minutes / 60) * 30;

  const hand = (angle: number, length: number, width: number, color: string) => {
    const rad = ((angle - 90) * Math.PI) / 180;
    const x2 = cx + length * Math.cos(rad);
    const y2 = cy + length * Math.sin(rad);
    return (
      <line
        x1={cx}
        y1={cy}
        x2={x2}
        y2={y2}
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
      />
    );
  };

  const tickMarks = Array.from({ length: 12 }, (_, i) => {
    const angle = ((i * 30 - 90) * Math.PI) / 180;
    const isMain = i % 3 === 0;
    const outerR = r * 0.95;
    const innerR = isMain ? r * 0.75 : r * 0.82;
    return (
      <line
        key={i}
        x1={cx + innerR * Math.cos(angle)}
        y1={cy + innerR * Math.sin(angle)}
        x2={cx + outerR * Math.cos(angle)}
        y2={cy + outerR * Math.sin(angle)}
        stroke="hsl(var(--foreground))"
        strokeWidth={isMain ? 2.5 : 1.2}
        strokeLinecap="round"
      />
    );
  });

  const numbers = Array.from({ length: 12 }, (_, i) => {
    const num = i === 0 ? 12 : i;
    const angle = ((i * 30 - 90) * Math.PI) / 180;
    const numR = r * 0.62;
    return (
      <text
        key={num}
        x={cx + numR * Math.cos(angle)}
        y={cy + numR * Math.sin(angle)}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={size * 0.11}
        fontWeight="600"
        fill="hsl(var(--foreground))"
      >
        {num}
      </text>
    );
  });

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="inline-block"
      aria-label={`Clock showing ${hours % 12 || 12}:${String(minutes).padStart(2, "0")}`}
    >
      {/* Face */}
      <circle cx={cx} cy={cy} r={r} fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth={2.5} />
      {tickMarks}
      {numbers}
      {/* Hour hand */}
      {hand(hourAngle, r * 0.5, size * 0.035, "hsl(var(--foreground))")}
      {/* Minute hand */}
      {hand(minuteAngle, r * 0.72, size * 0.025, "hsl(var(--primary))")}
      {/* Center dot */}
      <circle cx={cx} cy={cy} r={size * 0.03} fill="hsl(var(--foreground))" />
    </svg>
  );
};

export default AnalogClock;
