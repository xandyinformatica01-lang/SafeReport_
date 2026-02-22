import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Button } from "@/react-app/components/ui/button";
import { Input } from "@/react-app/components/ui/input";
import { Card } from "@/react-app/components/ui/card";
import { Label } from "@/react-app/components/ui/label";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/react-app/components/ui/table";
import { Shield, Lock, LogOut, Eye, Building2, UserPlus, Copy, Check, MapPin } from "lucide-react";
import {
  type Denuncia,
  type Instituicao,
  type Status,
  getDenunciasByInstituicao,
  updateDenunciaStatus,
  saveInstituicao,
  loginInstituicao,
  generateInstituicaoCodigo,
} from "@/react-app/lib/storage";

const statusConfig = {
  enviada: {
    label: "Nova",
    color: "bg-red-500",
    textColor: "text-red-500",
  },
  analise: {
    label: "Em análise",
    color: "bg-yellow-500",
    textColor: "text-yellow-500",
  },
  resolvida: {
    label: "Resolvida",
    color: "bg-green-500",
    textColor: "text-green-500",
  },
};

type ViewMode = "login" | "register" | "panel";

export default function AdminPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("login");
  const [loggedInstituicao, setLoggedInstituicao] = useState<Instituicao | null>(null);
  
  // Login fields
  const [loginNome, setLoginNome] = useState("");
  const [loginCodigo, setLoginCodigo] = useState("");
  const [loginSenha, setLoginSenha] = useState("");
  const [loginError, setLoginError] = useState("");
  
  // Register fields
  const [registerNome, setRegisterNome] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerSenha, setRegisterSenha] = useState("");
  const [generatedCodigo, setGeneratedCodigo] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Panel
  const [denuncias, setDenuncias] = useState<Denuncia[]>([]);
  const [selectedDenuncia, setSelectedDenuncia] = useState<Denuncia | null>(null);

  useEffect(() => {
    if (loggedInstituicao) {
      const instDenuncias = getDenunciasByInstituicao(loggedInstituicao.nome);
      setDenuncias(instDenuncias);
    }
  }, [loggedInstituicao]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    
    const found = loginInstituicao(loginNome, loginCodigo, loginSenha);
    if (found) {
      setLoggedInstituicao(found);
      setViewMode("panel");
    } else {
      setLoginError("Dados inválidos. Verifique o nome, código e senha.");
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    const novoCodigo = generateInstituicaoCodigo();
    const novaInstituicao: Instituicao = {
      id: Date.now().toString(),
      codigo: novoCodigo,
      nome: registerNome,
      email: registerEmail,
      senha: registerSenha,
    };
    
    saveInstituicao(novaInstituicao);
    setGeneratedCodigo(novoCodigo);
    setRegisterSuccess(true);
  };

  const handleStatusChange = (codigo: string, newStatus: Status) => {
    const mensagem = newStatus === "resolvida" 
      ? "A denúncia foi analisada e resolvida. Agradecemos por contribuir com a melhoria da instituição."
      : undefined;
    
    updateDenunciaStatus(codigo, newStatus, mensagem);
    
    // Atualiza a lista local
    setDenuncias(denuncias.map((d) => 
      d.codigo === codigo 
        ? { ...d, status: newStatus, mensagemResolucao: mensagem }
        : d
    ));
    
    if (selectedDenuncia?.codigo === codigo) {
      setSelectedDenuncia({ ...selectedDenuncia, status: newStatus, mensagemResolucao: mensagem });
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(generatedCodigo);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLogout = () => {
    setLoggedInstituicao(null);
    setViewMode("login");
    setLoginNome("");
    setLoginCodigo("");
    setLoginSenha("");
    setSelectedDenuncia(null);
  };

  // Tela de registro com sucesso
  if (registerSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-6 sm:p-8">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-green-500/20 mx-auto mb-6 flex items-center justify-center">
              <Check className="w-8 h-8 text-green-500" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Instituição Vinculada!
            </h1>
            <p className="text-muted-foreground mb-6 text-sm">
              Sua instituição foi cadastrada com sucesso. Guarde o código abaixo para acessar o painel.
            </p>
            
            <div className="bg-muted/50 rounded-lg p-4 mb-6">
              <p className="text-xs text-muted-foreground mb-2">Código da Instituição:</p>
              <div className="flex items-center justify-center gap-3">
                <span className="text-2xl font-mono font-bold text-primary">{generatedCodigo}</span>
                <Button variant="ghost" size="icon" onClick={copyCode}>
                  {copied ? (
                    <Check className="w-5 h-5 text-green-500" />
                  ) : (
                    <Copy className="w-5 h-5" />
                  )}
                </Button>
              </div>
            </div>

            <Button 
              className="w-full h-12" 
              onClick={() => {
                setRegisterSuccess(false);
                setViewMode("login");
                setRegisterNome("");
                setRegisterEmail("");
                setRegisterSenha("");
              }}
            >
              Fazer login
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Tela de Login
  if (viewMode === "login") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-6 sm:p-8">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
              <Building2 className="w-7 h-7 text-primary" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-foreground text-center mb-2">
            Área da Instituição
          </h1>
          <p className="text-muted-foreground text-center mb-6 text-sm">
            Acesse o painel da sua instituição
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label>Nome da Instituição</Label>
              <Input
                placeholder="Ex: IF Baiano – Campus Governador Mangabeira"
                value={loginNome}
                onChange={(e) => setLoginNome(e.target.value)}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label>Código da Instituição</Label>
              <Input
                placeholder="Ex: INST-001"
                value={loginCodigo}
                onChange={(e) => setLoginCodigo(e.target.value)}
                className="h-11 font-mono uppercase"
              />
            </div>
            <div className="space-y-2">
              <Label>Senha</Label>
              <Input
                type="password"
                placeholder="••••••••"
                value={loginSenha}
                onChange={(e) => setLoginSenha(e.target.value)}
                className="h-11"
              />
            </div>
            
            {loginError && (
              <p className="text-sm text-destructive text-center">{loginError}</p>
            )}
            
            <Button type="submit" className="w-full h-12">
              <Lock className="w-4 h-4 mr-2" />
              Entrar
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-sm text-muted-foreground text-center mb-4">
              Primeira vez? Vincule sua instituição
            </p>
            <Button 
              variant="outline" 
              className="w-full h-12"
              onClick={() => setViewMode("register")}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Vincular Instituição
            </Button>
          </div>

          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground text-center">
              <strong>Demonstração:</strong> IF Baiano – Campus Governador Mangabeira | INST-001 | 123456
            </p>
          </div>

          <div className="mt-4">
            <Link to="/">
              <Button variant="ghost" className="w-full">
                Voltar ao site
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  // Tela de Registro
  if (viewMode === "register") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-6 sm:p-8">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
              <UserPlus className="w-7 h-7 text-primary" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-foreground text-center mb-2">
            Vincular Instituição
          </h1>
          <p className="text-muted-foreground text-center mb-6 text-sm">
            Cadastre sua instituição para receber denúncias
          </p>

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label>Nome da Instituição</Label>
              <Input
                placeholder="Nome completo da instituição"
                value={registerNome}
                onChange={(e) => setRegisterNome(e.target.value)}
                className="h-11"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>E-mail Institucional</Label>
              <Input
                type="email"
                placeholder="contato@instituicao.edu.br"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                className="h-11"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Criar Senha</Label>
              <Input
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={registerSenha}
                onChange={(e) => setRegisterSenha(e.target.value)}
                className="h-11"
                required
                minLength={6}
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-12"
              disabled={!registerNome || !registerEmail || registerSenha.length < 6}
            >
              <Building2 className="w-4 h-4 mr-2" />
              Vincular Instituição
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-border">
            <Button 
              variant="ghost" 
              className="w-full"
              onClick={() => setViewMode("login")}
            >
              Já tenho cadastro
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Painel da Instituição
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-bold text-foreground">SafeReport</span>
              <span className="text-xs text-muted-foreground block">Painel da Instituição</span>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-foreground truncate max-w-[200px]">
                {loggedInstituicao?.nome}
              </p>
              <p className="text-xs text-muted-foreground font-mono">
                {loggedInstituicao?.codigo}
              </p>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleLogout}
              className="text-muted-foreground"
            >
              <LogOut className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Sair</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">Denúncias Recebidas</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {denuncias.length} denúncia(s) para sua instituição
            </p>
          </div>
          <div className="flex flex-wrap gap-3 sm:gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500"></span>
              <span className="text-muted-foreground">
                {denuncias.filter((d) => d.status === "enviada").length} novas
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
              <span className="text-muted-foreground">
                {denuncias.filter((d) => d.status === "analise").length} em análise
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-500"></span>
              <span className="text-muted-foreground">
                {denuncias.filter((d) => d.status === "resolvida").length} resolvidas
              </span>
            </div>
          </div>
        </div>

        {denuncias.length === 0 ? (
          <Card className="p-8 sm:p-12 text-center">
            <Building2 className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h2 className="text-lg font-medium text-foreground mb-2">Nenhuma denúncia ainda</h2>
            <p className="text-muted-foreground text-sm">
              Quando sua instituição receber denúncias, elas aparecerão aqui.
            </p>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Table - Mobile Cards / Desktop Table */}
            <div className="lg:col-span-2">
              {/* Mobile: Cards */}
              <div className="lg:hidden space-y-3">
                {denuncias.map((denuncia) => (
                  <Card 
                    key={denuncia.id}
                    className={`p-4 cursor-pointer transition-colors ${
                      selectedDenuncia?.id === denuncia.id ? "border-primary" : ""
                    }`}
                    onClick={() => setSelectedDenuncia(denuncia)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <span className="font-mono font-medium text-sm">{denuncia.codigo}</span>
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${statusConfig[denuncia.status].color}`}></span>
                        <span className={`text-xs ${statusConfig[denuncia.status].textColor}`}>
                          {statusConfig[denuncia.status].label}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{denuncia.tipo}</p>
                    {denuncia.localDano && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {denuncia.localDano}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">{denuncia.data}</p>
                  </Card>
                ))}
              </div>

              {/* Desktop: Table */}
              <Card className="overflow-hidden hidden lg:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Código</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Local</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {denuncias.map((denuncia) => (
                      <TableRow 
                        key={denuncia.id}
                        className={selectedDenuncia?.id === denuncia.id ? "bg-muted/50" : ""}
                      >
                        <TableCell className="font-mono font-medium">
                          {denuncia.codigo}
                        </TableCell>
                        <TableCell>{denuncia.tipo}</TableCell>
                        <TableCell>
                          {denuncia.localDano || "-"}
                        </TableCell>
                        <TableCell>{denuncia.data}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className={`w-2.5 h-2.5 rounded-full ${statusConfig[denuncia.status].color}`}></span>
                            <span className={`text-sm ${statusConfig[denuncia.status].textColor}`}>
                              {statusConfig[denuncia.status].label}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setSelectedDenuncia(denuncia)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </div>

            {/* Detail Panel */}
            <div>
              <Card className="p-4 sm:p-6 sticky top-6">
                {selectedDenuncia ? (
                  <>
                    <h2 className="font-semibold text-foreground mb-4">
                      Detalhes da Denúncia
                    </h2>
                    
                    <div className="space-y-4 mb-6">
                      <div>
                        <span className="text-xs text-muted-foreground">Código</span>
                        <p className="font-mono font-medium">{selectedDenuncia.codigo}</p>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">Tipo</span>
                        <p className="text-sm">{selectedDenuncia.tipo}</p>
                      </div>
                      {selectedDenuncia.localDano && (
                        <div>
                          <span className="text-xs text-muted-foreground">Local do dano</span>
                          <p className="text-sm flex items-center gap-1">
                            <MapPin className="w-4 h-4 text-primary" />
                            {selectedDenuncia.localDano}
                          </p>
                        </div>
                      )}
                      <div>
                        <span className="text-xs text-muted-foreground">Data</span>
                        <p className="text-sm">{selectedDenuncia.data}</p>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">Descrição</span>
                        <p className="text-sm">{selectedDenuncia.descricao}</p>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">Status atual</span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`w-3 h-3 rounded-full ${statusConfig[selectedDenuncia.status].color}`}></span>
                          <span className={statusConfig[selectedDenuncia.status].textColor}>
                            {statusConfig[selectedDenuncia.status].label}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <span className="text-xs text-muted-foreground">Alterar status:</span>
                      <div className="flex flex-col gap-2">
                        <Button
                          size="sm"
                          variant={selectedDenuncia.status === "analise" ? "default" : "outline"}
                          className={`h-11 justify-start ${selectedDenuncia.status === "analise" ? "bg-yellow-500 hover:bg-yellow-600 text-black" : ""}`}
                          onClick={() => handleStatusChange(selectedDenuncia.codigo, "analise")}
                          disabled={selectedDenuncia.status === "analise"}
                        >
                          <span className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></span>
                          Marcar como "Em análise"
                        </Button>
                        <Button
                          size="sm"
                          variant={selectedDenuncia.status === "resolvida" ? "default" : "outline"}
                          className={`h-11 justify-start ${selectedDenuncia.status === "resolvida" ? "bg-green-500 hover:bg-green-600" : ""}`}
                          onClick={() => handleStatusChange(selectedDenuncia.codigo, "resolvida")}
                          disabled={selectedDenuncia.status === "resolvida"}
                        >
                          <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                          Marcar como "Resolvida"
                        </Button>
                      </div>
                      {selectedDenuncia.status === "resolvida" && (
                        <p className="text-xs text-green-500 mt-2">
                          ✓ Mensagem automática enviada ao denunciante
                        </p>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 sm:py-12 text-muted-foreground">
                    <Eye className="w-12 h-12 mx-auto mb-4 opacity-30" />
                    <p>Selecione uma denúncia para ver os detalhes</p>
                  </div>
                )}
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
