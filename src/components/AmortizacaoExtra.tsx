import { useState } from "react";
import { SimulacaoRow, calcSAC, calcPRICE, fmt } from "@/lib/mcmv";
import type { SimulacaoInput } from "@/pages/Index";

interface Props {
  tabela: SimulacaoRow[];
  inputData: SimulacaoInput;
}

export function AmortizacaoExtra({ tabela, inputData }: Props) {
  const [mes, setMes] = useState(12);
  const [valor, setValor] = useState(20000);
  const [tipo, setTipo] = useState<"prazo" | "parcela">("prazo");
  const [resultado, setResultado] = useState<{
    economia: number;
    novoMeses: number;
    mesesRestantes: number;
    totalNormal: number;
    totalAmort: number;
    novaParcela?: number;
    parcelaAnterior?: number;
  } | null>(null);

  const handleSimular = () => {
    if (mes >= inputData.prazo) return;

    const taxaMensal = inputData.taxa / 100 / 12;
    const saldoAntes = tabela[mes - 1].saldo;
    const saldoApos = Math.max(0, saldoAntes - valor);
    const mesesRestantes = inputData.prazo - mes;

    const rowsNormal = tabela.slice(mes);
    let rowsAmort: SimulacaoRow[];
    let novoMeses = mesesRestantes;

    if (tipo === "prazo") {
      const amortOriginal = tabela[0].amort;
      novoMeses = Math.ceil(saldoApos / amortOriginal);
      rowsAmort = calcSAC(
        saldoApos,
        taxaMensal,
        novoMeses,
        inputData.idade + Math.floor(mes / 12)
      );
    } else {
      rowsAmort =
        inputData.sistema === "sac"
          ? calcSAC(saldoApos, taxaMensal, mesesRestantes, inputData.idade + Math.floor(mes / 12))
          : calcPRICE(saldoApos, taxaMensal, mesesRestantes, inputData.idade + Math.floor(mes / 12));
    }

    const totalNormal = rowsNormal.reduce((s, r) => s + r.amort + r.juros + r.seg, 0);
    const totalAmort = rowsAmort.reduce((s, r) => s + r.amort + r.juros + r.seg, 0);

    setResultado({
      economia: totalNormal - totalAmort - valor,
      novoMeses,
      mesesRestantes,
      totalNormal,
      totalAmort,
      novaParcela: tipo === "parcela" && rowsAmort.length ? rowsAmort[0].parcela : undefined,
      parcelaAnterior: tipo === "parcela" ? tabela[mes]?.parcela : undefined,
    });
  };

  const inputClass =
    "w-full h-9 px-3 rounded-lg border border-input bg-secondary/30 text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary transition-colors";
  const labelClass = "block text-xs font-medium text-muted-foreground mb-1";

  return (
    <div>
      <div className="rounded-lg bg-info/10 border border-info/20 px-4 py-3 text-sm text-info mb-4">
        Simule o efeito de uma amortizacao extraordinaria sobre o saldo devedor e
        total pago.
      </div>

      <div className="grid grid-cols-3 gap-3 mb-3">
        <div>
          <label className={labelClass}>Mes da amortizacao</label>
          <input
            type="number"
            className={inputClass}
            value={mes}
            onChange={(e) => setMes(Number(e.target.value))}
            min={1}
          />
        </div>
        <div>
          <label className={labelClass}>Valor amortizado (R$)</label>
          <input
            type="number"
            className={inputClass}
            value={valor}
            onChange={(e) => setValor(Number(e.target.value))}
            min={1000}
            step={1000}
          />
        </div>
        <div>
          <label className={labelClass}>Modalidade</label>
          <select
            className={inputClass}
            value={tipo}
            onChange={(e) => setTipo(e.target.value as "prazo" | "parcela")}
          >
            <option value="prazo">Reduzir prazo</option>
            <option value="parcela">Reduzir parcela</option>
          </select>
        </div>
      </div>

      <button
        onClick={handleSimular}
        className="w-full h-10 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 active:scale-[0.99] transition-all"
      >
        Simular amortizacao
      </button>

      {resultado && (
        <div className="mt-4 grid grid-cols-3 gap-3">
          <div className="rounded-lg bg-secondary/50 p-3">
            <div className="text-xs text-muted-foreground mb-1">
              Economia em juros
            </div>
            <div className="text-lg font-semibold text-success">
              {fmt(resultado.totalNormal - resultado.totalAmort)}
            </div>
            <div className="text-[11px] text-muted-foreground">
              vs. sem amortizacao
            </div>
          </div>
          <div className="rounded-lg bg-secondary/50 p-3">
            <div className="text-xs text-muted-foreground mb-1">
              Novo prazo restante
            </div>
            <div className="text-lg font-semibold text-foreground">
              {resultado.novoMeses} meses
            </div>
            <div className="text-[11px] text-muted-foreground">
              era {resultado.mesesRestantes} meses
            </div>
          </div>
          <div className="rounded-lg bg-secondary/50 p-3">
            <div className="text-xs text-muted-foreground mb-1">
              {tipo === "parcela" ? "Nova 1a parcela" : "Meses economizados"}
            </div>
            <div className="text-lg font-semibold text-foreground">
              {tipo === "parcela" && resultado.novaParcela
                ? fmt(resultado.novaParcela)
                : `${resultado.mesesRestantes - resultado.novoMeses}`}
            </div>
            <div className="text-[11px] text-muted-foreground">
              {tipo === "parcela" && resultado.parcelaAnterior
                ? `era ${fmt(resultado.parcelaAnterior)}`
                : "reducao de prazo"}
            </div>
          </div>
          <div className="col-span-3 text-xs text-muted-foreground mt-1">
            A economia liquida (descontando o valor amortizado) e de{" "}
            <strong className="text-foreground">{fmt(resultado.economia)}</strong>{" "}
            em juros futuros.
          </div>
        </div>
      )}
    </div>
  );
}
