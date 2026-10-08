JavaScript

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://blvfmytswkxfrgcwpaye.supabase.co/rest/v1/'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJsdmZteXRzd2t4ZnJnY3dwYXllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1MTE2MTEsImV4cCI6MjA5MTA4NzYxMX0.N7dsRfzPsSOhgfYzioa_6Jh-IiA7eR0o47Uv3Ipg6mg'

export const supabase = createClient(supabaseUrl, supabaseKey)