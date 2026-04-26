export type OrcamentoStatus = 'nova' | 'em_contato' | 'concluida' | 'descartada';

export interface AmbienteItem {
  nome: string;
  quantidade: number;
}

export type TipoProjeto = 'Construção' | 'Reforma' | 'Interiores';
export type TipoImovel = 'Residencial' | 'Comercial' | 'Corporativo';

export type NivelImportancia = 1 | 2 | 3;

export interface ImportanciaItem {
  funcionalidade: NivelImportancia;
  estetica: NivelImportancia;
  conforto: NivelImportancia;
  materiaisNobres: NivelImportancia;
  tecnologia: NivelImportancia;
  qualidadeVida: NivelImportancia;
  auxilioCondicaoFisica: NivelImportancia;
}

export type AvaliacaoEstilo =
  | 'Gosto Muito'
  | 'Gosto'
  | 'Neutro'
  | 'Não Gosto'
  | 'Inadmissível'
  | null;

export interface EstilosAvaliacao {
  minimalista: AvaliacaoEstilo;
  industrial: AvaliacaoEstilo;
  contemporaneo: AvaliacaoEstilo;
  classicoLuxuoso: AvaliacaoEstilo;
  rusticoNatural: AvaliacaoEstilo;
  escandinavo: AvaliacaoEstilo;
  vintageRetro: AvaliacaoEstilo;
  abertoSugestoes: AvaliacaoEstilo;
}

export interface OrcamentoFormData {
  // Step 1 - Identificação
  nome: string;
  email: string;
  telefone: string;
  instagram: string;
  tipoProjeto: TipoProjeto | '';
  tipoImovel: TipoImovel | '';

  // Step 2 - Escopo
  ambientes: AmbienteItem[];
  ambientesPrioritarios: string[];
  outrosPrioritarios: string;
  descricaoEscopo: string;
  investimento: string;
  moradoresQuantidade: string;
  moradoresIdades: string;

  // Step 3 - Preferências
  importancia: ImportanciaItem;
  condicaoEspecial: string;
  corPreferida: string;
  estilos: EstilosAvaliacao;
  sustentabilidade: number;
  referencias: string[]; // paths no Storage após upload

  // Step 4 - Subjetivas
  subjetivaSabado: string;
  subjetivaComodo: string;
  subjetivaEstiloVida: string;
  subjetivaRestricoes: string;
  subjetivaMotivacao: string;
  prazoData: string;
  prazoFlexibilidade: number;

  // Step 5 - Finalização
  aceiteMinimo: boolean;
  aceiteLgpd: boolean;
}

export const ORCAMENTO_FORM_INITIAL: OrcamentoFormData = {
  nome: '',
  email: '',
  telefone: '',
  instagram: '',
  tipoProjeto: '',
  tipoImovel: '',

  ambientes: [],
  ambientesPrioritarios: [],
  outrosPrioritarios: '',
  descricaoEscopo: '',
  investimento: '',
  moradoresQuantidade: '',
  moradoresIdades: '',

  importancia: {
    funcionalidade: 1,
    estetica: 1,
    conforto: 1,
    materiaisNobres: 1,
    tecnologia: 1,
    qualidadeVida: 1,
    auxilioCondicaoFisica: 1,
  },
  condicaoEspecial: '',
  corPreferida: '',
  estilos: {
    minimalista: null,
    industrial: null,
    contemporaneo: null,
    classicoLuxuoso: null,
    rusticoNatural: null,
    escandinavo: null,
    vintageRetro: null,
    abertoSugestoes: null,
  },
  sustentabilidade: 5,
  referencias: [],

  subjetivaSabado: '',
  subjetivaComodo: '',
  subjetivaEstiloVida: '',
  subjetivaRestricoes: '',
  subjetivaMotivacao: '',
  prazoData: '',
  prazoFlexibilidade: 3,

  aceiteMinimo: false,
  aceiteLgpd: false,
};

// Tipo do DB (retornado pelo Supabase)
export interface OrcamentoSolicitacao {
  id: string;
  created_at: string;
  status: OrcamentoStatus;
  nome: string;
  email: string;
  telefone: string;
  instagram: string | null;
  tipo_projeto: string;
  tipo_imovel: string;
  ambientes: AmbienteItem[];
  ambientes_prioritarios: string[];
  outros_prioritarios: string | null;
  descricao_escopo: string;
  investimento: string;
  moradores_quantidade: number | null;
  moradores_idades: string | null;
  importancia: ImportanciaItem | null;
  condicao_especial: string | null;
  cor_preferida: string | null;
  estilos: EstilosAvaliacao | null;
  sustentabilidade: number | null;
  referencias: string[];
  subjetiva_sabado: string | null;
  subjetiva_comodo: string | null;
  subjetiva_estilo_vida: string | null;
  subjetiva_restricoes: string | null;
  subjetiva_motivacao: string | null;
  prazo_data: string | null;
  prazo_flexibilidade: number | null;
  aceite_minimo: boolean;
  aceite_lgpd: boolean;
}
