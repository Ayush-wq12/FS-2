import { createContext, useContext, useMemo, useState } from 'react'
import {
  BrowserRouter,
  Navigate,
  NavLink,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom'
import './App.css'

const ROLE_PERMISSIONS = {
  Admin: ['view:dashboard', 'edit:content', 'manage:users', 'view:reports'],
  Editor: ['view:dashboard', 'edit:content', 'view:reports'],
  Viewer: ['view:dashboard', 'view:reports'],
}

const ROLE_DETAILS = {
  Admin: { initials: 'AD', tone: 'red', description: 'Full workspace control' },
  Editor: { initials: 'ED', tone: 'blue', description: 'Content and reporting access' },
  Viewer: { initials: 'VW', tone: 'green', description: 'Read-only workspace access' },
}

const AuthContext = createContext(null)

function AuthProvider({ children }) {
  const [role, setRole] = useState('Editor')
  const permissions = ROLE_PERMISSIONS[role]
  const value = useMemo(
    () => ({
      role,
      permissions,
      user: ROLE_DETAILS[role],
      isAllowed: (permission) => permissions.includes(permission),
      switchRole: setRole,
    }),
    [permissions, role],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

function useAuth() {
  return useContext(AuthContext)
}

function ProtectedRoute({ permission }) {
  const { isAllowed } = useAuth()
  const location = useLocation()

  if (!isAllowed(permission)) {
    return <Navigate to="/unauthorized" replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}

function Shell() {
  const { role, user } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark">A</span><span>access<span className="brand-dot">.</span>lab</span></div>
        <div className="workspace-label">WORKSPACE</div>
        <div className="workspace-switcher"><span className="workspace-icon">N</span><span>Northstar Studio</span><span className="chevron">v</span></div>
        <nav className="main-nav" aria-label="Primary navigation">
          <NavLink to="/" end className="nav-link"><span className="nav-icon">+</span>Overview</NavLink>
          <NavLink to="/content" className="nav-link"><span className="nav-icon">=</span>Content</NavLink>
          <NavLink to="/reports" className="nav-link"><span className="nav-icon">#</span>Reports</NavLink>
          <NavLink to="/admin" className="nav-link"><span className="nav-icon">*</span>Team access</NavLink>
        </nav>
        <div className="sidebar-footer">
          <div className="workspace-label">CURRENT ROLE</div>
          <button className={`role-chip ${user.tone}`} onClick={() => navigate('/role-playground')}>
            <span className="avatar small">{user.initials}</span><span><strong>{role}</strong><small>Change role</small></span><span className="chevron">v</span>
          </button>
          <div className="security-note"><span className="lock">+</span><span><strong>Protected session</strong><small>Permissions are active</small></span></div>
        </div>
      </aside>
      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumbs">Workspace <span>/</span> <strong>{role === 'Admin' ? 'Team access' : 'Overview'}</strong></div>
          <div className="topbar-actions"><button className="icon-button" aria-label="Notifications">!</button><button className="profile-button" onClick={() => navigate('/role-playground')}><span className={`avatar ${user.tone}`}>{user.initials}</span><span>{role}</span><span className="chevron">v</span></button></div>
        </header>
        <div className="page-content"><Outlet /></div>
      </main>
    </div>
  )
}

function Overview() {
  const { role, user, isAllowed } = useAuth()

  return <>
    <div className="page-heading"><div><div className="eyebrow">MONDAY, 14 OCTOBER 2024</div><h1>Good morning, Alex.</h1><p>Here is what is happening across your workspace.</p></div><div className={`access-badge ${user.tone}`}><span className="status-dot"></span>{role} access active</div></div>
    <div className="stats-grid"><Stat label="Published content" value="128" change="+12.5%" note="vs last month" /><Stat label="Team members" value="24" change="+2" note="this month" /><Stat label="Workspace health" value="98.4%" change="+4.2%" note="vs last week" /></div>
    <div className="content-grid">
      <section className="panel activity-panel"><div className="panel-header"><div><div className="eyebrow">RECENT ACTIVITY</div><h2>Workspace pulse</h2></div><button className="text-button">View all <span>-&gt;</span></button></div><Activity label="Landing page refresh" detail="Maya Chen published a new version" time="12 min ago" tone="blue" /><Activity label="Quarterly report" detail="You were added as a reviewer" time="2 hr ago" tone="orange" /><Activity label="New team member" detail="Jordan Lee joined the workspace" time="Yesterday" tone="green" /></section>
      <section className="panel permission-panel"><div className="eyebrow">YOUR ACCESS</div><h2>Permission map</h2><p className="panel-copy">Your interface adapts to the permissions attached to your current role.</p><Permission label="View dashboard" allowed={isAllowed('view:dashboard')} /><Permission label="Edit content" allowed={isAllowed('edit:content')} /><Permission label="Manage users" allowed={isAllowed('manage:users')} /><Permission label="View reports" allowed={isAllowed('view:reports')} /></section>
    </div>
  </>
}

function Stat({ label, value, change, note }) { return <div className="stat-card"><span>{label}</span><strong>{value}</strong><div><b>{change}</b> <small>{note}</small></div></div> }
function Activity({ label, detail, time, tone }) { return <div className="activity-row"><span className={`activity-icon ${tone}`}>+</span><div><strong>{label}</strong><p>{detail}</p></div><time>{time}</time></div> }
function Permission({ label, allowed }) { return <div className="permission-row"><span className={allowed ? 'permission-check allowed' : 'permission-check'}>{allowed ? 'OK' : '-'}</span><span>{label}</span><small>{allowed ? 'Allowed' : 'Restricted'}</small></div> }

function ContentPage() { const { isAllowed } = useAuth(); return <ResourcePage eyebrow="CONTENT LIBRARY" title="Content" description="Create, review, and publish the stories that move your workspace forward." permission="edit:content" action={isAllowed('edit:content') ? 'Create content' : null} empty="Your content queue is clear." /> }
function ReportsPage() { return <ResourcePage eyebrow="ANALYTICS" title="Reports" description="Track performance across every channel and campaign." permission="view:reports" action="Export report" empty="Your monthly report is ready to review." /> }
function ResourcePage({ eyebrow, title, description, action, empty }) { return <><div className="page-heading"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{description}</p></div>{action && <button className="primary-button">+ {action}</button>}</div><section className="panel empty-panel"><div className="empty-art">{title === 'Reports' ? '#' : '='}</div><h2>{empty}</h2><p>Everything you can access will appear here.</p></section></> }

function AdminPage() { const { role } = useAuth(); return <><div className="page-heading"><div><div className="eyebrow">ADMINISTRATION</div><h1>Team access</h1><p>Manage who can see and change workspace resources.</p></div><button className="primary-button">+ Invite member</button></div><section className="panel"><div className="panel-header"><div><div className="eyebrow">MEMBERS</div><h2>24 people</h2></div><span className="access-badge red">{role} only</span></div><div className="member-row"><span className="avatar red">AD</span><div><strong>Alex Davis</strong><p>alex@northstar.studio</p></div><span className="member-role">Admin</span></div><div className="member-row"><span className="avatar blue">ED</span><div><strong>Maya Chen</strong><p>maya@northstar.studio</p></div><span className="member-role">Editor</span></div><div className="member-row"><span className="avatar green">VW</span><div><strong>Jordan Lee</strong><p>jordan@northstar.studio</p></div><span className="member-role">Viewer</span></div></section></> }

function Unauthorized() { const { role } = useAuth(); const navigate = useNavigate(); return <div className="unauthorized"><div className="denied-icon">!</div><div className="eyebrow">403 / ACCESS DENIED</div><h1>This area is restricted.</h1><p>Your current <strong>{role}</strong> role does not have permission to view this page.</p><button className="primary-button" onClick={() => navigate('/')}>Return to overview</button><button className="text-button" onClick={() => navigate('/role-playground')}>Switch role</button></div> }

function RolePlayground() { const { role, user, switchRole, permissions } = useAuth(); return <><div className="page-heading"><div><div className="eyebrow">AUTHORIZATION LAB</div><h1>Role playground</h1><p>Switch identities to observe protected routes and conditional UI.</p></div><div className={`access-badge ${user.tone}`}><span className="status-dot"></span>Live session</div></div><section className="role-layout"><div className="panel role-selector"><div className="eyebrow">SIMULATE USER</div><h2>Choose a role</h2><p className="panel-copy">This local switch simulates a successful login with a different JWT role claim.</p>{Object.keys(ROLE_DETAILS).map((option) => <button key={option} className={`role-option ${role === option ? 'selected' : ''}`} onClick={() => switchRole(option)}><span className={`avatar ${ROLE_DETAILS[option].tone}`}>{ROLE_DETAILS[option].initials}</span><span><strong>{option}</strong><small>{ROLE_DETAILS[option].description}</small></span><span className="option-check">{role === option ? 'OK' : ''}</span></button>)}</div><div className="panel token-panel"><div className="eyebrow">AUTH STATE</div><h2>Access token claims</h2><div className="token-code"><span>"sub"</span>: "alex-1042",<br /><span>"role"</span>: <strong>"{role.toLowerCase()}"</strong>,<br /><span>"permissions"</span>: [{permissions.map((permission) => <em key={permission}>"{permission}"</em>)}]</div><div className="token-footer"><span className="status-dot"></span>Token verified locally</div></div></section></> }

function App() {
  return (
    <BrowserRouter><AuthProvider><Routes><Route element={<Shell />}><Route index element={<Overview />} /><Route path="content" element={<ContentPage />} /><Route path="reports" element={<ReportsPage />} /><Route path="role-playground" element={<RolePlayground />} /><Route element={<ProtectedRoute permission="manage:users" />}><Route path="admin" element={<AdminPage />} /></Route><Route path="unauthorized" element={<Unauthorized />} /><Route path="*" element={<Navigate to="/" replace />} /></Route></Routes></AuthProvider></BrowserRouter>
  )
}

export default App
