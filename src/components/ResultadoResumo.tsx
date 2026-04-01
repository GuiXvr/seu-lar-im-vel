import { SimulacaoRow, fmt, fmtK } from "@/lib/mcmv";

interface Props {
  resumo: {
    financiado: number;
    totalJuros: number;
    totalPago: number;
    comprometimento: number;
    segMes: number;
    entradaTotal: number;
    sistema: string;
  };
  primeira: SimulacaoRow;
  ultima: SimulacaoRow;
  fgts: number;
}

export function ResultadoResumo({ resumo, primeira, ultima, fgts }: Props) {
  const comprTag =
    resumo.comprometimento <= 30
      ? { bg: "bg-success/10", text: "text-success", label: "Renda OK" }
      : resumo.comprometimento <= 35
      ? { bg: "bg-warning/10", text: "text-warning", label: "Renda apertada" }
      : { bg: "bg-destructive/10", text: "text-destructive", label: "Renda insuficiente" };

  return (
    <section className="space-y-3">
      {resumo.comprometimento > 30 && (
        <div className="rounded-lg bg-warning/10 border border-warning/20 px-4 py-3 text-sm text-warning-foreground">
          A CAIXA limita o comprometimento de renda a 30%. Sua 1a parcela
          representa {resumo.comprometimento.toFixed(1)}% da renda. Considere
          aumentar a entrada ou o prazo.
        </div>
      )}

      {fgts > 0 && (
        <div className="rounded-lg bg-info/10 border border-info/20 px-4 py-3 text-sm text-info">
          FGTS de {fmt(fgts)} aplicado como entrada, reduzindo o valor financiado.
        </div>
      )}

      <div className="rounded-xl border border-border bg-card p-5">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          Resumo do financiamento
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <MetricCard
            label="1a parcela"
            value={fmt(primeira.parcela)}
            sub={`${resumo.sistema.toUpperCase()} -- 1a parcela`}
          />
          <MetricCard
            label="Ultima parcela"
            value={fmt(ultima.parcela)}
            sub="inclui seguros"
          />
          <MetricCard
            label="Total de juros"
            value={fmtK(resumo.totalJuros)}
            sub={`${((resumo.totalJuros / resumo.financiado) * 100).toFixed(0)}% do financiado`}
          />
          <MetricCard
            label="Total pago"
            value={fmtK(resumo.totalPago + resumo.entradaTotal)}
            sub={`Comprometimento: ${resumo.comprometimento.toFixed(1)}%`}
          />
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span>
            Valor financiado:{" "}
            <strong className="text-foreground">{fmt(resumo.financiado)}</strong>
          </span>
          <span>
            Seguros/mes:{" "}
            <strong className="text-foreground">{fmt(resumo.segMes)}</strong>
          </span>
          <span>
            Taxa adm.:{" "}
            <strong className="text-foreground">R$ 25,00/mes</strong>
          </span>
          <span
            className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${comprTag.bg} ${comprTag.text}`}
          >
            {comprTag.label} ({resumo.comprometimento.toFixed(1)}%)
          </span>
        </div>
      </div>
    </section>
  );
}

function MetricCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="rounded-lg bg-secondary/50 p-3">
      <div className="text-xs text-muted-foreground mb-1">{label}</div>
      <div className="text-lg font-semibold text-foreground">{value}</div>
      <div className="text-[11px] text-muted-foreground mt-0.5">{sub}</div>
    </div>
  );
}
