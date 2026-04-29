import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://sbyqjasejgmpkszmutlm.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNieXFqYXNlamdtcGtzem11dGxtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0MTI2MzEsImV4cCI6MjA5Mjk4ODYzMX0.TBCrQVeAOGAOWP6jOwsDYBK04qH2e1WdyGfEcRlU25k'
)
