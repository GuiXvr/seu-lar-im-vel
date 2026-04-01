import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { SimulacaoRow } from "@/lib/mcmv";

interface Props {
  rows: SimulacaoRow[];
}

export function GraficoEvolucao({ rows }: Props) {
  const data = useMemo(() => {
    const step = Math.max(1, Math.floor(rows.length / 36));
    let jurosAcum = 0;
    const points: { mes: string; saldo: number; juros: number }[] = [];

    rows.forEach((r, i) => {
      jurosAcum += r.juros;
      if (i % step === 0 || i === rows.length - 1) {
        points.push({
          mes: `${r.mes}m`,
          saldo: Math.round(r.saldo),
          juros: Math.round(jurosAcum),
        });
      }
    });

    return points;
  }, [rows]);

  const formatValue = (v: number) =>
    `R$ ${(v / 1000).toLocaleString("pt-BR", { maximumFractionDigits: 0 })}k`;

  return (
    <div>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(150 12% 88%)" />
          <XAxis
            dataKey="mes"
            tick={{ fontSize: 11, fill: "hsl(200 10% 45%)" }}
          />
          <YAxis
            tickFormatter={formatValue}
            tick={{ fontSize: 11, fill: "hsl(200 10% 45%)" }}
          />
          <Tooltip
            formatter={(value: number) =>
              `R$ ${value.toLocaleString("pt-BR")}`
            }
            contentStyle={{
              background: "hsl(0 0% 100%)",
              border: "1px solid hsl(150 12% 88%)",
              borderRadius: "8px",
              fontSize: "12px",
            }}
          />
          <Line
            type="monotone"
            dataKey="saldo"
            name="Saldo devedor"
            stroke="hsl(152 55% 33%)"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="juros"
            name="Juros acumulados"
            stroke="hsl(38 80% 50%)"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
      <div className="flex gap-5 mt-2 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-primary" />
          Saldo devedor
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-accent" />
          Juros acumulados
        </span>
      </div>
    </div>
  );
}
