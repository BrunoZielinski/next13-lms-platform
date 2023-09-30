'use client'

import * as React from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandItem,
  CommandEmpty,
  CommandGroup,
  CommandInput,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

interface ComboboxInterface {
  value?: string
  onChange: (value: string) => void
  options: {
    value: string
    label: string
  }[]
}

const Combobox = React.forwardRef<HTMLButtonElement, ComboboxInterface>(
  ({ options, onChange, value }, ref) => {
    const [open, setOpen] = React.useState(false)

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="justify-between w-full"
          >
            {value
              ? options.find(option => option.value === value)?.label
              : 'Select option...'}
            <ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search option..." />
            <CommandEmpty>No option found.</CommandEmpty>
            <CommandGroup>
              {options.map(option => (
                <CommandItem
                  key={option.value}
                  onSelect={() => {
                    onChange(option.value === value ? '' : option.value)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === option.value ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    )
  },
)

Combobox.displayName = 'Combobox'

export { Combobox }
