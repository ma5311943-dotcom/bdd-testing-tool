import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const MetricsChart = ({ performance, accessibility, bestPractices, seo }) => {
  const data = [
    { subject: "Performance", A: performance || 0 },
    { subject: "Accessibility", A: accessibility || 0 },
    { subject: "Best Practices", A: bestPractices || 0 },
    { subject: "SEO", A: seo || 0 },
  ];

  return (
    <div style={{ width: "100%", height: 350, margin: "2rem auto", position: "relative" }}>
      <ResponsiveContainer>
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="rgba(255,255,255,0.05)" />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 700 }} 
          />
          <PolarRadiusAxis 
            angle={30} 
            domain={[0, 100]} 
            tick={false}
            axisLine={false}
          />
          <Radar
            name="Metrics"
            dataKey="A"
            stroke="var(--primary)"
            fill="var(--primary)"
            fillOpacity={0.4}
            dot={{ r: 4, fill: "var(--primary)", strokeWidth: 2, stroke: "#fff" }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: "rgba(15, 23, 42, 0.9)", 
              border: "1px solid rgba(255, 255, 255, 0.1)", 
              borderRadius: "12px",
              backdropFilter: "blur(10px)",
              color: "#fff"
            }}
            itemStyle={{ color: "var(--primary)" }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MetricsChart;
