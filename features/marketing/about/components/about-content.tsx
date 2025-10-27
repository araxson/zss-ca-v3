import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export function AboutContent() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">About Zenith Strategic Solutions</h1>
        <p className="text-lg text-muted-foreground">
          Professional website development for Canadian small businesses
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Our Mission</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-neutral dark:prose-invert">
          <p className="text-muted-foreground">
            We believe every small business deserves a professional online
            presence without the complexity and high costs traditionally
            associated with website development. Our subscription-based model
            makes professional website services accessible and affordable.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>What We Do</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">
              Subscription-Based Website Development
            </h3>
            <p className="text-muted-foreground">
              We build and maintain professional static websites for small
              businesses on a monthly subscription basis. No large upfront
              costs, just predictable monthly pricing.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">
              Ongoing Support & Maintenance
            </h3>
            <p className="text-muted-foreground">
              Your subscription includes regular updates, security patches, and
              dedicated support to ensure your website stays current and
              performs optimally.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Professional Design</h3>
            <p className="text-muted-foreground">
              Every website is custom-designed by our team to match your brand
              and business goals, ensuring a unique and professional online
              presence.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Why Choose Us</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex items-start">
              <span className="mr-2 font-bold">•</span>
              <span className="text-muted-foreground">
                <strong>Predictable Pricing:</strong> No hidden fees or
                surprise costs
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 font-bold">•</span>
              <span className="text-muted-foreground">
                <strong>Canadian-Focused:</strong> Built for Canadian businesses
                by Canadians
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 font-bold">•</span>
              <span className="text-muted-foreground">
                <strong>Professional Quality:</strong> Enterprise-level design
                and development
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 font-bold">•</span>
              <span className="text-muted-foreground">
                <strong>Dedicated Support:</strong> Real humans ready to help
                when you need it
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
