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
  summaryTitle: 'Resumo automático',
  summaryText: 'Quando a integração com IA for ativada, um resumo com pontos-chave e itens de ação aparecerá aqui.',
  keyPointsTitle: 'Pontos-chave',
  keyPointsText: 'Principais tópicos destacados do áudio.',
} as const

export type I18nKey = keyof typeof pt
export default pt
