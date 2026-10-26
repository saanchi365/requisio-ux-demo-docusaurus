// One page of the handbook: top bar, feature menu, breadcrumb, the five tabs and the chosen tab.
import React, {useEffect, useMemo, useRef, useState} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import {useHistory, useLocation} from '@docusaurus/router';
import Mermaid from '@theme/Mermaid';
import D from '@site/src/data/handbook.json';

const TABS = [['overview', 'Overview'], ['wireframes', 'Wireframes'], ['flowcharts', 'Flowcharts'], ['requirements', 'Requirements'], ['comments', 'Comments']];
const STATUSES = ['Done', 'In progress', 'Overdue', 'To do'];
const F = Object.fromEntries(D.features.map((f) => [f.n, f]));
const R = Object.fromEntries(D.requirements.map((r) => [r.n, r]));
const W = Object.fromEntries(D.wireframes.map((w) => [w.file, w]));
const cls = (s) => ({Done: 'done', 'In progress': 'prog', Overdue: 'late'})[s] || 'todo';
const base = (f) => (f ? `/feature-${f.n}/` : '/all/');

const ICON = {
  book: <><path d="M4 5a2 2 0 0 1 2-2h12v16H6a2 2 0 0 0-2 2z" /><path d="M4 19V5" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>,
  msgs: <path d="M21 14a2 2 0 0 1-2 2H8l-4 4V6a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2z" />,
  menu: <path d="M4 6h16M4 12h16M4 18h16" />,
  left: <path d="m15 6-6 6 6 6" />, right: <path d="m9 6 6 6-6 6" />, down: <path d="m6 9 6 6 6-6" />,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  alert: <><circle cx="12" cy="12" r="9" /><path d="M12 8v4M12 16h.01" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  users: <><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0" /><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 20a6.5 6.5 0 0 0-3-5.5" /></>,
  layers: <><path d="m12 3 9 5-9 5-9-5 9-5z" /><path d="m3 13 9 5 9-5" /></>,
};
const Icon = ({n, style}) => <svg className="i" viewBox="0 0 24 24" aria-hidden="true" style={style}>{ICON[n]}</svg>;
const Pill = ({s}) => <span className={`pl p-${cls(s)}`}>{s}</span>;
const Dot = ({s}) => <span className={`dot d-${cls(s)}`} />;
const md = (t) => ({__html: String(t || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')});
const reqUrl = (r) => `/feature-${r.feature}/requirements/#r-${r.n}`;

/* ---------------- top bar and feature menu ---------------- */
function TopBar({onMenu}) {
  const [q, setQ] = useState('');
  const index = useMemo(() => [
    ...D.features.map((f) => ({t: f.title, k: 'Feature', u: `/feature-${f.n}/overview/`})),
    ...D.requirements.map((r) => ({t: `#${r.n} ${r.title}`, k: 'Requirement', u: reqUrl(r)})),
    ...D.flowcharts.filter((fc) => fc.feature !== 'product').map((fc) => ({t: fc.title, k: 'Flowchart', u: `/feature-${fc.feature}/flowcharts/`})),
  ], []);
  const t = q.trim().toLowerCase();
  const hits = t.length < 2 ? null : index.filter((x) => x.t.toLowerCase().includes(t)).slice(0, 10);
  return (
    <header className="hb-top">
      <button className="hb-ib menu-btn" onClick={onMenu} aria-label="Open the feature menu"><Icon n="menu" /></button>
      <Link className="hb-logo" to="/all/overview/"><Icon n="book" /> {D.name}</Link>
      <div className="hb-srch"><Icon n="search" /><input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search features and requirements" aria-label="Search" />
        {hits && <div className="hb-res">{hits.length ? hits.map((x) => <Link key={x.u + x.t} to={x.u} onClick={() => setQ('')}><span>{x.t}</span><span className="xs" style={{marginLeft: 'auto'}}>{x.k}</span></Link>)
          : <div className="sm mu" style={{padding: 8}}>Nothing found for "{t}".</div>}</div>}
      </div>
      <div className="hb-rt">
        <Link className="hb-ib" to="/all/comments/" aria-label="All comments"><Icon n="msgs" /><span className="hb-bdg">{D.comments.length}</span></Link>
        <a className="hb-ib" href={`https://github.com/${D.repo}`}>GitHub</a>
      </div>
    </header>
  );
}

function Menu({scope, tab, doc, orphans, show}) {
  return (
    <nav className={`hb-side ${show ? 'show' : ''}`} aria-label="Features">
      <details className="hb-users" open={!!doc}>
        <summary><Icon n="users" /> About users <span className="chev" style={{marginLeft: 'auto'}}><Icon n="down" /></span></summary>
        {Object.entries(D.users).map(([k, v]) => <Link key={k} className={`hb-sl sub ${doc === k ? 'on' : ''}`} to={`/users/${k}/`}>{v.title}</Link>)}
      </details>
      <div style={{height: 10}} />
      <Link className={`hb-sl ${scope === 'all' && !doc ? 'on' : ''}`} to={`/all/${tab || 'overview'}/`}><Icon n="layers" /> All features<span className="hb-cc">{D.requirements.length}</span></Link>
      <Link className={`hb-sl ${orphans ? 'on' : ''}`} to="/not-under-a-feature/"><Icon n="alert" /> Not under a feature<span className="hb-cc">{(D.orphans || []).length}</span></Link>
      {D.stage_groups.map((g) => (
        <React.Fragment key={g.stage}>
          <div className="hb-g">{g.stage}</div>
          {g.features.map((n) => { const f = F[n]; return (
            <Link key={n} className={`hb-sl ${scope === n ? 'on' : ''}`} to={`/feature-${n}/${tab || 'overview'}/`}><Dot s={f.status} />{f.title}{f.comment_list.length > 0 && <span className="hb-cc">{f.comment_list.length}</span>}</Link>); })}
        </React.Fragment>
      ))}
    </nav>
  );
}

/* ---------------- requirements that are not inside any feature: a plain list, their level can't be known ---------------- */
function Orphans() {
  const list = D.orphans || [];
  return (
    <>
      <nav className="hb-crumb" aria-label="Breadcrumb"><Link to="/all/overview/">All features</Link> › <span>Not under a feature</span></nav>
      <h1>Not under a feature</h1>
      <p className="brief">Requirements that aren't inside any feature on GitHub yet. Open each one and add it to the right feature (on the feature: Sub-issues → Add existing issue).</p>
      {list.length ? (
        <div className="tw" style={{marginTop: 16}}><table>
          <thead><tr><th>#</th><th>Requirement</th><th>Status</th><th>Target</th><th>Assigned to</th><th>Given by</th><th>Priority</th><th>Comments</th><th /></tr></thead>
          <tbody>{list.map((r) => (
            <tr key={r.n}><td className="num">#{r.n}</td><td>{r.title}</td><td><Pill s={r.status} /></td><td className="num">{r.target_text || '—'}</td>
              <td>{r.assignees.length ? r.assignees.join(', ') : <span className="xs">Not assigned</span>}</td><td>{r.given_by || '—'}</td><td>{r.priority || '—'}</td>
              <td className="num">{r.comment_count || <span className="xs">—</span>}</td><td><a href={r.url}>Open on GitHub ↗</a></td></tr>))}</tbody></table></div>
      ) : <div className="empty" style={{marginTop: 16}}><b>Nothing here</b>Every requirement is inside a feature.</div>}
    </>
  );
}

/* ---------------- tabs ---------------- */
function Overview({f}) {
  const soon = f ? f.soonest : D.soonest, sum = f ? f.summary : D.summary, qs = f ? f.all_questions : D.all_questions, recent = f ? f.recent : D.recent;
  return (
    <>
      {f ? <><p className="brief" dangerouslySetInnerHTML={md(f.what)} />
        {f.use_cases.length > 0 && <details className="ucx"><summary>Use cases · {f.use_cases.length}</summary><ol>{f.use_cases.map((u) => <li key={u} dangerouslySetInnerHTML={md(u)} />)}</ol></details>}</>
        : <p className="brief">{D.brief}</p>}
      <div className="ovgrid">
        <div className="grid" style={{alignContent: 'start'}}>
          <div className="cd">
            <div className="lbl">Requirements{!f && <span className="xs" style={{textTransform: 'none', letterSpacing: 0, fontWeight: 500}}>Soonest due first, across all features</span>}</div>
            {soon.slice(0, 6).map((n) => { const r = R[n]; return (
              <div className="row" key={n}>
                <Link to={reqUrl(r)} style={{color: 'var(--fg)', display: 'flex', gap: 8, minWidth: 0, flex: 1, fontSize: 12.5}}><span className="xs" style={{width: 30, flex: 'none'}}>#{r.n}</span><span>{r.title}</span></Link>
                {!f && <span className="xs" style={{width: 150, flex: 'none'}}>{F[r.feature].title}</span>}
                <span className="sm mu" style={{width: 52, flex: 'none', textAlign: 'right'}}>{r.target_text || '—'}</span><Pill s={r.status} />
              </div>); })}
            {!soon.length && <p className="mu sm" style={{margin: 0}}>No requirements yet.</p>}
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, gap: 10}}>
              {soon.length > 6 ? <Link className="sm" to={`${base(f)}requirements/`} style={{fontWeight: 600}}>+{soon.length - 6} more</Link> : <span />}
              <Link className="hb-ib pri" to={`${base(f)}requirements/`}>View all requirements ›</Link>
            </div>
          </div>
          <div className="cd">
            <div className="lbl"><Icon n="clock" /> What changed recently</div>
            {recent.slice(0, 5).map((x) => (
              <div className="row" key={x.n}><span className="xs" style={{width: 70, flex: 'none'}}>{x.when}</span><span className="sm" style={{flex: 1}}>#{x.n} {x.title}</span>
                {!f && x.feature && <Link className="xs" to={`/feature-${x.feature}/overview/`}>{F[x.feature].title}</Link>}</div>))}
            {!recent.length && <p className="mu sm" style={{margin: 0}}>Nothing changed recently.</p>}
          </div>
        </div>
        <div className="grid" style={{alignContent: 'start'}}>
          <div className="cd">
            <div className="lbl">Overall progress</div>
            <div className="big">{sum.Done}<span className="mu" style={{fontSize: 14, fontWeight: 500}}> of {sum.total} done</span></div>
            <div className="bar" style={{marginTop: 10}} aria-hidden="true">{['Done', 'In progress', 'Overdue'].map((s) => <span key={s} style={{width: `${sum.pct[s]}%`, background: `var(--${cls(s)})`}} />)}</div>
            <div style={{display: 'grid', gap: 5, marginTop: 12}}>
              {STATUSES.map((s) => <Link key={s} className="sm" to={`${base(f)}requirements/#status-${s.toLowerCase().replace(' ', '-')}`} style={{display: 'flex', gap: 8, alignItems: 'center', color: 'var(--muted)'}}><Dot s={s} />{s}<b style={{marginLeft: 'auto', color: 'var(--fg)'}}>{sum[s]}</b></Link>)}
            </div>
            {f && f.target && <div className="xs" style={{marginTop: 10}}>Target {f.target_text}</div>}
          </div>
          <div className="cd">
            <div className="lbl"><Icon n="alert" /> Open questions</div>
            {qs.map((x, i) => (
              <div key={i} className="sm" style={{padding: '7px 0', borderBottom: '1px solid var(--line)'}}>{x.q}
                {x.n ? <div><Link className="xs" to={reqUrl(R[x.n])}>#{x.n} {R[x.n].title}</Link></div>
                  : !f && x.feature ? <div><Link className="xs" to={`/feature-${x.feature}/overview/`}>{F[x.feature].title}</Link></div> : null}
              </div>))}
            {!qs.length && <p className="mu sm" style={{margin: 0}}>No open questions.</p>}
          </div>
        </div>
      </div>
    </>
  );
}

function Wireframes({f}) {
  const files = f ? f.wireframes : D.feature_order.flatMap((n) => F[n].wireframes);
  const location = useLocation();
  const [cur, setCur] = useState(0);
  const [mode, setMode] = useState('slideshow');
  const [open, setOpen] = useState({});
  const sampleBase = useBaseUrl('/');
  const src = (w) => (w.sample ? sampleBase + w.src : w.src);
  const go = (i) => setCur((i + files.length) % files.length);
  useEffect(() => {
    const m = location.hash.match(/^#screen-(.+)$/);
    if (m) { const k = files.indexOf(decodeURIComponent(m[1])); if (k >= 0) setCur(k); }
  }, [location.hash]);
  useEffect(() => {
    const key = (e) => { if (mode !== 'slideshow' || e.target.closest('input,textarea,select')) return; if (e.key === 'ArrowLeft') go(cur - 1); if (e.key === 'ArrowRight') go(cur + 1); };
    window.addEventListener('keydown', key); return () => window.removeEventListener('keydown', key);
  });
  if (!files.length) return <div className="empty"><b>No wireframes yet</b>Screens appear here, in flowchart order, once they are added to the wireframes folder.</div>;
  const w = W[files[cur]], r = R[w.n], wf = F[r ? r.feature : w.n];
  const curFeature = wf.n;
  let k = -1;
  return (
    <div>
      <div className="bar-row"><span className="xs" style={{flex: 1}}>Screens in flowchart order{!f && ', feature by feature'}</span>
        <div className="seg" role="tablist" aria-label="Wireframe view">{['slideshow', 'flow'].map((m) => <button key={m} className={mode === m ? 'on' : ''} onClick={() => setMode(m)}>{m === 'slideshow' ? 'Slideshow' : 'Flow view'}</button>)}</div></div>
      {mode === 'slideshow' ? (
        <div className="wfgrid"><div className="wfleft">
          <div className="statusline">
            {r ? <><b>#{r.n} {r.title}</b><Pill s={r.status} /><span><span className="xs">Target</span> {r.target_text || '—'}</span><span><span className="xs">Assigned</span> {r.assignees.join(', ') || 'Not assigned'}</span><span><Icon n="msgs" /> {r.comment_count} comments</span></> : <b>#{w.n} {wf.title}</b>}
            {!f && <span className="pl" style={{background: 'var(--accent-soft)', color: 'var(--accent)'}}>{wf.title}</span>}
            {w.sample && <span className="xs">Sample screen</span>}
          </div>
          <div className="wfstage">
            <div className="wftitle"><span>{w.title}</span><span className="xs">{wf.title}</span></div>
            <img className="wfimg" src={src(w)} alt={`Wireframe: ${w.title}`} />
            <button className="wfarw" style={{left: -16}} onClick={() => go(cur - 1)} aria-label="Previous screen"><Icon n="left" /></button>
            <button className="wfarw" style={{right: -16}} onClick={() => go(cur + 1)} aria-label="Next screen"><Icon n="right" /></button>
          </div>
          {w.description || w.questions.length ? (
            <div className={`notes ${w.description && w.questions.length ? 'two' : ''}`}>
              {w.description && <div><div className="lbl" style={{marginBottom: 4}}>Description</div><span className="mu">{w.description}</span></div>}
              {w.questions.length > 0 && <div><div className="lbl" style={{marginBottom: 4, color: 'var(--prog)'}}>Open questions · {w.questions.length}</div>{w.questions.map((q) => <div key={q} style={{padding: '2px 0'}}>• {q}</div>)}</div>}
            </div>) : <div className="notes"><span className="xs" style={{fontSize: 12.5}}>No description or open questions for this screen.</span></div>}
          <div className="pager"><button className="hb-ib" onClick={() => go(cur - 1)} aria-label="Previous screen"><Icon n="left" /></button><b>{cur + 1} / {files.length}</b><button className="hb-ib" onClick={() => go(cur + 1)} aria-label="Next screen"><Icon n="right" /></button><span className="xs">Arrow keys work too</span></div>
        </div>
        <nav className="side-col" aria-label="Flow map">
          {f ? <><div className="lbl" style={{marginBottom: 6}}>Flow map · {f.title}</div>
            {files.map((file, i) => <button key={file} className={`mapsc ${i === cur ? 'on' : ''}`} onClick={() => go(i)}>{i + 1}. {W[file].title}</button>)}
            <div className="xs" style={{marginTop: 10}}>Click a screen to open it</div></>
            : <><div className="lbl" style={{marginBottom: 6}}>Flow map · whole product</div>
              {D.stage_groups.map((g) => <React.Fragment key={g.stage}><div className="mapstage">{g.stage}</div>
                {g.features.map((n) => { const ff = F[n]; const isOpen = open[n] ?? n === curFeature; return (
                  <details key={n} className="mapft" open={isOpen} onToggle={(e) => { const o = e.currentTarget.open; if (o !== isOpen) setOpen({...open, [n]: o}); }}>
                    <summary><span className="chev"><Icon n="right" /></span><Dot s={ff.status} />{ff.title}<span className="xs" style={{marginLeft: 'auto'}}>{ff.wireframes.length}</span></summary>
                    {ff.wireframes.map((file) => { k = files.indexOf(file); const i = k; return <button key={file} className={`mapsc ${i === cur ? 'on' : ''}`} onClick={() => go(i)}>{W[file].title}</button>; })}
                  </details>); })}</React.Fragment>)}</>}
        </nav></div>
      ) : f ? (
        <><div className="cd" style={{padding: 18}}><div className="strip">{files.map((file, i) => <React.Fragment key={file}>{i > 0 && <span className="xs"><Icon n="arrow" /></span>}
          <a className="thumb" href="#" onClick={(e) => { e.preventDefault(); setCur(i); setMode('slideshow'); }}><img src={src(W[file])} alt="" /><span>{i + 1}. {W[file].title}</span></a></React.Fragment>)}</div></div>
          <p className="xs">The screens in the order of the flowchart. Click one to open it in the slideshow.</p></>
      ) : (
        <div className="lanes">{D.feature_order.map((n) => { const ff = F[n]; return (
          <div className="lane" key={n}><div><Link to={`/feature-${n}/wireframes/`} style={{fontWeight: 600, color: 'var(--fg)', display: 'flex', gap: 6, alignItems: 'center'}}><Dot s={ff.status} />{ff.title}</Link><div className="xs">{ff.wireframes.length} screens</div></div>
            <div className="strip">{ff.wireframes.length ? ff.wireframes.map((file, j) => <React.Fragment key={file}>{j > 0 && <span className="xs"><Icon n="arrow" /></span>}
              <a className="thumb" href="#" onClick={(e) => { e.preventDefault(); setCur(files.indexOf(file)); setMode('slideshow'); }}><img src={src(W[file])} alt="" /><span>{W[file].title}</span></a></React.Fragment>) : <span className="xs">No wireframes yet</span>}</div></div>); })}</div>
      )}
    </div>
  );
}

function Steps({fc}) {
  let n = 0;
  return <div className="fcin">{fc.steps.map((s, i) => s.kind === 'decision' ? <div key={i} className="fcstep dec">◇ {s.label}</div> : <div key={i} className="fcstep">{++n}. {s.label}</div>)}</div>;
}
function Flowcharts({f}) {
  const fcs = D.flowcharts.filter((fc) => fc.feature === (f ? f.n : 'product'));
  const [sel, setSel] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [hide, setHide] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const box = useRef(null);
  const history = useHistory();
  const siteBase = useBaseUrl('/');
  const order = D.flow_order, at = Math.max(0, order.findIndex((x) => String(x) === String(f ? f.n : 'all')));
  const url = (x) => (x === 'all' ? '/all/flowcharts/' : `/feature-${x}/flowcharts/`);
  const fc = fcs[Math.min(sel, fcs.length - 1)];
  // On the product chart, a box with a requirement number opens that requirement's feature.
  useEffect(() => {
    if (!fc || fc.feature !== 'product' || !box.current) return undefined;
    const wire = () => box.current && box.current.querySelectorAll('g.node').forEach((node) => {
      const n = (node.textContent.match(/#(\d+)/) || [])[1], to = n && D.req_feature[n];
      if (!to || node.dataset.wired) return;
      node.dataset.wired = '1'; node.style.cursor = 'pointer';
      node.addEventListener('click', () => history.push(`${siteBase}feature-${to}/flowcharts/`));
    });
    wire();
    const ob = new MutationObserver(wire); ob.observe(box.current, {childList: true, subtree: true});
    return () => ob.disconnect();
  }, [fc && fc.id]);
  if (!fc) return <div className="empty"><b>No flowchart yet</b>Add one to the flowcharts folder with this feature's number in its Feature line.</div>;
  const nSteps = fc.steps.filter((s) => s.kind !== 'decision').length, nDec = fc.steps.length - nSteps;
  return (
    <div className="fcgrid"><div className="wfleft">
      <div className="bar-row"><div className="statusline">
        <b>{fc.title}</b>{f && <Pill s={f.status} />}<span><span className="xs">Steps</span> {nSteps}</span>{nDec > 0 && <span><span className="xs">Decisions</span> {nDec}</span>}
        <span style={{display: 'inline-flex', gap: 6, alignItems: 'center', marginLeft: 'auto'}}>
          <Link className="hb-ib" to={url(order[(at - 1 + order.length) % order.length])} aria-label="Previous flowchart"><Icon n="left" /></Link><span className="xs">{at + 1} of {order.length}</span>
          <Link className="hb-ib" to={url(order[(at + 1) % order.length])} aria-label="Next flowchart"><Icon n="right" /></Link></span>
      </div></div>
      <div className="fccanvas"><div className="fcbar"><span className="lbl" style={{margin: 0}}>{f ? f.title : 'Whole product'}</span><span className="xs">{f ? 'Dashed boxes are assumptions · diamonds are decisions' : "Click a box to open that feature's flowchart"}</span>
        <span className="fczoom"><button className="hb-ib" onClick={() => setZoom(Math.max(0.6, zoom - 0.2))} aria-label="Zoom out">−</button><button className="hb-ib" onClick={() => setZoom(Math.min(2, zoom + 0.2))} aria-label="Zoom in">+</button><button className="hb-ib" onClick={() => setZoom(1)}>Fit</button></span></div>
        <div className="fcscroll" ref={box}><div style={{transform: `scale(${zoom})`, transformOrigin: 'top left'}}><Mermaid value={fc.mermaid} key={fc.id} /></div></div></div>
      <div className="fcdetails" style={{marginTop: 10}}>
        <div className="fcmeta"><b className="sm">About this flowchart</b>{fc.created_text && <span><span className="xs">Created</span> {fc.created_text}</span>}{fc.updated_text && <span><span className="xs">Updated</span> {fc.updated_text}</span>}
          <span><span className="xs">Based on</span> {f ? <><a href={f.url}>#{f.n}</a> and its requirements</> : 'all feature issues'}</span>
          <span style={{marginLeft: 'auto', display: 'flex', gap: 14}}><button className="hb-ib" style={{padding: '2px 9px'}} onClick={() => setHide(!hide)}>{hide ? 'Show details' : 'Hide details'}</button><a className="sm" href={fc.github}>Open in GitHub ↗</a></span></div>
        {!hide && <div className="fcnotes">
          <div><div className="lbl" style={{marginBottom: 4}}>Description</div><span className="mu">{fc.description || 'No description yet.'}</span></div>
          <div><div className="lbl" style={{marginBottom: 4, color: 'var(--prog)'}}>Open questions · {fc.questions.length}</div>{fc.questions.length ? fc.questions.map((q) => <div key={q} style={{padding: '2px 0'}}>• {q}</div>) : <span className="xs">No open questions.</span>}
            {fc.assumptions.length > 0 && <><div className="lbl" style={{margin: '10px 0 4px'}}>Not confirmed yet</div>{fc.assumptions.map((q) => <div key={q} style={{padding: '2px 0'}}>• {q}</div>)}</>}</div>
        </div>}
      </div>
    </div>
    <nav className="side-col" aria-label="Flowcharts">
      <div className="lbl" style={{marginBottom: 6}}>Flowcharts</div>
      {D.flowcharts.filter((x) => x.feature === 'product').map((x) => !f
        ? <React.Fragment key={x.id}><div className="fcitem on"><button className="fctoggle" onClick={() => setCollapsed(!collapsed)} aria-label="Show or hide the steps" style={{transform: collapsed ? 'rotate(-90deg)' : ''}}><Icon n="down" /></button><span className="fcname">◇ Whole product</span></div>{!collapsed && <Steps fc={x} />}</React.Fragment>
        : <div className="fcitem" key={x.id}><span className="fctoggle" /><Link to="/all/flowcharts/">◇ Whole product</Link></div>)}
      {D.stage_groups.map((g) => { const list = g.features.filter((n) => F[n].flowcharts.length); return list.length ? (
        <React.Fragment key={g.stage}><div className="fcgrp">{g.stage}</div>
          {list.map((n) => { const ff = F[n]; const mine = D.flowcharts.filter((x) => x.feature === n); return f && f.n === n
            ? mine.map((x, i) => <React.Fragment key={x.id}><div className="fcitem on"><button className="fctoggle" onClick={() => setCollapsed(!collapsed)} aria-label="Show or hide the steps" style={{transform: collapsed ? 'rotate(-90deg)' : ''}}><Icon n="down" /></button>
              <button className="fcname" onClick={() => setSel(i)}><Dot s={ff.status} />{mine.length > 1 ? x.title : ff.title}</button>{x.questions.length > 0 && <span className="pl p-prog" style={{fontSize: 10}}>{x.questions.length}?</span>}</div>{!collapsed && i === sel && <Steps fc={x} />}</React.Fragment>)
            : <div className="fcitem" key={n}><span className="fctoggle" /><Link to={`/feature-${n}/flowcharts/`}><Dot s={ff.status} />{ff.title}</Link>{ff.questions.length > 0 && <span className="pl p-prog" style={{fontSize: 10}}>{ff.questions.length}?</span>}</div>; })}
        </React.Fragment>) : null; })}
      <div className="xs" style={{marginTop: 10}}>Amber number = open questions</div>
    </nav></div>
  );
}

function Requirements({f}) {
  const list = f ? D.requirements.filter((r) => r.feature === f.n) : D.requirements;
  const sum = f ? f.summary : D.summary;
  const location = useLocation();
  const [flt, setFlt] = useState('All');
  const hl = (location.hash.match(/^#r-(\d+)$/) || [])[1];
  useEffect(() => {
    const st = location.hash.match(/^#status-(.+)$/);
    if (st) { const s = ['In progress', 'Overdue', 'To do', 'Done'].find((x) => x.toLowerCase().replace(' ', '-') === st[1]); if (s) setFlt(s); }
    if (hl) document.getElementById(`r-${hl}`)?.scrollIntoView({block: 'center'});
  }, [location.hash]);
  const shown = list.filter((r) => flt === 'All' || r.status === flt);
  return (
    <>
      <div className="grid" style={{gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', marginBottom: 16}}>
        <div className="cd"><div className="lbl">Overdue</div><div className="big" style={{color: 'var(--late)'}}>{sum.Overdue}</div></div>
        <div className="cd"><div className="lbl">Due this week</div><div className="big">{sum.due_soon}</div></div>
        <div className="cd"><div className="lbl">Done</div><div className="big">{sum.Done}<span className="mu" style={{fontSize: 16, fontWeight: 500}}> of {sum.total}</span></div></div>
      </div>
      <div className="chips" role="group" aria-label="Filter by status">{['All', 'In progress', 'Overdue', 'To do', 'Done'].map((s) => <button key={s} className={`chip ${flt === s ? 'on' : ''}`} onClick={() => setFlt(s)}>{s}</button>)}</div>
      <p className="xs" style={{margin: '0 0 8px'}}>{shown.length} of {list.length} requirements</p>
      {list.length ? (
        <div className="tw"><table>
          <thead><tr><th>#</th><th>Requirement</th>{!f && <th>Feature</th>}<th>Status</th><th>Target</th><th>Assigned to</th><th>Given by</th><th>Priority</th><th>Wireframe</th><th>Comments</th></tr></thead>
          <tbody>{shown.map((r) => (
            <tr key={r.n} id={`r-${r.n}`} className={String(r.n) === hl ? 'hl' : ''}>
              <td className="num">#{r.n}</td>
              <td><span style={{display: 'flex', gap: 6, alignItems: 'center', paddingLeft: r.parent ? 18 : 0}}>{r.parent && <span className="xs">↳</span>}{r.title}</span></td>
              {!f && <td><Link to={`/feature-${r.feature}/requirements/`}>{F[r.feature].title}</Link></td>}
              <td><Pill s={r.status} /></td><td className="num">{r.target_text || '—'}</td>
              <td>{r.assignees.length ? r.assignees.join(', ') : <span className="xs">Not assigned</span>}</td>
              <td>{r.given_by || '—'}</td><td>{r.priority || '—'}</td>
              <td>{r.wireframe ? <Link to={`/feature-${r.feature}/wireframes/#screen-${r.wireframe}`}>View</Link> : <span className="xs">None yet</span>}</td>
              <td className="num">{r.comment_count || <span className="xs">—</span>}</td>
            </tr>))}</tbody></table></div>
      ) : <div className="empty"><b>No requirements yet</b>Add them as sub-issues of this feature on GitHub.</div>}
    </>
  );
}

function Comments({f}) {
  const list = (f ? f.comment_list : D.comments.map((_, i) => i)).map((i) => D.comments[i]).reverse();
  return (
    <>
      <div className="bar-row"><div className="statusline"><span className="sm">Comments made on the GitHub issues{f && ' of this feature and its requirements'}. Commenting right on this website (select text, comment on a screen) comes with the comment service.</span></div>
        <a className="hb-ib pri" href={f ? f.url : `https://github.com/${D.repo}/issues`}>Comment on GitHub ↗</a></div>
      {list.map((c) => { const r = R[c.issue], cf = F[c.issue]; return (
        <div className="cmt" key={c.url}><div className="who"><span className="av">{c.author.slice(0, 2).toUpperCase()}</span><div><b className="sm">{c.author}</b> <span className="xs">{c.when}</span>
          <div className="xs">on {r ? <Link to={reqUrl(r)}>#{r.n} {r.title}</Link> : cf ? <Link to={`/feature-${cf.n}/overview/`}>{cf.title}</Link> : `#${c.issue}`} · <a href={c.url}>View on GitHub ↗</a></div></div></div>
          <div className="body">{c.body}</div></div>); })}
      {!list.length && <div className="empty"><b>No comments yet</b>Comments made on this feature's GitHub issues will show here.</div>}
    </>
  );
}

/* ---------------- the page ---------------- */
export default function HandbookPage({page}) {
  const {scope, tab, doc, orphans} = page;
  const f = scope && scope !== 'all' ? F[scope] : null;
  const [menu, setMenu] = useState(false);
  const counts = f ? {wireframes: f.wireframes.length, requirements: f.requirement_list.length, comments: f.comment_list.length}
    : {wireframes: D.wireframes.length, requirements: D.requirements.length, comments: D.comments.length};
  const Tab = {overview: Overview, wireframes: Wireframes, flowcharts: Flowcharts, requirements: Requirements, comments: Comments}[tab];
  const title = orphans ? 'Not under a feature' : doc ? D.users[doc].title : f ? f.title : 'All features';
  return (
    <Layout title={title} noFooter>
      <div className="hb">
        <TopBar onMenu={() => setMenu(!menu)} />
        <div className="hb-shell">
          <Menu scope={orphans ? null : f ? f.n : 'all'} tab={tab} doc={doc} orphans={orphans} show={menu} />
          <main className="hb-main">
            {orphans ? <Orphans /> : doc ? (
              <>
                <nav className="hb-crumb"><Link to="/all/overview/">{D.name}</Link> › <span>About users</span></nav>
                <h1>{title}</h1>
                <nav className="hb-tabs">{Object.entries(D.users).map(([k, v]) => <Link key={k} className={k === doc ? 'on' : ''} to={`/users/${k}/`}>{v.title}</Link>)}</nav>
                <div className="cd users-doc" dangerouslySetInnerHTML={{__html: D.users[doc].html}} />
              </>
            ) : (
              <>
                <nav className="hb-crumb" aria-label="Breadcrumb"><Link to="/all/overview/">All features</Link>{f && <> › <Link to={`${base(f)}overview/`}>{f.title}</Link></>} › <span>{TABS.find((t) => t[0] === tab)[1]}</span></nav>
                <h1>{title}</h1>
                <nav className="hb-tabs" aria-label="What to see">{TABS.map(([k, label]) => <Link key={k} className={k === tab ? 'on' : ''} to={`${base(f)}${k}/`}>{label}{counts[k] > 0 && <> <span className="n">{counts[k]}</span></>}</Link>)}</nav>
                <Tab f={f} />
              </>
            )}
            <footer className="foot"><span>Status colours:</span>{STATUSES.map((s) => <span key={s}><Dot s={s} />{s}</span>)}
              <span style={{marginLeft: 'auto'}}>Built with Docusaurus · data from <a href={`https://github.com/${D.repo}`}>{D.repo}</a></span></footer>
          </main>
        </div>
      </div>
    </Layout>
  );
}
