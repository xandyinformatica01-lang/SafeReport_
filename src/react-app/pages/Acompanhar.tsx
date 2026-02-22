import { useState } from "react";
import { Link } from "react-router";
import { Button } from "@/react-app/components/ui/button";
import { Input } from "@/react-app/components/ui/input";
import { Card } from "@/react-app/components/ui/card";
import { Shield, ArrowLeft, Search, Clock, CheckCircle2, AlertCircle, MessageSquare } from "lucide-react";
import { getDenunciaByCodigo, type Denuncia } from "@/react-app/lib/storage";

const statusConfig = {
  enviada: {
    label: "Enviada / Não lida",
    color: "bg-red-500",
    textColor: "text-red-500",
    bgLight: "bg-red-500/10",
    icon: AlertCircle,
    message: "Sua denúncia foi recebida e está aguardando análise.",
  },
  analise: {
    label: "Em análise",
    color: "bg-yellow-500",
    textColor: "text-yellow-500",
    bgLight: "bg-yellow-500/10",
    icon: Clock,
    message: "Sua denúncia está sendo analisada pela instituição responsável.",
  },
  resolvida: {
    label: "Resolvida",
    color: "bg-green-500",
    textColor: "text-green-500",
    bgLight: "bg-green-500/10",
    icon: CheckCircle2,
    message: "Sua denúncia foi analisada e as medidas necessárias foram tomadas.",
  },
};

export default function AcompanharPage() {
  const [codigo, setCodigo] = useState("");
  const [result, setResult] = useState<Denuncia | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const found = getDenunciaByCodigo(codigo.trim());
    
    if (found) {
      setResult(found);
      setNotFound(false);
    } else {
      setResult(null);
      setNotFound(true);
    }
    setSearched(true);
  };

  const StatusIcon = result ? statusConfig[result.status].icon : AlertCircle;

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

      <main className="container mx-auto px-4 py-12 sm:py-16">
        <div className="max-w-lg mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 text-center">
            Acompanhar Denúncia
          </h1>
          <p className="text-muted-foreground mb-8 text-center">
            Digite o código da sua denúncia para verificar o status.
          </p>

          <form onSubmit={handleSearch} className="mb-8">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Ex: SR-2025-001"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                  className="pl-10 h-12 font-mono uppercase"
                />
              </div>
              <Button type="submit" size="lg" className="h-12 px-6">
                Buscar
              </Button>
            </div>
          </form>

          {searched && notFound && (
            <Card className="p-6 border-destructive/50 bg-destructive/5">
              <div className="text-center">
                <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
                <h2 className="text-lg font-semibold text-foreground mb-2">
                  Denúncia não encontrada
                </h2>
                <p className="text-muted-foreground text-sm">
                  Verifique se o código foi digitado corretamente.
                </p>
              </div>
            </Card>
          )}

          {result && (
            <Card className="overflow-hidden">
              {/* Status Header */}
              <div className={`p-4 sm:p-6 ${statusConfig[result.status].bgLight}`}>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-muted-foreground">Status atual:</span>
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${statusConfig[result.status].color}`}></span>
                    <span className={`font-medium ${statusConfig[result.status].textColor}`}>
                      {statusConfig[result.status].label}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 sm:p-4 rounded-lg bg-background/50">
                  <StatusIcon className={`w-6 h-6 shrink-0 ${statusConfig[result.status].textColor}`} />
                  <p className="text-sm text-foreground">
                    {statusConfig[result.status].message}
                  </p>
                </div>
              </div>

              {/* Mensagem de resolução */}
              {result.status === "resolvida" && result.mensagemResolucao && (
                <div className="px-4 sm:px-6 py-4 bg-green-500/5 border-b border-green-500/20">
                  <div className="flex items-start gap-3">
                    <MessageSquare className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-green-500 mb-1">Mensagem da Instituição:</p>
                      <p className="text-sm text-foreground">{result.mensagemResolucao}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Status Progress */}
              <div className="px-4 sm:px-6 py-4 border-b border-border">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col items-center">
                    <div className={`w-4 h-4 rounded-full ${
                      result.status === "enviada" || result.status === "analise" || result.status === "resolvida"
                        ? "bg-red-500"
                        : "bg-muted"
                    }`}></div>
                    <span className="text-xs text-muted-foreground mt-2">Enviada</span>
                  </div>
                  <div className={`flex-1 h-1 mx-2 ${
                    result.status === "analise" || result.status === "resolvida"
                      ? "bg-yellow-500"
                      : "bg-muted"
                  }`}></div>
                  <div className="flex flex-col items-center">
                    <div className={`w-4 h-4 rounded-full ${
                      result.status === "analise" || result.status === "resolvida"
                        ? "bg-yellow-500"
                        : "bg-muted"
                    }`}></div>
                    <span className="text-xs text-muted-foreground mt-2 whitespace-nowrap">Em análise</span>
                  </div>
                  <div className={`flex-1 h-1 mx-2 ${
                    result.status === "resolvida"
                      ? "bg-green-500"
                      : "bg-muted"
                  }`}></div>
                  <div className="flex flex-col items-center">
                    <div className={`w-4 h-4 rounded-full ${
                      result.status === "resolvida"
                        ? "bg-green-500"
                        : "bg-muted"
                    }`}></div>
                    <span className="text-xs text-muted-foreground mt-2">Resolvida</span>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="p-4 sm:p-6 space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Código:</span>
                  <span className="font-mono font-medium text-foreground">{result.codigo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Instituição:</span>
                  <span className="text-sm text-foreground text-right max-w-[60%]">{result.instituicao}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Tipo:</span>
                  <span className="text-sm text-foreground">{result.tipo}</span>
                </div>
                {result.localDano && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Local do dano:</span>
                    <span className="text-sm text-foreground">{result.localDano}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Data de envio:</span>
                  <span className="text-sm text-foreground">{result.data}</span>
                </div>
              </div>
            </Card>
          )}

          {/* Demo codes hint */}
          <div className="mt-8 p-4 bg-card border border-border rounded-lg">
            <p className="text-sm text-muted-foreground text-center mb-2">
              <strong>Códigos de demonstração:</strong>
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <code className="text-xs bg-muted px-2 py-1 rounded font-mono">SR-2025-001</code>
              <code className="text-xs bg-muted px-2 py-1 rounded font-mono">SR-2025-002</code>
              <code className="text-xs bg-muted px-2 py-1 rounded font-mono">SR-2025-003</code>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
