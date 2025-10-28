'use client'

import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Switch } from '@/components/ui/switch'
import { FieldGroup, FieldLegend, FieldSet } from '@/components/ui/field'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from '@/components/ui/item'
interface ProfilePreferencesFieldsProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any
}

export function ProfilePreferencesFields({ form }: ProfilePreferencesFieldsProps) {
  return (
    <FieldSet>
      <FieldLegend>Preferences</FieldLegend>
      <FieldGroup>
        <FormField
          control={form.control}
          name="marketing_opt_in"
          render={({ field }) => (
            <FormItem>
              <Item variant="outline" className="items-center justify-between gap-4 p-4">
                <ItemContent className="space-y-1">
                  <ItemTitle>Marketing Communications</ItemTitle>
                  <ItemDescription>
                    Receive emails about new features, updates, and promotions
                  </ItemDescription>
                </ItemContent>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </Item>
              <FormMessage />
            </FormItem>
          )}
        />
      </FieldGroup>
    </FieldSet>
  )
}
