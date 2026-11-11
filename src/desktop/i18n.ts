export type Lang = 'tr' | 'en'

export const translations = {
  tr: {
    studioOs: 'Studio OS',
    instagram: 'Instagram',
    openProfile: 'Profili aç',
    product: 'Ürün',
    studio: 'Stüdyo',
    comingSoon: 'Yakında. Bu pencereyi sonra birlikte dolduracağız.',
    desktopTagline: 'Gençler için',
    aboutBody:
      'Hopestry, gençler için sosyal uygulamalar geliştiren bağımsız bir stüdyo. Kendimizi fazla ciddiye almıyoruz ama yaptığımız işi çok ciddiye alıyoruz. İlk ürünümüz pear, App Store’da yayında; Android sürümü yakında geliyor.',
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
    baby: {
      petLabel: 'Bebek',
      egg: 'Bir yumurta! Az kaldı…',
      born: 'Merhaba! Yeni doğdum. Bana tıkla!',
      missed: 'Geri geldin! Seni çok özledim.',
      full: 'Tokum, daha yiyemem!',
      eating: 'Nyam nyam…',
      happy: 'Karnım tok, keyfim yerinde!',
      ok: 'Fena değilim. Biraz ilgi iyi olur.',
      hungry: 'Çok acıktım! Beni besler misin?',
      bored: 'Canım sıkıldı, oynayalım mı?',
      fullness: 'Tokluk',
      joy: 'Neşe',
      feed: 'Besle',
      play: 'Oyna',
      back: 'Tamam',
      left: 'Sol',
      right: 'Sağ',
      gamePrompt: 'Hangi tarafa bakacağım?',
      lookedLeft: 'Sola baktım.',
      lookedRight: 'Sağa baktım.',
      gameRight: 'Bildin!',
      gameWrong: 'Bilemedin!',
      gameWin: 'Kazandın! Çok eğlendim!',
      gameLose: 'Bu sefer olmadı ama yine de eğlendik!',
      gameRound: (round: number, total: number, wins: number) =>
        `Tur ${round}/${total} · ${wins} doğru`,
      stats: (days: number, feeds: number) => `${days}. gün · ${feeds} kez beslendi`,
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
    desktopTagline: 'For young people',
    aboutBody:
      'Hopestry is an independent studio building social apps for young people. We don’t take ourselves too seriously, but we take our work very seriously. Our first product, pear, is live on the App Store, with Android coming soon.',
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
    baby: {
      petLabel: 'Baby',
      egg: 'An egg! Almost there…',
      born: 'Hi! I was just born. Click me!',
      missed: 'You’re back! I missed you so much.',
      full: 'I’m full, I can’t eat any more!',
      eating: 'Nom nom…',
      happy: 'Full tummy, great mood!',
      ok: 'I’m fine. A little attention would be nice.',
      hungry: 'I’m so hungry! Will you feed me?',
      bored: 'I’m bored, want to play?',
      fullness: 'Fullness',
      joy: 'Joy',
      feed: 'Feed',
      play: 'Play',
      back: 'OK',
      left: 'Left',
      right: 'Right',
      gamePrompt: 'Which way will I look?',
      lookedLeft: 'I looked left.',
      lookedRight: 'I looked right.',
      gameRight: 'You got it!',
      gameWrong: 'Nope!',
      gameWin: 'You won! That was so fun!',
      gameLose: 'Not this time, but it was still fun!',
      gameRound: (round: number, total: number, wins: number) =>
        `Round ${round}/${total} · ${wins} right`,
      stats: (days: number, feeds: number) =>
        `Day ${days} · fed ${feeds} ${feeds === 1 ? 'time' : 'times'}`,
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
