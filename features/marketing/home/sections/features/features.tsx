import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { featuresData } from './features.data'

export function Features() {
  return (
    <section className="w-full max-w-7xl mx-auto">
      <div className="text-center space-y-4 mb-12">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
          {featuresData.heading}
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {featuresData.subheading}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuresData.features.map((feature) => (
          <Card key={feature.id}>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="text-4xl" aria-hidden="true">
                  {feature.icon}
                </div>
                <CardTitle>{feature.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                {feature.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
