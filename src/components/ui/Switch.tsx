import { useState } from 'react'
import { cn } from '../../lib/utils'

interface Props {
  defaultChecked?: boolean
  onChange?: (checked: boolean) => void
}

export default function Switch({ defaultChecked = false, onChange }: Props) {
  const [checked, setChecked] = useState(defaultChecked)

  const handleClick = () => {
    const next = !checked
    setChecked(next)
    onChange?.(next)
  }

  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={handleClick}
      className={cn(
        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200',
        checked ? 'bg-green-500' : 'bg-gray-300'
      )}
    >
      <span
        className={cn(
          'inline-block h-4 w-4 rounded-full bg-white shadow transition-transform duration-200',
          checked ? 'translate-x-6' : 'translate-x-1'
        )}
      />
    </button>
  )
}