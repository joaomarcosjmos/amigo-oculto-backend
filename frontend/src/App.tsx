import { useState } from 'react';
import axios from 'axios';
import './App.css';

interface Participant {
  nickname: string;
  email: string;
  partnerEmail?: string;
}

interface Result {
  email: string;
  secretFriend: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  results?: Result[];
  totalParticipants: number;
}

const API_URL = (import.meta.env.VITE_API_URL as string) || 'http://localhost:3000';

// Função para formatar preview do template
const formatTemplatePreview = (template: string): string => {
  let formatted = template.replace(/\{\{secretFriend\}\}/g, '<strong style="color: #667eea;">[Nome do Amigo]</strong>');
  
  // Converte markdown simples para HTML
  formatted = formatted
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>');
  
  // Converte quebras de linha em parágrafos
  const paragraphs = formatted.split(/\n\n+/).filter(p => p.trim());
  const formattedParagraphs = paragraphs.map(para => {
    const lines = para.split('\n').filter(l => l.trim());
    return `<p style="margin-bottom: 15px; line-height: 1.6;">${lines.join('<br>')}</p>`;
  });
  
  return `
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
      <h2 style="color: white; margin: 0; font-size: 20px;">🎁 Amigo Oculto</h2>
    </div>
    <div style="background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; border: 1px solid #e0e0e0; border-top: none;">
      ${formattedParagraphs.join('')}
    </div>
  `;
};

function App() {
  const [participants, setParticipants] = useState<Participant[]>([
    { nickname: '', email: '', partnerEmail: '' },
  ]);
  const [organizerEmail, setOrganizerEmail] = useState('');
  const [emailTemplate, setEmailTemplate] = useState(`Olá!

O sorteio do **Amigo Oculto** foi realizado!

Seu amigo é {{secretFriend}}

Agora é só escolher o presente perfeito! 🎉

Boa sorte e divirta-se!`);
  const [showTemplateEditor, setShowTemplateEditor] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<'config' | 'participants'>('config');

  // Validação em tempo real
  const getValidParticipantsCount = () => {
    return participants.filter(p => p.nickname.trim() && p.email.trim()).length;
  };

  const hasDuplicateEmails = () => {
    const emails = participants.map(p => p.email.trim()).filter(e => e);
    return new Set(emails).size !== emails.length;
  };

  const addParticipant = () => {
    setParticipants([...participants, { nickname: '', email: '', partnerEmail: '' }]);
  };

  const removeParticipant = (index: number) => {
    if (participants.length > 1) {
      setParticipants(participants.filter((_, i) => i !== index));
    }
  };

  const updateParticipant = (index: number, field: keyof Participant, value: string) => {
    const updated = [...participants];
    updated[index] = { ...updated[index], [field]: value || undefined };
    setParticipants(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Validação básica
      const validParticipants = participants.filter(
        (p) => p.nickname.trim() && p.email.trim()
      );

      if (validParticipants.length < 2) {
        throw new Error('É necessário pelo menos 2 participantes');
      }

      // Validação de emails
      const emails = validParticipants.map((p) => p.email);
      const uniqueEmails = new Set(emails);
      if (uniqueEmails.size !== emails.length) {
        throw new Error('Os emails devem ser únicos');
      }

      // Remove campos vazios antes de enviar
      const cleanedParticipants = validParticipants.map(p => ({
        nickname: p.nickname.trim(),
        email: p.email.trim(),
        ...(p.partnerEmail && p.partnerEmail.trim() ? { partnerEmail: p.partnerEmail.trim() } : {}),
      }));

      const response = await axios.post<ApiResponse>(`${API_URL}/secret-santa/draw`, {
        participants: cleanedParticipants,
        ...(organizerEmail.trim() ? { organizerEmail: organizerEmail.trim() } : {}),
        ...(emailTemplate.trim() ? { emailTemplate: emailTemplate.trim() } : {}),
      });

      setResult(response.data);
    } catch (err: any) {
      setError(
        err.response?.data?.message || err.message || 'Erro ao realizar sorteio'
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setParticipants([{ nickname: '', email: '', partnerEmail: '' }]);
    setOrganizerEmail('');
    setShowTemplateEditor(false);
    setResult(null);
    setError(null);
  };

  return (
    <div className="app">
      <nav className="navbar">
        <div className="logo">
          <span className="logo-icon">🎁</span>
          <span>AMIGO OCULTO</span>
        </div>
        <div className="nav-links">
          <span className="nav-link">FEATURES</span>
          <span className="nav-link">SOBRE</span>
          <button className="nav-btn">GET STARTED</button>
        </div>
        <div className="nav-icons">
          <span className="nav-icon">🔍</span>
          <span className="nav-icon">☰</span>
        </div>
      </nav>

      <div className="container">
        <div className="hero">
          <div className="banner">
            <span className="banner-star">⭐</span>
            <span>Sistema v1.0 Disponível</span>
          </div>
          <h1 className="hero-title">AMIGO OCULTO</h1>
          <div className="hero-labels">
            <div className="hero-label">
              <span>✨</span>
              <span>Fácil</span>
            </div>
            <div className="hero-label green">
              <span>⚡</span>
              <span>Instantâneo</span>
            </div>
          </div>
          <p className="hero-description">
            Crie, organize e realize sorteios de amigo oculto com envio automático de emails. 
            Sistema completo com restrições para casais e privacidade total.
          </p>
        </div>

        {!result ? (
          <div className="form-container">
            {/* Progress Indicator */}
            <div className="progress-steps">
              <div className={`step ${activeSection === 'config' ? 'active' : ''} ${getValidParticipantsCount() >= 2 ? 'completed' : ''}`}>
                <div className="step-number">1</div>
                <div className="step-label">Configuração</div>
              </div>
              <div className={`step ${activeSection === 'participants' ? 'active' : ''} ${getValidParticipantsCount() >= 2 ? 'completed' : ''}`}>
                <div className="step-number">2</div>
                <div className="step-label">Participantes</div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="form">
            {/* Configurações */}
            <div className="form-section">
              <div className="section-title" onClick={() => setActiveSection('config')} style={{ cursor: 'pointer' }}>
                <span className="section-icon">⚙️</span>
                <h2>Configurações</h2>
              </div>
              
              <div className="form-group">
                <label htmlFor="organizerEmail" className="label-with-icon">
                  <span>👤</span>
                  <span>Email do Organizador</span>
                  <span className="label-optional">(opcional)</span>
                </label>
                <p className="field-description">Se você participar, os resultados dos outros serão ocultados</p>
                <input
                  id="organizerEmail"
                  type="email"
                  value={organizerEmail}
                  onChange={(e) => setOrganizerEmail(e.target.value)}
                  onFocus={(e) => {
                    e.stopPropagation();
                    if (activeSection !== 'config') {
                      setActiveSection('config');
                    }
                  }}
                  placeholder="seu-email@exemplo.com"
                  className={organizerEmail && !organizerEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) ? 'input-error' : ''}
                />
              </div>

              <div className="form-group">
                <div className="template-header">
                  <label htmlFor="emailTemplate" className="label-with-icon">
                    <span>✉️</span>
                    <span>Mensagem do Email</span>
                    <span className="label-optional">(opcional)</span>
                  </label>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowTemplateEditor(!showTemplateEditor);
                    }}
                    className="btn-toggle-template"
                  >
                    {showTemplateEditor ? '👁️ Ocultar Preview' : '👁️ Ver Preview'}
                  </button>
                </div>
                <p className="field-description">
                  Use <code>{'{{secretFriend}}'}</code> onde quiser o nome do amigo oculto
                </p>
                <div className="template-help">
                  <span>💡 <strong>Dicas:</strong> Use <code>**texto**</code> para negrito, <code>*texto*</code> para itálico</span>
                </div>
                <textarea
                  id="emailTemplate"
                  value={emailTemplate}
                  onChange={(e) => setEmailTemplate(e.target.value)}
                  onFocus={(e) => {
                    e.stopPropagation();
                    if (activeSection !== 'config') {
                      setActiveSection('config');
                    }
                  }}
                  placeholder={`Olá!

O sorteio do **Amigo Oculto** foi realizado!

Seu amigo é {{secretFriend}}

Agora é só escolher o presente perfeito! 🎉`}
                  className="template-editor"
                  rows={10}
                />
                {showTemplateEditor && (
                  <div className="template-preview">
                    <div className="template-preview-label">📧 Preview do Email</div>
                    <div
                      className="template-preview-content"
                      dangerouslySetInnerHTML={{
                        __html: formatTemplatePreview(emailTemplate),
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Participantes */}
            <div className="form-section">
              <div className="section-title" onClick={() => setActiveSection('participants')} style={{ cursor: 'pointer' }}>
                <span className="section-icon">👥</span>
                <h2>Participantes</h2>
                <div className="participant-count">
                  {getValidParticipantsCount()} {getValidParticipantsCount() === 1 ? 'participante' : 'participantes'}
                </div>
              </div>

              {hasDuplicateEmails() && (
                <div className="warning-message">
                  <span>⚠️</span>
                  <span>Existem emails duplicados. Cada participante deve ter um email único.</span>
                </div>
              )}

              {getValidParticipantsCount() < 2 && (
                <div className="info-message">
                  <span>ℹ️</span>
                  <span>Adicione pelo menos 2 participantes para realizar o sorteio</span>
                </div>
              )}

              <div className="participants-grid">
                {participants.map((participant, index) => {
                  const isValid = participant.nickname.trim() && participant.email.trim();
                  const emailValid = !participant.email || participant.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
                  
                  return (
                    <div key={index} className={`participant-card ${isValid ? 'valid' : ''} ${!emailValid ? 'invalid' : ''}`}>
                      <div className="participant-header">
                        <div className="participant-number-wrapper">
                          <span className="participant-number">#{index + 1}</span>
                          {isValid && <span className="check-icon">✓</span>}
                        </div>
                        {participants.length > 1 && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeParticipant(index);
                            }}
                            className="btn-remove"
                            title="Remover participante"
                          >
                            ✕
                          </button>
                        )}
                      </div>

                      <div className="participant-fields">
                        <div className="field">
                          <label className="field-label">
                            <span>🏷️</span>
                            <span>Apelido</span>
                            <span className="required">*</span>
                          </label>
                          <input
                            type="text"
                            value={participant.nickname}
                            onChange={(e) =>
                              updateParticipant(index, 'nickname', e.target.value)
                            }
                            onFocus={(e) => {
                              e.stopPropagation();
                              if (activeSection !== 'participants') {
                                setActiveSection('participants');
                              }
                            }}
                            placeholder="Ex: João Grandão"
                            required
                            className={participant.nickname && !participant.nickname.trim() ? 'input-error' : ''}
                          />
                        </div>

                        <div className="field">
                          <label className="field-label">
                            <span>📧</span>
                            <span>Email</span>
                            <span className="required">*</span>
                          </label>
                          <input
                            type="email"
                            value={participant.email}
                            onChange={(e) =>
                              updateParticipant(index, 'email', e.target.value)
                            }
                            onFocus={(e) => {
                              e.stopPropagation();
                              if (activeSection !== 'participants') {
                                setActiveSection('participants');
                              }
                            }}
                            placeholder="email@exemplo.com"
                            required
                            className={participant.email && !emailValid ? 'input-error' : ''}
                          />
                          {participant.email && !emailValid && (
                            <span className="field-error">Email inválido</span>
                          )}
                        </div>

                        <div className="field">
                          <label className="field-label">
                            <span>💑</span>
                            <span>Email do Parceiro</span>
                            <span className="label-optional">(opcional)</span>
                          </label>
                          <p className="field-description-small">Evita que casais se sortem entre si</p>
                          <input
                            type="email"
                            value={participant.partnerEmail || ''}
                            onChange={(e) =>
                              updateParticipant(index, 'partnerEmail', e.target.value)
                            }
                            onFocus={(e) => {
                              e.stopPropagation();
                              if (activeSection !== 'participants') {
                                setActiveSection('participants');
                              }
                            }}
                            placeholder="parceiro@exemplo.com"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button 
                type="button" 
                onClick={(e) => {
                  e.stopPropagation();
                  addParticipant();
                }} 
                className="btn-add-participant"
              >
                <span>➕</span>
                <span>Adicionar Participante</span>
              </button>
            </div>

            {/* Status e Ações */}
            <div className="form-actions">
              {error && (
                <div className="error-message">
                  <span className="error-icon">❌</span>
                  <div>
                    <strong>Erro:</strong>
                    <p>{error}</p>
                  </div>
                </div>
              )}

              <div className="submit-section">
                <div className="submit-info">
                  {getValidParticipantsCount() >= 2 && (
                    <div className="ready-indicator">
                      <span className="ready-icon">✓</span>
                      <span>Pronto para sortear!</span>
                    </div>
                  )}
                  {getValidParticipantsCount() < 2 && (
                    <div className="not-ready-indicator">
                      <span>Adicione {2 - getValidParticipantsCount()} {2 - getValidParticipantsCount() === 1 ? 'participante' : 'participantes'} para continuar</span>
                    </div>
                  )}
                </div>
                <button 
                  type="submit" 
                  disabled={loading || getValidParticipantsCount() < 2 || hasDuplicateEmails()} 
                  className={`btn-submit ${getValidParticipantsCount() >= 2 && !hasDuplicateEmails() ? 'ready' : ''}`}
                >
                  {loading ? (
                    <>
                      <span className="spinner">🔄</span>
                      <span>Realizando sorteio...</span>
                    </>
                  ) : (
                    <>
                      <span>🎲</span>
                      <span>Realizar Sorteio</span>
                    </>
                  )}
                </button>
              </div>
            </div>
            </form>
          </div>
        ) : (
          <div className="form-container">
            <div className="result">
              <div className="success-animation">
                <div className="success-icon-large">✅</div>
              </div>
              <div className="success-message">
                <h2>{result.message}</h2>
                <div className="success-stats">
                  <div className="stat-item">
                    <span className="stat-value">{result.totalParticipants}</span>
                    <span className="stat-label">Participantes</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value">✓</span>
                    <span className="stat-label">Emails Enviados</span>
                  </div>
                </div>
              </div>

              {result.results && result.results.length > 0 && (
                <div className="results-list">
                  <div className="results-header">
                    <h3>📋 Seu Resultado</h3>
                    <p className="results-subtitle">Os demais resultados foram ocultados pois você está participando</p>
                  </div>
                  {result.results.map((r, index) => (
                    <div key={index} className="result-item">
                      <div className="result-card">
                        <div className="result-label">Você vai presentear:</div>
                        <div className="result-friend-large">{r.secretFriend}</div>
                        <div className="result-email-small">{r.email}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="result-actions">
                <button onClick={resetForm} className="btn-reset">
                  <span>🔄</span>
                  <span>Novo Sorteio</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

