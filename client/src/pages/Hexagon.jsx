function Hexagon() {
  const size = 52; // اندازه شعاع دایره‌ی محاطی
  const centerX = 70;
  const centerY = 70;

  const points = [...Array(6)]
    .map((_, i) => {
      const angle_deg = 60 * i + 60; // شروع از -30 تا ضلع بالا افقی باشه
      const angle_rad = (Math.PI / 180) * angle_deg;
      const x = centerX + size * Math.cos(angle_rad);
      const y = centerY + size * Math.sin(angle_rad);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg
      width="140"
      height="140"
      viewBox="0 0 140 140"
      style={{
        display: "block",
        margin: "100px auto",
        background: "transparent",
        // background: "black",
      }}
    >
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#a2e8ff" />
          <stop offset="100%" stopColor="#ffffff" />
        </linearGradient>
      </defs>

      <polygon
        points={points}
        fill="transparent"
        stroke="#00ccff"
        strokeWidth="1.5"
      />

      <polygon
        points={points}
        fill="transparent"
        stroke="url(#blueGradient)"
        strokeWidth="2"
        strokeDasharray="60 240"
        strokeDashoffset="0"
        filter="url(#glow)"
      >
        <animate
          attributeName="stroke-dashoffset"
          values="0;-300"
          dur="4s"
          repeatCount="indefinite"
        />
      </polygon>
    </svg>
  );
}

export default Hexagon;
