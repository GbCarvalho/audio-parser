const pt = {
  title: 'Transcrição',
  subtitle: 'Ouça e clique nos trechos para navegar.',
  activePlayback: 'Reprodução ativa',
  audio: 'Áudio',
  currentTime: 'Tempo atual',
  tabTranscription: 'Transcrição',
  tabSummary: 'Resumo',
  speaker: 'Falante',
  transcriptionsTitle: 'Transcrições',
  blocks: 'blocos',
  summarizationTitle: 'Sumarização',
  comingSoon: 'Em breve',
  summaryTitle: 'Resumo',
  summaryText: 'Resumo automático aparecerá aqui.',
  keyPointsTitle: 'Pontos-chave',
  keyPointsText: 'Principais tópicos destacados do áudio.',
} as const

export type I18nKey = keyof typeof pt
export default pt
