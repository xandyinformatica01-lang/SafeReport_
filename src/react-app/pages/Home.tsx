import { Link } from "react-router";
import { Button } from "@/react-app/components/ui/button";
import { Shield, Eye, FileText, Lock, AlertTriangle, CheckCircle, Building2 } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <span className="text-xl font-bold text-foreground">SafeReport</span>
          </div>
          <Link to="/admin">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <Building2 className="w-4 h-4 mr-2" />
              Área da Instituição
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
            <Lock className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-medium">100% Anônimo e Seguro</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            SafeReport
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-4">
            Sua voz importa.
          </p>
          <p className="text-lg text-muted-foreground mb-12">
            Denuncie de forma <span className="text-primary font-semibold">100% anônima</span>.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link to="/denunciar" className="w-full sm:w-auto">
              <Button size="lg" className="w-full text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Fazer denúncia
              </Button>
            </Link>
            <Link to="/acompanhar" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 border-border hover:bg-secondary">
                <Eye className="w-5 h-5 mr-2" />
                Acompanhar denúncia
              </Button>
            </Link>
          </div>

          {/* Info Card */}
          <div className="bg-card border border-border rounded-2xl p-6 md:p-8 text-left">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Como funciona
            </h2>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-sm font-medium flex items-center justify-center shrink-0 mt-0.5">1</span>
                <span>Preencha o formulário com os detalhes da denúncia</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-sm font-medium flex items-center justify-center shrink-0 mt-0.5">2</span>
                <span>Receba um código único para acompanhar o status</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-sm font-medium flex items-center justify-center shrink-0 mt-0.5">3</span>
                <span>Acompanhe a resolução de forma totalmente anônima</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Status Legend */}
        <div className="max-w-2xl mx-auto mt-12">
          <h3 className="text-center text-sm font-medium text-muted-foreground mb-4">Sistema de Status</h3>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500"></span>
              <span className="text-sm text-muted-foreground">Enviada / Não lida</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
              <span className="text-sm text-muted-foreground">Em análise</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-500"></span>
              <span className="text-sm text-muted-foreground">Resolvida</span>
            </div>
          </div>
        </div>

        {/* Trust Section */}
        <div className="max-w-3xl mx-auto mt-16 pt-12 border-t border-border/50">
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 text-center">
            <div>
              <div className="w-12 h-12 rounded-xl bg-secondary mx-auto mb-4 flex items-center justify-center">
                <Lock className="w-6 h-6 text-muted-foreground" />
              </div>
              <h3 className="font-medium text-foreground mb-2">Anonimato Garantido</h3>
              <p className="text-sm text-muted-foreground">Sua identidade é 100% protegida durante todo o processo.</p>
            </div>
            <div>
              <div className="w-12 h-12 rounded-xl bg-secondary mx-auto mb-4 flex items-center justify-center">
                <Shield className="w-6 h-6 text-muted-foreground" />
              </div>
              <h3 className="font-medium text-foreground mb-2">Uso Responsável</h3>
              <p className="text-sm text-muted-foreground">Utilize a plataforma de forma ética e verdadeira.</p>
            </div>
            <div className="sm:col-span-2 md:col-span-1">
              <div className="w-12 h-12 rounded-xl bg-secondary mx-auto mb-4 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-muted-foreground" />
              </div>
              <h3 className="font-medium text-foreground mb-2">Acompanhamento</h3>
              <p className="text-sm text-muted-foreground">Acompanhe o progresso da sua denúncia com um código único.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 SafeReport. Plataforma de denúncia anônima.</p>
          <p className="mt-2 text-xs">Projeto educacional para instituições públicas.</p>
        </div>
      </footer>
    </div>
  );
}
