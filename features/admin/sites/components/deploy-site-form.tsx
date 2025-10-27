'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from '@/components/ui/input-group'
import { Textarea } from '@/components/ui/textarea'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { deploySiteSchema, type DeploySiteInput } from '../schema'
import { deploySiteAction } from '../api/mutations'
import { Rocket, Link2 } from 'lucide-react'

interface DeploySiteFormProps {
  siteId: string
  siteName: string
  isLive: boolean
}

export function DeploySiteForm({ siteId, siteName, isLive }: DeploySiteFormProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const form = useForm<DeploySiteInput>({
    resolver: zodResolver(deploySiteSchema),
    defaultValues: {
      deployment_url: '',
      deployment_notes: '',
    },
  })

  async function onSubmit(data: DeploySiteInput) {
    setError(null)
    const result = await deploySiteAction(siteId, data)

    if (result.error) {
      setError(result.error)
      return
    }

    form.reset()
    router.refresh()
  }

  if (isLive) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Site Already Live</CardTitle>
          <CardDescription>
            This site has already been deployed. Use the edit form to update the deployment URL.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            Update deployment details from the edit panel if you need to change URLs or notes.
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Rocket className="h-5 w-5" />
          <CardTitle>Deploy Site</CardTitle>
        </div>
        <CardDescription>
          Deploy {siteName} and make it live for the client
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Deployment failed</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="deployment_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deployment URL</FormLabel>
                  <FormControl>
                    <InputGroup>
                      <InputGroupInput
                        {...field}
                        placeholder="example.com"
                        className="!pl-1"
                        value={field.value?.replace(/^https?:\/\//i, '') || ''}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                      <InputGroupAddon>
                        <InputGroupText>https://</InputGroupText>
                      </InputGroupAddon>
                      <InputGroupAddon align="inline-end">
                        <Link2 className="size-4" />
                      </InputGroupAddon>
                    </InputGroup>
                  </FormControl>
                  <FormDescription>
                    The live URL where the site is now accessible
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="deployment_notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deployment Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any notes about the deployment..."
                      className="min-h-20"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Internal notes about this deployment
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button type="button" disabled={form.formState.isSubmitting}>
                  <Rocket className="h-4 w-4 mr-2" />
                  Deploy Site
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Deploy {siteName}?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will mark the site as live and send a notification email to the client.
                    The site status will be changed to &quot;Live&quot;.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={form.handleSubmit(onSubmit)}>
                    {form.formState.isSubmitting ? 'Deploying...' : 'Deploy Now'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
