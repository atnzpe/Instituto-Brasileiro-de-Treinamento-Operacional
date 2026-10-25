/**
 * FOTO INTEIRA numa moldura de tamanho fixo (Gleyson, 24/10/2026: "foto cortada
 * fica feio; devemos ser belos e simétricos").
 *
 * - A moldura tem sempre a mesma proporção (ex.: 3:4, em pé): todos os cartões
 *   da grade ficam do mesmo tamanho, alinhados e simétricos.
 * - A foto aparece INTEIRA dentro dela (nunca corta rosto, cabeça ou pés).
 * - A sobra da moldura (quando a foto tem outro formato) é preenchida com a
 *   PRÓPRIA foto, ampliada e desfocada, em vez de faixas pretas.
 *
 * As duas imagens usam o mesmo endereço: o navegador baixa a foto uma vez só.
 */

/**
 * @param src      Endereço da foto. Ex.: 'https://cursos.ib-to.org/imagens/rede-nacional/7'
 * @param alt      Descrição da foto para quem usa leitor de tela. Ex.: 'Foto de Ana M. S., Instrutor II'
 * @param proporcao Classe do Tailwind com a proporção da moldura. Ex.: 'aspect-[3/4]' (padrão, em pé) ou 'aspect-video' (deitada).
 * @param largura  Largura da foto em pixels, para o navegador reservar o espaço antes de baixar. Ex.: 600
 * @param altura   Altura da foto em pixels. Ex.: 800
 * @returns A moldura com a foto inteira dentro (um <div>).
 */
export function FotoInteira({
  src,
  alt,
  proporcao = 'aspect-[3/4]',
  largura = 600,
  altura = 800,
}: {
  src: string
  alt: string
  proporcao?: string
  largura?: number
  altura?: number
}) {
  return (
    // "relative" + "overflow-hidden": o fundo desfocado fica preso dentro da moldura.
    <div className={`relative w-full overflow-hidden bg-black/40 ${proporcao}`}>
      {/* FUNDO: a mesma foto, cobrindo a moldura toda, desfocada e um pouco escura.
          É só enfeite: alt vazio e aria-hidden, para o leitor de tela não ler duas vezes. */}
      <img
        src={src}
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="absolute inset-0 size-full scale-110 object-cover opacity-60 blur-xl"
      />
      {/* FRENTE: a foto INTEIRA (object-contain = encaixa sem cortar), centralizada. */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        width={largura}
        height={altura}
        className="relative size-full object-contain"
      />
    </div>
  )
}
