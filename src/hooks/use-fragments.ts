import { useState, useCallback, useEffect } from 'react'
import { useAuth } from './use-auth'
import { getTotalFragments } from '@/lib/services/fragments'

export function useFragments() {
  const { user } = useAuth()
  const [totalFragments, setTotalFragments] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchFragments = useCallback(async () => {
    if (!user) {
      setTotalFragments(null)
      setLoading(false)
      return
    }
    
    try {
      setError(null)
      const total = await getTotalFragments(user.id)
      setTotalFragments(total)
    } catch (error) {
      console.error('Error fetching fragments:', error)
      setError(error as Error)
    } finally {
      setLoading(false)
    }
  }, [user])

  // Initial fetch and polling setup
  useEffect(() => {
    fetchFragments()
    
    // Poll for updates every 2 seconds
    const interval = setInterval(fetchFragments, 2000)
    
    return () => clearInterval(interval)
  }, [fetchFragments])

  return {
    totalFragments: totalFragments ?? 0,
    loading,
    error,
    retry: fetchFragments
  }
}