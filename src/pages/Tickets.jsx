import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useStore } from '../store'
import { format } from 'date-fns'
import { X, Save, Loader2 } from 'lucide-react'

export default function Tickets() {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const { profile } = useStore()

  // Modal State
  const [selectedTicket, setSelectedTicket] = useState(null)
  
  // Edit State (para técnicos/admins alterarem status e prioridade)
  const [editMode, setEditMode] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editData, setEditData] = useState({})
  
  // Opções para edição
  const [statuses, setStatuses] = useState([])

  useEffect(() => {
    if (profile) {
      loadTickets()
      loadStatuses()
    }
  }, [profile])

  async function loadTickets() {
    setLoading(true)
    const { data, error } = await supabase
      .from('tickets')
      .select(`
        id,
        title,
        description,
        priority,
        created_at,
        category:categories(id, name),
        status:ticket_statuses(id, name, color_class),
        creator:profiles!tickets_created_by_fkey(full_name, avatar_url)
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erro ao buscar tickets:', error)
    }

    if (data) setTickets(data)
    setLoading(false)
  }

  async function loadStatuses() {
    const { data } = await supabase.from('ticket_statuses').select('*')
    if (data) setStatuses(data)
  }

  const openTicketModal = (ticket) => {
    setSelectedTicket(ticket)
    setEditMode(false)
    setEditData({
      status_id: ticket.status?.id,
      priority: ticket.priority
    })
  }

  const handleSaveUpdate = async () => {
    setSaving(true)
    try {
      const { error } = await supabase
        .from('tickets')
        .update({
          status_id: editData.status_id,
          priority: profile.role === 'admin' ? editData.priority : selectedTicket.priority // Apenas admin altera prioridade
        })
        .eq('id', selectedTicket.id)

      if (error) throw error

      // Atualiza a listagem e fecha o modal
      await loadTickets()
      setSelectedTicket(null)
    } catch (error) {
      alert('Erro ao atualizar: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="dashboard-content" style={{paddingTop: '24px'}}>
      <h2 style={{fontSize:'24px', fontWeight:'bold', marginBottom:'16px'}}>Meus Chamados</h2>
      
      <section className="table-section">
        <div className="filters-bar">
          <span className="filter-label">Filtrar por:</span>
          <button className="chip chip-active">Todos</button>
          <button className="chip">Informática / TI</button>
          <button className="chip">Elétrica</button>
          <button className="chip">Predial / Civil</button>
        </div>
        
        <div className="table-wrapper">
          {loading ? (
            <div style={{padding:'40px', textAlign:'center'}}>Carregando chamados...</div>
          ) : tickets.length === 0 ? (
            <div style={{padding:'40px', textAlign:'center', color:'var(--on-surface-variant)'}}>Nenhum chamado encontrado.</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>ID/Ticket</th>
                  <th>Assunto</th>
                  <th>Categoria</th>
                  <th className="text-center">Prioridade</th>
                  <th>Status</th>
                  <th className="text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map(t => (
                  <tr key={t.id}>
                    <td className="cell-id">#TK-{8800 + t.id}</td>
                    <td>
                      <p className="cell-subject-title">{t.title}</p>
                      <p className="cell-subject-meta">Aberto por: {t.creator?.full_name || 'Usuário'} em {format(new Date(t.created_at), 'dd/MM/yyyy HH:mm')}</p>
                    </td>
                    <td>
                      <span className="tag" style={{backgroundColor:'var(--surface-container-high)', color:'var(--on-surface)'}}>
                        {t.category?.name || 'Sem categoria'}
                      </span>
                    </td>
                    <td className="text-center">
                      <span className={`priority-dot priority-${t.priority === 'Alta' ? 'high' : t.priority === 'Média' ? 'medium' : 'low'}`} title={t.priority}></span>
                    </td>
                    <td>
                      <span className={`tag ${t.status?.color_class || 'status-open'}`}>
                        {t.status?.name || 'Desconhecido'}
                      </span>
                    </td>
                    <td>
                      <div className="actions-cell">
                        <button onClick={() => openTicketModal(t)} className="btn-action btn-action-view" title="Visualizar">
                          <span className="material-symbols-outlined" style={{fontSize: '18px'}}>visibility</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {/* TICKET DETAILS MODAL */}
      {selectedTicket && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px'
        }}>
          <div style={{
            backgroundColor: 'var(--surface-container-lowest)', borderRadius: '12px',
            width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', border: '1px solid var(--outline-variant)'
          }}>
            {/* Modal Header */}
            <div style={{padding: '24px', borderBottom: '1px solid var(--outline-variant)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
              <div>
                <span style={{fontSize: '12px', fontWeight: 'bold', color: 'var(--on-surface-variant)', letterSpacing: '1px'}}>#TK-{8800 + selectedTicket.id}</span>
                <h3 style={{fontSize: '20px', fontWeight: 'bold', marginTop: '4px'}}>{selectedTicket.title}</h3>
              </div>
              <button onClick={() => setSelectedTicket(null)} style={{background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--on-surface-variant)'}}>
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px'}}>
              
              <div style={{display: 'flex', gap: '16px', alignItems: 'center', padding: '16px', backgroundColor: 'var(--surface-container-low)', borderRadius: '8px'}}>
                <img src={selectedTicket.creator?.avatar_url || 'https://www.gravatar.com/avatar/0?d=mp'} alt="Creator" style={{width: '40px', height: '40px', borderRadius: '50%'}} />
                <div>
                  <p style={{fontWeight: 'bold', fontSize: '14px'}}>{selectedTicket.creator?.full_name || 'Usuário'}</p>
                  <p style={{fontSize: '12px', color: 'var(--on-surface-variant)'}}>Aberto em {format(new Date(selectedTicket.created_at), 'dd/MM/yyyy HH:mm')}</p>
                </div>
              </div>

              <div>
                <h4 style={{fontSize: '12px', fontWeight: 'bold', color: 'var(--on-surface-variant)', textTransform: 'uppercase', marginBottom: '8px'}}>Descrição do Problema</h4>
                <div style={{padding: '16px', border: '1px solid var(--outline-variant)', borderRadius: '8px', whiteSpace: 'pre-wrap', lineHeight: '1.5', fontSize: '14px'}}>
                  {selectedTicket.description || 'Nenhuma descrição fornecida.'}
                </div>
              </div>

              {/* Informações Classificatórias */}
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
                <div>
                   <h4 style={{fontSize: '12px', fontWeight: 'bold', color: 'var(--on-surface-variant)', textTransform: 'uppercase', marginBottom: '8px'}}>Categoria</h4>
                   <span className="tag" style={{backgroundColor:'var(--surface-container-high)', color:'var(--on-surface)'}}>{selectedTicket.category?.name}</span>
                </div>
                <div>
                   <h4 style={{fontSize: '12px', fontWeight: 'bold', color: 'var(--on-surface-variant)', textTransform: 'uppercase', marginBottom: '8px'}}>Prioridade</h4>
                   {editMode && profile?.role === 'admin' ? (
                     <select 
                       value={editData.priority} 
                       onChange={e => setEditData({...editData, priority: e.target.value})}
                       style={{width:'100%', padding:'8px', borderRadius:'6px', border:'1px solid var(--outline-variant)'}}
                     >
                       <option value="Baixa">Baixa</option>
                       <option value="Média">Média</option>
                       <option value="Alta">Alta</option>
                     </select>
                   ) : (
                     <span style={{fontWeight: 'bold', color: selectedTicket.priority === 'Alta' ? '#dc2626' : selectedTicket.priority === 'Média' ? '#d97706' : '#2563eb'}}>
                       {selectedTicket.priority}
                     </span>
                   )}
                </div>
                <div>
                   <h4 style={{fontSize: '12px', fontWeight: 'bold', color: 'var(--on-surface-variant)', textTransform: 'uppercase', marginBottom: '8px'}}>Status Atual</h4>
                   {editMode ? (
                     <select 
                       value={editData.status_id} 
                       onChange={e => setEditData({...editData, status_id: e.target.value})}
                       style={{width:'100%', padding:'8px', borderRadius:'6px', border:'1px solid var(--outline-variant)'}}
                     >
                       {statuses.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                     </select>
                   ) : (
                     <span className={`tag ${selectedTicket.status?.color_class || 'status-open'}`}>{selectedTicket.status?.name}</span>
                   )}
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div style={{padding: '16px 24px', borderTop: '1px solid var(--outline-variant)', backgroundColor: 'var(--surface-container-low)', display: 'flex', justifyContent: 'flex-end', gap: '12px'}}>
              {(profile?.role === 'admin' || profile?.role === 'tecnico') && !editMode && (
                <button onClick={() => setEditMode(true)} style={{padding:'10px 16px', borderRadius:'8px', border:'1px solid var(--outline-variant)', backgroundColor:'transparent', cursor:'pointer', fontWeight:'bold'}}>
                  Modificar Status/Prioridade
                </button>
              )}

              {editMode && (
                <>
                  <button onClick={() => setEditMode(false)} style={{padding:'10px 16px', borderRadius:'8px', border:'1px solid var(--outline-variant)', backgroundColor:'transparent', cursor:'pointer'}}>Cancelar Edição</button>
                  <button onClick={handleSaveUpdate} disabled={saving} style={{padding:'10px 16px', borderRadius:'8px', border:'none', backgroundColor:'var(--secondary)', color:'white', fontWeight:'bold', cursor: saving ? 'not-allowed' : 'pointer', display:'flex', alignItems:'center', gap:'8px'}}>
                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} 
                    Salvar Alterações
                  </button>
                </>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  )
}
