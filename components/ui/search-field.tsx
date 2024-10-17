'use client'

import { IconSearch, IconX } from 'justd-icons'
import {
  SearchField as SearchFieldPrimitive,
  type SearchFieldProps as SearchFieldPrimitiveProps,
  type ValidationResult
} from 'react-aria-components'
import { tv } from 'tailwind-variants'

import { Button } from './button'
import { Description, FieldError, FieldGroup, Input, Label } from './field'
import { ctr } from './primitive'
import { Loader } from '@/components/ui/loader'

const searchFieldStyles = tv({
  slots: {
    base: 'group flex min-w-10 flex-col gap-1',
    searchIcon:
      'ml-2 size-4 shrink-0 text-muted-fg group-disabled:text-muted-fg/50 forced-colors:text-[ButtonText] forced-colors:group-disabled:text-[GrayText]',
    clearButton:
      'mr-1 size-8 text-muted-fg group-empty:invisible hover:bg-transparent pressed:text-fg',
    input: '[&::-webkit-search-cancel-button]:hidden'
  },
  variants: {
    isPending: {
      true: ''
    }
  }
})

const { base, searchIcon, clearButton, input } = searchFieldStyles()

interface SearchFieldProps extends SearchFieldPrimitiveProps {
  label?: string
  placeholder?: string
  description?: string
  errorMessage?: string | ((validation: ValidationResult) => string)
  isPending?: boolean
}

const SearchField = ({
  className,
  placeholder,
  label,
  description,
  errorMessage,
  isPending,
  ...props
}: SearchFieldProps) => {
  return (
    <SearchFieldPrimitive
      aria-label={placeholder ?? props['aria-label']}
      {...props}
      className={ctr(className, base())}
    >
      {label && <Label>{label}</Label>}
      <FieldGroup>
        <IconSearch aria-hidden className={searchIcon()} />
        <Input placeholder={placeholder ?? 'Search...'} className={input()} />
        {isPending ? <Loader variant='spin'/> : <Button size="square-petite" appearance="plain" className={clearButton()}>
          <IconX aria-hidden className="size-4" />
        </Button>}

      </FieldGroup>
      {description && <Description>{description}</Description>}
      <FieldError>{errorMessage}</FieldError>
    </SearchFieldPrimitive>
  )
}

export { SearchField, type SearchFieldProps }
