import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Dashboard() {
  const [stats, setStats] = useState({ abertos: 0, atendimento: 0, aguardando: 0, concluidos: 0 })

  useEffect(() => {
    // In a real scenario, we would fetch tickets from supabase and calculate stats
    setStats({ abertos: 42, atendimento: 18, aguardando: 7, concluidos: 29 })
  }, [])

  return (
    <div className="dashboard-content">
      {/* Metrics Grid */}
      <section className="metrics-grid">
        <div className="metric-card">
          <div className="metric-header">
            <span className="material-symbols-outlined metric-icon metric-icon-1">folder_open</span>
            <span className="metric-trend metric-trend-1">
              <span className="material-symbols-outlined" style={{fontSize: '14px'}}>trending_up</span> +12%
            </span>
          </div>
          <p className="metric-label">Chamados Abertos</p>
          <p className="metric-value">{stats.abertos}</p>
        </div>
        
        <div className="metric-card">
          <div className="metric-header">
            <span className="material-symbols-outlined metric-icon metric-icon-2">engineering</span>
            <span className="metric-trend metric-trend-2">
              <span className="material-symbols-outlined" style={{fontSize: '14px'}}>horizontal_rule</span> 0%
            </span>
          </div>
          <p className="metric-label">Em Atendimento</p>
          <p className="metric-value">{stats.atendimento}</p>
        </div>
        
        <div className="metric-card">
          <div className="metric-header">
            <span className="material-symbols-outlined metric-icon metric-icon-3">Anchor</span>
            <span className="metric-trend metric-trend-3">
              <span className="material-symbols-outlined" style={{fontSize: '14px'}}>priority_high</span> +5%
            </span>
          </div>
          <p className="metric-label">Aguardando Peças</p>
          <p className="metric-value">{stats.aguardando}</p>
        </div>
        
        <div className="metric-card">
          <div className="metric-header">
            <span className="material-symbols-outlined metric-icon metric-icon-4">check_circle</span>
            <span className="metric-trend metric-trend-4">
              <span className="material-symbols-outlined" style={{fontSize: '14px'}}>trending_up</span> +24%
            </span>
          </div>
          <p className="metric-label">Concluídos Hoje</p>
          <p className="metric-value">{stats.concluidos}</p>
        </div>
      </section>

      {/* Insights Section */}
      <section className="insights-grid">
        <div className="insight-card insights-chart">
          <div className="insight-header">
            <h3 className="insight-title">Carga por Categoria</h3>
            <span className="material-symbols-outlined" style={{color: 'var(--outline)'}}>more_horiz</span>
          </div>
          
          <div className="chart-area">
            <div className="bar bar-ti"><div className="bar-tooltip">TI</div></div>
            <div className="bar bar-elet"><div className="bar-tooltip">Elet</div></div>
            <div className="bar bar-pred"><div className="bar-tooltip">Pred</div></div>
            <div className="bar bar-seg"><div className="bar-tooltip">Seg</div></div>
            <div className="bar bar-tel"><div className="bar-tooltip">Tel</div></div>
          </div>
        </div>
        
        <div className="performance-card">
          <div className="perf-deco"></div>
          <h3 className="insight-title">Performance</h3>
          <p className="perf-subtitle">SLA Médio de Resposta hoje</p>
          <div className="perf-chart-wrapper">
            <div className="circular-chart">
              <svg className="circular-svg">
                <circle className="circle-bg" cx="64" cy="64" fill="transparent" r="58" stroke="currentColor" strokeWidth="8"></circle>
                <circle className="circle-progress" cx="64" cy="64" fill="transparent" r="58" stroke="currentColor" strokeWidth="8"></circle>
              </svg>
              <span className="perf-value">92%</span>
            </div>
            <p className="perf-status">Excelente desempenho</p>
          </div>
        </div>
      </section>
    </div>
  )
}
