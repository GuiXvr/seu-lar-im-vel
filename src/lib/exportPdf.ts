import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { SimulacaoRow, fmt } from "@/lib/mcmv";
import type { SimulacaoInput } from "@/pages/Index";

interface ResumoData {
  financiado: number;
  totalJuros: number;
  totalPago: number;
  comprometimento: number;
  segMes: number;
  entradaTotal: number;
  sistema: string;
}

export function exportarPDF(
  rows: SimulacaoRow[],
  resumo: ResumoData,
  input: SimulacaoInput
) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header
  doc.setFillColor(0, 100, 60);
  doc.rect(0, 0, pageWidth, 28, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Simulacao Minha Casa Minha Vida 2026", 14, 14);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(
    `Gerado em ${new Date().toLocaleDateString("pt-BR")}`,
    14,
    22
  );

  // Reset text color
  doc.setTextColor(30, 30, 30);
  let y = 36;

  // Dados do financiamento
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Dados do financiamento", 14, y);
  y += 6;

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  const dados = [
    ["Valor do imovel", fmt(input.valorImovel)],
    ["Entrada + FGTS", fmt(resumo.entradaTotal)],
    ["Valor financiado", fmt(resumo.financiado)],
    ["Prazo", `${input.prazo} meses (${Math.round(input.prazo / 12)} anos)`],
    ["Sistema", resumo.sistema.toUpperCase()],
    ["Taxa de juros", `${input.taxa.toFixed(2)}% a.a.`],
    ["Renda familiar", fmt(input.renda)],
    ["Idade do titular", `${input.idade} anos`],
  ];

  dados.forEach(([label, value]) => {
    doc.text(`${label}: ${value}`, 14, y);
    y += 5;
  });

  y += 4;

  // Resumo
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Resumo", 14, y);
  y += 6;

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  const resumoLinhas = [
    ["1a parcela", fmt(rows[0].parcela)],
    ["Ultima parcela", fmt(rows[rows.length - 1].parcela)],
    ["Total de juros", fmt(resumo.totalJuros)],
    ["Total pago (com entrada)", fmt(resumo.totalPago + resumo.entradaTotal)],
    ["Comprometimento de renda", `${resumo.comprometimento.toFixed(1)}%`],
    ["Seguros/mes (1a parcela)", fmt(resumo.segMes)],
  ];

  resumoLinhas.forEach(([label, value]) => {
    doc.text(`${label}: ${value}`, 14, y);
    y += 5;
  });

  y += 6;

  // Tabela - primeiros 36 meses + ultimo
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Tabela de parcelas (36 primeiros meses + ultimo)", 14, y);
  y += 2;

  const tabelaRows = rows
    .filter((_, i) => i < 36 || i === rows.length - 1)
    .map((r, idx, arr) => {
      const isLast = idx === arr.length - 1 && rows.length > 36;
      return [
        isLast ? `... ${r.mes}` : String(r.mes),
        fmt(r.parcela),
        fmt(r.amort),
        fmt(r.juros),
        fmt(r.seg),
        fmt(r.saldo),
      ];
    });

  autoTable(doc, {
    startY: y,
    head: [["Mes", "Parcela", "Amortizacao", "Juros", "Seguros", "Saldo"]],
    body: tabelaRows,
    styles: {
      fontSize: 7.5,
      cellPadding: 1.5,
    },
    headStyles: {
      fillColor: [0, 100, 60],
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [245, 248, 245],
    },
    margin: { left: 14, right: 14 },
  });

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setTextColor(140, 140, 140);
    doc.text(
      "Simulacao meramente ilustrativa. Valores sujeitos a analise de credito pela CAIXA.",
      14,
      doc.internal.pageSize.getHeight() - 8
    );
    doc.text(
      `Pagina ${i} de ${pageCount}`,
      pageWidth - 14,
      doc.internal.pageSize.getHeight() - 8,
      { align: "right" }
    );
  }

  doc.save("simulacao-mcmv-2026.pdf");
}
