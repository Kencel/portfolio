export function HalftoneLayer({
  color,
  dotRadius = 1.3,
  gap = 15,
  opacity = 1,
}: {
  color: string;
  dotRadius?: number;
  gap?: number;
  opacity?: number;
}) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: '0px',
        backgroundImage: `radial-gradient(${color} ${dotRadius}px, transparent ${(dotRadius + 0.1).toFixed(1)}px)`,
        backgroundSize: `${gap}px ${gap}px`,
        opacity,
        pointerEvents: 'none',
      }}
    />
  );
}
