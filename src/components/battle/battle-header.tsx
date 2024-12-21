import { Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function BattleHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold">Vocabulary Battle</h1>
        <p className="text-sm text-gray-500">Test your vocabulary knowledge</p>
      </div>
    </div>
  )
}