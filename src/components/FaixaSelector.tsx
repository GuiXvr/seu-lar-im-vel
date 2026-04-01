import { FaixaMCMV } from "@/lib/mcmv";

interface FaixaSelectorProps {
  faixas: FaixaMCMV[];
  selecionada: FaixaMCMV;
  onChange: (faixa: FaixaMCMV) => void;
}

export function FaixaSelector({ faixas, selecionada, onChange }: FaixaSelectorProps) {
  return (
    <section className="rounded-xl border border-border bg-card p-5">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
        Selecione a faixa de renda
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {faixas.map((f) => {
          const ativo = f.id === selecionada.id;
          return (
            <button
              key={f.id}
              onClick={() => onChange(f)}
              className={`rounded-lg border px-3 py-2.5 text-left transition-all ${
                ativo
                  ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                  : "border-border bg-card hover:border-primary/30"
              }`}
            >
              <span
                className={`block text-sm font-semibold ${
                  ativo ? "text-primary" : "text-foreground"
                }`}
              >
                {f.label}
              </span>
              <span className="block text-xs text-muted-foreground mt-0.5">
                Ate R$ {f.rendaMax.toLocaleString("pt-BR")}
              </span>
              <span className="block text-xs text-muted-foreground">
                {f.taxaMin === f.taxaMax
                  ? `${f.taxaMin}% a.a.`
                  : `${f.taxaMin}% - ${f.taxaMax}% a.a.`}
              </span>
            </button>
          );
        })}
      </div>
      <div className="mt-3 rounded-lg bg-secondary/50 px-3.5 py-2.5 text-xs text-muted-foreground">
        <strong className="text-foreground">{selecionada.label}:</strong>{" "}
        {selecionada.description}. Limite do imovel:{" "}
        R$ {selecionada.limiteImovel.toLocaleString("pt-BR")}.
        {selecionada.subsidioMax > 0 &&
          ` Subsidio de ate R$ ${selecionada.subsidioMax.toLocaleString("pt-BR")}.`}
      </div>
    </section>
  );
}
