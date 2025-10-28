"use client"

import type { ReactNode } from "react"

import { useFormField } from "@/components/ui/form"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field"

type FormFieldLayoutProps = {
  label: string
  description?: ReactNode
  orientation?: "vertical" | "horizontal" | "responsive"
  children: ReactNode
}

export function FormFieldLayout({
  label,
  description,
  orientation = "vertical",
  children,
}: FormFieldLayoutProps) {
  const { formItemId, formDescriptionId } = useFormField()

  return (
    <Field orientation={orientation}>
      <FieldLabel htmlFor={formItemId}>{label}</FieldLabel>
      <FieldContent>
        {children}
        {description ? (
          <>
            <span id={formDescriptionId} className="sr-only">
              {description}
            </span>
            <FieldDescription>{description}</FieldDescription>
          </>
        ) : null}
      </FieldContent>
    </Field>
  )
}
