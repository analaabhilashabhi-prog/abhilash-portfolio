import React, { useState } from 'react';
import HandsDeviceSvg from '../assets/hands-device-frame.svg';

interface Project {
  id: string;
  tag: string;
  title: string;
  category: string;
  summary: string;
  metrics: { label: string; value: string }[];
  stack: string[];
  terminalLogs: string[];
  highlights: string[];
}

const PROJECTS: Project[] = [
  {
    id: 'fabric-bi',
    tag: 'PROJECT 01',
    title: 'Enterprise BI & Fabric Analytics Suite',
    category: 'Enterprise Analytics • Microsoft Fabric • Power BI',
    summary:
      'High-throughput business intelligence platform unifying cross-departmental ERP and transaction streams into sub-second analytical star-schemas.',
    metrics: [
      { label: 'Query Latency', value: '< 400ms' },
      { label: 'Batch Rows', value: '300K+' },
      { label: 'Uptime', value: '99.98%' },
    ],
    stack: ['Microsoft Fabric', 'Power BI', 'DAX', 'SQL Server', 'Azure Synapse'],
    terminalLogs: [
      '[INIT] Ingesting enterprise transaction streams...',
      '[TRANSFORM] Applying star-schema dimensional models...',
      '[LOAD] 300,000+ rows cached in DirectLake memory',
      '[READY] Executive BI reporting ready for 500+ daily seats',
    ],
    highlights: [
      'Multi-source ingestion from SQL, Salesforce, and Excel pipelines',
      'Automated incremental refreshes with zero report downtime',
      'Executive KPI scorecards with dynamic row-level security (RLS)',
    ],
  },
  {
    id: 'telemetry-stream',
    tag: 'PROJECT 02',
    title: 'Real-Time Data Telemetry & Predictive Horizon',
    category: 'Full-Stack • WebGL Telemetry • Stream Processing',
    summary:
      'Continuous data stream engine and hardware-accelerated telemetry interface monitoring organic oscillations and automated threshold alerts at enterprise scale.',
    metrics: [
      { label: 'Render Frame', value: '60 FPS' },
      { label: 'Stream Delay', value: '12ms' },
      { label: 'Data Nodes', value: '128 Pinned' },
    ],
    stack: ['TypeScript', 'WebGL', 'Three.js', 'Next.js', 'Kafka', 'Tailwind'],
    terminalLogs: [
      '[SOCKET] Connection established to wss://telemetry.core:8443',
      '[GPU] Raw WebGL context allocated: 1920x1080 buffer',
      '[ALGORITHM] Predictive Arc wave oscillating at 1.00x baseline',
      '[SYNC] Telemetry horizon stable — 0 dropped frames',
    ],
    highlights: [
      'Raw canvas & WebGL shader rendering for silky 60 FPS performance',
      'Sub-20ms WebSocket telemetry ingestion from distributed clusters',
      'Dynamic color gamut modulation responding to live load changes',
    ],
  },
  {
    id: 'snowflake-lakehouse',
    tag: 'PROJECT 03',
    title: 'Cloud Lakehouse & Automated ELT Pipeline',
    category: 'Data Engineering • Snowflake • Python • dbt',
    summary:
      'Automated extraction, transformation, and warehouse pipeline synchronizing disparate CRM, operational, and billing databases into an enterprise single source of truth.',
    metrics: [
      { label: 'Sources Synced', value: '15+ Silos' },
      { label: 'Data Loss', value: '0.00%' },
      { label: 'ETL Speed', value: '4.2x Faster' },
    ],
    stack: ['Snowflake', 'Python', 'dbt Core', 'PostgreSQL', 'Docker', 'Airflow'],
    terminalLogs: [
      '[STAGE] Connecting to AWS S3 raw landed parquets...',
      '[DBT] Executing 42 transformation models with zero test failures',
      '[WAREHOUSE] Snowflake virtual warehouse auto-scaled (M size)',
      '[AUDIT] Reconciled 1.2M rows with 100% referential integrity',
    ],
    highlights: [
      'Modular dbt models with automated unit testing and documentation',
      'Zero-loss idempotent pipelines with automatic error retries',
      'Optimized clustering keys delivering a 60% reduction in compute credits',
    ],
  },
  {
    id: 'mainframe-iam',
    tag: 'PROJECT 04',
    title: 'Predictive Mainframe Ops & Access Governance',
    category: 'Systems Architecture • Security • Cloud Automation',
    summary:
      'Enterprise security governance and microservice orchestration suite eliminating workflow bottlenecks with automated role-based access and anomaly alerts.',
    metrics: [
      { label: 'Auth Latency', value: '< 25ms' },
      { label: 'Security Score', value: 'SOC-2 Type II' },
      { label: 'Tickets Cut', value: '-85%' },
    ],
    stack: ['Go', 'OAuth2 / OIDC', 'Redis', 'Kubernetes', 'GraphQL'],
    terminalLogs: [
      '[AUTH] Token validated against OAuth2 / OIDC security gateway',
      '[RBAC] Role policy applied: SystemArchitect (Level 5)',
      '[ORCHESTRATOR] 16 pods running healthy across Kubernetes cluster',
      '[ALERT] 0 security vulnerabilities detected in automated scan',
    ],
    highlights: [
      'Role-based granular access control (RBAC) with instantaneous token revocation',
      'Distributed Redis cluster caching session states with sub-5ms lookup',
      'Self-healing containerized architecture deployed on Kubernetes',
    ],
  },
];

export const ProjectsSection: React.FC = () => {
  const [activeProject, setActiveProject] = useState<Project>(PROJECTS[0]);
  const [screenTab, setScreenTab] = useState<'preview' | 'terminal'>('preview');

  return (
    <section
      id="projects-section"
      className="relative z-20 w-full bg-[#000000] text-white py-24 sm:py-32 px-4 sm:px-6 md:px-10 lg:px-16 overflow-hidden select-none"
    >
      {/* Subtle ambient lighting behind section */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-emerald-500/[0.03] blur-[140px] pointer-events-none rounded-full" />

      <div className="w-full max-w-[1500px] mx-auto flex flex-col items-center">
        {/* SECTION HEADER */}
        <div className="w-full max-w-4xl text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.05] border border-white/10 mb-5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] sm:text-[12px] uppercase tracking-widest font-semibold text-emerald-400 font-mono">
              04 // FEATURED PROJECTS
            </span>
          </div>

          <h2
            className="text-[34px] sm:text-[46px] md:text-[56px] font-bold text-white tracking-[-0.03em] leading-[1.08] mb-4"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Engineered for Impact.
            <br />
            <span className="text-white/60">Delivered in Production.</span>
          </h2>

          <p className="text-white/60 text-[15px] sm:text-[17px] max-w-2xl mx-auto leading-relaxed">
            A curated selection of mission-critical business intelligence architectures, cloud data
            warehouses, and high-performance applications.
          </p>
        </div>

        {/* PROJECT NAVIGATION TABS */}
        <div className="w-full max-w-4xl flex items-center justify-center flex-wrap gap-2.5 sm:gap-3 mb-12">
          {PROJECTS.map((proj) => {
            const isActive = proj.id === activeProject.id;
            return (
              <button
                key={proj.id}
                type="button"
                onClick={() => setActiveProject(proj)}
                className={`px-4 sm:px-5 py-2.5 rounded-xl sm:rounded-2xl text-[12px] sm:text-[13px] font-medium transition-all duration-300 cursor-pointer flex items-center gap-2 ${
                  isActive
                    ? 'bg-white/15 text-white border border-white/30 shadow-[0_0_20px_rgba(255,255,255,0.1)] scale-102'
                    : 'bg-white/[0.04] text-white/60 hover:text-white hover:bg-white/[0.08] border border-white/[0.08]'
                }`}
              >
                <span
                  className={`font-mono text-[10px] ${
                    isActive ? 'text-emerald-400 font-bold' : 'text-white/40'
                  }`}
                >
                  {proj.tag.replace('PROJECT ', '#')}
                </span>
                <span>{proj.title.split(' ')[0]} {proj.title.split(' ')[1]}</span>
              </button>
            );
          })}
        </div>

        {/* THE CENTERPIECE: HALFTONE HANDS HOLDING WORKSTATION DISPLAY */}
        <div className="relative w-full max-w-[1000px] aspect-[960/515] mx-auto my-4 flex items-center justify-center">
          {/* 1. SCREEN CONTENT CONTAINER (Positioned inside the tablet bezel cutout) */}
          <div
            className="absolute z-10 overflow-hidden bg-[#0a0a0f] border border-emerald-500/20 rounded-[6px] sm:rounded-[8px] flex flex-col shadow-2xl transition-all duration-500"
            style={{
              left: '21.5%',
              top: '11.0%',
              width: '57.0%',
              height: '81.4%',
            }}
          >
            {/* SCREEN TOP BAR */}
            <div className="w-full h-7 sm:h-8 bg-[#111116] border-b border-white/10 px-2.5 sm:px-3.5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500/80" />
                <span className="w-2 h-2 rounded-full bg-yellow-500/80" />
                <span className="w-2 h-2 rounded-full bg-emerald-500/80" />
                <span className="hidden sm:inline ml-2 text-[10px] font-mono text-white/40 uppercase tracking-wider">
                  workstation://{activeProject.id}
                </span>
              </div>

              {/* View Switcher */}
              <div className="flex items-center gap-1 bg-black/40 p-0.5 rounded-md border border-white/10 text-[9px] sm:text-[10px] font-mono">
                <button
                  type="button"
                  onClick={() => setScreenTab('preview')}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    screenTab === 'preview'
                      ? 'bg-emerald-500/20 text-emerald-300 font-semibold'
                      : 'text-white/50 hover:text-white'
                  }`}
                >
                  PREVIEW
                </button>
                <button
                  type="button"
                  onClick={() => setScreenTab('terminal')}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    screenTab === 'terminal'
                      ? 'bg-emerald-500/20 text-emerald-300 font-semibold'
                      : 'text-white/50 hover:text-white'
                  }`}
                >
                  LOGS
                </button>
              </div>
            </div>

            {/* SCREEN INNER BODY */}
            <div className="relative w-full flex-1 p-3 sm:p-5 overflow-y-auto overflow-x-hidden flex flex-col justify-between bg-radial from-emerald-950/20 via-transparent to-black/80">
              {screenTab === 'preview' ? (
                <>
                  {/* PROJECT META */}
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-[10px] sm:text-[11px] font-mono font-semibold uppercase tracking-wider text-emerald-400">
                        {activeProject.category}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[9px] font-mono text-emerald-400/80 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                        ACTIVE
                      </span>
                    </div>

                    <h3
                      className="text-[15px] sm:text-[19px] md:text-[21px] font-bold text-white tracking-tight leading-snug mb-2"
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      {activeProject.title}
                    </h3>

                    <p className="text-white/70 text-[11px] sm:text-[12.5px] leading-relaxed line-clamp-3 mb-3">
                      {activeProject.summary}
                    </p>
                  </div>

                  {/* LIVE KPI METRICS INSIDE SCREEN */}
                  <div className="grid grid-cols-3 gap-1.5 sm:gap-2 my-2">
                    {activeProject.metrics.map((m, i) => (
                      <div
                        key={i}
                        className="bg-black/50 border border-white/10 rounded-lg p-1.5 sm:p-2.5 text-center"
                      >
                        <div className="text-[9px] sm:text-[10px] text-white/50 font-mono">
                          {m.label}
                        </div>
                        <div className="text-[13px] sm:text-[15px] md:text-[17px] font-bold text-emerald-300 font-mono tracking-tight mt-0.5">
                          {m.value}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* TECH STACK CHIPS */}
                  <div className="flex items-center flex-wrap gap-1 sm:gap-1.5 pt-2 border-t border-white/10">
                    {activeProject.stack.map((t, i) => (
                      <span
                        key={i}
                        className="text-[9px] sm:text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.07] text-white/80 border border-white/10"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </>
              ) : (
                /* TERMINAL / LOGS VIEW */
                <div className="w-full h-full font-mono text-[10px] sm:text-[11.5px] text-emerald-400/90 flex flex-col justify-start space-y-1.5 sm:space-y-2">
                  <div className="text-white/40 text-[9px] pb-1 border-b border-white/10">
                    STREAM BUFFER: ACTIVE // ZERO EXCEPTIONS
                  </div>
                  {activeProject.terminalLogs.map((log, i) => (
                    <div key={i} className="flex items-start gap-1.5 leading-relaxed">
                      <span className="text-white/30 select-none">&gt;</span>
                      <span className={i === activeProject.terminalLogs.length - 1 ? 'text-white font-semibold' : ''}>
                        {log}
                      </span>
                    </div>
                  ))}
                  <div className="pt-2 flex items-center gap-1 text-emerald-300 animate-pulse">
                    <span>_</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 2. THE EXACT HALFTONE SVG MOCKUP OVERLAY (Hands holding the tablet) */}
          <img
            src={HandsDeviceSvg}
            alt="Device Mockup Handheld Workstation"
            className="absolute inset-0 w-full h-full object-contain pointer-events-none z-20 select-none filter drop-shadow-[0_20px_50px_rgba(0,0,0,0.9)]"
          />
        </div>

        {/* BOTTOM PROJECT DETAIL HIGHLIGHTS */}
        <div className="w-full max-w-4xl mt-10 bg-[#0e0e12] border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl">
          <div className="flex-1 space-y-2.5">
            <h4 className="text-[13px] font-mono uppercase tracking-wider text-emerald-400 font-semibold flex items-center gap-2">
              <span>● Key Architectural Features</span>
            </h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[13px] sm:text-[14px] text-white/80">
              {activeProject.highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold shrink-0">✓</span>
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-black font-semibold text-[13px] sm:text-[14px] hover:bg-white/90 hover:scale-105 transition-all shadow-lg cursor-pointer"
            >
              <span>Discuss Architecture</span>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
