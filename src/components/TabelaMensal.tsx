import { SimulacaoRow, fmt } from "@/lib/mcmv";

interface Props {
  rows: SimulacaoRow[];
}

export function TabelaMensal({ rows }: Props) {
  const exibir = rows.filter((_, i) => i < 60 || i === rows.length - 1);

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground">
                Mes
              </th>
              <th className="text-right py-2 px-2 text-xs font-medium text-muted-foreground">
                Parcela
              </th>
              <th className="text-right py-2 px-2 text-xs font-medium text-muted-foreground">
                Amortizacao
              </th>
              <th className="text-right py-2 px-2 text-xs font-medium text-muted-foreground">
                Juros
              </th>
              <th className="text-right py-2 px-2 text-xs font-medium text-muted-foreground">
                Seguros
              </th>
              <th className="text-right py-2 px-2 text-xs font-medium text-muted-foreground">
                Saldo devedor
              </th>
            </tr>
          </thead>
          <tbody>
            {exibir.map((r, idx) => {
              const isLast = idx === exibir.length - 1 && rows.length > 60;
              return (
                <tr
                  key={r.mes}
                  className={`border-b border-border/50 hover:bg-secondary/30 transition-colors ${
                    isLast ? "font-medium" : ""
                  }`}
                >
                  <td className="py-1.5 px-2 text-muted-foreground">
                    {isLast ? `... ${r.mes}` : r.mes}
                  </td>
                  <td className="py-1.5 px-2 text-right text-foreground">
                    {fmt(r.parcela)}
                  </td>
                  <td className="py-1.5 px-2 text-right text-foreground">
                    {fmt(r.amort)}
                  </td>
                  <td className="py-1.5 px-2 text-right text-foreground">
                    {fmt(r.juros)}
                  </td>
                  <td className="py-1.5 px-2 text-right text-foreground">
                    {fmt(r.seg)}
                  </td>
                  <td className="py-1.5 px-2 text-right text-foreground">
                    {fmt(r.saldo)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="text-[11px] text-muted-foreground mt-2">
        Exibindo os primeiros 60 meses + ultimo. Valores sem correcao pela TR.
      </p>
    </div>
  );
}
