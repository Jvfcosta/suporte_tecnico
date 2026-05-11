import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useStore } from '../store'

export default function NewTicket() {
  const navigate = useNavigate()
  const { profile } = useStore()
  
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [priority, setPriority] = useState('Média')
  
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadCategories() {
      const { data } = await supabase.from('categories').select('*').order('name')
      if (data) {
        setCategories(data)
        if (data.length > 0) setCategoryId(data[0].id)
      }
    }
    loadCategories()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (!profile) {
      setError('Sessão inválida. Faça login novamente.')
      setLoading(false)
      return
    }

    try {
      // Fetch the default status (Aberto)
      const { data: statusData } = await supabase
        .from('ticket_statuses')
        .select('id')
        .eq('name', 'Aberto')
        .single()

      const status_id = statusData?.id

      if (!status_id) {
        throw new Error('Status "Aberto" não encontrado no sistema.')
      }

      const { error: insertError } = await supabase.from('tickets').insert({
        title,
        description,
        category_id: categoryId,
        priority,
        status_id,
        created_by: profile.id
      })

      if (insertError) throw insertError

      navigate('/chamados')
    } catch (err) {
      setError(err.message || 'Erro ao criar chamado')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="dashboard-content" style={{paddingTop: '24px'}}>
      <h2 style={{fontSize:'24px', fontWeight:'bold', marginBottom:'24px'}}>Novo Chamado</h2>
      
      <div className="insight-card" style={{maxWidth: '600px'}}>
        {error && (
          <div style={{backgroundColor:'#fef2f2', color:'#991b1b', padding:'12px', borderRadius:'8px', marginBottom:'16px'}}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} style={{display:'flex', flexDirection:'column', gap:'16px'}}>
          <div>
            <label style={{display:'block', fontSize:'12px', fontWeight:'600', marginBottom:'8px', textTransform:'uppercase'}}>Assunto</label>
            <input 
              type="text" 
              required 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Descreva o problema resumidamente..."
              style={{width:'100%', padding:'12px', borderRadius:'8px', border:'1px solid var(--outline-variant)', backgroundColor:'var(--surface-container-low)'}} 
            />
          </div>
          
          <div>
            <label style={{display:'block', fontSize:'12px', fontWeight:'600', marginBottom:'8px', textTransform:'uppercase'}}>Descrição Detalhada</label>
            <textarea 
              required 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explique os detalhes, como começou, etc..."
              rows={5}
              style={{width:'100%', padding:'12px', borderRadius:'8px', border:'1px solid var(--outline-variant)', backgroundColor:'var(--surface-container-low)', resize:'vertical'}} 
            ></textarea>
          </div>
          
          <div style={{display:'flex', gap:'16px'}}>
            <div style={{flex:1}}>
              <label style={{display:'block', fontSize:'12px', fontWeight:'600', marginBottom:'8px', textTransform:'uppercase'}}>Categoria</label>
              <select 
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                style={{width:'100%', padding:'12px', borderRadius:'8px', border:'1px solid var(--outline-variant)', backgroundColor:'var(--surface-container-low)'}}
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            
            <div style={{flex:1}}>
              <label style={{display:'block', fontSize:'12px', fontWeight:'600', marginBottom:'8px', textTransform:'uppercase'}}>Prioridade</label>
              <select 
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                style={{width:'100%', padding:'12px', borderRadius:'8px', border:'1px solid var(--outline-variant)', backgroundColor:'var(--surface-container-low)'}}
              >
                <option value="Baixa">Baixa</option>
                <option value="Média">Média</option>
                <option value="Alta">Alta</option>
              </select>
            </div>
          </div>
          
          <div style={{display:'flex', justifyContent:'flex-end', gap:'12px', marginTop:'16px'}}>
            <button 
              type="button" 
              onClick={() => navigate(-1)}
              style={{padding:'12px 24px', backgroundColor:'transparent', color:'var(--on-surface-variant)', border:'1px solid var(--outline-variant)', borderRadius:'8px', fontWeight:'600', cursor:'pointer'}}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={loading}
              style={{padding:'12px 24px', backgroundColor:'var(--secondary)', color:'white', border:'none', borderRadius:'8px', fontWeight:'600', cursor: loading ? 'not-allowed' : 'pointer'}}
            >
              {loading ? 'Abrindo...' : 'Abrir Chamado'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
