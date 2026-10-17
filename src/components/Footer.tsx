/**
 * RODAPÉ DO SITE: o logo do IBTO e a versão no ar (#75), discreta, para o suporte
 * saber o que está publicado quando alguém relata um problema.
 */
export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-ink pt-10 pb-safe-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-safe-4">
        <img src="/images/logo.webp" alt="IBTO" className="h-16 w-auto" />
        {/* A versão do site (vem do package.json no build). Ex.: v0.2.0 */}
        <p className="text-xs text-white/60">v{__VERSAO_SITE__}</p>
      </div>
    </footer>
  )
}
