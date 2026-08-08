export type Lang = 'tr' | 'en'

export const translations = {
  tr: {
    studioOs: 'Studio OS',
    instagram: 'Instagram',
    openProfile: 'Profili aç',
    product: 'Ürün',
    studio: 'Stüdyo',
    getInTouch: 'İletişim',
    comingSoon: 'Yakında. Bu pencereyi sonra birlikte dolduracağız.',
    contactBody: 'Bir fikir veya iş birliği için yaz.',
    aboutBody:
      'Hopestry, Ankara merkezli bir yazılım stüdyosu. Pear ve Blindo üzerinde çalışıyor; sade ürünler üretiyoruz.',
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
    getInTouch: 'Get in touch',
    comingSoon: 'Coming soon. We will fill this window together later.',
    contactBody: 'Reach out for an idea or a collaboration.',
    aboutBody:
      'Hopestry is a software studio based in Ankara. We build Pear and Blindo — simple products, carefully made.',
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
