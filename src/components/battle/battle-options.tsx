import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface BattleOptionsProps {
  options?: string[]
  correctAnswer: string
  selected: string | null
  timeLeft: number
  onSelect: (option: string) => void
}

export function BattleOptions({ 
  options = [], 
  correctAnswer, 
  selected, 
  timeLeft, 
  onSelect 
}: BattleOptionsProps) {
  if (!options.length) return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {options.map((option) => (
        <Button
          key={option}
          variant={selected === option 
            ? option === correctAnswer 
              ? "default" 
              : "destructive"
            : "outline"
          }
          className={cn(
            "p-6 h-auto text-left transition-all",
            selected === option && option === correctAnswer && "ring-2 ring-green-500",
            selected === option && option !== correctAnswer && "ring-2 ring-red-500"
          )}
          onClick={() => onSelect(option)}
          disabled={timeLeft === 0 || selected !== null}
        >
          {option}
        </Button>
      ))}
    </div>
  )
}