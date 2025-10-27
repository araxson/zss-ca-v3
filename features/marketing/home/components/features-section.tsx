import {
  ArrowUpRight,
  Clock,
  Palette,
  ShieldCheck,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'

const features = [
  {
    title: 'Strategic Design',
    description:
      'Custom websites crafted to match your brand, industry, and growth goals—never off-the-shelf templates.',
    icon: Palette,
  },
  {
    title: 'Subscription Simplicity',
    description:
      'Predictable monthly pricing covers design, development, hosting, and maintenance with no surprise fees.',
    icon: Clock,
  },
  {
    title: 'Built-In Support',
    description:
      'Dedicated Canadian team on standby for updates, change requests, and ongoing optimizations.',
    icon: ShieldCheck,
  },
  {
    title: 'Launch Ready',
    description:
      'From SEO to analytics, every site ships production-ready so you can focus on your business.',
    icon: ArrowUpRight,
  },
] as const

export function FeaturesSection() {
  return (
    <section id="features" className="w-full">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 text-center">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Designed for busy founders</h2>
          <p className="text-muted-foreground">
            Everything you need to launch and maintain a professional web presence—handled for you.
          </p>
        </div>
        <div className="grid w-full gap-6 md:grid-cols-2">
          {features.map((feature) => (
            <Card key={feature.title} className="text-left">
              <CardHeader className="flex flex-row items-start gap-4">
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <div className="flex size-12 cursor-pointer items-center justify-center rounded-full bg-muted">
                      <feature.icon className="size-6 text-primary" aria-hidden="true" />
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent side="top" className="max-w-xs text-sm">
                    {feature.description}
                  </HoverCardContent>
                </HoverCard>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
