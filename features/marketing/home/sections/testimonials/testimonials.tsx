import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import { testimonialsData } from './testimonials.data'

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

export function Testimonials() {
  return (
    <ItemGroup className="mx-auto w-full max-w-7xl gap-16">
      <Item className="flex w-full flex-col items-center border-0 p-0 text-center">
        <ItemContent className="max-w-3xl items-center gap-3 text-center">
          <ItemTitle className="justify-center">
            <span className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">
              {testimonialsData.heading}
            </span>
          </ItemTitle>
          <ItemDescription className="text-base text-muted-foreground sm:text-lg">
            {testimonialsData.subheading}
          </ItemDescription>
        </ItemContent>
      </Item>
      <Item className="w-full flex-col border-0 p-0">
        <Carousel
          opts={{ align: 'start', loop: true }}
          className="relative w-full"
        >
          <CarouselContent className="-ml-4">
            {testimonialsData.testimonials.map((testimonial) => (
              <CarouselItem
                key={testimonial.id}
                className="pl-4 md:basis-1/2 lg:basis-1/3"
              >
                <Item className="border-0 bg-transparent p-0 shadow-none">
                  <Card className="flex h-full flex-col gap-4 p-6" aria-labelledby={`${testimonial.id}-title`}>
                    <CardHeader className="flex flex-row items-start justify-between gap-4 p-0">
                      <div className="flex items-start gap-3">
                        <ItemMedia variant="icon">
                          <Avatar className="size-12">
                            <AvatarFallback className="text-base font-semibold">
                              {getInitials(testimonial.name)}
                            </AvatarFallback>
                          </Avatar>
                        </ItemMedia>
                        <div className="flex flex-col gap-1">
                          <CardTitle id={`${testimonial.id}-title`}>
                            {testimonial.name}
                          </CardTitle>
                          <CardDescription>
                            {testimonial.role}, {testimonial.company}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge variant="secondary" aria-label={`${testimonial.rating} star rating`}>
                        {`${testimonial.rating}★`}
                      </Badge>
                    </CardHeader>
                    <CardContent className="p-0">
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {testimonial.content}
                      </p>
                    </CardContent>
                  </Card>
                </Item>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="-left-10 hidden md:flex" />
          <CarouselNext className="-right-10 hidden md:flex" />
        </Carousel>
      </Item>
    </ItemGroup>
  )
}
