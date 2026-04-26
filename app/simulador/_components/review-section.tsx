"use client";

import { OrcamentoFormData, AmbienteItem } from "@/lib/orcamento-types";

interface ReviewSectionProps {
  form: OrcamentoFormData;
  onEdit: (step: string) => void;
}

function ReviewRow({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <div>
      <p className="font-['Spartan'] text-[9px] uppercase tracking-widest text-[#87381e] mb-0.5">
        {label}
      </p>
      <p className="text-sm text-[#2e3d30] font-light leading-relaxed">{value}</p>
    </div>
  );
}

function ReviewBlock({
  title,
  stepKey,
  onEdit,
  children,
}: {
  title: string;
  stepKey: string;
  onEdit: (step: string) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[#bfa086]/30 bg-[#bfa086]/5 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-['Spartan'] text-[10px] uppercase tracking-[0.2em] text-[#756d47]">
          {title}
        </h3>
        <button
          type="button"
          onClick={() => onEdit(stepKey)}
          className="text-[9px] font-['Spartan'] uppercase tracking-widest text-[#87381e] hover:underline"
        >
          Editar
        </button>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Chips({ items }: { items: string[] }) {
  if (!items.length) return <p className="text-sm text-[#756d47] font-light">Nenhum selecionado</p>;
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span key={item} className="px-3 py-1 bg-[#2e3d30] text-[#e3d9ce] rounded-full text-[10px] font-['Spartan'] uppercase tracking-widest">
          {item}
        </span>
      ))}
    </div>
  );
}

function AmbientesChips({ items }: { items: AmbienteItem[] }) {
  if (!items.length) return <p className="text-sm text-[#756d47] font-light">Nenhum selecionado</p>;
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span key={item.nome} className="px-3 py-1 bg-[#2e3d30] text-[#e3d9ce] rounded-full text-[10px] font-['Spartan'] uppercase tracking-widest">
          {item.nome}{item.quantidade > 1 ? ` ×${item.quantidade}` : ""}
        </span>
      ))}
    </div>
  );
}

function ReviewSection({ form, onEdit }: ReviewSectionProps) {
  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <ReviewBlock title="1. Contato e Imóvel" stepKey="identification" onEdit={onEdit}>
        <ReviewRow label="Nome" value={form.nome} />
        <ReviewRow label="Email" value={form.email} />
        <ReviewRow label="Telefone" value={form.telefone} />
        {form.instagram && <ReviewRow label="Instagram" value={`@${form.instagram.replace('@', '')}`} />}
        <div className="grid grid-cols-2 gap-3">
          <ReviewRow label="Tipo de Projeto" value={form.tipoProjeto || null} />
          <ReviewRow label="Tipo de Imóvel" value={form.tipoImovel || null} />
        </div>
      </ReviewBlock>

      <ReviewBlock title="2. Escopo e Investimento" stepKey="scope" onEdit={onEdit}>
        <div>
          <p className="font-['Spartan'] text-[9px] uppercase tracking-widest text-[#87381e] mb-1.5">
            Ambientes
          </p>
          <AmbientesChips items={form.ambientes} />
        </div>
        {form.ambientesPrioritarios.length > 0 && (
          <div>
            <p className="font-['Spartan'] text-[9px] uppercase tracking-widest text-[#87381e] mb-1.5">
              Prioritários
            </p>
            <Chips items={form.ambientesPrioritarios} />
            {form.outrosPrioritarios && (
              <p className="text-xs text-[#756d47] mt-1 font-light">{form.outrosPrioritarios}</p>
            )}
          </div>
        )}
        <ReviewRow label="Escopo" value={form.descricaoEscopo} />
        <div className="grid grid-cols-2 gap-3">
          <ReviewRow label="Investimento" value={form.investimento} />
          <ReviewRow
            label="Moradores"
            value={form.moradoresQuantidade ? `${form.moradoresQuantidade} pessoa(s)` : null}
          />
        </div>
        {form.moradoresIdades && <ReviewRow label="Idades" value={form.moradoresIdades} />}
      </ReviewBlock>

      <ReviewBlock title="3. Preferências e Estilo" stepKey="preferences" onEdit={onEdit}>
        <ReviewRow label="Cor Preferida" value={form.corPreferida} />
        <ReviewRow label="Sustentabilidade" value={form.sustentabilidade ? `${form.sustentabilidade}/10` : null} />
        {form.referencias.length > 0 && (
          <p className="text-xs text-[#756d47] font-light">
            {form.referencias.length} arquivo(s) de referência enviado(s)
          </p>
        )}
      </ReviewBlock>

      <ReviewBlock title="4. Subjetivas e Prazos" stepKey="subjective" onEdit={onEdit}>
        <ReviewRow label="Sábado perfeito" value={form.subjetivaSabado} />
        {form.subjetivaComodo && <ReviewRow label="Cômodo favorito" value={form.subjetivaComodo} />}
        {form.subjetivaEstiloVida && <ReviewRow label="Estilo de vida" value={form.subjetivaEstiloVida} />}
        {form.subjetivaRestricoes && <ReviewRow label="Restrições" value={form.subjetivaRestricoes} />}
        {form.subjetivaMotivacao && <ReviewRow label="Motivação" value={form.subjetivaMotivacao} />}
        <div className="grid grid-cols-2 gap-3">
          {form.prazoData && <ReviewRow label="Prazo Ideal" value={new Date(form.prazoData).toLocaleDateString('pt-BR')} />}
          <ReviewRow label="Flexibilidade" value={form.prazoFlexibilidade ? `${form.prazoFlexibilidade}/5` : null} />
        </div>
      </ReviewBlock>
    </div>
  );
}

export { ReviewSection };
