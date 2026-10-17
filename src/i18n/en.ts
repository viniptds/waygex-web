// English copy. pt.ts must have exactly the same shape (TypeScript checks it).
// Strings with {name}-style slots are filled in by the components.

const en = {
  meta: {
    title: 'Waygex — From first idea to launched app',
    successTitle: 'Meeting booked — Waygex',
  },

  nav: {
    skip: 'Skip to content',
    services: 'What we build',
    process: 'How we work',
    partners: 'Partners',
    faq: 'Questions',
    contact: 'Send a brief',
    book: 'Book a call',
    otherLanguage: 'Português',
    otherLanguageLabel: 'Ler em português',
    home: 'Waygex home',
  },

  hero: {
    title: ['Your app,', 'from zero to one'],
    lead: 'A software studio in Brazil that designs and builds web and mobile apps, with AI in the product and in how we work.',
    cta: 'Book a call',
    secondary: 'or send a brief',
  },

  services: {
    heading: 'What we build',
    items: [
      { name: 'Web apps', text: 'SaaS platforms, marketplaces, dashboards and internal tools, on a stack you can hire for later.' },
      { name: 'Mobile apps', text: 'iOS and Android from one codebase, taken all the way through App Store and Google Play review.' },
      { name: 'AI features', text: 'Assistants, document reading, search and agents wired into your own data, with guardrails and costs you can see.' },
      { name: 'Automations', text: 'The repetitive, manual steps of your operation turned into workflows that run on their own.' },
      { name: 'Cloud and infra', text: 'Hosting, migrations, backups and monitoring, so launch day is not the last day it works.' },
      { name: 'Extra hands', text: 'Developers and designers who join your team for a project, or a whole team when you need one.' },
    ],
    statement: 'AI drafts the routine code. A senior engineer reviews every line before it ships, and you test working software every week.',
  },

  process: {
    heading: 'How we work',
    picker: 'Where are you starting from?',
    stages: { idea: 'An idea', prototype: 'A prototype', live: 'A live product' },
    paths: {
      idea: [
        { name: 'First call', text: 'Thirty minutes on what you want to build, who it is for and what must work on launch day.' },
        { name: 'Proposal in two days', text: 'Scope, milestones and a fixed price per milestone within 1–2 business days. Free, no commitment.' },
        { name: 'Weekly builds', text: 'A version you can click every week, designed and built by the same small team.' },
        { name: 'Launch', text: 'We publish to the web, the App Store and Google Play, and watch the first weeks closely.' },
      ],
      prototype: [
        { name: 'First call', text: 'Show us what exists: the prototype, the designs, the code and what is not working yet.' },
        { name: 'Review and proposal', text: 'Within 1–2 business days: what to keep, what to rebuild and a fixed price per milestone.' },
        { name: 'Make it real', text: 'We turn the prototype into production code with accounts, payments, data and tests.' },
        { name: 'Launch', text: 'Stores, domain, monitoring and analytics in place before the first real user signs up.' },
      ],
      live: [
        { name: 'First call', text: 'Tell us where the product hurts: slow releases, a missing feature, cloud costs or an AI idea.' },
        { name: 'Audit and proposal', text: 'We read the code and the infrastructure and send a plan with fixed prices in 1–2 business days.' },
        { name: 'Small, safe releases', text: 'Improvements shipped in small, reversible steps, next to your team or on our own.' },
        { name: 'Keep it running', text: 'Monitoring, backups and a monthly plan for what comes next.' },
      ],
    },
    cta: 'Send a brief from here',
  },

  partners: {
    label: 'Partners',
    sentence: 'Companies and institutions we have built software with, from São Paulo to New York.',
    ask: 'Want your company on this line?',
    cta: 'Book a call',
  },

  about: {
    heading: ['Small studio,', 'senior hands'],
    blocks: [
      {
        title: 'The studio',
        text: 'Waygex is a software studio in Presidente Prudente, São Paulo, working with clients in Brazil and abroad since 2022. The people on your call are the people who write the code.',
      },
      {
        title: 'Vinicius Padovan, founder',
        text: 'Software engineer who led projects at companies with over $4 million in revenue and 10,000 orders, and launched a billing system that collected $200,000 in its first 30 days.',
      },
    ],
    cta: 'Book a call',
    linkedin: 'Vinicius on LinkedIn',
    portraitAlt: 'Vinicius Padovan, founder of Waygex',
  },

  faq: {
    heading: 'Questions',
    items: [
      {
        q: 'What does Waygex do?',
        a: 'We design, build and launch web and mobile apps, and add AI features to products that already exist. We are based in Brazil and work in English and Portuguese.',
      },
      {
        q: 'How do you use AI?',
        a: 'In two places. Inside your product: assistants, document reading, search and automations, with the model chosen for each case. In our own work: AI drafts routine code and tests, and an engineer reviews everything before it ships.',
      },
      {
        q: 'My idea is complex. Can you take it on?',
        a: 'Most likely. We have built e-commerce, payment and service platforms. On the first call we tell you plainly what we would build first, what we would leave for later, and what we would not take on.',
      },
      {
        q: 'How do we start?',
        a: 'Book a call or send a brief. Within 1–2 business days after the call you receive a proposal with scope, milestones and price. The proposal is free and carries no commitment.',
      },
      {
        q: 'I accepted the proposal. What happens next?',
        a: 'You confirm through the link in the proposal and sign the contract. We ask for a few documents and details, and the first week of work begins.',
      },
      {
        q: 'When and how do I pay?',
        a: 'Payment dates are agreed in the contract. You follow every invoice in the Waygex client area. We accept international wire transfers (SWIFT) and PayPal.',
      },
      {
        q: 'How do I end the contract?',
        a: 'Email {mail} with the subject “Stop services” and we close everything within 5 business days. We will be here for the next project.',
      },
    ],
  },

  contact: {
    heading: 'Tell us what you are building',
    lead: 'Send a short brief and we reply within 1–2 business days.',
    talk: 'Prefer to talk?',
    book: 'Book a call',
    fields: {
      name: 'Your name',
      email: 'Email',
      company: 'Company',
      optional: 'optional',
      project: 'What do you want to build?',
      projectHelp: 'A few sentences are enough: who it is for and what it should do.',
      stage: 'Where are you now?',
      platforms: 'What do you need?',
      budget: 'Budget',
      budgetNone: 'Choose a range',
    },
    budgets: { small: 'Under $15k', medium: '$15k – $50k', large: 'Over $50k', unsure: 'Not sure yet' },
    platforms: { web: 'Web app', ios: 'iOS app', android: 'Android app', ai: 'AI features' },
    submit: 'Send brief',
    sending: 'Sending…',
    privacy: 'We use these details only to reply to your brief.',
    success: {
      heading: 'Brief received',
      text: 'Thanks, {name}. A copy is on its way to {email}, and we will reply within 1–2 business days.',
      again: 'Send another brief',
    },
    errors: {
      required: 'Fill this in.',
      too_short: 'A little more detail, please.',
      too_long: 'This is too long.',
      invalid: 'Check this one.',
      email: 'Check this address.',
      platforms: 'Pick at least one.',
      rate_limited: 'Too many messages from this connection. Try again in a few minutes, or email {mail}.',
      send_failed: 'The brief did not go through. Try again, or email {mail}.',
      not_configured: 'The form is offline right now. Please email {mail}.',
      network: 'No connection. Check your internet and try again.',
      summary: 'A few fields need a look before sending.',
    },
  },

  footer: {
    place: 'Presidente Prudente, São Paulo, Brazil',
    what: 'Web apps, mobile apps and AI, from first idea to launch.',
    top: 'Back to top',
    careers: 'Work with us',
    credits: 'Photographs',
    rights: 'All rights reserved.',
  },

  // Sample app screens drawn in code. They illustrate the kind of work, not a specific client.
  screens: {
    assistant: {
      app: 'Orders',
      question: 'Which orders are late this week?',
      answer: '4 orders are late. 3 of them wait on the same supplier.',
      rows: [
        { label: 'Supplier A, #2841', value: '2 days' },
        { label: 'Supplier A, #2853', value: '1 day' },
        { label: 'Supplier B, #2860', value: '1 day' },
      ],
      action: 'Email the supplier',
      input: 'Ask about your orders',
    },
    notes: { title: 'Call notes', items: ['For: clinic front desks', 'Must: book in under a minute', 'Later: online payments'] },
    proposal: {
      title: 'Proposal',
      rows: [
        { label: 'Accounts and booking', value: '3 weeks' },
        { label: 'Reminders and payments', value: '2 weeks' },
        { label: 'Launch on both stores', value: '1 week' },
      ],
      foot: 'Fixed price per milestone',
    },
    builds: {
      title: 'Builds',
      rows: [
        { label: 'Week 4: booking flow', status: 'Ready to test' },
        { label: 'Week 3: patient profiles', status: 'Approved' },
        { label: 'Week 2: sign-in', status: 'Approved' },
        { label: 'Week 1: first screens', status: 'Approved' },
      ],
    },
    launch: {
      title: 'Book a visit',
      day: 'Tuesday, 14 October',
      times: ['09:00', '09:30', '10:30', '11:00', '14:00', '15:30'],
      selected: '10:30',
      hint: 'Suggested: 10:30, your usual time',
      cta: 'Confirm 10:30',
    },
  },

  success: {
    heading: 'Your call is booked',
    text: 'The invitation is in your inbox. Until then, a brief helps us prepare.',
    details: 'Details',
    event: 'Meeting',
    with: 'With',
    when: 'When',
    missing: 'Check your email for the invitation and the meeting details.',
    back: 'Back to the site',
    brief: 'Send a brief',
  },
}

export default en

type Widen<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
    ? Widen<U>[]
    : T extends object
      ? { [K in keyof T]: Widen<T[K]> }
      : T

export type Dict = Widen<typeof en>
