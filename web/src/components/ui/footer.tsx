'use client';

import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--card)]">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo e descrição */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <img
                src="/ascesaLogo.jpg"
                alt="ASCESA"
                className="h-12 w-40 object-contain"
              />
            </Link>
            <p className="text-sm text-[var(--muted-foreground)] max-w-md">
              Associação dos Servidores do Sicoob - Credificando benefícios e
              vantagens para você e sua família.
            </p>
          </div>

          {/* Links rápidos */}
          <div>
            <h4 className="font-semibold mb-4 text-[var(--foreground)]">Links Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--secondary)]">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link href="/benefits" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--secondary)]">
                  Benefícios
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--secondary)]">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--secondary)]">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--secondary)]">
                  Fale Conosco
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--secondary)]">
                  Seja um Associado
                </Link>
              </li>
              <li>
                <Link href="/parceiro" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--secondary)]">
                  Seja um Parceiro
                </Link>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h4 className="font-semibold mb-4 text-[var(--foreground)]">Contato</h4>
            <ul className="space-y-2 text-sm text-[var(--muted-foreground)]">
              <li>contato@ascesa.com.br</li>
              <li>(61) 3200-0000</li>
              <li>Brasília, DF</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-[var(--border)]">
          <p className="text-center text-sm text-[var(--muted-foreground)]">
            © {new Date().getFullYear()} ASCESA. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
