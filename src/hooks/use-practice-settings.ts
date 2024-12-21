import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from './use-auth'
import { PracticeMode, DisplayMode, PracticeSettings } from '@/lib/types/practice'
import { User } from '@supabase/supabase-js'

const DEFAULT_SETTINGS: PracticeSettings = {
  practiceMode: 'guided',
  displayMode: 'en_to_en',
  battleSettings: {
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
}

export function usePracticeSettings() {
  const { user } = useAuth() as { user: User | null }
  const [settings, setSettings] = useState<PracticeSettings>(DEFAULT_SETTINGS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function initializeSettings() {
      if (!user) {
        console.log('No user found, skipping settings initialization')
        return
      }

      try {
        console.log('Fetching settings for user:', user.id)
        
        // Try to get existing settings
        const { data: existingSettings, error: fetchError } = await supabase
          .from('user_practice_settings')
          .select('practice_mode, display_mode, battle_settings')
          .eq('user_id', user.id)
          .maybeSingle()

        if (fetchError) {
          console.error('Error fetching settings:', fetchError)
          throw fetchError
        }

        // If no settings exist, create default settings
        if (!existingSettings) {
          console.log('No existing settings found, creating defaults')
          const { error: insertError } = await supabase
            .from('user_practice_settings')
            .insert({
              user_id: user.id,
              practice_mode: DEFAULT_SETTINGS.practiceMode,
              display_mode: DEFAULT_SETTINGS.displayMode,
              battle_settings: DEFAULT_SETTINGS.battleSettings
            })

          if (insertError) {
            console.error('Error inserting default settings:', insertError)
            throw insertError
          }
          
          console.log('Default settings created successfully')
          setSettings(DEFAULT_SETTINGS)
        } else {
          console.log('Existing settings found:', existingSettings)
          const updatedSettings = {
            practiceMode: existingSettings.practice_mode as PracticeMode,
            displayMode: existingSettings.display_mode as DisplayMode,
            battleSettings: existingSettings.battle_settings || DEFAULT_SETTINGS.battleSettings
          }
          console.log('Updating settings state with:', updatedSettings)
          setSettings(updatedSettings)
        }
      } catch (error) {
        console.error('Error initializing practice settings:', error)
      } finally {
        setLoading(false)
      }
    }

    initializeSettings()
  }, [user])

  const updateSettings = async (newSettings: Partial<PracticeSettings>) => {
    if (!user) {
      console.log('No user found, skipping settings update')
      return
    }

    try {
      console.log('Current settings:', settings)
      console.log('Updating settings with:', newSettings)

      const updatedSettings = {
        practice_mode: newSettings.practiceMode || settings.practiceMode,
        display_mode: newSettings.displayMode || settings.displayMode,
        battle_settings: newSettings.battleSettings || settings.battleSettings,
        updated_at: new Date().toISOString()
      }

      console.log('Sending to database:', updatedSettings)

      const { error, data } = await supabase
        .from('user_practice_settings')
        .update(updatedSettings)
        .eq('user_id', user.id)
        .select()

      if (error) {
        console.error('Error updating settings in database:', error)
        throw error
      }

      console.log('Database response:', data)

      const mergedSettings = { ...settings, ...newSettings }
      console.log('Updating local state with:', mergedSettings)
      setSettings(mergedSettings)

      console.log('Settings updated successfully')
    } catch (error) {
      console.error('Error updating practice settings:', error)
      throw error
    }
  }

  return {
    settings,
    updateSettings,
    loading
  }
}