export type Lang = 'tr' | 'en'

export const translations = {
  tr: {
    studioOs: 'Studio OS',
    instagram: 'Instagram',
    openProfile: 'Profili aç',
    product: 'Ürün',
    studio: 'Stüdyo',
    comingSoon: 'Yakında. Bu pencereyi sonra birlikte dolduracağız.',
    aboutBody:
      'Kendini fazla ciddiye almayan, gençler için sosyal uygulamalar geliştiren bağımsız bir ekip.',
    apps: {
      about: { label: 'Hakkımızda', title: 'Hakkımızda' },
      contact: { label: 'İletişim', title: 'İletişim' },
      instagram: { label: 'Instagram', title: 'Instagram' },
      blindo: { label: 'Blindo', title: 'Blindo' },
      pear: { label: 'Pear', title: 'Pear' },
      tetris: { label: 'Tetris', title: 'Tetris' },
    },
  },
  en: {
    studioOs: 'Studio OS',
    instagram: 'Instagram',
    openProfile: 'Open profile',
    product: 'Product',
    studio: 'Studio',
    comingSoon: 'Coming soon. We will fill this window together later.',
    aboutBody:
      'An independent team that does not take itself too seriously, building social apps for young people.',
    apps: {
      about: { label: 'About Us', title: 'About Us' },
      contact: { label: 'Contact', title: 'Contact' },
      instagram: { label: 'Instagram', title: 'Instagram' },
      blindo: { label: 'Blindo', title: 'Blindo' },
      pear: { label: 'Pear', title: 'Pear' },
      tetris: { label: 'Tetris', title: 'Tetris' },
    },
  },
} as const

export function getInitialLang(): Lang {
  const saved = localStorage.getItem('hopestry-lang')
  if (saved === 'tr' || saved === 'en') return saved
  return navigator.language.toLowerCase().startsWith('tr') ? 'tr' : 'en'
}
