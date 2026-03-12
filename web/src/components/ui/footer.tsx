'use client';

import Link from 'next/link';
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--card)]">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Logo e descrição */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-6">
              <img
                src="/ascesaLogo.jpg"
                alt="ASCESA"
                className="h-14 w-44 object-contain"
              />
            </Link>
            <p className="text-sm text-[var(--muted-foreground)] max-w-md leading-relaxed mb-6">
              Associação dos Servidores do Sicoob - Credificando benefícios e
              vantagens para você e sua família.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-xl bg-[var(--gray-100)] flex items-center justify-center text-[var(--foreground)] hover:bg-[var(--primary)] hover:text-white transition-all duration-300 hover:-translate-y-1"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-xl bg-[var(--gray-100)] flex items-center justify-center text-[var(--foreground)] hover:bg-[var(--primary)] hover:text-white transition-all duration-300 hover:-translate-y-1"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-xl bg-[var(--gray-100)] flex items-center justify-center text-[var(--foreground)] hover:bg-[var(--primary)] hover:text-white transition-all duration-300 hover:-translate-y-1"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links rápidos */}
          <div>
            <h4 className="font-bold mb-6 text-[var(--foreground)] text-lg">Links Rápidos</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--secondary)] hover:translate-x-1 transition-all duration-200">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link href="/benefits" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--secondary)] hover:translate-x-1 transition-all duration-200">
                  Benefícios
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--secondary)] hover:translate-x-1 transition-all duration-200">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--secondary)] hover:translate-x-1 transition-all duration-200">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--secondary)] hover:translate-x-1 transition-all duration-200">
                  Fale Conosco
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--secondary)] hover:translate-x-1 transition-all duration-200">
                  Seja um Associado
                </Link>
              </li>
              <li>
                <Link href="/parceiro" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--secondary)] hover:translate-x-1 transition-all duration-200">
                  Seja um Parceiro
                </Link>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h4 className="font-bold mb-6 text-[var(--foreground)] text-lg">Contato</h4>
            <ul className="space-y-4 text-sm text-[var(--muted-foreground)]">
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[var(--secondary)] flex-shrink-0 mt-0.5" />
                <span>contato@ascesa.com.br</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[var(--secondary)] flex-shrink-0 mt-0.5" />
                <span>(61) 3200-0000</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[var(--secondary)] flex-shrink-0 mt-0.5" />
                <span>Brasília, DF</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[var(--border)]">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-[var(--muted-foreground)]">
              © {new Date().getFullYear()} ASCESA. Todos os direitos reservados.
            </p>
            <div className="flex gap-6">
              <Link href="/terms" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors">
                Termos de Uso
              </Link>
              <Link href="/privacy" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors">
                Privacidade
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
