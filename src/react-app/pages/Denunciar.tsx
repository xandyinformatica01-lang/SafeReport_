import { useState } from "react";
import { Link } from "react-router";
import { Button } from "@/react-app/components/ui/button";
import { Input } from "@/react-app/components/ui/input";
import { Textarea } from "@/react-app/components/ui/textarea";
import { Checkbox } from "@/react-app/components/ui/checkbox";
import { Label } from "@/react-app/components/ui/label";
import { Card } from "@/react-app/components/ui/card";
import { Shield, ArrowLeft, AlertTriangle, Wrench, Upload, Calendar, CheckCircle2, Copy, Check, MapPin } from "lucide-react";
import { saveDenuncia, generateDenunciaCodigo, getInstituicoes } from "@/react-app/lib/storage";

const instituicoesFixas = [
  "IF Baiano – Campus Governador Mangabeira",
  "IF Baiano – Campus Santo Amaro",
  "IF Baiano – Campus Catu",
  "IF Baiano – Campus Guanambi",
  "Prefeitura de Cachoeira – BA",
  "Prefeitura de Cruz das Almas – BA",
  "Prefeitura de Conceição da Feira – BA",
];

const danosPatrimonio = [
  { id: "cadeira", label: "Cadeira quebrada" },
  { id: "mesa", label: "Mesa danificada" },
  { id: "porta_janela", label: "Porta ou janela quebrada" },
  { id: "banheiro", label: "Banheiro danificado" },
  { id: "equipamento", label: "Equipamento destruído" },
  { id: "outro_dano", label: "Outro" },
];

const comportamentoInadequado = [
  { id: "vandalismo", label: "Vandalismo" },
  { id: "agressao_verbal", label: "Agressão verbal" },
  { id: "agressao_fisica", label: "Agressão física" },
  { id: "bullying", label: "Bullying" },
  { id: "outro_comportamento", label: "Outro" },
];

export default function DenunciarPage() {
  // Combina instituições fixas com cadastradas
  const instituicoesCadastradas = getInstituicoes().map((i) => i.nome);
  const todasInstituicoes = [...new Set([...instituicoesFixas, ...instituicoesCadastradas])];

  const [instituicao, setInstituicao] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedDanos, setSelectedDanos] = useState<string[]>([]);
  const [selectedComportamento, setSelectedComportamento] = useState<string[]>([]);
  const [outroDano, setOutroDano] = useState("");
  const [outroComportamento, setOutroComportamento] = useState("");
  const [localDano, setLocalDano] = useState("");
  const [descricao, setDescricao] = useState("");
  const [data, setData] = useState("");
  const [confirmacao, setConfirmacao] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [codigo, setCodigo] = useState("");
  const [copied, setCopied] = useState(false);

  const filteredInstituicoes = todasInstituicoes.filter((i) =>
    i.toLowerCase().includes(instituicao.toLowerCase())
  );

  const handleDanoChange = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedDanos([...selectedDanos, id]);
    } else {
      setSelectedDanos(selectedDanos.filter((d) => d !== id));
    }
  };

  const handleComportamentoChange = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedComportamento([...selectedComportamento, id]);
    } else {
      setSelectedComportamento(selectedComportamento.filter((c) => c !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCode = generateDenunciaCodigo();
    
    // Determina o tipo
    let tipo = "";
    if (selectedDanos.length > 0 && selectedComportamento.length > 0) {
      tipo = "Danos ao patrimônio / Comportamento inadequado";
    } else if (selectedDanos.length > 0) {
      tipo = "Danos ao patrimônio";
    } else {
      tipo = "Comportamento inadequado";
    }

    // Formata a data
    const dataFormatada = data 
      ? new Date(data).toLocaleDateString("pt-BR")
      : new Date().toLocaleDateString("pt-BR");

    // Salva a denúncia
    saveDenuncia({
      id: Date.now().toString(),
      codigo: newCode,
      instituicao,
      tipo,
      localDano: selectedDanos.length > 0 ? localDano : undefined,
      data: dataFormatada,
      status: "enviada",
      descricao,
    });

    setCodigo(newCode);
    setSubmitted(true);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(codigo);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const hasDanos = selectedDanos.length > 0;

  const isFormValid =
    instituicao &&
    (selectedDanos.length > 0 || selectedComportamento.length > 0) &&
    descricao &&
    confirmacao &&
    (!hasDanos || localDano.trim() !== "");

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border/50">
          <div className="container mx-auto px-4 py-4">
            <Link to="/" className="flex items-center gap-2 w-fit">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <span className="text-xl font-bold text-foreground">SafeReport</span>
            </Link>
          </div>
        </header>

        <main className="container mx-auto px-4 py-12 sm:py-16">
          <div className="max-w-md mx-auto text-center">
            <div className="w-20 h-20 rounded-full bg-green-500/20 mx-auto mb-6 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-4">
              Denúncia Enviada com Sucesso!
            </h1>
            <p className="text-muted-foreground mb-8">
              Sua denúncia foi registrada de forma anônima. Use o código abaixo para acompanhar o status.
            </p>
            
            <Card className="p-6 mb-8">
              <p className="text-sm text-muted-foreground mb-2">Seu código de acompanhamento:</p>
              <div className="flex items-center justify-center gap-3">
                <span className="text-2xl sm:text-3xl font-mono font-bold text-primary">{codigo}</span>
                <Button variant="ghost" size="icon" onClick={copyCode}>
                  {copied ? (
                    <Check className="w-5 h-5 text-green-500" />
                  ) : (
                    <Copy className="w-5 h-5" />
                  )}
                </Button>
              </div>
            </Card>

            <p className="text-sm text-muted-foreground mb-6">
              Guarde este código em um lugar seguro. Você precisará dele para verificar o andamento da sua denúncia.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/acompanhar" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full h-12">
                  Acompanhar denúncia
                </Button>
              </Link>
              <Link to="/" className="w-full sm:w-auto">
                <Button className="w-full h-12">
                  Voltar ao início
                </Button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <span className="text-xl font-bold text-foreground">SafeReport</span>
          </Link>
          <Link to="/">
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Voltar</span>
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 sm:py-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Fazer Denúncia</h1>
          <p className="text-muted-foreground mb-6 sm:mb-8">
            Preencha o formulário abaixo. Sua identidade será mantida em sigilo.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
            {/* Instituição */}
            <div className="space-y-3">
              <Label className="text-base font-medium">1. Instituição</Label>
              <div className="relative">
                <Input
                  placeholder="Digite para buscar a instituição..."
                  value={instituicao}
                  onChange={(e) => {
                    setInstituicao(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  className="h-12"
                />
                {showSuggestions && instituicao && filteredInstituicoes.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded-lg shadow-lg max-h-60 overflow-auto">
                    {filteredInstituicoes.map((inst) => (
                      <button
                        key={inst}
                        type="button"
                        className="w-full px-4 py-3 text-left hover:bg-secondary transition-colors text-foreground"
                        onClick={() => {
                          setInstituicao(inst);
                          setShowSuggestions(false);
                        }}
                      >
                        {inst}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Tipo de Denúncia */}
            <div className="space-y-4">
              <Label className="text-base font-medium">2. Tipo de denúncia</Label>
              
              {/* Danos ao Patrimônio */}
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Wrench className="w-5 h-5 text-primary" />
                  <span className="font-medium text-foreground">Danos ao patrimônio</span>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  {danosPatrimonio.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3">
                      <Checkbox
                        id={item.id}
                        checked={selectedDanos.includes(item.id)}
                        onCheckedChange={(checked) => handleDanoChange(item.id, checked as boolean)}
                      />
                      <Label htmlFor={item.id} className="text-sm cursor-pointer">
                        {item.label}
                      </Label>
                    </div>
                  ))}
                </div>
                {selectedDanos.includes("outro_dano") && (
                  <Input
                    placeholder="Descreva o dano..."
                    className="mt-3"
                    value={outroDano}
                    onChange={(e) => setOutroDano(e.target.value)}
                  />
                )}
              </Card>

              {/* Campo Local do Dano - aparece quando há danos selecionados */}
              {hasDanos && (
                <Card className="p-4 border-primary/30 bg-primary/5">
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-5 h-5 text-primary" />
                    <span className="font-medium text-foreground">Onde ocorreu o dano? *</span>
                  </div>
                  <Input
                    placeholder="Ex: Sala 1º A, Laboratório de Informática, Banheiro, Pátio, Biblioteca..."
                    value={localDano}
                    onChange={(e) => setLocalDano(e.target.value)}
                    className="h-12"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Informe o local exato onde o dano foi identificado
                  </p>
                </Card>
              )}

              {/* Comportamento Inadequado */}
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-5 h-5 text-yellow-500" />
                  <span className="font-medium text-foreground">Comportamento inadequado</span>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  {comportamentoInadequado.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3">
                      <Checkbox
                        id={item.id}
                        checked={selectedComportamento.includes(item.id)}
                        onCheckedChange={(checked) => handleComportamentoChange(item.id, checked as boolean)}
                      />
                      <Label htmlFor={item.id} className="text-sm cursor-pointer">
                        {item.label}
                      </Label>
                    </div>
                  ))}
                </div>
                {selectedComportamento.includes("outro_comportamento") && (
                  <Input
                    placeholder="Descreva o comportamento..."
                    className="mt-3"
                    value={outroComportamento}
                    onChange={(e) => setOutroComportamento(e.target.value)}
                  />
                )}
              </Card>
            </div>

            {/* Descrição */}
            <div className="space-y-3">
              <Label className="text-base font-medium">3. Descrição do ocorrido</Label>
              <Textarea
                placeholder="Descreva a situação com detalhes..."
                className="min-h-32"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
              />
            </div>

            {/* Data */}
            <div className="space-y-3">
              <Label className="text-base font-medium">4. Data aproximada</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="date"
                  className="pl-10 h-12"
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                />
              </div>
            </div>

            {/* Upload de Imagem */}
            <div className="space-y-3">
              <Label className="text-base font-medium">5. Envio de imagem (opcional)</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 sm:p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">
                  Clique para fazer upload ou arraste uma imagem
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  PNG, JPG até 5MB
                </p>
              </div>
            </div>

            {/* Confirmação */}
            <div className="space-y-3">
              <Label className="text-base font-medium">6. Confirmação</Label>
              <Card className="p-4">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="confirmacao"
                    checked={confirmacao}
                    onCheckedChange={(checked) => setConfirmacao(checked as boolean)}
                    className="mt-1"
                  />
                  <Label htmlFor="confirmacao" className="text-sm cursor-pointer leading-relaxed">
                    Declaro que as informações são verdadeiras e estou ciente do uso responsável da plataforma.
                  </Label>
                </div>
              </Card>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              className="w-full h-14 text-base sm:text-lg bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25"
              disabled={!isFormValid}
            >
              <AlertTriangle className="w-5 h-5 mr-2" />
              Enviar denúncia
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}
