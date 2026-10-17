// Photographs used on the page. All from Unsplash (Unsplash licence), shown in brand duotone.
// Replace with Waygex's own photographs whenever they exist; keep the credit line in sync.

export interface Picture {
  src: string
  alt: { en: string; pt: string }
  width: number
  height: number
}

export const heroImage: Picture = {
  src: '/images/photos/hero-concrete.jpg',
  alt: { en: 'White angular concrete building against a dark sky', pt: 'Prédio de concreto branco e anguloso contra um céu escuro' },
  width: 2400,
  height: 1600,
}

export const stripImages: Picture[] = [
  { src: '/images/photos/strip-1081.jpg', width: 450, height: 600, alt: { en: 'Stepped white facade rising into the sky', pt: 'Fachada branca em degraus subindo para o céu' } },
  { src: '/images/photos/strip-36.jpg', width: 600, height: 600, alt: { en: 'A device taken apart, every part laid out in rows', pt: 'Um aparelho desmontado, cada peça organizada em fileiras' } },
  { src: '/images/photos/strip-893.jpg', width: 900, height: 600, alt: { en: 'Curved lattice facade', pt: 'Fachada curva em treliça' } },
  { src: '/images/photos/strip-60.jpg', width: 450, height: 600, alt: { en: 'Desk seen from above with a screen, tablet and keyboard', pt: 'Mesa vista de cima com tela, tablet e teclado' } },
  { src: '/images/photos/strip-160.jpg', width: 600, height: 600, alt: { en: 'Close-up of a phone on a desk', pt: 'Celular sobre a mesa, em close' } },
  { src: '/images/photos/strip-119.jpg', width: 900, height: 600, alt: { en: 'Minimal white desk with a closed laptop', pt: 'Mesa branca minimalista com um notebook fechado' } },
  { src: '/images/photos/strip-180.jpg', width: 450, height: 600, alt: { en: 'Laptop next to a sketchbook of screen drawings', pt: 'Notebook ao lado de um caderno com esboços de telas' } },
  { src: '/images/photos/strip-201.jpg', width: 600, height: 600, alt: { en: 'Laptop and glasses on a wooden desk', pt: 'Notebook e óculos sobre uma mesa de madeira' } },
]

export const credits = [
  'Carl Nenzen Loven',
  'Julien Moreau',
  'Samuel Zeller',
  'Vadim Sherbakov',
  'Thom',
  'Nadir Balcikli',
  'Galymzhan Abdugalimov',
  'Craig Garner',
]
