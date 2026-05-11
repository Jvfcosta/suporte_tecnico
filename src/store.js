import { create } from 'zustand'
import { supabase } from './lib/supabase'

export const useStore = create((set, get) => ({
  user: null,
  profile: null,
  settings: {
    system_title: 'SupportDesk',
    system_subtitle: 'Technical Portal',
    logo_url: null,
    help_text: '',
    help_email: '',
    help_website: '',
    help_phone: ''
  },
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setSettings: (settings) => set({ settings }),
  
  fetchProfile: async (userId) => {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single()
    if (data) set({ profile: data })
  },
  
  fetchSettings: async () => {
    const { data, error } = await supabase.from('system_settings').select('*').eq('id', 1).single()
    if (data) set({ settings: data })
  },
  
  logout: async () => {
    await supabase.auth.signOut()
    set({ user: null, profile: null })
  }
}))
