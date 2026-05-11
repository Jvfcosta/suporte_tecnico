import { useState } from 'react'
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useStore } from '../store'
import { Menu, Search, Plus, HelpCircle, LogOut, User as UserIcon } from 'lucide-react'

export default function Layout() {
  const { profile, settings, logout } = useStore()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)
  
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  // Hide search on non-list pages
  const showSearch = location.pathname === '/' || location.pathname === '/chamados'

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`} style={{zIndex: 50}}>
        <div className="sidebar-header">
          {settings?.logo_url ? (
             <img src={settings.logo_url} alt="Logo" style={{maxHeight:'40px', maxWidth:'100%', marginBottom:'8px'}} />
          ) : null}
          <h1 className="sidebar-title">{settings?.system_title || 'SupportDesk'}</h1>
          <p className="sidebar-subtitle">{settings?.system_subtitle || 'Portal Técnico'}</p>
        </div>
        
        <nav className="sidebar-nav">
          {profile?.role !== 'cliente' && (
            <NavLink to="/" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`} onClick={() => setSidebarOpen(false)}>
              <span className="material-symbols-outlined">dashboard</span>
              <span className="label">Painel Geral</span>
            </NavLink>
          )}
          <NavLink to="/chamados" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`} onClick={() => setSidebarOpen(false)}>
            <span className="material-symbols-outlined">confirmation_number</span>
            <span className="label">Meus Chamados</span>
          </NavLink>
          {profile?.role !== 'cliente' && (
            <NavLink to="/relatorios" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`} onClick={() => setSidebarOpen(false)}>
              <span className="material-symbols-outlined">analytics</span>
              <span className="label">Relatórios</span>
            </NavLink>
          )}
          <NavLink to="/configuracoes" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`} onClick={() => setSidebarOpen(false)}>
            <span className="material-symbols-outlined">settings</span>
            <span className="label">Configurações</span>
          </NavLink>
        </nav>
        
        <div className="sidebar-footer">
          <img alt="Avatar" className="avatar" src={profile?.avatar_url || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'}/>
          <div className="user-info">
            <p className="user-name">{profile?.full_name || 'Usuário'}</p>
            <p className="user-role">{profile?.title || profile?.role}</p>
          </div>
        </div>
      </aside>

      {sidebarOpen && <div className="overlay active" onClick={() => setSidebarOpen(false)}></div>}

      {/* Main Content Area */}
      <main className="main-content">
        {/* TopAppBar */}
        <header className="top-header" style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <div className="search-container" style={{display:'flex', alignItems:'center', gap:'12px', flex:1}}>
            <button className="btn-icon mobile-menu-btn" onClick={() => setSidebarOpen(true)} style={{display: 'none'}}>
              <Menu size={20} />
            </button>
            
            {showSearch && (
              <div className="search-input-wrapper" style={{maxWidth:'500px', width:'100%', position:'relative'}}>
                <Search className="search-icon" size={18} style={{position:'absolute', left:'12px', top:'50%', transform:'translateY(-50%)', color:'var(--outline)'}} />
                <input 
                  className="search-input" 
                  placeholder="Buscar chamados por título ou usuário..." 
                  type="text"
                  onKeyDown={(e) => {
                     if(e.key === 'Enter'){
                       // trigger search logic here (can be via context or global store)
                     }
                  }}
                  style={{width:'100%', paddingLeft:'40px', paddingRight:'16px', padding:'8px 16px 8px 40px', borderRadius:'8px', border:'1px solid var(--outline-variant)', backgroundColor:'var(--surface-container-low)'}}
                />
              </div>
            )}
          </div>
          
          <div className="header-actions" style={{display:'flex', alignItems:'center', gap:'16px'}}>
            {/* Status Filter Combobox (only in lists) */}
            {showSearch && profile?.role !== 'cliente' && (
              <select style={{padding:'8px', borderRadius:'8px', border:'1px solid var(--outline-variant)', backgroundColor:'var(--surface)'}}>
                <option value="">Todos os Status</option>
                <option value="Aberto">Aberto</option>
                <option value="Em Curso">Em Curso</option>
                <option value="Concluído">Concluído</option>
              </select>
            )}

            <button className="btn-primary" onClick={() => navigate('/novo-chamado')}>
              <Plus size={18} />
              <span>Novo Chamado</span>
            </button>
            
            <div className="icon-actions" style={{display:'flex', alignItems:'center', gap:'8px'}}>
              <div style={{position:'relative'}}>
                <button className="btn-icon" onClick={() => {setHelpOpen(!helpOpen); setUserMenuOpen(false)}}>
                  <HelpCircle size={20} />
                </button>
                {helpOpen && (
                  <div style={{position:'absolute', top:'100%', right:0, marginTop:'8px', width:'250px', backgroundColor:'var(--surface)', border:'1px solid var(--outline-variant)', borderRadius:'8px', padding:'16px', boxShadow:'0 4px 6px -1px rgba(0,0,0,0.1)', zIndex: 100}}>
                     <h4 style={{fontSize:'14px', fontWeight:'bold', marginBottom:'8px'}}>Ajuda</h4>
                     {settings?.help_text && <p style={{fontSize:'12px', marginBottom:'4px'}}>{settings.help_text}</p>}
                     {settings?.help_email && <p style={{fontSize:'12px', marginBottom:'4px'}}>✉️ {settings.help_email}</p>}
                     {settings?.help_phone && <p style={{fontSize:'12px', marginBottom:'4px'}}>📞 {settings.help_phone}</p>}
                     {settings?.help_website && <p style={{fontSize:'12px'}}>🌐 <a href={settings.help_website} target="_blank" rel="noreferrer" style={{color:'var(--secondary)'}}>Website</a></p>}
                     {!settings?.help_text && !settings?.help_email && !settings?.help_phone && <p style={{fontSize:'12px', color:'var(--outline)'}}>Nenhuma informação de ajuda cadastrada.</p>}
                  </div>
                )}
              </div>

              <div style={{position:'relative'}}>
                <button 
                  className="btn-icon" 
                  style={{display:'flex', alignItems:'center', gap:'8px', padding:'4px', borderRadius:'24px', border:'1px solid var(--outline-variant)'}}
                  onClick={() => {setUserMenuOpen(!userMenuOpen); setHelpOpen(false)}}
                >
                  <img src={profile?.avatar_url || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'} alt="User" style={{width:'28px', height:'28px', borderRadius:'50%', objectFit:'cover'}} />
                </button>
                {userMenuOpen && (
                  <div style={{position:'absolute', top:'100%', right:0, marginTop:'8px', width:'200px', backgroundColor:'var(--surface)', border:'1px solid var(--outline-variant)', borderRadius:'8px', padding:'8px 0', boxShadow:'0 4px 6px -1px rgba(0,0,0,0.1)', zIndex: 100}}>
                     <div style={{padding:'8px 16px', borderBottom:'1px solid var(--outline-variant)', marginBottom:'8px'}}>
                        <p style={{fontWeight:'bold', fontSize:'14px'}}>{profile?.full_name || 'Usuário'}</p>
                     </div>
                     <button onClick={() => {navigate('/configuracoes'); setUserMenuOpen(false)}} style={{width:'100%', textAlign:'left', padding:'8px 16px', display:'flex', alignItems:'center', gap:'8px', backgroundColor:'transparent', border:'none', cursor:'pointer', fontSize:'14px'}}>
                        <UserIcon size={16} /> Perfil
                     </button>
                     <button onClick={handleLogout} style={{width:'100%', textAlign:'left', padding:'8px 16px', display:'flex', alignItems:'center', gap:'8px', backgroundColor:'transparent', border:'none', cursor:'pointer', fontSize:'14px', color:'var(--error)'}}>
                        <LogOut size={16} /> Sair
                     </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <div style={{flex: 1, display:'flex', flexDirection:'column', overflowY:'auto'}}>
          <Outlet />
        </div>
      </main>
      
      <style>{`
        @media (max-width: 768px) {
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </div>
  )
}
