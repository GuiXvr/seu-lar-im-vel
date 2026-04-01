import { useState, useCallback } from "react";
import {
  FAIXAS_MCMV,
  FaixaMCMV,
  SimulacaoRow,
  calcSAC,
  calcPRICE,
  fmt,
  fmtK,
} from "@/lib/mcmv";
import { FaixaSelector } from "@/components/FaixaSelector";
import { SimuladorForm } from "@/components/SimuladorForm";
import { ResultadoResumo } from "@/components/ResultadoResumo";
import { TabelaMensal } from "@/components/TabelaMensal";
import { GraficoEvolucao } from "@/components/GraficoEvolucao";
import { AmortizacaoExtra } from "@/components/AmortizacaoExtra";

export interface SimulacaoInput {
  valorImovel: number;
  entrada: number;
  prazo: number;
  sistema: "sac" | "price";
  taxa: number;
  renda: number;
  idade: number;
  fgts: number;
}

const Index = () => {
  const [faixaSelecionada, setFaixaSelecionada] = useState<FaixaMCMV>(
    FAIXAS_MCMV[2]
  );
  const [tabela, setTabela] = useState<SimulacaoRow[]>([]);
  const [resumo, setResumo] = useState<{
    financiado: number;
    totalJuros: number;
    totalPago: number;
    comprometimento: number;
    segMes: number;
    entradaTotal: number;
    sistema: string;
  } | null>(null);
  const [abaAtiva, setAbaAtiva] = useState<"tabela" | "grafico" | "amortizacao">(
    "tabela"
  );
  const [inputData, setInputData] = useState<SimulacaoInput | null>(null);

  const handleFaixaChange = useCallback((faixa: FaixaMCMV) => {
    setFaixaSelecionada(faixa);
    setTabela([]);
    setResumo(null);
  }, []);

  const handleCalcular = useCallback((data: SimulacaoInput) => {
    const entradaTotal = data.entrada + data.fgts;
    const financiado = data.valorImovel - entradaTotal;

    if (financiado <= 0) return;

    const taxaMensal = data.taxa / 100 / 12;
    const rows =
      data.sistema === "sac"
        ? calcSAC(financiado, taxaMensal, data.prazo, data.idade)
        : calcPRICE(financiado, taxaMensal, data.prazo, data.idade);

    const totalJuros = rows.reduce((s, r) => s + r.juros, 0);
    const totalPago = rows.reduce((s, r) => s + r.amort + r.juros + r.seg, 0);
    const comprometimento = (rows[0].parcela / data.renda) * 100;

    setTabela(rows);
    setInputData(data);
    setResumo({
      financiado,
      totalJuros,
      totalPago,
      comprometimento,
      segMes: rows[0].seg,
      entradaTotal,
      sistema: data.sistema,
    });
    setAbaAtiva("tabela");
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-3xl px-4 py-5">
          <h1 className="text-xl font-bold text-foreground tracking-tight">
            Simulador Minha Casa Minha Vida
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Simule seu financiamento habitacional com as taxas do programa
            federal -- valores de referencia 2026
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-6 space-y-5">
        {/* Faixa Selector */}
        <FaixaSelector
          faixas={FAIXAS_MCMV}
          selecionada={faixaSelecionada}
          onChange={handleFaixaChange}
        />

        {/* Form */}
        <SimuladorForm
          faixa={faixaSelecionada}
          onCalcular={handleCalcular}
        />

        {/* Resultados */}
        {resumo && tabela.length > 0 && (
          <>
            <ResultadoResumo
              resumo={resumo}
              primeira={tabela[0]}
              ultima={tabela[tabela.length - 1]}
              fgts={inputData?.fgts || 0}
            />

            {/* Tabs */}
            <section className="rounded-xl border border-border bg-card p-5">
              <div className="flex gap-1.5 mb-4">
                {(
                  [
                    { key: "tabela", label: "Tabela mensal" },
                    { key: "grafico", label: "Evolucao do saldo" },
                    { key: "amortizacao", label: "Amortizacao extra" },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setAbaAtiva(tab.key)}
                    className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      abaAtiva === tab.key
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {abaAtiva === "tabela" && <TabelaMensal rows={tabela} />}
              {abaAtiva === "grafico" && <GraficoEvolucao rows={tabela} />}
              {abaAtiva === "amortizacao" && inputData && (
                <AmortizacaoExtra tabela={tabela} inputData={inputData} />
              )}
            </section>
          </>
        )}

        {/* Footer */}
        <footer className="text-center text-xs text-muted-foreground py-4 border-t border-border">
          <p>
            Simulacao meramente ilustrativa. Valores sujeitos a analise de
            credito pela CAIXA. Consulte uma agencia para valores oficiais.
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Index;
