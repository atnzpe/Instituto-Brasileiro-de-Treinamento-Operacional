"""
GERA OS ÍCONES DO APP (PWA) A PARTIR DO EMBLEMA OFICIAL DO IBTO.

Uso (na pasta do site):  python -X utf8 scripts/gerar-icones.py "C:/workspace/ibto/docs referencia/logo-ibto.png"

O que sai em public/icons (e o favicon em public/):
- icon-192.png e icon-512.png: o emblema inteiro, para a tela inicial e a lista de apps;
- maskable-512.png: o emblema menor, no centro de um fundo preto. O Android recorta o
  ícone em círculo, quadrado ou gota; a margem garante que nada do desenho é cortado
  (a "zona segura" é o círculo central de 80%);
- apple-touch-icon.png (180 px): o ícone do iPhone e do iPad (o iOS não usa o manifesto);
- favicon.ico (16, 32 e 48 px): o ícone da aba do navegador.

Precisa do Pillow (biblioteca de imagens do Python): pip install pillow.
"""

import sys
from pathlib import Path

from PIL import Image

# A cor do fundo dos ícones: o mesmo preto do site (background_color do manifesto).
PRETO = (0, 0, 0, 255)


def quadrado(imagem: Image.Image) -> Image.Image:
    """Recorta o centro da imagem num quadrado (o emblema já é redondo e centralizado)."""
    lado = min(imagem.size)
    esquerda = (imagem.width - lado) // 2
    topo = (imagem.height - lado) // 2
    return imagem.crop((esquerda, topo, esquerda + lado, topo + lado))


def com_margem(imagem: Image.Image, tamanho: int, ocupacao: float) -> Image.Image:
    """
    Coloca a imagem no centro de um fundo preto quadrado.

    tamanho: lado final em pixels. Ex.: 512.
    ocupacao: quanto do lado o emblema ocupa. Ex.: 0.8 = 80% (maskable).
    """
    fundo = Image.new('RGBA', (tamanho, tamanho), PRETO)
    lado = round(tamanho * ocupacao)
    # LANCZOS: o jeito de reduzir que mantém o desenho mais nítido.
    menor = imagem.resize((lado, lado), Image.LANCZOS)
    deslocamento = (tamanho - lado) // 2
    fundo.paste(menor, (deslocamento, deslocamento), menor)
    return fundo


def salvar_leve(imagem: Image.Image, destino: Path) -> None:
    """
    Grava o PNG com uma paleta de 256 cores (o emblema quase só tem preto e dourado):
    o arquivo fica bem menor, sem diferença visível. Importa porque os ícones são
    baixados na primeira visita, inclusive no celular com dados móveis.
    """
    imagem.convert('RGB').quantize(colors=256, method=Image.Quantize.MEDIANCUT).save(destino, optimize=True)


def main() -> None:
    # Sem o caminho do emblema: explica o uso e para.
    if len(sys.argv) != 2:
        print(__doc__)
        sys.exit(1)

    raiz = Path(__file__).resolve().parent.parent
    pasta_icones = raiz / 'public' / 'icons'
    emblema = quadrado(Image.open(sys.argv[1]).convert('RGBA'))

    # Emblema inteiro (ocupa 100%): o próprio emblema já tem o fundo preto em volta.
    for tamanho in (192, 512):
        salvar_leve(com_margem(emblema, tamanho, 1.0), pasta_icones / f'icon-{tamanho}.png')

    # Maskable: 80% do lado, para caber na zona segura de qualquer recorte do Android.
    salvar_leve(com_margem(emblema, 512, 0.8), pasta_icones / 'maskable-512.png')

    # iPhone/iPad: 180 px, com uma pequena margem (o iOS arredonda os cantos).
    salvar_leve(com_margem(emblema, 180, 0.92), pasta_icones / 'apple-touch-icon.png')

    # Favicon com três tamanhos dentro do mesmo arquivo.
    com_margem(emblema, 48, 1.0).save(raiz / 'public' / 'favicon.ico', sizes=[(16, 16), (32, 32), (48, 48)])

    print('Ícones gerados em', pasta_icones)


if __name__ == '__main__':
    main()
