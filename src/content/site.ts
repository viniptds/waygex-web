import type { Locale } from '../../shared/contact'

// Company facts used across the page. Change them here, not in the components.
export const site = {
  name: 'Waygex',
  legalName: 'Waygex Solutions',
  email: 'contact@waygex.com',
  cnpj: 'CNPJ 45.620.450/0001-15',
  calendly: {
    en: 'https://calendly.com/vinicius-padovan/initial-presentation',
    pt: 'https://calendly.com/vinicius-padovan/apresentacao-inicial',
  } satisfies Record<Locale, string>,
  careers: 'https://forms.gle/9UwW4HSZU3k6WwQU8',
  founderLinkedIn: 'https://www.linkedin.com/in/vinicius-ptds/',
  social: [
    { label: 'LinkedIn', url: 'https://www.linkedin.com/company/waygex' },
    { label: 'Instagram', url: 'https://instagram.com/waygex' },
    { label: 'X', url: 'https://twitter.com/waygex' },
    { label: 'Facebook', url: 'https://facebook.com/waygex' },
  ],
}
