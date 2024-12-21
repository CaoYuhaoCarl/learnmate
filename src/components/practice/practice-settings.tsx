import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Settings } from 'lucide-react'
import { PracticeMode, DisplayMode, BattleSettings as BattleSettingsType } from '@/lib/types/practice'
import { PracticeModeSelector } from './practice-mode-selector'
import { DisplayModeSelector } from './display-mode-selector'
import { usePracticeSettings } from '@/hooks/use-practice-settings'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface PracticeSettingsProps {
  onClose: () => void
}

type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced'

export function PracticeSettings({ onClose }: PracticeSettingsProps) {
  const { settings, updateSettings, loading } = usePracticeSettings()
  const [mode, setMode] = useState<PracticeMode>(settings.practiceMode)
  const [displayMode, setDisplayMode] = useState<DisplayMode>(settings.displayMode)
  const [battleSettings, setBattleSettings] = useState<BattleSettingsType>(
    settings.battleSettings || {
      wordCount: 10,
      level: undefined,
      difficultyLevel: undefined,
      frequencyRankRange: {
        min: undefined,
        max: undefined
      },
      dateRange: {
        start: undefined,
        end: undefined
      }
    }
  )

  const availableDisplayModes = mode === 'guided' 
    ? ['en_to_en', 'zh_to_en', 'en_to_zh'] as DisplayMode[]
    : ['zh_to_speech', 'en_to_speech'] as DisplayMode[]

  const handleSave = async () => {
    await updateSettings({
      practiceMode: mode,
      displayMode: displayMode,
      battleSettings: battleSettings
    })
    onClose()
  }

  if (loading) return null

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl m-4">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Practice Settings</h2>
          </div>
          <Button variant="ghost" onClick={onClose}>Close</Button>
        </div>

        <CardContent className="p-6 space-y-8">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Practice Mode</h3>
              <PracticeModeSelector
                selectedMode={mode}
                onSelectMode={setMode}
              />
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Display Mode</h3>
              <DisplayModeSelector
                mode={displayMode}
                availableModes={availableDisplayModes}
                onSelect={setDisplayMode}
              />
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Battle Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Word Count */}
                <div className="space-y-2">
                  <Label htmlFor="wordCount">Number of Words</Label>
                  <Input
                    id="wordCount"
                    type="number"
                    min={5}
                    max={20}
                    value={battleSettings.wordCount}
                    onChange={(e) => setBattleSettings({ 
                      ...battleSettings, 
                      wordCount: parseInt(e.target.value) || 10 
                    })}
                  />
                </div>

                {/* Level */}
                <div className="space-y-2">
                  <Label htmlFor="level">Level</Label>
                  <Select
                    value={battleSettings.level?.toString() || 'any'}
                    onValueChange={(value) => setBattleSettings({ 
                      ...battleSettings, 
                      level: value === 'any' ? undefined : parseInt(value) 
                    })}
                  >
                    <SelectTrigger id="level" className="w-full" aria-label="Select Level">
                      <SelectValue placeholder="Any Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any Level</SelectItem>
                      {[1, 2, 3, 4, 5, 6].map((level) => (
                        <SelectItem key={level} value={level.toString()}>
                          Level {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Difficulty Level */}
                <div className="space-y-2">
                  <Label htmlFor="difficultyLevel">Difficulty</Label>
                  <Select
                    value={battleSettings.difficultyLevel || 'any'}
                    onValueChange={(value: string) => setBattleSettings({ 
                      ...battleSettings, 
                      difficultyLevel: value === 'any' ? undefined : (value as DifficultyLevel)
                    })}
                  >
                    <SelectTrigger id="difficultyLevel" className="w-full" aria-label="Select Difficulty">
                      <SelectValue placeholder="Any Difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any Difficulty</SelectItem>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Frequency Rank Range */}
                <div className="space-y-2">
                  <Label>Frequency Rank Range</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={battleSettings.frequencyRankRange?.min || ''}
                      onChange={(e) => setBattleSettings({
                        ...battleSettings,
                        frequencyRankRange: {
                          ...battleSettings.frequencyRankRange,
                          min: e.target.value ? parseInt(e.target.value) : undefined
                        }
                      })}
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={battleSettings.frequencyRankRange?.max || ''}
                      onChange={(e) => setBattleSettings({
                        ...battleSettings,
                        frequencyRankRange: {
                          ...battleSettings.frequencyRankRange,
                          max: e.target.value ? parseInt(e.target.value) : undefined
                        }
                      })}
                    />
                  </div>
                </div>

                {/* Date Range */}
                <div className="space-y-2 md:col-span-2">
                  <Label>Date Range</Label>
                  <div className="flex gap-2">
                    <Input
                      type="date"
                      value={battleSettings.dateRange?.start?.toISOString().split('T')[0] || ''}
                      onChange={(e) => setBattleSettings({
                        ...battleSettings,
                        dateRange: {
                          ...battleSettings.dateRange,
                          start: e.target.value ? new Date(e.target.value) : undefined
                        }
                      })}
                    />
                    <Input
                      type="date"
                      value={battleSettings.dateRange?.end?.toISOString().split('T')[0] || ''}
                      onChange={(e) => setBattleSettings({
                        ...battleSettings,
                        dateRange: {
                          ...battleSettings.dateRange,
                          end: e.target.value ? new Date(e.target.value) : undefined
                        }
                      })}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-gray-900 text-white hover:bg-gray-800">
              Save Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}