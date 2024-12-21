import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { BattleSettings as BattleSettingsType } from '@/lib/types/practice';

interface BattleSettingsProps {
  onSave: (settings: BattleSettingsType) => void;
  defaultSettings?: BattleSettingsType;
}

type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export function BattleSettings({ onSave, defaultSettings }: BattleSettingsProps) {
  const [settings, setSettings] = useState<BattleSettingsType>(defaultSettings || {
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
  });

  const handleSave = () => {
    onSave(settings);
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Battle Settings</h2>
        <p className="text-sm text-gray-500">Customize your vocabulary battle experience</p>
      </div>

      <div className="space-y-4">
        {/* Word Count */}
        <div className="space-y-2">
          <Label htmlFor="wordCount">Number of Words</Label>
          <Input
            id="wordCount"
            type="number"
            min={5}
            max={20}
            value={settings.wordCount}
            onChange={(e) => setSettings({ ...settings, wordCount: parseInt(e.target.value) || 10 })}
          />
        </div>

        {/* Level */}
        <div className="space-y-2">
          <Label htmlFor="level">Level</Label>
          <Select
            value={settings.level?.toString() || ''}
            onValueChange={(value) => setSettings({ 
              ...settings, 
              level: value ? parseInt(value) : undefined 
            })}
          >
            <SelectTrigger id="level" className="w-full" aria-label="Select Level">
              <SelectValue placeholder="Any Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Any Level</SelectItem>
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
            value={settings.difficultyLevel || ''}
            onValueChange={(value: string) => setSettings({ 
              ...settings, 
              difficultyLevel: (value as DifficultyLevel) || undefined 
            })}
          >
            <SelectTrigger id="difficultyLevel" className="w-full" aria-label="Select Difficulty">
              <SelectValue placeholder="Any Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Any Difficulty</SelectItem>
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
              value={settings.frequencyRankRange?.min || ''}
              onChange={(e) => setSettings({
                ...settings,
                frequencyRankRange: {
                  ...settings.frequencyRankRange,
                  min: e.target.value ? parseInt(e.target.value) : undefined
                }
              })}
            />
            <Input
              type="number"
              placeholder="Max"
              value={settings.frequencyRankRange?.max || ''}
              onChange={(e) => setSettings({
                ...settings,
                frequencyRankRange: {
                  ...settings.frequencyRankRange,
                  max: e.target.value ? parseInt(e.target.value) : undefined
                }
              })}
            />
          </div>
        </div>

        {/* Date Range */}
        <div className="space-y-2">
          <Label>Date Range</Label>
          <div className="flex gap-2">
            <Input
              type="date"
              value={settings.dateRange?.start?.toISOString().split('T')[0] || ''}
              onChange={(e) => setSettings({
                ...settings,
                dateRange: {
                  ...settings.dateRange,
                  start: e.target.value ? new Date(e.target.value) : undefined
                }
              })}
            />
            <Input
              type="date"
              value={settings.dateRange?.end?.toISOString().split('T')[0] || ''}
              onChange={(e) => setSettings({
                ...settings,
                dateRange: {
                  ...settings.dateRange,
                  end: e.target.value ? new Date(e.target.value) : undefined
                }
              })}
            />
          </div>
        </div>
      </div>

      <Button onClick={handleSave} className="w-full">
        Save Settings
      </Button>
    </Card>
  );
} 