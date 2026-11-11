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
    pearTagline: 'Birlikte çek, birlikte biriktir.',
    pearBody:
      'Her gün rastgele bir saatte, o an ne yapıyorsan onun fotoğrafını grubuna at. Poz yok, sadece o an.',
    pearFeatures: [
      'Günlük fotoğraf ve seri',
      'Haritada arkadaşlarına pear bırak',
      'Fotoğraflar sadece grubunla paylaşılır',
    ],
    pearLinks: {
      support: 'Destek',
      privacy: 'Gizlilik Politikası',
      terms: 'Kullanım Koşulları',
    },
    storeAppleSmall: 'Şuradan indirin',
    storeGoogleSmall: 'Şuradan edinin',
    soon: 'Yakında',
    apps: {
      about: { label: 'Hakkımızda', title: 'Hakkımızda' },
      contact: { label: 'İletişim', title: 'İletişim' },
      instagram: { label: 'Instagram', title: 'Instagram' },
      pear: { label: 'Pear', title: 'Pear' },
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
    pearTagline: 'Shoot together, collect together.',
    pearBody:
      'Once a day, at a random time, share a photo of whatever you are doing with your group. No posing, just the moment.',
    pearFeatures: [
      'Daily photo and streaks',
      'Drop pears for friends on the map',
      'Photos are shared only with your group',
    ],
    pearLinks: {
      support: 'Support',
      privacy: 'Privacy Policy',
      terms: 'Terms of Use',
    },
    storeAppleSmall: 'Download on the',
    storeGoogleSmall: 'Get it on',
    soon: 'Soon',
    apps: {
      about: { label: 'About Us', title: 'About Us' },
      contact: { label: 'Contact', title: 'Contact' },
      instagram: { label: 'Instagram', title: 'Instagram' },
      pear: { label: 'Pear', title: 'Pear' },
    },
  },
} as const

export function getInitialLang(): Lang {
  const saved = localStorage.getItem('hopestry-lang')
  if (saved === 'tr' || saved === 'en') return saved
  return 'tr'
}
