"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { OrcamentoSolicitacao, OrcamentoStatus } from "@/lib/orcamento-types";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  Trash2,
  Download,
  Loader2,
  ClipboardList,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const STATUS_LABELS: Record<OrcamentoStatus, string> = {
  nova: "Nova",
  em_contato: "Em contato",
  concluida: "Concluída",
  descartada: "Descartada",
};

const STATUS_COLORS: Record<OrcamentoStatus, string> = {
  nova: "bg-[#87381e] text-[#e3d9ce]",
  em_contato: "bg-[#2e3d30] text-[#e3d9ce]",
  concluida: "bg-[#756d47] text-[#e3d9ce]",
  descartada: "bg-[#bfa086]/40 text-[#756d47]",
};

function StatCard({ label, value, sub }: { label: string; value: number | string; sub?: string }) {
  return (
    <div className="rounded-2xl border border-[#bfa086]/30 bg-[#e3d9ce]/60 p-5 space-y-1">
      <p className="font-['Spartan'] text-[9px] uppercase tracking-widest text-[#87381e]">{label}</p>
      <p className="text-3xl font-serif text-[#2e3d30]">{value}</p>
      {sub && <p className="text-xs text-[#756d47] font-light">{sub}</p>}
    </div>
  );
}

export default function SolicitacoesManager() {
  const [items, setItems] = useState<OrcamentoSolicitacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<OrcamentoStatus | "all">("all");
  const [filterInvestimento, setFilterInvestimento] = useState<string>("all");
  const [filterTipo, setFilterTipo] = useState<string>("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("orcamento_solicitacoes")
      .select("*")
      .order("created_at", { ascending: false });
    setItems((data as OrcamentoSolicitacao[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: OrcamentoStatus) => {
    await supabase.from("orcamento_solicitacoes").update({ status }).eq("id", id);
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
  };

  const deleteItem = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta solicitação?")) return;
    setDeletingId(id);
    await supabase.from("orcamento_solicitacoes").delete().eq("id", id);
    setItems((prev) => prev.filter((i) => i.id !== id));
    setDeletingId(null);
  };

  const downloadAttachment = async (solicitacaoId: string, path: string) => {
    const res = await fetch(`/api/admin/orcamento/${solicitacaoId}/signed-url`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path }),
    });
    const { url } = await res.json();
    if (url) window.open(url, "_blank");
  };

  // Mini-dashboard stats
  const total = items.length;
  const ultimos7 = items.filter(
    (i) => new Date(i.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  ).length;
  const porStatus = items.reduce<Record<OrcamentoStatus, number>>(
    (acc, i) => { acc[i.status] = (acc[i.status] ?? 0) + 1; return acc; },
    { nova: 0, em_contato: 0, concluida: 0, descartada: 0 }
  );
  const investFreq = items.reduce<Record<string, number>>((acc, i) => {
    acc[i.investimento] = (acc[i.investimento] ?? 0) + 1;
    return acc;
  }, {});
  const topInvest = Object.entries(investFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([label, count]) => `${label} (${count})`);

  // Filtros
  const filtered = items.filter((i) => {
    if (filterStatus !== "all" && i.status !== filterStatus) return false;
    if (filterInvestimento !== "all" && i.investimento !== filterInvestimento) return false;
    if (filterTipo !== "all" && i.tipo_projeto !== filterTipo) return false;
    return true;
  });

  const investimentos = [...new Set(items.map((i) => i.investimento))];
  const tipos = [...new Set(items.map((i) => i.tipo_projeto))];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-[#87381e]" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Mini-dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total" value={total} />
        <StatCard label="Últimos 7 dias" value={ultimos7} />
        <StatCard
          label="Por status"
          value={porStatus.nova}
          sub={`${porStatus.em_contato} em contato · ${porStatus.concluida} concluídas`}
        />
        <StatCard
          label="Top investimento"
          value={topInvest[0]?.split(" (")[0] ?? "—"}
          sub={topInvest.slice(1).join(" · ") || undefined}
        />
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-3">
        <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as OrcamentoStatus | "all")}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            {(Object.keys(STATUS_LABELS) as OrcamentoStatus[]).map((s) => (
              <SelectItem key={s} value={s}>{STATUS_LABELS[s]}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterTipo} onValueChange={(v) => setFilterTipo(v ?? "all")}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Tipo de projeto" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os tipos</SelectItem>
            {tipos.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
          </SelectContent>
        </Select>

        <Select value={filterInvestimento} onValueChange={(v) => setFilterInvestimento(v ?? "all")}>
          <SelectTrigger className="w-52">
            <SelectValue placeholder="Investimento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os investimentos</SelectItem>
            {investimentos.map((inv) => <SelectItem key={inv} value={inv}>{inv}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Lista */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-[#756d47]">
          <ClipboardList className="h-10 w-10 opacity-30" />
          <p className="font-['Spartan'] text-[10px] uppercase tracking-widest">Nenhuma solicitação encontrada</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-[#bfa086]/30 bg-[#e3d9ce]/40 overflow-hidden transition-all duration-200"
            >
              {/* Card header */}
              <div
                className="flex items-center gap-4 p-5 cursor-pointer hover:bg-[#bfa086]/10 transition-colors"
                onClick={() => setExpanded(expanded === item.id ? null : item.id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-base font-serif text-[#2e3d30]">{item.nome}</span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[9px] font-['Spartan'] uppercase tracking-widest ${STATUS_COLORS[item.status]}`}
                    >
                      {STATUS_LABELS[item.status]}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-xs text-[#756d47] font-light flex-wrap">
                    <span>{item.tipo_projeto} · {item.tipo_imovel}</span>
                    <span>{item.investimento}</span>
                    <span>{new Date(item.created_at).toLocaleDateString("pt-BR")}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {/* Ações rápidas */}
                  <a
                    href={`mailto:${item.email}`}
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 rounded-xl text-[#756d47] hover:text-[#87381e] hover:bg-[#87381e]/10 transition-all"
                    title="Enviar email"
                  >
                    <Mail className="h-4 w-4" />
                  </a>
                  <a
                    href={`https://wa.me/55${item.telefone.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 rounded-xl text-[#756d47] hover:text-[#2e3d30] hover:bg-[#2e3d30]/10 transition-all"
                    title="WhatsApp"
                  >
                    <Phone className="h-4 w-4" />
                  </a>
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteItem(item.id); }}
                    disabled={deletingId === item.id}
                    className="p-2 rounded-xl text-[#756d47] hover:text-[#87381e] hover:bg-[#87381e]/10 transition-all"
                    title="Excluir"
                  >
                    {deletingId === item.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </button>
                  {expanded === item.id ? (
                    <ChevronUp className="h-4 w-4 text-[#756d47]" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-[#756d47]" />
                  )}
                </div>
              </div>

              {/* Detalhes expandidos */}
              {expanded === item.id && (
                <div className="border-t border-[#bfa086]/20 p-5 space-y-6 animate-in fade-in duration-300">
                  {/* Status e contato */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 space-y-1">
                      <p className="font-['Spartan'] text-[9px] uppercase tracking-widest text-[#87381e]">Contato</p>
                      <p className="text-sm text-[#2e3d30] font-light">{item.email}</p>
                      <p className="text-sm text-[#2e3d30] font-light">{item.telefone}</p>
                      {item.instagram && (
                        <p className="text-sm text-[#756d47] font-light">@{item.instagram}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <p className="font-['Spartan'] text-[9px] uppercase tracking-widest text-[#87381e]">Status</p>
                      <Select
                        value={item.status}
                        onValueChange={(v) => updateStatus(item.id, v as OrcamentoStatus)}
                      >
                        <SelectTrigger className="w-44">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {(Object.keys(STATUS_LABELS) as OrcamentoStatus[]).map((s) => (
                            <SelectItem key={s} value={s}>{STATUS_LABELS[s]}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Escopo */}
                  <div>
                    <p className="font-['Spartan'] text-[9px] uppercase tracking-widest text-[#87381e] mb-2">Escopo</p>
                    <p className="text-sm text-[#2e3d30] font-light leading-relaxed">{item.descricao_escopo}</p>
                    {item.ambientes?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {item.ambientes.map((a: string | { nome: string; quantidade: number }) => {
                          const nome = typeof a === "string" ? a : a.nome;
                          const qty = typeof a === "string" ? 1 : a.quantidade;
                          return (
                            <span key={nome} className="px-2.5 py-1 bg-[#2e3d30]/10 text-[#2e3d30] rounded-full text-[10px] font-['Spartan'] uppercase tracking-widest">
                              {nome}{qty > 1 ? ` ×${qty}` : ""}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Subjetivas */}
                  {item.subjetiva_sabado && (
                    <div>
                      <p className="font-['Spartan'] text-[9px] uppercase tracking-widest text-[#87381e] mb-1">Sábado perfeito</p>
                      <p className="text-sm text-[#2e3d30] font-light italic leading-relaxed">"{item.subjetiva_sabado}"</p>
                    </div>
                  )}

                  {/* Prazo */}
                  {item.prazo_data && (
                    <div className="flex gap-6">
                      <div>
                        <p className="font-['Spartan'] text-[9px] uppercase tracking-widest text-[#87381e] mb-1">Prazo ideal</p>
                        <p className="text-sm text-[#2e3d30] font-light">
                          {new Date(item.prazo_data).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                      {item.prazo_flexibilidade && (
                        <div>
                          <p className="font-['Spartan'] text-[9px] uppercase tracking-widest text-[#87381e] mb-1">Flexibilidade</p>
                          <p className="text-sm text-[#2e3d30] font-light">{item.prazo_flexibilidade}/5</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Anexos */}
                  {item.referencias?.length > 0 && (
                    <div>
                      <p className="font-['Spartan'] text-[9px] uppercase tracking-widest text-[#87381e] mb-2">Referências visuais</p>
                      <div className="flex flex-wrap gap-2">
                        {item.referencias.map((path: string) => (
                          <Button
                            key={path}
                            variant="outline"
                            onClick={() => downloadAttachment(item.id, path)}
                            className="text-xs gap-2"
                          >
                            <Download className="h-3.5 w-3.5" />
                            {path.split("/").pop()}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
