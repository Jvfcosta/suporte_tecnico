import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useStore } from '../store'
import { Lock, User } from 'lucide-react'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const { settings } = useStore()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // O Supabase exige email válido e senha >= 6 caracteres.
    // Se não houver @, mapeamos para um formato de e-mail invisível para o usuário.
    let mappedEmail = username.toLowerCase();
    
    // Suporte ao admin antigo e aos novos logins
    if (mappedEmail === 'admin') {
      mappedEmail = 'admin@admin.com';
    } else if (!mappedEmail.includes('@')) {
      mappedEmail = `${mappedEmail}@sistema.local`;
    }

    const mappedPassword = password === 'admin' ? 'admin123' : password;

    const { data, error } = await supabase.auth.signInWithPassword({
      email: mappedEmail,
      password: mappedPassword,
    })

    if (error) {
      setError('Usuário ou senha incorretos.')
    }
    setLoading(false)
  }

  return (
    <div style={{
      display: 'flex', 
      height: '100vh', 
      width: '100%', 
      backgroundColor: 'var(--background)', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(0,88,190,0.1) 0%, transparent 70%)'
    }}>
      <div style={{
        width: '100%', 
        maxWidth: '420px', 
        padding: '48px', 
        backgroundColor: 'var(--surface-container-lowest)', 
        borderRadius: '24px', 
        border: '1px solid rgba(255,255,255,0.4)', 
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative blur element */}
        <div style={{
          position: 'absolute', top: '-50px', right: '-50px', width: '150px', height: '150px',
          backgroundColor: 'rgba(0, 88, 190, 0.15)', borderRadius: '50%', filter: 'blur(40px)', zIndex: 0
        }}></div>

        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', marginBottom: '40px' }}>
          {settings?.logo_url ? (
            <img src={settings.logo_url} alt="Logo" style={{ height: '70px', margin: '0 auto 24px auto', display: 'block', objectFit: 'contain' }} />
          ) : (
            <div style={{ width: '70px', height: '70px', margin: '0 auto 24px auto', borderRadius: '16px', backgroundColor: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '36px' }}>support_agent</span>
            </div>
          )}
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: 'var(--on-background)', letterSpacing: '-0.02em' }}>
            {settings?.system_title || 'SupportDesk'}
          </h1>
          <p style={{ color: 'var(--on-surface-variant)', fontSize: '15px', marginTop: '8px' }}>
            {settings?.system_subtitle || 'Portal Técnico'}
          </p>
        </div>

        {error && (
          <div style={{ 
            backgroundColor: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca', 
            padding: '16px', borderRadius: '12px', marginBottom: '24px', fontSize: '14px', textAlign: 'center', fontWeight: '500' 
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ position: 'relative' }}>
            <User size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--outline)' }} />
            <input 
              type="text" 
              placeholder="Usuário"
              required 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ 
                width: '100%', padding: '16px 16px 16px 48px', borderRadius: '12px', 
                border: '1px solid var(--outline-variant)', backgroundColor: 'var(--surface-container-low)',
                fontSize: '15px', transition: 'all 0.2s', outline: 'none'
              }} 
              onFocus={(e) => { e.target.style.borderColor = 'var(--secondary)'; e.target.style.boxShadow = '0 0 0 4px rgba(0,88,190,0.1)' }}
              onBlur={(e) => { e.target.style.borderColor = 'var(--outline-variant)'; e.target.style.boxShadow = 'none' }}
            />
          </div>
          
          <div style={{ position: 'relative' }}>
            <Lock size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--outline)' }} />
            <input 
              type="password" 
              placeholder="Senha"
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ 
                width: '100%', padding: '16px 16px 16px 48px', borderRadius: '12px', 
                border: '1px solid var(--outline-variant)', backgroundColor: 'var(--surface-container-low)',
                fontSize: '15px', transition: 'all 0.2s', outline: 'none'
              }} 
              onFocus={(e) => { e.target.style.borderColor = 'var(--secondary)'; e.target.style.boxShadow = '0 0 0 4px rgba(0,88,190,0.1)' }}
              onBlur={(e) => { e.target.style.borderColor = 'var(--outline-variant)'; e.target.style.boxShadow = 'none' }}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              marginTop: '12px', padding: '16px', backgroundColor: 'var(--secondary)', color: 'white', 
              border: 'none', borderRadius: '12px', fontWeight: '600', fontSize: '16px', 
              cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s',
              boxShadow: '0 4px 12px rgba(0,88,190,0.3)'
            }}
            onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
            onMouseDown={(e) => e.target.style.transform = 'translateY(1px)'}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}
