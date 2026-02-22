// Tipos
export type Status = "enviada" | "analise" | "resolvida";

export interface Denuncia {
  id: string;
  codigo: string;
  instituicao: string;
  tipo: string;
  localDano?: string;
  data: string;
  status: Status;
  descricao: string;
  mensagemResolucao?: string;
}

export interface Instituicao {
  id: string;
  codigo: string;
  nome: string;
  email: string;
  senha: string;
}

// Chaves do localStorage
const DENUNCIAS_KEY = "safereport_denuncias";
const INSTITUICOES_KEY = "safereport_instituicoes";

// Denúncias iniciais para demonstração
const denunciasIniciais: Denuncia[] = [
  {
    id: "1",
    codigo: "SR-2025-001",
    instituicao: "IF Baiano – Campus Governador Mangabeira",
    tipo: "Danos ao patrimônio",
    localDano: "Sala 205",
    data: "15/01/2025",
    status: "enviada",
    descricao: "Cadeira quebrada na sala 205.",
  },
  {
    id: "2",
    codigo: "SR-2025-002",
    instituicao: "Prefeitura de Cruz das Almas – BA",
    tipo: "Comportamento inadequado",
    data: "10/01/2025",
    status: "analise",
    descricao: "Vandalismo no banheiro público.",
  },
  {
    id: "3",
    codigo: "SR-2025-003",
    instituicao: "IF Baiano – Campus Santo Amaro",
    tipo: "Danos ao patrimônio",
    localDano: "Laboratório de Informática",
    data: "05/01/2025",
    status: "resolvida",
    descricao: "Mesa danificada no laboratório de informática.",
    mensagemResolucao: "A denúncia foi analisada e resolvida. Agradecemos por contribuir com a melhoria da instituição.",
  },
];

// Instituições iniciais para demonstração
const instituicoesIniciais: Instituicao[] = [
  {
    id: "1",
    codigo: "INST-001",
    nome: "IF Baiano – Campus Governador Mangabeira",
    email: "admin@ifbaiano.edu.br",
    senha: "123456",
  },
];

// Funções de denúncia
export function getDenuncias(): Denuncia[] {
  const stored = localStorage.getItem(DENUNCIAS_KEY);
  if (!stored) {
    localStorage.setItem(DENUNCIAS_KEY, JSON.stringify(denunciasIniciais));
    return denunciasIniciais;
  }
  return JSON.parse(stored);
}

export function saveDenuncia(denuncia: Denuncia): void {
  const denuncias = getDenuncias();
  denuncias.push(denuncia);
  localStorage.setItem(DENUNCIAS_KEY, JSON.stringify(denuncias));
}

export function getDenunciaByCodigo(codigo: string): Denuncia | undefined {
  const denuncias = getDenuncias();
  return denuncias.find((d) => d.codigo.toUpperCase() === codigo.toUpperCase());
}

export function getDenunciasByInstituicao(instituicaoNome: string): Denuncia[] {
  const denuncias = getDenuncias();
  return denuncias.filter((d) => d.instituicao === instituicaoNome);
}

export function updateDenunciaStatus(codigo: string, status: Status, mensagem?: string): void {
  const denuncias = getDenuncias();
  const index = denuncias.findIndex((d) => d.codigo === codigo);
  if (index !== -1) {
    denuncias[index].status = status;
    if (status === "resolvida" && mensagem) {
      denuncias[index].mensagemResolucao = mensagem;
    }
    localStorage.setItem(DENUNCIAS_KEY, JSON.stringify(denuncias));
  }
}

// Funções de instituição
export function getInstituicoes(): Instituicao[] {
  const stored = localStorage.getItem(INSTITUICOES_KEY);
  if (!stored) {
    localStorage.setItem(INSTITUICOES_KEY, JSON.stringify(instituicoesIniciais));
    return instituicoesIniciais;
  }
  return JSON.parse(stored);
}

export function saveInstituicao(instituicao: Instituicao): void {
  const instituicoes = getInstituicoes();
  instituicoes.push(instituicao);
  localStorage.setItem(INSTITUICOES_KEY, JSON.stringify(instituicoes));
}

export function loginInstituicao(nome: string, codigo: string, senha: string): Instituicao | null {
  const instituicoes = getInstituicoes();
  const found = instituicoes.find(
    (i) => i.nome === nome && i.codigo.toUpperCase() === codigo.toUpperCase() && i.senha === senha
  );
  return found || null;
}

export function generateInstituicaoCodigo(): string {
  const instituicoes = getInstituicoes();
  const num = String(instituicoes.length + 1).padStart(3, "0");
  return `INST-${num}`;
}

export function generateDenunciaCodigo(): string {
  const denuncias = getDenuncias();
  const year = new Date().getFullYear();
  const num = String(denuncias.length + 1).padStart(3, "0");
  return `SR-${year}-${num}`;
}
