import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useStore } from '../store'
import { UserPlus, Save, Users, Shield, Loader2, Trash2 } from 'lucide-react'

export default function Settings() {
  const [activeTab, setActiveTab] = useState('usuarios')
  const { profile } = useStore()

  // Tab definitions
  const tabs = [
    { id: 'sistema', label: 'Sistema' },
    { id: 'perfil', label: 'Meu Perfil' },
    { id: 'usuarios', label: 'Usuários e Acessos' },
    { id: 'ajuda', label: 'Informações de Ajuda' },
    { id: 'categorias', label: 'Categorias & Status' },
    { id: 'chamados', label: 'Gerenciamento de Dados' }
  ]

  return (
    <div className="dashboard-content" style={{paddingTop: '24px'}}>
      <h2 style={{fontSize:'24px', fontWeight:'bold', marginBottom:'24px'}}>Configurações</h2>
      
      <div style={{display:'flex', gap:'24px'}}>
        {/* Sidebar de Configurações */}
        <div style={{width:'250px', display:'flex', flexDirection:'column', gap:'8px'}}>
          {tabs.map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)} 
              className="btn-action" 
              style={{
                justifyContent:'flex-start', 
                padding:'12px 16px', 
                width:'100%', 
                border:'1px solid',
                borderColor: activeTab === tab.id ? 'var(--secondary)' : 'var(--outline-variant)',
                backgroundColor: activeTab === tab.id ? 'var(--secondary)' : 'transparent',
                color: activeTab === tab.id ? '#ffffff' : 'var(--on-surface)',
                fontWeight: activeTab === tab.id ? '600' : '400',
                transition: 'all 0.2s',
                borderRadius: '8px'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
        
        {/* Área Principal de Configurações */}
        <div className="insight-card" style={{flex:1, minHeight: '500px'}}>
          <h3 style={{fontSize:'20px', fontWeight:'bold', marginBottom:'24px'}}>
            {tabs.find(t => t.id === activeTab)?.label}
          </h3>
          
          {activeTab === 'usuarios' ? (
            <UserManagement />
          ) : (
            <div style={{padding:'24px', textAlign:'center', backgroundColor:'var(--surface-container-low)', borderRadius:'8px'}}>
              <p style={{color:'var(--on-surface-variant)'}}>Funcionalidade em desenvolvimento.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function UserManagement() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Form state
  const [showForm, setShowForm] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    password: '',
    role: 'tecnico',
    title: 'Suporte Nível 1'
  })
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    loadUsers()
  }, [])

  async function loadUsers() {
    setLoading(true)
    const { data, error } = await supabase.from('profiles').select('*').order('full_name')
    if (data) setUsers(data)
    setLoading(false)
  }

  const handleEditClick = (user) => {
    setEditingUser(user)
    setFormData({
      fullName: user.full_name || '',
      username: '', // Não exibido na edição direta
      password: '', // Não exibido
      role: user.role || 'tecnico',
      title: user.title || ''
    })
    setShowForm(true)
    setMessage({ type: '', text: '' })
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingUser(null)
    setFormData({ fullName: '', username: '', password: '', role: 'tecnico', title: '' })
  }

  const handleSubmitUser = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setMessage({ type: '', text: '' })

    try {
      if (editingUser) {
        // Modo Edição: Atualiza apenas a tabela profiles
        const { error } = await supabase.from('profiles')
          .update({
            full_name: formData.fullName,
            title: formData.title,
            role: formData.role
          })
          .eq('id', editingUser.id)

        if (error) throw error
        setMessage({ type: 'success', text: 'Usuário atualizado com sucesso!' })
      } else {
        // Modo Criação
        const finalEmail = formData.username.includes('@') ? formData.username : `${formData.username}@sistema.local`;
        const { error } = await supabase.rpc('admin_create_user', {
          p_email: finalEmail,
          p_password: formData.password,
          p_role: formData.role,
          p_full_name: formData.fullName,
          p_title: formData.title
        })
        if (error) throw error
        setMessage({ type: 'success', text: 'Usuário cadastrado com sucesso!' })
      }

      handleCancel()
      loadUsers()
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Erro ao processar usuário' })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Tem certeza que deseja EXCLUIR permanentemente o usuário ${userName}? Esta ação não pode ser desfeita.`)) {
      return;
    }

    try {
      const { error } = await supabase.rpc('admin_delete_user', {
        p_user_id: userId
      })

      if (error) {
        if (error.message.includes('violates foreign key')) {
          throw new Error('Não é possível excluir este usuário pois ele possui chamados vinculados a ele no sistema.')
        }
        throw error
      }

      setMessage({ type: 'success', text: `Usuário ${userName} excluído com sucesso!` })
      loadUsers()
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Erro ao excluir usuário.' })
    }
  }

  return (
    <div>
      {message.text && (
        <div style={{
          padding:'12px', borderRadius:'8px', marginBottom:'24px', 
          backgroundColor: message.type === 'error' ? '#fef2f2' : '#f0fdf4',
          color: message.type === 'error' ? '#991b1b' : '#166534',
          border: `1px solid ${message.type === 'error' ? '#fecaca' : '#bbf7d0'}`
        }}>
          {message.text}
        </div>
      )}

      {showForm ? (
        <div style={{backgroundColor:'var(--surface-container-lowest)', padding:'24px', borderRadius:'12px', border:'1px solid var(--outline-variant)'}}>
          <h4 style={{fontSize:'16px', fontWeight:'bold', marginBottom:'16px', display:'flex', alignItems:'center', gap:'8px'}}>
            <UserPlus size={18} /> {editingUser ? 'Editar Usuário' : 'Novo Funcionário / Usuário'}
          </h4>
          
          <form onSubmit={handleSubmitUser} style={{display:'flex', flexDirection:'column', gap:'16px'}}>
            <div style={{display:'flex', gap:'16px'}}>
              <div style={{flex:1}}>
                <label style={{display:'block', fontSize:'12px', fontWeight:'600', marginBottom:'8px'}}>Nome Completo</label>
                <input type="text" required value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} style={{width:'100%', padding:'10px', borderRadius:'8px', border:'1px solid var(--outline-variant)'}} />
              </div>
              <div style={{flex:1}}>
                <label style={{display:'block', fontSize:'12px', fontWeight:'600', marginBottom:'8px'}}>Cargo / Título (Ex: Técnico Junior)</label>
                <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} style={{width:'100%', padding:'10px', borderRadius:'8px', border:'1px solid var(--outline-variant)'}} />
              </div>
            </div>

            {!editingUser && (
              <div style={{display:'flex', gap:'16px'}}>
                <div style={{flex:1}}>
                  <label style={{display:'block', fontSize:'12px', fontWeight:'600', marginBottom:'8px'}}>Login de Usuário</label>
                  <input type="text" required value={formData.username} onChange={e => setFormData({...formData, username: e.target.value.toLowerCase().replace(/\s/g, '')})} placeholder="Ex: joao.silva" style={{width:'100%', padding:'10px', borderRadius:'8px', border:'1px solid var(--outline-variant)'}} />
                </div>
                <div style={{flex:1}}>
                  <label style={{display:'block', fontSize:'12px', fontWeight:'600', marginBottom:'8px'}}>Senha Temporária (Mín. 6 chars)</label>
                  <input type="password" required minLength={6} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} style={{width:'100%', padding:'10px', borderRadius:'8px', border:'1px solid var(--outline-variant)'}} />
                </div>
              </div>
            )}

            <div>
              <label style={{display:'block', fontSize:'12px', fontWeight:'600', marginBottom:'8px'}}>Nível de Acesso (Role)</label>
              <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} style={{width:'100%', padding:'10px', borderRadius:'8px', border:'1px solid var(--outline-variant)'}}>
                <option value="tecnico">Técnico (Atende chamados, edita status)</option>
                <option value="admin">Administrador (Acesso total)</option>
                <option value="cliente">Cliente (Apenas visualiza seus próprios chamados)</option>
              </select>
            </div>

            <div style={{display:'flex', justifyContent:'flex-end', gap:'12px', marginTop:'8px'}}>
              <button type="button" onClick={handleCancel} style={{padding:'10px 16px', borderRadius:'8px', border:'1px solid var(--outline-variant)', backgroundColor:'transparent', cursor:'pointer'}}>Cancelar</button>
              <button type="submit" disabled={submitting} style={{padding:'10px 16px', borderRadius:'8px', border:'none', backgroundColor:'var(--secondary)', color:'white', fontWeight:'bold', cursor: submitting ? 'not-allowed' : 'pointer', display:'flex', alignItems:'center', gap:'8px'}}>
                {submitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} 
                {submitting ? 'Salvando...' : (editingUser ? 'Salvar Alterações' : 'Salvar Usuário')}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'24px'}}>
            <p style={{color:'var(--on-surface-variant)'}}>Gerencie os acessos ao sistema SupportDesk.</p>
            <button onClick={() => { setEditingUser(null); setShowForm(true); setMessage({type:'', text:''}); }} className="btn-primary" style={{padding:'8px 16px', fontSize:'14px'}}>
              <UserPlus size={16} /> Adicionar Usuário
            </button>
          </div>

          {loading ? (
            <div style={{textAlign:'center', padding:'40px'}}>Carregando usuários...</div>
          ) : (
            <div className="table-wrapper" style={{border:'1px solid var(--outline-variant)', borderRadius:'12px', overflow:'hidden'}}>
              <table style={{width:'100%', borderCollapse:'collapse'}}>
                <thead style={{backgroundColor:'var(--surface-container-low)', textAlign:'left'}}>
                  <tr>
                    <th style={{padding:'12px 16px', borderBottom:'1px solid var(--outline-variant)'}}>Usuário</th>
                    <th style={{padding:'12px 16px', borderBottom:'1px solid var(--outline-variant)'}}>Nível</th>
                    <th style={{padding:'12px 16px', borderBottom:'1px solid var(--outline-variant)'}}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} style={{borderBottom:'1px solid var(--outline-variant)'}}>
                      <td style={{padding:'12px 16px'}}>
                        <div style={{display:'flex', alignItems:'center', gap:'12px'}}>
                          <img src={u.avatar_url || 'https://www.gravatar.com/avatar/0?d=mp'} alt="" style={{width:'32px', height:'32px', borderRadius:'50%'}} />
                          <div>
                            <p style={{fontWeight:'bold', fontSize:'14px'}}>{u.full_name || 'Sem nome'}</p>
                            <p style={{fontSize:'12px', color:'var(--on-surface-variant)'}}>{u.title || 'Sem cargo'}</p>
                          </div>
                        </div>
                      </td>
                      <td style={{padding:'12px 16px'}}>
                        <span style={{
                          padding:'4px 8px', borderRadius:'16px', fontSize:'12px', fontWeight:'bold',
                          backgroundColor: u.role === 'admin' ? '#fef08a' : u.role === 'tecnico' ? '#bfdbfe' : '#e5e7eb',
                          color: u.role === 'admin' ? '#854d0e' : u.role === 'tecnico' ? '#1e40af' : '#374151'
                        }}>
                          {u.role.toUpperCase()}
                        </span>
                      </td>
                      <td style={{padding:'12px 16px'}}>
                        <div style={{display:'flex', gap:'12px', alignItems:'center'}}>
                          <button onClick={() => handleEditClick(u)} style={{color:'var(--secondary)', background:'none', border:'none', cursor:'pointer', fontWeight:'bold', fontSize:'12px'}}>
                            EDITAR
                          </button>
                          <button onClick={() => handleDeleteUser(u.id, u.full_name)} style={{color:'#dc2626', background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center'}} title="Excluir Usuário">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  )
}
