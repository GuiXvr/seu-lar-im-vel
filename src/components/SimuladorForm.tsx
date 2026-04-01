import { useState, useEffect } from "react";
import { FaixaMCMV } from "@/lib/mcmv";
import { CurrencyInput } from "@/components/CurrencyInput";
import type { SimulacaoInput } from "@/pages/Index";

interface SimuladorFormProps {
  faixa: FaixaMCMV;
  onCalcular: (data: SimulacaoInput) => void;
}

export function SimuladorForm({ faixa, onCalcular }: SimuladorFormProps) {
  const [valorImovel, setValorImovel] = useState(faixa.limiteImovel);
  const [entrada, setEntrada] = useState(Math.round(faixa.limiteImovel * 0.2));
  const [prazo, setPrazo] = useState(360);
  const [sistema, setSistema] = useState<"sac" | "price">("sac");
  const [taxa, setTaxa] = useState(faixa.taxaMax);
  const [renda, setRenda] = useState(faixa.rendaMax);
  const [idade, setIdade] = useState(35);
  const [fgts, setFgts] = useState(0);

  useEffect(() => {
    setTaxa(faixa.taxaMax);
    setValorImovel(faixa.limiteImovel);
    setEntrada(Math.round(faixa.limiteImovel * 0.2));
    setRenda(faixa.rendaMax);
  }, [faixa]);

  const handleSubmit = () => {
    onCalcular({ valorImovel, entrada, prazo, sistema, taxa, renda, idade, fgts });
  };

  const inputClass =
    "w-full h-9 px-3 rounded-lg border border-input bg-secondary/30 text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary transition-colors";
  const selectClass = inputClass;
  const labelClass = "block text-xs font-medium text-muted-foreground mb-1";

  return (
    <section className="rounded-xl border border-border bg-card p-5">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
        Dados do financiamento
      </h2>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className={labelClass}>Valor do imovel (R$)</label>
          <CurrencyInput
            className={inputClass}
            value={valorImovel}
            onChange={setValorImovel}
            min={50000}
          />
        </div>
        <div>
          <label className={labelClass}>Entrada (R$)</label>
          <CurrencyInput
            className={inputClass}
            value={entrada}
            onChange={setEntrada}
            min={0}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className={labelClass}>Prazo</label>
          <select
            className={selectClass}
            value={prazo}
            onChange={(e) => setPrazo(Number(e.target.value))}
          >
            <option value={120}>10 anos (120 meses)</option>
            <option value={180}>15 anos (180 meses)</option>
            <option value={240}>20 anos (240 meses)</option>
            <option value={300}>25 anos (300 meses)</option>
            <option value={360}>30 anos (360 meses)</option>
            <option value={420}>35 anos (420 meses)</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Sistema de amortizacao</label>
          <select
            className={selectClass}
            value={sistema}
            onChange={(e) => setSistema(e.target.value as "sac" | "price")}
          >
            <option value="sac">SAC -- parcelas decrescentes</option>
            <option value="price">PRICE -- parcelas fixas</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-3">
        <div>
          <label className={labelClass}>Taxa de juros (% a.a.)</label>
          <input
            type="number"
            className={inputClass}
            value={taxa}
            onChange={(e) => setTaxa(Number(e.target.value))}
            min={1}
            max={20}
            step={0.01}
          />
        </div>
        <div>
          <label className={labelClass}>Renda familiar (R$)</label>
          <CurrencyInput
            className={inputClass}
            value={renda}
            onChange={setRenda}
            min={1000}
          />
        </div>
        <div>
          <label className={labelClass}>Idade do titular</label>
          <input
            type="number"
            className={inputClass}
            value={idade}
            onChange={(e) => setIdade(Number(e.target.value))}
            min={18}
            max={80}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className={labelClass}>FGTS disponivel (R$)</label>
          <CurrencyInput
            className={inputClass}
            value={fgts}
            onChange={setFgts}
            min={0}
          />
        </div>
        <div />
      </div>

      <button
        onClick={handleSubmit}
        className="w-full h-10 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 active:scale-[0.99] transition-all"
      >
        Calcular financiamento
      </button>
    </section>
  );
}
