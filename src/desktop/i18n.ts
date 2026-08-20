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
    pearBody:
      'Pear, gençlerin arkadaş gruplarıyla çektikleri fotoğrafları tek bir yerde topladığı bir grup fotoğraf arşivi uygulaması. Her grup kendi arşivini oluşturur, anılar kaybolmadan zaman içinde geri dönüp bakılabilir.',
    pearFeatures: [
      'Grup arşivleri — her arkadaş grubu kendi fotoğraf arşivini oluşturur',
      'Zaman çizelgesi — anılar tarih sırasına göre geri dönüp izlenir',
      'Davetle katılım — gruba sadece davet linkiyle katılınır, arşiv sadece üyelere açık',
    ],
    blindoBody:
      'Blindo, kimliğini göstermeden yeni insanlarla tanışabildiğin anonim bir tanışma uygulaması. Önce sohbet edersin, tanışıklık ilerledikçe kimlikler ortaya çıkar.',
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
    pearBody:
      'Pear is a group photo archive app where young people collect the photos they take with their friend groups in one place. Every group builds its own archive, so memories stay safe and easy to look back on over time.',
    pearFeatures: [
      'Group archives — every friend group builds its own photo archive',
      'Timeline — memories are laid out in order and easy to revisit',
      'Invite-only — you join a group with an invite link, and the archive stays private to its members',
    ],
    blindoBody:
      'Blindo is an anonymous app for meeting new people without revealing your identity. You chat first, and identities are revealed as the connection grows.',
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
