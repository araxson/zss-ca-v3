import { LifeBuoy, Flag, PiggyBank, ShieldCheck } from 'lucide-react'
import type { AboutValuesData } from './about-values.types'

export const aboutValuesData: AboutValuesData = {
  title: 'Why teams choose us',
  values: [
    {
      title: 'Predictable pricing',
      description: 'No hidden fees or surprise costs—just a subscription that covers design, development, and care.',
      icon: PiggyBank,
      iconLabel: 'Predictable pricing icon',
    },
    {
      title: 'Canadian-focused',
      description: 'Built for Canadian businesses by a team that understands the market and compliance requirements.',
      icon: Flag,
      iconLabel: 'Canadian focus icon',
    },
    {
      title: 'Professional quality',
      description: 'Enterprise-level patterns, accessible design, and engineering rigor behind every launch.',
      icon: ShieldCheck,
      iconLabel: 'Quality shield icon',
    },
    {
      title: 'Dedicated support',
      description: 'Real humans ready to ship updates, revisions, and improvements without fuss.',
      icon: LifeBuoy,
      iconLabel: 'Support icon',
    },
  ],
}
