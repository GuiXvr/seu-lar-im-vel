export type FaixaMCMV = {
  id: string;
  label: string;
  rendaMin: number;
  rendaMax: number;
  taxaMin: number;
  taxaMax: number;
  limiteImovel: number;
  subsidioMax: number;
  description: string;
};

export const FAIXAS_MCMV: FaixaMCMV[] = [
  {
    id: "faixa1",
    label: "Faixa 1",
    rendaMin: 0,
    rendaMax: 2850,
    taxaMin: 4.0,
    taxaMax: 5.0,
    limiteImovel: 190000,
    subsidioMax: 55000,
    description: "Renda bruta familiar mensal ate R$ 2.850",
  },
  {
    id: "faixa2",
    label: "Faixa 2",
    rendaMin: 2850.01,
    rendaMax: 4700,
    taxaMin: 5.5,
    taxaMax: 7.0,
    limiteImovel: 264000,
    subsidioMax: 55000,
    description: "Renda bruta familiar mensal de R$ 2.850 ate R$ 4.700",
  },
  {
    id: "faixa3",
    label: "Faixa 3",
    rendaMin: 4700.01,
    rendaMax: 8600,
    taxaMin: 7.66,
    taxaMax: 8.16,
    limiteImovel: 350000,
    subsidioMax: 0,
    description: "Renda bruta familiar mensal de R$ 4.700 ate R$ 8.600",
  },
  {
    id: "faixa4",
    label: "Faixa 4",
    rendaMin: 8600.01,
    rendaMax: 12000,
    taxaMin: 10.5,
    taxaMax: 10.5,
    limiteImovel: 500000,
    subsidioMax: 0,
    description: "Renda bruta familiar mensal de R$ 8.600 ate R$ 12.000",
  },
];

export interface SimulacaoRow {
  mes: number;
  parcela: number;
  amort: number;
  juros: number;
  seg: number;
  saldo: number;
}

export function fmt(v: number): string {
  return (
    "R$ " +
    v.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
}

export function fmtK(v: number): string {
  if (v >= 1000000) {
    return (
      "R$ " +
      (v / 1000000).toLocaleString("pt-BR", {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      }) +
      " mi"
    );
  }
  return (
    "R$ " +
    (v / 1000).toLocaleString("pt-BR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }) +
    " mil"
  );
}

function calcSeguro(saldo: number, idade: number): number {
  const mip = (0.00018 + (idade - 18) * 0.000006) * saldo;
  const dfi = 0.0001337 * saldo;
  return mip + dfi + 25;
}

export function calcSAC(
  financiado: number,
  taxaMensal: number,
  meses: number,
  idade: number
): SimulacaoRow[] {
  const amort = financiado / meses;
  let saldo = financiado;
  const rows: SimulacaoRow[] = [];
  for (let i = 1; i <= meses; i++) {
    const juros = saldo * taxaMensal;
    const seg = calcSeguro(saldo, Math.min(idade + Math.floor(i / 12), 79));
    const parcela = amort + juros + seg;
    saldo -= amort;
    if (saldo < 0.01) saldo = 0;
    rows.push({ mes: i, parcela, amort, juros, seg, saldo });
  }
  return rows;
}

export function calcPRICE(
  financiado: number,
  taxaMensal: number,
  meses: number,
  idade: number
): SimulacaoRow[] {
  const pmt =
    (financiado * taxaMensal) / (1 - Math.pow(1 + taxaMensal, -meses));
  let saldo = financiado;
  const rows: SimulacaoRow[] = [];
  for (let i = 1; i <= meses; i++) {
    const juros = saldo * taxaMensal;
    const amort = pmt - juros;
    const seg = calcSeguro(saldo, Math.min(idade + Math.floor(i / 12), 79));
    const parcela = pmt + seg;
    saldo -= amort;
    if (saldo < 0.01) saldo = 0;
    rows.push({ mes: i, parcela, amort, juros, seg, saldo });
  }
  return rows;
}
