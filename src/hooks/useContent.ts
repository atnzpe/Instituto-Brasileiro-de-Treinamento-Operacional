import { useQuery } from '@tanstack/react-query'
import {
  areasDeAtuacao as staticAreasDeAtuacao,
  contato as staticContato,
  home as staticHome,
  nav as staticNav,
  quemSomos as staticQuemSomos,
  redeNacional as staticRedeNacional,
  type AreasDeAtuacaoContent,
  type ContatoContent,
  type HomeContent,
  type NavLink,
  type QuemSomosContent,
  type RedeNacionalContent,
} from '../../shared/content'
import { fetchNav, fetchPageContent } from '../lib/api'

// Every hook seeds `initialData` from the bundled static content so pages
// render immediately, then revalidates against the Redis-cached `/api/*`
// endpoints in the background — the app works with or without `bun run server`.

export function useNav() {
  return useQuery<NavLink[]>({
    queryKey: ['nav'],
    queryFn: fetchNav,
    initialData: staticNav,
  })
}

export function useHomeContent() {
  return useQuery<HomeContent>({
    queryKey: ['content', 'home'],
    queryFn: () => fetchPageContent<HomeContent>('home'),
    initialData: staticHome,
  })
}

export function useQuemSomosContent() {
  return useQuery<QuemSomosContent>({
    queryKey: ['content', 'quem-somos'],
    queryFn: () => fetchPageContent<QuemSomosContent>('quem-somos'),
    initialData: staticQuemSomos,
  })
}

export function useAreasDeAtuacaoContent() {
  return useQuery<AreasDeAtuacaoContent>({
    queryKey: ['content', 'areas-de-atuacao'],
    queryFn: () => fetchPageContent<AreasDeAtuacaoContent>('areas-de-atuacao'),
    initialData: staticAreasDeAtuacao,
  })
}

export function useContatoContent() {
  return useQuery<ContatoContent>({
    queryKey: ['content', 'contato'],
    queryFn: () => fetchPageContent<ContatoContent>('contato'),
    initialData: staticContato,
  })
}

export function useRedeNacionalContent() {
  return useQuery<RedeNacionalContent>({
    queryKey: ['content', 'rede-nacional'],
    queryFn: () => fetchPageContent<RedeNacionalContent>('rede-nacional'),
    initialData: staticRedeNacional,
  })
}
