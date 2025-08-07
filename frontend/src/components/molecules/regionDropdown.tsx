import { useState } from 'react'
import type { HTMLAttributes } from 'react'
import SemiTransparentButton from '@/components/atoms/Buttons/SemiTransparentButton'
import { dropdownItemClass, dropdownListClass } from '@/utils/buttonClassNames'

interface RegionDropdownProps {
  options: string[]
  selected: string
  onSelect: (value: string) => void
  className?: string
}

export default function RegionDropdown({
  options,
  selected,
  onSelect,
  className = '',
}: RegionDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleToggle = () => {
    setIsOpen((prev) => !prev)
  }

  const handleSelect = (value: string) => {
    onSelect(value)
    setIsOpen(false)
  }

  return (
    <div className={`relative inline-block ${className}`}>
      <SemiTransparentButton type="button" onClick={handleToggle}>
        {selected}
      </SemiTransparentButton>

      {isOpen && (
        <ul
          className={dropdownListClass}
        >
          {options.map((option) => (
            <li
              key={option}
              className={dropdownItemClass}
              onClick={() => handleSelect(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
