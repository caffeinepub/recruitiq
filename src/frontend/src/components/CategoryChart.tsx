import { ALL_CATEGORIES } from "@/data/examData";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface CategoryScore {
  correct: number;
  total: number;
  percentage: number;
}

interface Props {
  categoryScores: Record<string, CategoryScore>;
}

const ABBREV: Record<string, string> = {
  "Reading Comprehension": "Reading",
  "Grammar and Spelling": "Grammar",
  Vocabulary: "Vocab",
  "Report Writing": "Reports",
  "Memory and Observation": "Memory",
  Arithmetic: "Math",
  "Word Problems": "Word Prob",
  "Logic and Reasoning": "Logic",
  "Map Reading": "Maps",
  "Situational Judgment": "Situational",
  "Ethical Decision Making": "Ethics",
  "Pattern Recognition": "Patterns",
  "Following Instructions": "Instructions",
  "Public Safety Communication": "Comm",
  "Canadian Law Enforcement": "CA Law",
  "USA Law Enforcement": "US Law",
};

function barColor(pct: number) {
  if (pct >= 80) return "oklch(0.40 0.20 250)"; // blue
  if (pct >= 65) return "oklch(0.60 0.08 230)"; // steel silver-blue
  return "oklch(0.65 0.19 22)"; // red
}

interface TooltipPayload {
  name: string;
  value: number;
  payload: ChartEntry;
}

interface ChartEntry {
  category: string;
  pct: number;
  total: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="bg-card border border-border rounded-lg px-3 py-2 text-xs shadow-lg">
      <p className="font-semibold mb-1">{d.payload.category}</p>
      <p>
        Score: <span className="font-bold">{d.value}%</span>
      </p>
      <p className="text-muted-foreground">{d.payload.total} questions</p>
    </div>
  );
}

export function CategoryChart({ categoryScores }: Props) {
  const data: ChartEntry[] = ALL_CATEGORIES.filter(
    (cat) => categoryScores[cat]?.total > 0,
  ).map((cat) => ({
    category: cat,
    abbrev: ABBREV[cat] ?? cat.slice(0, 8),
    pct: categoryScores[cat].percentage,
    total: categoryScores[cat].total,
  }));

  if (data.length === 0) return null;

  return (
    <div style={{ width: "100%", overflowX: "auto" }}>
      <div style={{ minWidth: 520 }}>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart
            data={data}
            margin={{ top: 8, right: 12, left: -10, bottom: 60 }}
            barCategoryGap="25%"
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="oklch(0.28 0.032 265 / 0.4)"
              vertical={false}
            />
            <XAxis
              dataKey="abbrev"
              tick={{ fontSize: 10, fill: "oklch(0.55 0.015 265)" }}
              angle={-40}
              textAnchor="end"
              interval={0}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 10, fill: "oklch(0.55 0.015 265)" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: number) => `${v}%`}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "oklch(0.28 0.032 265 / 0.3)" }}
            />
            <ReferenceLine
              y={80}
              stroke="oklch(0.65 0.19 22)"
              strokeDasharray="5 3"
              strokeWidth={1.5}
              label={{
                value: "Pass 80%",
                position: "insideTopRight",
                fontSize: 9,
                fill: "oklch(0.65 0.19 22)",
              }}
            />
            <Bar dataKey="pct" radius={[4, 4, 0, 0]} maxBarSize={32}>
              {data.map((entry) => (
                <Cell key={entry.category} fill={barColor(entry.pct)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
