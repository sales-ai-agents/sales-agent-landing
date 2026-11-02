import Image from "next/image";
import { StrokeIcon, type StrokeIconName } from "@/components/landing/icons";
import { LinesHeading, MetaRow } from "@/components/landing/typography";

const SIDEBAR_ITEMS: readonly { icon: StrokeIconName; label: string; active?: boolean }[] = [
  { icon: "overview", label: "Огляд", active: true },
  { icon: "agents", label: "Агенти" },
  { icon: "users", label: "Контакти" },
  { icon: "phone", label: "Дзвінки" },
  { icon: "grid", label: "Номери" },
  { icon: "card", label: "Тарифи і Оплата" },
  { icon: "puzzle", label: "Інтеграції" },
];

const AGENT_ROWS = [
  { initial: "М", name: "Марія", task: "Підтвердження записів", rate: 86 },
  { initial: "О", name: "Олег", task: "Уточнення замовлень", rate: 74 },
  { initial: "І", name: "Ірина", task: "Кваліфікація лідів", rate: 61 },
] as const;

const CALL_ROWS = [
  {
    client: "Олена К.",
    agent: "Марія",
    duration: "1:02",
    tone: "g",
    status: "Запис підтверджено",
    time: "10:24",
  },
  {
    client: "Ігор М.",
    agent: "Олег",
    duration: "1:45",
    tone: "y",
    status: "Перенесено на пʼятницю",
    time: "10:31",
  },
  {
    client: "Світлана Т.",
    agent: "Марія",
    duration: "0:15",
    tone: "r",
    status: "Не відповіла · повтор о 14:00",
    time: "10:38",
  },
  {
    client: "Андрій В.",
    agent: "Ірина",
    duration: "2:55",
    tone: "b",
    status: "Тепла заявка → менеджеру",
    time: "10:45",
  },
] as const;

const CHART_LINES = [
  { className: "ln1", points: "20,104.8 130,84.4 240,94.6 350,57.2 460,70.8 570,125.2 680,19.8" },
  { className: "ln2", points: "20,135.4 130,118.4 240,128.6 350,98 460,108.2 570,149 680,77.6" },
  { className: "ln3", points: "20,159.2 130,149 240,152.4 350,135.4 460,142.2 570,166 680,121.8" },
] as const;

const WEEK_DAYS = ["Вт", "Ср", "Чт", "Пт", "Сб", "Нд", "Пн"] as const;

function DashSidebar() {
  return (
    <aside className="dash-side">
      <div className="dash-logo">
        <Image src="/image/Logo.svg" alt="" width={39} height={40} />
        <Image className="word" src="/image/calls4u.svg" alt="calls4u" width={96} height={20} />
      </div>
      <nav className="dash-nav" aria-label="Меню кабінету (демо)">
        {SIDEBAR_ITEMS.map((item) => (
          <span key={item.label} className={item.active ? "on" : undefined}>
            <StrokeIcon name={item.icon} />
            {item.label}
          </span>
        ))}
      </nav>
      <div className="dash-plan">
        <span className="mono">Тариф</span>
        <b>Business</b>
        <small>Керувати тарифом →</small>
      </div>
    </aside>
  );
}

function StatCards() {
  return (
    <div className="dash-cards">
      <div className="dcard">
        <span className="mono">Використання хвилин</span>
        <b>
          <span data-count="186">186</span>
          <small> / 300 хв</small>
        </b>
        <i className="bar">
          <i style={{ width: "62%" }} />
        </i>
        <small>Залишилось 114 хв · вистачить ще на ~9 днів</small>
      </div>
      <StatCard
        icon="phone"
        tone="g"
        label="Усього дзвінків"
        count={248}
        note="За останні 7 днів"
        trend="+18% проти попередніх 7 днів"
      />
      <StatCard
        icon="clock"
        tone="b"
        label="Заощаджено часу"
        count={31}
        unit=" год"
        note="За останні 7 днів"
        trend="≈ 4 робочі дні менеджера"
      />
      <StatCard
        icon="target"
        tone="o"
        label="Досягнуто цілі"
        count={172}
        note="69% від усіх дзвінків"
        trend="+12% проти попередніх 7 днів"
      />
    </div>
  );
}

interface StatCardProps {
  icon: StrokeIconName;
  tone: "g" | "b" | "o";
  label: string;
  count: number;
  unit?: string;
  note: string;
  trend: string;
}

function StatCard({ icon, tone, label, count, unit, note, trend }: StatCardProps) {
  return (
    <div className="dcard">
      <span className="mono">
        <i className={`ico ${tone}`}>
          <StrokeIcon name={icon} weight={2.2} />
        </i>
        {label}
      </span>
      <b>
        <span data-count={count}>{count}</span>
        {unit ? <small>{unit}</small> : null}
      </b>
      <small>{note}</small>
      <small className="up">{trend}</small>
    </div>
  );
}

function ActivityChart() {
  return (
    <div className="dpanel dash-chart">
      <div className="dp-head">
        <b>Активність дзвінків</b>
        <span className="legend">
          <i className="l1" />
          Усі дзвінки
          <i className="l2" />
          Досягнуто цілі
          <i className="l3" />
          Заощаджений час
        </span>
      </div>
      <svg
        viewBox="0 0 700 230"
        preserveAspectRatio="none"
        role="img"
        aria-label="Графік активності дзвінків за тиждень"
      >
        <g className="grid">
          <path d="M20 20H680M20 70H680M20 120H680M20 170H680M20 200H680" />
        </g>
        {CHART_LINES.map((line) => (
          <polyline key={line.className} className={line.className} points={line.points} />
        ))}
      </svg>
      <div className="days mono">
        {WEEK_DAYS.map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>
    </div>
  );
}

function AgentsPanel() {
  return (
    <div className="dpanel dash-agents">
      <div className="dp-head">
        <span className="mono">Ефективність агентів</span>
        <small className="blue">Усі агенти →</small>
      </div>
      {AGENT_ROWS.map((agent) => (
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
      <span className="dp-btn">Перейти до всіх агентів</span>
    </div>
  );
}

function CallsTable() {
  return (
    <div className="dpanel dash-table">
      <div className="dp-head">
        <b>Останні дзвінки</b>
        <small className="muted">Усі дзвінки →</small>
      </div>
      <div className="dt-scroll">
        <table>
          <thead>
            <tr>
              <th>Клієнт</th>
              <th>Агент</th>
              <th>Тривалість</th>
              <th>Результат</th>
              <th>Час</th>
            </tr>
          </thead>
          <tbody>
            {CALL_ROWS.map((row) => (
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

export function DashboardSection() {
  return (
    <section className="sec" id="control">
      <div className="wrap">
        <MetaRow left="(06) Ваш кабінет" right="Повний контроль після кожного дзвінка" />
        <div className="sec-head">
          <LinesHeading
            className="h2 t1"
            lines={["Ви бачите", <em key="accent">кожну розмову</em>]}
          />
          <p className="lead" data-r="">
            Так виглядає кабінет Calls4U: хвилини, дзвінки, заощаджений час і результат кожної
            розмови — в одному місці.
          </p>
        </div>
        <div className="dash" data-r="" data-in="">
          <DashSidebar />
          <div className="dash-main">
            <div className="dash-head">
              <div>
                <b>Огляд</b>
                <small>Статистика роботи ваших ШІ-агентів</small>
              </div>
              <div className="dash-tools">
                <span className="demo-chip mono">Демо-дані</span>
                <span className="dash-sel">7 днів ▾</span>
                <span className="dash-new">+ Новий агент</span>
              </div>
            </div>
            <StatCards />
            <div className="dash-row">
              <ActivityChart />
              <AgentsPanel />
            </div>
            <CallsTable />
          </div>
        </div>
      </div>
    </section>
  );
}
