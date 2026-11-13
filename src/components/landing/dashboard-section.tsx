import Image from "next/image";
import type { DashboardCopy, DashboardStatCopy } from "@/components/landing/copy/types";
import { StrokeIcon, type StrokeIconName } from "@/components/landing/icons";
import { CopyHeading, CountValue, MetaRow } from "@/components/landing/typography";

const USED_MINUTES = 186;
const USAGE_PERCENT = 62;
const TOTAL_CALLS = 248;
const SAVED_HOURS = 31;
const GOAL_CALLS = 172;

const CHART_LINES = [
  { className: "ln1", points: "20,104.8 130,84.4 240,94.6 350,57.2 460,70.8 570,125.2 680,19.8" },
  { className: "ln2", points: "20,135.4 130,118.4 240,128.6 350,98 460,108.2 570,149 680,77.6" },
  { className: "ln3", points: "20,159.2 130,149 240,152.4 350,135.4 460,142.2 570,166 680,121.8" },
] as const;

function DashSidebar({ copy }: { copy: DashboardCopy }) {
  return (
    <aside className="dash-side">
      <div className="dash-logo">
        <Image src="/image/Logo.svg" alt="" width={39} height={40} />
        <Image className="word" src="/image/calls4u.svg" alt="Calls4U" width={99} height={22} />
      </div>
      <nav className="dash-nav" aria-label={copy.menuLabel}>
        {copy.sidebar.map((item, index) => (
          <span key={item.label} className={index === 0 ? "on" : undefined}>
            <StrokeIcon name={item.icon} />
            {item.label}
          </span>
        ))}
      </nav>
      <div className="dash-plan">
        <span className="mono">{copy.planLabel}</span>
        <b>{copy.planName}</b>
        <small>{copy.planLink}</small>
      </div>
    </aside>
  );
}

interface StatCardProps {
  icon: StrokeIconName;
  tone: "g" | "b" | "o";
  copy: DashboardStatCopy;
  count: number;
}

function StatCard({ icon, tone, copy, count }: StatCardProps) {
  return (
    <div className="dcard">
      <span className="mono">
        <i className={`ico ${tone}`}>
          <StrokeIcon name={icon} weight={2.2} />
        </i>
        {copy.label}
      </span>
      <b>
        <CountValue value={count} />
        {copy.unit ? <small>{copy.unit}</small> : null}
      </b>
      <small>{copy.note}</small>
      <small className="up">{copy.trend}</small>
    </div>
  );
}

function StatCards({ copy }: { copy: DashboardCopy }) {
  return (
    <div className="dash-cards">
      <div className="dcard">
        <span className="mono">{copy.usage.label}</span>
        <b>
          <CountValue value={USED_MINUTES} />
          <small>{copy.usage.total}</small>
        </b>
        <i className="bar">
          <i style={{ width: `${USAGE_PERCENT}%` }} />
        </i>
        <small>{copy.usage.note}</small>
      </div>
      <StatCard icon="phone" tone="g" copy={copy.totalCalls} count={TOTAL_CALLS} />
      <StatCard icon="clock" tone="b" copy={copy.savedTime} count={SAVED_HOURS} />
      <StatCard icon="target" tone="o" copy={copy.goals} count={GOAL_CALLS} />
    </div>
  );
}

function ActivityChart({ copy }: { copy: DashboardCopy["chart"] }) {
  const [all, goals, saved] = copy.legend;

  return (
    <div className="dpanel dash-chart">
      <div className="dp-head">
        <b>{copy.title}</b>
        <span className="legend">
          <i className="l1" />
          {all}
          <i className="l2" />
          {goals}
          <i className="l3" />
          {saved}
        </span>
      </div>
      <svg viewBox="0 0 700 230" preserveAspectRatio="none" role="img" aria-label={copy.ariaLabel}>
        <g className="grid">
          <path d="M20 20H680M20 70H680M20 120H680M20 170H680M20 200H680" />
        </g>
        {CHART_LINES.map((line) => (
          <polyline key={line.className} className={line.className} points={line.points} />
        ))}
      </svg>
      <div className="days mono">
        {copy.days.map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>
    </div>
  );
}

function AgentsPanel({ copy }: { copy: DashboardCopy["agentsPanel"] }) {
  return (
    <div className="dpanel dash-agents">
      <div className="dp-head">
        <span className="mono">{copy.title}</span>
        <small className="blue">{copy.all}</small>
      </div>
      {copy.rows.map((agent) => (
        <div className="agent" key={agent.name}>
          <span className="av">{agent.initial}</span>
          <div>
            <b>{agent.name}</b>
            <small>{agent.task}</small>
            <i className="bar">
              <i style={{ width: `${agent.rate}%` }} />
            </i>
          </div>
          <em>{agent.rate}%</em>
        </div>
      ))}
      <span className="dp-btn">{copy.button}</span>
    </div>
  );
}

function CallsTable({ copy }: { copy: DashboardCopy["callsTable"] }) {
  return (
    <div className="dpanel dash-table">
      <div className="dp-head">
        <b>{copy.title}</b>
        <small className="muted">{copy.all}</small>
      </div>
      <div className="dt-scroll">
        <table>
          <thead>
            <tr>
              {copy.headers.map((header) => (
                <th key={header}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {copy.rows.map((row) => (
              <tr key={row.client}>
                <td>
                  <b>{row.client}</b>
                </td>
                <td>{row.agent}</td>
                <td>{row.duration}</td>
                <td>
                  <span className={`st ${row.tone}`}>
                    <i />
                    {row.status}
                  </span>
                </td>
                <td>{row.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function DashboardSection({ copy }: { copy: DashboardCopy }) {
  return (
    <section className="sec" id="control">
      <div className="wrap">
        <MetaRow left={copy.meta} right={copy.metaRight} />
        <div className="sec-head">
          <CopyHeading className="h2 t1" heading={copy.heading} />
          <p className="lead" data-r="">
            {copy.lead}
          </p>
        </div>
        <div className="dash" data-r="" data-in="">
          <DashSidebar copy={copy} />
          <div className="dash-main">
            <div className="dash-head">
              <div>
                <b>{copy.headTitle}</b>
                <small>{copy.headSubtitle}</small>
              </div>
              <div className="dash-tools">
                <span className="demo-chip mono">{copy.demoChip}</span>
                <span className="dash-sel">{copy.range}</span>
                <span className="dash-new">{copy.newAgent}</span>
              </div>
            </div>
            <StatCards copy={copy} />
            <div className="dash-row">
              <ActivityChart copy={copy.chart} />
              <AgentsPanel copy={copy.agentsPanel} />
            </div>
            <CallsTable copy={copy.callsTable} />
          </div>
        </div>
      </div>
    </section>
  );
}
