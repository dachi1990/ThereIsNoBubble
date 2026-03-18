import { useState, useEffect, useRef, createContext, useContext } from "react";
import { AreaChart, Area, BarChart, Bar, ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, Line } from "recharts";

/* ══════════════ THEMES ══════════════ */
const themes = {
  dark: {
    bg:"#0a0e17",bgCard:"#111827",bgCardAlt:"#0f172a",bgHover:"#1a2235",
    border:"#1e293b",borderLight:"#334155",
    text:"#e2e8f0",textMuted:"#94a3b8",textDim:"#64748b",
    green:"#34d399",greenBg:"rgba(52,211,153,0.1)",greenBorder:"rgba(52,211,153,0.25)",
    yellow:"#fbbf24",yellowBg:"rgba(251,191,36,0.1)",yellowBorder:"rgba(251,191,36,0.25)",
    red:"#f87171",redBg:"rgba(248,113,113,0.1)",redBorder:"rgba(248,113,113,0.25)",
    blue:"#60a5fa",purple:"#a78bfa",cyan:"#22d3ee",orange:"#fb923c",
    accent:"#818cf8",accentBg:"rgba(129,140,248,0.08)",
    gridStroke:"#1e293b",tooltipBg:"#1e293b",headerBg:"rgba(17,24,39,0.92)",
    refLabel:"#94a3b8",riskBarBg:"#1e293b",
    shadow:"0 4px 20px rgba(0,0,0,0.3)",cardShadow:"0 1px 2px rgba(0,0,0,0.3)",
  },
  light: {
    bg:"#f5f7fb",bgCard:"#ffffff",bgCardAlt:"#f0f4f8",bgHover:"#e8edf4",
    border:"#d8dfe9",borderLight:"#c0c9d6",
    text:"#111827",textMuted:"#4b5563",textDim:"#9ca3af",
    green:"#059669",greenBg:"rgba(5,150,105,0.07)",greenBorder:"rgba(5,150,105,0.22)",
    yellow:"#b45309",yellowBg:"rgba(180,83,9,0.07)",yellowBorder:"rgba(180,83,9,0.2)",
    red:"#dc2626",redBg:"rgba(220,38,38,0.06)",redBorder:"rgba(220,38,38,0.18)",
    blue:"#2563eb",purple:"#7c3aed",cyan:"#0891b2",orange:"#c2410c",
    accent:"#4f46e5",accentBg:"rgba(79,70,229,0.06)",
    gridStroke:"#e5e7eb",tooltipBg:"#ffffff",headerBg:"rgba(245,247,251,0.92)",
    refLabel:"#6b7280",riskBarBg:"#e5e7eb",
    shadow:"0 4px 20px rgba(0,0,0,0.08)",cardShadow:"0 1px 3px rgba(0,0,0,0.05)",
  },
};

/* ══════════════ DATA ══════════════ */
const capeData=[{y:"1920",v:5},{y:"1929",v:32.6},{y:"1932",v:5.6},{y:"1950",v:12},{y:"1966",v:24.1},{y:"1982",v:6.6},{y:"1990",v:17},{y:"1995",v:23},{y:"2000",v:44.2},{y:"2002",v:22},{y:"2007",v:27.5},{y:"2009",v:13.3},{y:"2015",v:26},{y:"2020",v:31},{y:"2022",v:28},{y:"2024",v:36},{y:"2026",v:38.1}];
const fwdPE=[{y:"1995",v:14.5},{y:"1999",v:25.5},{y:"2000",v:26},{y:"2003",v:16},{y:"2007",v:15.2},{y:"2009",v:10.5},{y:"2013",v:15},{y:"2020",v:22},{y:"2022",v:17},{y:"2024",v:21},{y:"2026",v:20.9}];
const buffett=[{y:"1970",v:75},{y:"1982",v:33},{y:"1990",v:58},{y:"1995",v:92},{y:"2000",v:148},{y:"2002",v:80},{y:"2007",v:110},{y:"2009",v:60},{y:"2015",v:120},{y:"2020",v:170},{y:"2021",v:200},{y:"2025",v:230},{y:"2026",v:217}];
const erpD=[{y:"1995",v:4},{y:"1999",v:0.5},{y:"2000",v:-0.5},{y:"2004",v:3.5},{y:"2009",v:8},{y:"2015",v:4},{y:"2020",v:4.5},{y:"2022",v:2.5},{y:"2026",v:1.5}];
const conc=[{y:"1990",v:16},{y:"1995",v:17},{y:"2000",v:27},{y:"2005",v:19},{y:"2010",v:20},{y:"2015",v:19},{y:"2020",v:28},{y:"2024",v:37},{y:"2025",v:41},{y:"2026",v:39}];
const mDebt=[{y:"1997",v:132},{y:"2000",v:278},{y:"2007",v:381},{y:"2009",v:173},{y:"2014",v:451},{y:"2018",v:568},{y:"2021",v:936},{y:"2023",v:743},{y:"2026",v:1279}];
const ycD=[{y:"1990",v:0.3},{y:"1995",v:1},{y:"2000",v:-0.5},{y:"2007",v:-0.2},{y:"2009",v:2.7},{y:"2013",v:2.4},{y:"2019",v:-0.05},{y:"2023",v:-1},{y:"2025",v:0.3},{y:"2026",v:0.25}];
const hyD=[{y:"1997",v:3},{y:"2000",v:8},{y:"2007",v:2.6},{y:"2008",v:21.8},{y:"2011",v:5.5},{y:"2015",v:5.5},{y:"2018",v:3.5},{y:"2020",v:10.9},{y:"2024",v:3},{y:"2026",v:3.3}];
const hhD=[{y:"1990",v:83},{y:"1995",v:90},{y:"2000",v:97},{y:"2005",v:125},{y:"2007",v:133},{y:"2010",v:118},{y:"2015",v:100},{y:"2020",v:95},{y:"2024",v:90},{y:"2026",v:88}];
const m2D=[{y:"2010",v:8.6},{y:"2014",v:11},{y:"2019",v:15.3},{y:"2020",v:19.1},{y:"2021",v:21.7},{y:"2022",v:21.5},{y:"2024",v:21.2},{y:"2026",v:21.8}];
const fedB=[{y:"2008",v:0.9},{y:"2012",v:2.9},{y:"2016",v:4.5},{y:"2019",v:3.8},{y:"2020",v:7.4},{y:"2021",v:8.8},{y:"2023",v:7.8},{y:"2026",v:6.5}];
const vixD=[{y:"1995",v:12.5},{y:"2000",v:33},{y:"2004",v:14},{y:"2008",v:80},{y:"2013",v:12},{y:"2017",v:9.1},{y:"2020",v:82.7},{y:"2024",v:15},{y:"2026",v:22}];
const csD=[{y:"1990",v:77},{y:"2000",v:100},{y:"2006",v:190},{y:"2009",v:140},{y:"2015",v:170},{y:"2020",v:220},{y:"2022",v:305},{y:"2026",v:332}];
const gdD=[{y:"2000",v:230},{y:"2008",v:305},{y:"2012",v:310},{y:"2020",v:360},{y:"2022",v:340},{y:"2026",v:338}];
const epsQ=[{q:"Q3'24",g:5.8},{q:"Q4'24",g:13.2},{q:"Q1'25",g:12.8},{q:"Q2'25",g:11.5},{q:"Q3'25",g:10.2},{q:"Q4'25",g:14.5},{q:"Q1'26E",g:11.6},{q:"Q2'26E",g:16},{q:"Q3'26E",g:16.9},{q:"Q4'26E",g:15.9}];

/* ══════════════ METRICS ══════════════ */
const MS = [
  {nm:"Shiller CAPE Ratio",cur:"38.1",c00:"44.2",c08:"27.5",avg:"17.6",sig:"red",sc:85,tab:1,
    info:"How many years of profits are you paying for? Take the S&P 500 price ÷ 10-year average inflation-adjusted earnings. Example: A lemonade stand earning $10/year — if you pay $380, the CAPE is 38. You're paying 38 years' profits upfront. Average is ~17.6, so at 38.1 you pay double the normal price.",
    calc:"S&P 500 Price ÷ 10Y Avg Inflation-Adj EPS"},
  {nm:"Forward P/E",cur:"20.9",c00:"25.5",c08:"15.2",avg:"16.7",sig:"yellow",sc:60,tab:1,
    info:"How much you pay for NEXT year's expected profits. If Apple earns $7/share next year and trades at $146, its P/E is ~21x. For the S&P 500 at 20.9x, you pay $20.90 per $1 of expected earnings. Unlike 2000, today's expectations are backed by real 8%+ revenue growth.",
    calc:"S&P 500 Price ÷ Next-12-Month Expected EPS"},
  {nm:"Buffett Indicator",cur:"217%",c00:"148%",c08:"110%",avg:"90%",sig:"red",sc:95,tab:1,
    info:"Buffett's favorite: total stock market value vs. the entire economy. If all companies are worth $60T but the economy produces $28T/year = 217%. Like a restaurant valued at 2x annual revenue. BUT: companies earn 40% overseas, and GDP only counts domestic, so the ratio structurally overstates.",
    calc:"Total US Market Cap ÷ US GDP × 100"},
  {nm:"Equity Risk Premium",cur:"1.5%",c00:"−0.5%",c08:"2.0%",avg:"4.0%",sig:"yellow",sc:55,tab:1,
    info:"The 'bonus return' stocks offer over safe bonds. If stocks return 5.7% and Treasuries pay 4.2%, the ERP is 1.5%. In 2000, this went NEGATIVE — investors accepted LESS return from risky stocks than safe bonds. Today at 1.5%, slim but positive: you're still paid for taking risk.",
    calc:"Expected Stock Return − 10Y Treasury Yield"},
  {nm:"Top 10 Concentration",cur:"39%",c00:"27%",c08:"20%",avg:"19%",sig:"red",sc:90,tab:2,
    info:"What % of the S&P 500 is just the 10 biggest companies. Imagine 500 students where the top 10 hold 39% of all lunch money. If one has a bad day, everyone suffers. Apple + MSFT + NVIDIA alone ≈ 20%. Most concentrated market ever — but they also produce 32.5% of all earnings.",
    calc:"Top 10 Market Caps ÷ Total S&P 500 Cap × 100"},
  {nm:"FINRA Margin Debt",cur:"$1.28T",c00:"$278B",c08:"$381B",avg:"$347B",sig:"red",sc:80,tab:2,
    info:"Money borrowed to buy stocks. You have $100K, borrow $100K more from your broker = margin debt. $1.28T borrowed nationwide — a record. Danger: if stocks drop, brokers demand repayment ('margin call'), forcing selling → prices drop → more margin calls. A cascade.",
    calc:"Total dollars borrowed from brokers to buy securities"},
  {nm:"Margin Debt / Mkt Cap",cur:"1.85%",c00:"2.5%",c08:"2.7%",avg:"2.0%",sig:"green",sc:30,tab:2,
    info:"Borrowed money RELATIVE to market size — the fairer measure. Borrowing $100K is risky at $500K portfolio (20%) but modest at $5M (2%). At 1.85%, today's leverage is BELOW both 2000 (2.5%) and 2008 (2.7%). Less aggressive than headlines suggest.",
    calc:"Margin Debt ÷ Total Market Cap × 100"},
  {nm:"Yield Curve (10Y−2Y)",cur:"+25bp",c00:"−50bp",c08:"−20bp",avg:"+100bp",sig:"yellow",sc:50,tab:3,
    info:"Difference between long-term and short-term bond rates. Normally long rates are higher. When short > long ('inverted'), recession follows in 12-24 months. Like a 2-year CD paying 4.5% while a 10-year pays only 4.0% — something's off. Today at +25bp, un-inverted — cautiously positive.",
    calc:"10Y Treasury Yield − 2Y Treasury Yield (100bp = 1%)"},
  {nm:"HY Credit Spread",cur:"3.3%",c00:"8.0%",c08:"21.8%",avg:"4.9%",sig:"yellow",sc:45,tab:3,
    info:"Extra interest risky companies pay vs. the government. Govt borrows at 4%, junk-rated company at 7.3% — spread = 3.3%. Tight spread = investors feel safe. Before 2008, spreads were 2.6% — then exploded to 21.8%. Today's 3.3% signals calm, possibly too calm.",
    calc:"High-Yield Bond Yield − Treasury Yield"},
  {nm:"Household Debt/Income",cur:"88%",c00:"97%",c08:"133%",avg:"100%",sig:"green",sc:15,tab:3,
    info:"How much families owe vs. earn. Earn $100K, owe $88K total = 88%. In 2008, 133% — families owed MORE than a year's income. At 88%, consumers are in the best shape in 30+ years. Arguably the strongest 'not a bubble' data point: the consumer isn't overleveraged.",
    calc:"Total Household Debt ÷ Disposable Income × 100"},
  {nm:"S&P EPS Growth",cur:"+15.3%",c00:"−2%",c08:"−30%",avg:"+8%",sig:"green",sc:10,tab:4,
    info:"How fast company profits grow year-over-year. Earned $200/share last year, $230 this year = +15%. High prices are only 'bubbly' if earnings don't keep up. At +15.3%, nearly double the average. In 2000, earnings FELL. In 2008, they collapsed −30%.",
    calc:"Current Year EPS ÷ Prior Year EPS − 1"},
  {nm:"GDP Growth",cur:"~2.5%",c00:"1.0%",c08:"−4.3%",avg:"2.5%",sig:"green",sc:20,tab:4,
    info:"Growth of the entire US economy. Economy was $28T, now $28.7T = 2.5% growth. Before 2008, GDP SHRANK 4.3%. Today the economy grows at its long-run average, meaning the real economy supports stock prices.",
    calc:"Change in Inflation-Adjusted GDP (annualized %)"},
  {nm:"Fed Funds Rate",cur:"3.6%",c00:"6.5%",c08:"5.25%",avg:"3.5%",sig:"green",sc:25,tab:5,
    info:"The rate banks charge each other overnight — the most important rate in the world. Ripples through mortgages, car loans, everything. At 3.6%, near average. Before 2000 and 2008, the Fed pushed to 5-6.5%, choking the economy. Today the Fed is CUTTING — tailwinds, not headwinds.",
    calc:"Set by the Fed's FOMC at 8 meetings/year"},
  {nm:"M2 Money Supply",cur:"$21.8T",c00:"$4.9T",c08:"$8.0T",avg:"N/A",sig:"yellow",sc:50,tab:5,
    info:"All money in the economy: cash, checking, savings. Think of M2 as 'water' in the economic pool. During COVID the Fed pumped 40% more in ($15T → $21.7T). More money chasing same goods = higher prices. At $21.8T growing 4.6%/yr (above GDP), the pool is still very full.",
    calc:"Currency + checking + savings + money market funds"},
  {nm:"Fed Balance Sheet",cur:"$6.5T",c00:"$0.6T",c08:"$0.9T",avg:"N/A",sig:"yellow",sc:55,tab:5,
    info:"How much the Fed 'owns' — bonds bought to pump money in. Imagine a giant shopping cart: $0.9T before 2008, then $8.8T by 2022 via buying sprees. Now slowly putting things back ($6.5T). More buying = higher prices. The unwinding is orderly but slow.",
    calc:"Total Fed assets (bonds, MBS, etc.)"},
  {nm:"VIX",cur:"~22",c00:"33",c08:"80",avg:"19",sig:"yellow",sc:45,tab:6,
    info:"The 'fear gauge': expected market swings over 30 days from options prices. VIX 22 = market expects ~22% annual moves. Below 12 = dangerously calm. Above 30 = fear. Pre-bubble VIX was LOW (9-11 in 2006-07) = complacency. Today's 22 is actually healthier.",
    calc:"From S&P 500 options; annualized expected volatility"},
  {nm:"Case-Shiller HPI",cur:"332",c00:"100",c08:"190→140",avg:"N/A",sig:"yellow",sc:40,tab:7,
    info:"Home prices across 20 cities, indexed to 100 in 2000. At 332, homes cost 3.3x what they did then. In 2006 it peaked at 190 before crashing. But the driver is different: 2006 = reckless lending; today = housing SHORTAGE. FICO ~740 (vs ~700), 95% fixed-rate.",
    calc:"Repeat-sale index tracking same homes, 20 metros"},
  {nm:"Global Debt/GDP",cur:"338%",c00:"230%",c08:"305%",avg:"N/A",sig:"red",sc:75,tab:8,
    info:"All debt worldwide vs. global GDP. The world earns $100, owes $338. Like a family earning $100K owing $338K. Doesn't cause crises directly but makes them WORSE: less fiscal room to respond, higher refinancing costs.",
    calc:"Global Govt + Corp + Household Debt ÷ Global GDP × 100"},
];
const OS = Math.round(MS.reduce((a,m) => a + m.sc, 0) / MS.length);

const tabNames = ["Dashboard","Equity Valuation","Market Structure","Credit & Debt","Macro","Monetary Policy","Sentiment","Housing","Global Risk","Report"];

/* ══════════════ CONTEXT ══════════════ */
const Ctx = createContext(themes.dark);
const useT = () => useContext(Ctx);

/* ══════════════ SMALL COMPONENTS ══════════════ */
const sigColor = (s, t) => s === "green" ? t.green : s === "yellow" ? t.yellow : t.red;
const sigBg = (s, t) => s === "green" ? t.greenBg : s === "yellow" ? t.yellowBg : t.redBg;
const sigBd = (s, t) => s === "green" ? t.greenBorder : s === "yellow" ? t.yellowBorder : t.redBorder;

function Badge({ signal }) {
  const t = useT();
  const c = sigColor(signal, t);
  return (
    <span style={{display:"inline-flex",alignItems:"center",gap:5,padding:"3px 10px",borderRadius:20,fontSize:10,fontWeight:700,letterSpacing:1,background:sigBg(signal,t),color:c,border:`1px solid ${sigBd(signal,t)}`}}>
      <span style={{width:6,height:6,borderRadius:"50%",background:c}} />
      {signal === "green" ? "HEALTHY" : signal === "yellow" ? "CAUTION" : "ELEVATED"}
    </span>
  );
}

function RiskBar({ score }) {
  const t = useT();
  const c = score < 30 ? t.green : score < 60 ? t.yellow : t.red;
  return (
    <div style={{display:"flex",alignItems:"center",gap:6,minWidth:80}}>
      <div style={{flex:1,height:6,borderRadius:3,background:t.riskBarBg,overflow:"hidden"}}>
        <div style={{width:`${score}%`,height:"100%",borderRadius:3,background:c,transition:"width 0.6s"}} />
      </div>
      <span style={{fontSize:10,fontWeight:700,color:c,minWidth:18}}>{score}</span>
    </div>
  );
}

function InfoBtn({ info, calc, name }) {
  const t = useT();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const fn = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, [open]);

  return (
    <span ref={ref} style={{position:"relative",display:"inline-flex",verticalAlign:"middle"}}>
      <button onClick={(e) => { e.stopPropagation(); setOpen(!open); }} style={{
        width:18,height:18,borderRadius:"50%",border:`1.5px solid ${open ? t.accent : t.borderLight}`,
        background:open ? t.accentBg : "transparent",color:open ? t.accent : t.textDim,
        fontSize:11,fontWeight:700,cursor:"pointer",display:"inline-flex",alignItems:"center",
        justifyContent:"center",padding:0,marginLeft:6,fontFamily:"Georgia,serif",fontStyle:"italic"
      }}>i</button>
      {open && (
        <div onClick={(e) => e.stopPropagation()} style={{
          position:"absolute",top:"calc(100% + 8px)",left:-120,width:320,zIndex:300,
          background:t.bgCard,border:`1px solid ${t.border}`,borderRadius:12,padding:16,boxShadow:t.shadow,
        }}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
            <span style={{fontSize:11,fontWeight:700,color:t.accent}}>{name}</span>
            <button onClick={() => setOpen(false)} style={{background:"none",border:"none",color:t.textDim,cursor:"pointer",fontSize:16,padding:0,lineHeight:1}}>×</button>
          </div>
          <p style={{margin:"0 0 10px",fontSize:12,lineHeight:1.65,color:t.textMuted}}>{info}</p>
          {calc && (
            <div style={{padding:"7px 10px",background:t.bgCardAlt,borderRadius:8,border:`1px solid ${t.border}`}}>
              <div style={{fontSize:9,color:t.textDim,textTransform:"uppercase",letterSpacing:1,fontWeight:600,marginBottom:2}}>Formula</div>
              <div style={{fontSize:11,color:t.accent,fontFamily:"monospace",fontWeight:600}}>{calc}</div>
            </div>
          )}
        </div>
      )}
    </span>
  );
}

function Explainer({ title, info, calc }) {
  const t = useT();
  const [open, setOpen] = useState(false);
  return (
    <div style={{marginBottom:10,background:t.accentBg,border:`1px solid ${t.accent}22`,borderRadius:10,overflow:"hidden"}}>
      <button onClick={() => setOpen(!open)} style={{
        width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",
        padding:"9px 14px",background:"none",border:"none",cursor:"pointer",
        color:t.accent,fontSize:12,fontWeight:600,fontFamily:"inherit",textAlign:"left"
      }}>
        <span style={{display:"flex",alignItems:"center",gap:6}}>
          <span style={{width:18,height:18,borderRadius:"50%",border:`1.5px solid ${t.accent}`,display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:11,fontFamily:"Georgia,serif",fontStyle:"italic",flexShrink:0}}>i</span>
          <span>What is {title}?</span>
        </span>
        <span style={{transform:open ? "rotate(180deg)" : "none",transition:"transform 0.2s",fontSize:14,flexShrink:0}}>▾</span>
      </button>
      {open && (
        <div style={{padding:"0 14px 12px"}}>
          <p style={{margin:"0 0 8px",fontSize:13,lineHeight:1.7,color:t.textMuted}}>{info}</p>
          {calc && (
            <div style={{padding:"7px 10px",background:t.bgCard,borderRadius:8,border:`1px solid ${t.border}`}}>
              <span style={{fontSize:9,color:t.textDim,textTransform:"uppercase",letterSpacing:1,fontWeight:600}}>Formula: </span>
              <span style={{fontSize:11,color:t.accent,fontFamily:"monospace",fontWeight:600}}>{calc}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Card({ children, style }) {
  const t = useT();
  return <div style={{background:t.bgCard,border:`1px solid ${t.border}`,borderRadius:14,padding:20,boxShadow:t.cardShadow,...style}}>{children}</div>;
}

function ChartTip({ active, payload, label }) {
  const t = useT();
  if (!active || !payload?.length) return null;
  return (
    <div style={{background:t.tooltipBg,border:`1px solid ${t.border}`,borderRadius:8,padding:"8px 14px",boxShadow:t.shadow}}>
      <p style={{color:t.textDim,fontSize:11,margin:0}}>{label}</p>
      {payload.map((p, i) => <p key={i} style={{color:p.color,fontSize:13,fontWeight:700,margin:"3px 0 0"}}>{p.name}: {typeof p.value === "number" ? p.value.toLocaleString() : p.value}</p>)}
    </div>
  );
}

function ChartCard({ title, sub, children, signal, interp }) {
  const t = useT();
  return (
    <Card style={{marginBottom:20}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14,flexWrap:"wrap",gap:8}}>
        <div>
          <h3 style={{margin:0,fontSize:15,fontWeight:700,color:t.text}}>{title}</h3>
          {sub && <p style={{margin:"3px 0 0",fontSize:12,color:t.textMuted}}>{sub}</p>}
        </div>
        {signal && <Badge signal={signal} />}
      </div>
      <div style={{height:260}}>{children}</div>
      {interp && (
        <div style={{marginTop:14,padding:"12px 16px",background:t.bgCardAlt,borderRadius:10,borderLeft:`3px solid ${signal ? sigColor(signal,t) : t.accent}`}}>
          <p style={{margin:0,fontSize:13,lineHeight:1.65,color:t.textMuted}}>{interp}</p>
        </div>
      )}
    </Card>
  );
}

function StatBox({ label, value, sub, color }) {
  const t = useT();
  return (
    <div style={{textAlign:"center",padding:"10px 4px"}}>
      <div style={{fontSize:10,color:t.textDim,textTransform:"uppercase",letterSpacing:1.2,fontWeight:600}}>{label}</div>
      <div style={{fontSize:24,fontWeight:800,color:color || t.text,marginTop:3}}>{value}</div>
      {sub && <div style={{fontSize:11,color:t.textMuted,marginTop:2}}>{sub}</div>}
    </div>
  );
}

function Gauge({ score }) {
  const t = useT();
  const c = score < 30 ? t.green : score < 60 ? t.yellow : t.red;
  const angle = -90 + (score * 1.8);
  const nx = 100 + 55 * Math.cos((angle * Math.PI) / 180);
  const ny = 100 + 55 * Math.sin((angle * Math.PI) / 180);
  return (
    <svg viewBox="0 0 200 120" style={{width:"100%",maxWidth:180}}>
      <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke={t.riskBarBg} strokeWidth="12" strokeLinecap="round" />
      <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke={c} strokeWidth="12" strokeLinecap="round"
        strokeDasharray={`${score * 2.51} 251`} />
      <line x1="100" y1="100" x2={nx} y2={ny} stroke={t.text} strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="100" cy="100" r="4" fill={t.text} />
      <text x="100" y="85" textAnchor="middle" fill={c} fontSize="26" fontWeight="900" fontFamily="system-ui">{score}</text>
      <text x="100" y="115" textAnchor="middle" fill={t.textDim} fontSize="9" fontWeight="600">OF 100</text>
    </svg>
  );
}

/* ══════════════ AREA CHART HELPER ══════════════ */
function AC({ data, color, id, yFmt, refY, refLabel, refColor, name, domainY }) {
  const t = useT();
  return (
    <ResponsiveContainer>
      <AreaChart data={data}>
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.2} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={t.gridStroke} />
        <XAxis dataKey="y" tick={{fontSize:10,fill:t.textDim}} />
        <YAxis tick={{fontSize:10,fill:t.textDim}} tickFormatter={yFmt} domain={domainY} />
        <Tooltip content={<ChartTip />} />
        {refY != null && <ReferenceLine y={refY} stroke={refColor || t.refLabel} strokeDasharray="6 3" label={{value:refLabel,fill:refColor || t.refLabel,fontSize:10}} />}
        <Area type="monotone" dataKey="v" stroke={color} fill={`url(#${id})`} strokeWidth={2.5} name={name} dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

/* ══════════════ TABS ══════════════ */
function TabDash({ goTab }) {
  const t = useT();
  const greens = MS.filter(m => m.sig === "green");
  const reds = MS.filter(m => m.sig === "red");
  const radarD = [{s:"Equity",sc:74},{s:"Mkt Str.",sc:67},{s:"Credit",sc:37},{s:"Macro",sc:15},{s:"Money",sc:43},{s:"Sent.",sc:45},{s:"Housing",sc:40},{s:"Global",sc:75}];

  return (
    <div>
      <div style={{textAlign:"center",padding:"24px 0 18px"}}>
        <div style={{fontSize:11,color:t.accent,letterSpacing:3,textTransform:"uppercase",fontWeight:700}}>Real-Time Multi-Factor Analysis</div>
        <h1 style={{fontSize:32,fontWeight:900,color:t.text,margin:"6px 0",letterSpacing:-1.5}}>Bubble Risk Monitor</h1>
        <p style={{color:t.textMuted,fontSize:13,maxWidth:560,margin:"0 auto"}}>18 indicators compared against the Dot-Com Bubble (2000) and Global Financial Crisis (2008).</p>
      </div>

      <Card style={{marginBottom:16}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 2fr 1fr",gap:16,alignItems:"center"}}>
          <div style={{textAlign:"center"}}>
            <div style={{fontSize:10,color:t.textDim,textTransform:"uppercase",letterSpacing:2,fontWeight:600,marginBottom:4}}>Composite Risk</div>
            <Gauge score={OS} />
            <div style={{marginTop:6}}>
              <span style={{padding:"4px 12px",borderRadius:20,fontSize:10,fontWeight:700,letterSpacing:1,background:t.yellowBg,color:t.yellow,border:`1px solid ${t.yellowBorder}`}}>ELEVATED — NOT A BUBBLE</span>
            </div>
          </div>
          <div style={{height:200}}>
            <ResponsiveContainer>
              <RadarChart data={radarD}>
                <PolarGrid stroke={t.border} />
                <PolarAngleAxis dataKey="s" tick={{fontSize:9,fill:t.textMuted}} />
                <Radar dataKey="sc" stroke={t.yellow} fill={t.yellow} fillOpacity={0.12} strokeWidth={2} dot={{r:3,fill:t.yellow}} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {[{l:"Healthy",c:greens.length,s:"green"},{l:"Caution",c:MS.filter(m=>m.sig==="yellow").length,s:"yellow"},{l:"Elevated",c:reds.length,s:"red"}].map(x => (
              <div key={x.s} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 12px",borderRadius:10,background:sigBg(x.s,t),border:`1px solid ${sigBd(x.s,t)}`}}>
                <div style={{width:10,height:10,borderRadius:"50%",background:sigColor(x.s,t)}} />
                <div><div style={{fontSize:18,fontWeight:800,color:sigColor(x.s,t)}}>{x.c}</div><div style={{fontSize:10,color:t.textMuted}}>{x.l}</div></div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
        <Card style={{borderLeft:`3px solid ${t.green}`,padding:16}}>
          <div style={{fontSize:10,color:t.green,textTransform:"uppercase",letterSpacing:1.5,fontWeight:700,marginBottom:8}}>Strongest Bull Signals</div>
          {greens.slice(0,3).map((m,i) => (
            <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:i < 2 ? `1px solid ${t.border}` : "none"}}>
              <span style={{fontSize:12,color:t.text}}>{m.nm}</span>
              <span style={{fontSize:12,fontWeight:700,color:t.green,fontFamily:"monospace"}}>{m.cur}</span>
            </div>
          ))}
        </Card>
        <Card style={{borderLeft:`3px solid ${t.red}`,padding:16}}>
          <div style={{fontSize:10,color:t.red,textTransform:"uppercase",letterSpacing:1.5,fontWeight:700,marginBottom:8}}>Key Risk Signals</div>
          {reds.slice(0,3).map((m,i) => (
            <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:i < 2 ? `1px solid ${t.border}` : "none"}}>
              <span style={{fontSize:12,color:t.text}}>{m.nm}</span>
              <span style={{fontSize:12,fontWeight:700,color:t.red,fontFamily:"monospace"}}>{m.cur}</span>
            </div>
          ))}
        </Card>
      </div>

      <Card style={{marginBottom:16,borderLeft:`3px solid ${t.accent}`}}>
        <h3 style={{margin:"0 0 6px",fontSize:14,fontWeight:700,color:t.accent}}>THESIS: Stretched but Not a Bubble</h3>
        <p style={{margin:0,fontSize:13,lineHeight:1.7,color:t.textMuted}}>Valuations (CAPE 38.1, Buffett 217%) are extreme, but today's mega-caps produce massive real earnings. Household balance sheets are healthy (88% vs 133% in 2008). ERP remains positive (vs negative in 2000). Credit shows no systemic stress. Expensive but fundamentally supported.</p>
      </Card>

      <Card>
        <h3 style={{margin:"0 0 14px",fontSize:15,fontWeight:700,color:t.text}}>Complete Scorecard — 18 Metrics</h3>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
            <thead>
              <tr style={{borderBottom:`2px solid ${t.border}`}}>
                {["Metric","Current","2000","2008","Avg","Risk","Signal"].map(h => (
                  <th key={h} style={{padding:"9px 8px",textAlign:"left",color:t.textDim,fontWeight:700,fontSize:10,textTransform:"uppercase",letterSpacing:1}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MS.map((m, i) => (
                <tr key={i} onClick={() => goTab(m.tab)} style={{borderBottom:`1px solid ${t.border}`,cursor:"pointer"}}
                  onMouseEnter={e => e.currentTarget.style.background = t.bgHover}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <td style={{padding:"9px 8px",color:t.text,fontWeight:600}}>
                    <span style={{display:"inline-flex",alignItems:"center"}}>{m.nm}<InfoBtn info={m.info} calc={m.calc} name={m.nm} /></span>
                  </td>
                  <td style={{padding:"9px 8px",color:t.text,fontWeight:700,fontFamily:"monospace"}}>{m.cur}</td>
                  <td style={{padding:"9px 8px",color:t.textMuted,fontFamily:"monospace"}}>{m.c00}</td>
                  <td style={{padding:"9px 8px",color:t.textMuted,fontFamily:"monospace"}}>{m.c08}</td>
                  <td style={{padding:"9px 8px",color:t.textMuted,fontFamily:"monospace"}}>{m.avg}</td>
                  <td style={{padding:"9px 8px",minWidth:86}}><RiskBar score={m.sc} /></td>
                  <td style={{padding:"9px 8px"}}><Badge signal={m.sig} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{marginTop:8,fontSize:11,color:t.textDim,fontStyle:"italic"}}>Click any row to jump to its detailed analysis →</div>
      </Card>
    </div>
  );
}

function TabEquity() {
  const t = useT();
  return (
    <div>
      <h2 style={{fontSize:22,fontWeight:800,color:t.text,marginBottom:4}}>Equity Valuation Metrics</h2>
      <p style={{color:t.textMuted,fontSize:13,marginBottom:16}}>Are equity prices justified by fundamentals?</p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:16}}>
        <Card><StatBox label="CAPE" value="38.1" sub="vs 17.6 avg" color={t.red} /></Card>
        <Card><StatBox label="Fwd P/E" value="20.9" sub="vs 18.9 10Y" color={t.yellow} /></Card>
        <Card><StatBox label="Buffett" value="217%" sub="vs 90% avg" color={t.red} /></Card>
        <Card><StatBox label="ERP" value="1.5%" sub="vs 4.0% avg" color={t.yellow} /></Card>
      </div>
      {[0,1,2,3].map(i => <Explainer key={i} title={MS[i].nm} info={MS[i].info} calc={MS[i].calc} />)}
      <ChartCard title="Shiller CAPE Ratio (1920–2026)" signal="red" interp="CAPE at 38.1 is 2nd-highest in 154 years. Doesn't adjust for today's lower rates (4.2% vs 6.5% in 2000) or higher-margin tech models. Expensive but not irrational when rate-adjusted.">
        <AC data={capeData} color={t.red} id="cF" name="CAPE" refY={17.6} refLabel="Avg: 17.6" />
      </ChartCard>
      <ChartCard title="Forward P/E (1995–2026)" signal="yellow" interp="At 20.9x, above 10Y avg of 18.9 but below 2000's 25.5x. Strongest 'not a bubble' argument: today's 15.3% earnings growth is real, backed by $400B+ Mag 7 FCF.">
        <AC data={fwdPE} color={t.yellow} id="fF" name="Fwd P/E" refY={16.7} refLabel="25Y Avg" domainY={[8,30]} />
      </ChartCard>
      <ChartCard title="Buffett Indicator (1970–2026)" signal="red" interp="At 217%, highest ever. But S&P earns 40% abroad (GDP = domestic only) and margins doubled from 6% to 12%. Still demands respect as a mean-reversion signal.">
        <AC data={buffett} color={t.red} id="bF" name="Mkt Cap/GDP %" yFmt={v => `${v}%`} refY={90} refLabel="Avg: 90%" />
      </ChartCard>
      <ChartCard title="Equity Risk Premium (1995–2026)" signal="yellow" interp="ERP at 1.5% is slim but positive. In 1999 it went NEGATIVE. Today investors are still compensated for equity risk — the defining irrationality of 2000 isn't present.">
        <AC data={erpD} color={t.blue} id="eF" name="ERP %" yFmt={v => `${v}%`} refY={0} refLabel="Zero (Danger)" refColor={t.red} />
      </ChartCard>
    </div>
  );
}

function TabMktStr() {
  const t = useT();
  return (
    <div>
      <h2 style={{fontSize:22,fontWeight:800,color:t.text,marginBottom:4}}>Market Structure & Breadth</h2>
      <p style={{color:t.textMuted,fontSize:13,marginBottom:16}}>How narrow is the rally and how much leverage exists?</p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:16}}>
        <Card><StatBox label="Top 10" value="39%" sub="vs 19% avg" color={t.red} /></Card>
        <Card><StatBox label="Margin Debt" value="$1.28T" sub="Record" color={t.red} /></Card>
        <Card><StatBox label="Margin/Cap" value="1.85%" sub="Below 2000" color={t.green} /></Card>
      </div>
      {[4,5,6].map(i => <Explainer key={i} title={MS[i].nm} info={MS[i].info} calc={MS[i].calc} />)}
      <ChartCard title="Top 10 Concentration (1990–2026)" signal="red" interp="At 39%, exceeds 2000's 27%. But top 10 generate 32.5% of earnings — the premium is earned. Idiosyncratic risk is real: one NVIDIA miss moves the index.">
        <AC data={conc} color={t.purple} id="coF" name="Top 10 %" yFmt={v => `${v}%`} refY={27} refLabel="2000: 27%" refColor={t.yellow} />
      </ChartCard>
      <ChartCard title="FINRA Margin Debt ($B)" signal="red" interp="Record $1.28T but as % of market cap (1.85%), below 2000 (2.5%) and 2008 (2.7%). Relative leverage is moderate.">
        <ResponsiveContainer>
          <BarChart data={mDebt}>
            <CartesianGrid strokeDasharray="3 3" stroke={t.gridStroke} />
            <XAxis dataKey="y" tick={{fontSize:10,fill:t.textDim}} />
            <YAxis tick={{fontSize:10,fill:t.textDim}} tickFormatter={v => `$${v}B`} />
            <Tooltip content={<ChartTip />} />
            <Bar dataKey="v" name="Margin ($B)" radius={[6,6,0,0]}>
              {mDebt.map((d,i) => <Cell key={i} fill={d.v > 900 ? t.red : d.v > 500 ? t.yellow : t.blue} fillOpacity={0.7} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}

function TabCredit() {
  const t = useT();
  return (
    <div>
      <h2 style={{fontSize:22,fontWeight:800,color:t.text,marginBottom:4}}>Credit & Debt Metrics</h2>
      <p style={{color:t.textMuted,fontSize:13,marginBottom:16}}>Credit is the lifeblood of bubbles. 2008 was a credit crisis.</p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:16}}>
        <Card><StatBox label="Yield Curve" value="+25bp" sub="Re-steepened" color={t.yellow} /></Card>
        <Card><StatBox label="HY Spread" value="3.3%" sub="vs 4.9% avg" color={t.yellow} /></Card>
        <Card><StatBox label="HH Debt/Inc" value="88%" sub="vs 133% (2008)" color={t.green} /></Card>
      </div>
      {[7,8,9].map(i => <Explainer key={i} title={MS[i].nm} info={MS[i].info} calc={MS[i].calc} />)}
      <ChartCard title="Yield Curve: 10Y − 2Y" signal="yellow" interp="Deeply inverted 2022-24, re-steepened to +25bp. The economy absorbed rate hikes without recession. Cautiously positive.">
        <ResponsiveContainer>
          <ComposedChart data={ycD}>
            <CartesianGrid strokeDasharray="3 3" stroke={t.gridStroke} />
            <XAxis dataKey="y" tick={{fontSize:10,fill:t.textDim}} />
            <YAxis tick={{fontSize:10,fill:t.textDim}} tickFormatter={v => `${v}%`} />
            <Tooltip content={<ChartTip />} />
            <ReferenceLine y={0} stroke={t.red} strokeWidth={2} label={{value:"Inversion",fill:t.red,fontSize:10}} />
            <Area type="monotone" dataKey="v" fill={t.blue} fillOpacity={0.06} stroke="none" />
            <Line type="monotone" dataKey="v" stroke={t.cyan} strokeWidth={2.5} dot={{r:3,fill:t.cyan}} name="10Y-2Y %" />
          </ComposedChart>
        </ResponsiveContainer>
      </ChartCard>
      <ChartCard title="HY Credit Spreads" signal="yellow" interp="At 3.3%, below 20Y avg of 4.9%. Calm — possibly too calm. Before 2008 spreads were 2.6% → exploded to 21.8%.">
        <AC data={hyD} color={t.orange} id="hF" name="HY Spread %" yFmt={v => `${v}%`} refY={4.9} refLabel="20Y Avg" />
      </ChartCard>
      <ChartCard title="Household Debt-to-Income" signal="green" interp="At 88%, lowest in 30+ years. The single strongest 'not a bubble' argument. FICO ~740, 95%+ fixed-rate. Consumer is healthy.">
        <AC data={hhD} color={t.green} id="hhF" name="Debt/Inc %" yFmt={v => `${v}%`} domainY={[40,140]} refY={133} refLabel="2008 Peak" refColor={t.red} />
      </ChartCard>
    </div>
  );
}

function TabMacro() {
  const t = useT();
  return (
    <div>
      <h2 style={{fontSize:22,fontWeight:800,color:t.text,marginBottom:4}}>Macro Fundamentals</h2>
      <p style={{color:t.textMuted,fontSize:13,marginBottom:16}}>Does the real economy support prices?</p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:16}}>
        <Card><StatBox label="EPS Growth" value="+15.3%" color={t.green} /></Card>
        <Card><StatBox label="GDP" value="~2.5%" color={t.green} /></Card>
        <Card><StatBox label="Unemp." value="4.4%" color={t.green} /></Card>
        <Card><StatBox label="Core CPI" value="2.6%" color={t.yellow} /></Card>
      </div>
      {[10,11].map(i => <Explainer key={i} title={MS[i].nm} info={MS[i].info} calc={MS[i].calc} />)}
      <Card style={{marginBottom:20,borderLeft:`3px solid ${t.green}`}}>
        <h3 style={{margin:"0 0 6px",fontSize:14,fontWeight:700,color:t.green}}>Assessment: Fundamentally Sound</h3>
        <p style={{margin:0,fontSize:13,lineHeight:1.7,color:t.textMuted}}>EPS growing 15.3% on real 8% revenue. GDP expanding, unemployment stable, inflation cooling. In 2000 earnings fell; in 2008 the economy contracted. Today, reality follows the prices.</p>
      </Card>
      <ChartCard title="S&P 500 Earnings Growth" signal="green" interp="Six consecutive quarters of double-digit growth. CY 2026 consensus: 15.3%. This durability is unlike any prior bubble peak.">
        <ResponsiveContainer>
          <BarChart data={epsQ}>
            <CartesianGrid strokeDasharray="3 3" stroke={t.gridStroke} />
            <XAxis dataKey="q" tick={{fontSize:9,fill:t.textDim}} />
            <YAxis tick={{fontSize:10,fill:t.textDim}} tickFormatter={v => `${v}%`} />
            <Tooltip content={<ChartTip />} />
            <Bar dataKey="g" name="EPS Growth %" radius={[6,6,0,0]}>
              {epsQ.map((d,i) => <Cell key={i} fill={i >= 6 ? t.blue : t.green} fillOpacity={0.7} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}

function TabMoney() {
  const t = useT();
  return (
    <div>
      <h2 style={{fontSize:22,fontWeight:800,color:t.text,marginBottom:4}}>Monetary Policy & Liquidity</h2>
      <p style={{color:t.textMuted,fontSize:13,marginBottom:16}}>The Fed almost always pops the bubble.</p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:16}}>
        <Card><StatBox label="Fed Funds" value="3.6%" color={t.green} /></Card>
        <Card><StatBox label="M2" value="$21.8T" sub="+4.6% YoY" color={t.yellow} /></Card>
        <Card><StatBox label="Fed BS" value="$6.5T" sub="Down from $9T" color={t.yellow} /></Card>
      </div>
      {[12,13,14].map(i => <Explainer key={i} title={MS[i].nm} info={MS[i].info} calc={MS[i].calc} />)}
      <ChartCard title="M2 Money Supply ($T)" signal="yellow" interp="Exploded +40% during COVID. Now $21.8T growing 4.6% YoY. Liquidity remains historically elevated.">
        <AC data={m2D} color={t.cyan} id="m2F" name="M2 ($T)" yFmt={v => `$${v}T`} />
      </ChartCard>
      <ChartCard title="Fed Balance Sheet ($T)" signal="yellow" interp="Peaked $8.8T, now $6.5T via QT. Still 7x pre-2008. Orderly unwinding. Risk: forced pivot to QE.">
        <AC data={fedB} color={t.purple} id="feF" name="Fed BS ($T)" yFmt={v => `$${v}T`} />
      </ChartCard>
    </div>
  );
}

function TabSent() {
  const t = useT();
  return (
    <div>
      <h2 style={{fontSize:22,fontWeight:800,color:t.text,marginBottom:4}}>Sentiment</h2>
      <p style={{color:t.textMuted,fontSize:13,marginBottom:16}}>Capturing "irrational exuberance" — or the lack thereof.</p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:16}}>
        <Card><StatBox label="VIX" value="~22" color={t.yellow} /></Card>
        <Card><StatBox label="UMich" value="56.4" sub="Below avg" color={t.yellow} /></Card>
        <Card><StatBox label="IPOs" value="Subdued" color={t.green} /></Card>
      </div>
      <Explainer title={MS[15].nm} info={MS[15].info} calc={MS[15].calc} />
      <ChartCard title="VIX (1995–2026)" signal="yellow" interp="VIX ~22 near average. Pre-bubble VIX was LOW (9-11) = complacency. Today's moderate reading is healthier. Meme mania has cooled.">
        <AC data={vixD} color={t.yellow} id="vF" name="VIX" refY={20} refLabel="Avg ~20" />
      </ChartCard>
      <Card style={{borderLeft:`3px solid ${t.green}`}}>
        <h3 style={{margin:"0 0 6px",fontSize:14,fontWeight:700,color:t.green}}>Verdict: No Mania</h3>
        <p style={{margin:0,fontSize:13,lineHeight:1.7,color:t.textMuted}}>No euphoric hallmarks. Sentiment below average, IPOs subdued, SPACs collapsed. Prevailing narrative is caution — contrarian bullish.</p>
      </Card>
    </div>
  );
}

function TabHousing() {
  const t = useT();
  return (
    <div>
      <h2 style={{fontSize:22,fontWeight:800,color:t.text,marginBottom:4}}>Housing</h2>
      <p style={{color:t.textMuted,fontSize:13,marginBottom:16}}>2008 was a housing bubble. Is today different?</p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:16}}>
        <Card><StatBox label="Case-Shiller" value="332" color={t.yellow} /></Card>
        <Card><StatBox label="YoY" value="+1.3%" color={t.green} /></Card>
        <Card><StatBox label="Avg FICO" value="~740" color={t.green} /></Card>
      </div>
      <Explainer title={MS[16].nm} info={MS[16].info} calc={MS[16].calc} />
      <ChartCard title="Case-Shiller HPI (1990–2026)" signal="yellow" interp="All-time high at 332 but driven by supply shortage, not reckless lending. FICO ~740, 95% fixed-rate. Growth decelerating to 1.3%.">
        <AC data={csD} color={t.orange} id="csF" name="HPI" refY={190} refLabel="2006 Peak" refColor={t.red} />
      </ChartCard>
    </div>
  );
}

function TabGlobal() {
  const t = useT();
  return (
    <div>
      <h2 style={{fontSize:22,fontWeight:800,color:t.text,marginBottom:4}}>Global & Structural Risk</h2>
      <p style={{color:t.textMuted,fontSize:13,marginBottom:16}}>Systemic vulnerabilities beyond the US market.</p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:16}}>
        <Card><StatBox label="Global Debt/GDP" value="338%" color={t.red} /></Card>
        <Card><StatBox label="US Debt/GDP" value="~124%" color={t.red} /></Card>
        <Card><StatBox label="Geopolitical" value="Elevated" color={t.yellow} /></Card>
      </div>
      <Explainer title={MS[17].nm} info={MS[17].info} calc={MS[17].calc} />
      <ChartCard title="Global Debt-to-GDP" signal="red" interp="At 338%, near records. Doesn't cause bubbles alone but makes downturns worse. Less fiscal room. Structural vulnerability, not trigger.">
        <AC data={gdD} color={t.red} id="gdF" name="Debt/GDP %" yFmt={v => `${v}%`} />
      </ChartCard>
    </div>
  );
}

function TabReport() {
  const t = useT();
  return (
    <div>
      <div style={{textAlign:"center",padding:"20px 0 28px",borderBottom:`1px solid ${t.border}`,marginBottom:28}}>
        <div style={{fontSize:10,color:t.accent,letterSpacing:3,textTransform:"uppercase",fontWeight:700}}>Equity Research Report</div>
        <h1 style={{fontSize:28,fontWeight:900,color:t.text,margin:"6px 0 4px"}}>Are We in a Bubble?</h1>
        <h2 style={{fontSize:15,fontWeight:400,color:t.textMuted,margin:0}}>A Multi-Factor Framework for Systemic Market Risk</h2>
        <div style={{fontSize:12,color:t.textDim,marginTop:10}}>March 18, 2026 · Dachi | Monticello Fund Research</div>
      </div>
      <div style={{maxWidth:660,margin:"0 auto",fontSize:14,lineHeight:1.8,color:t.textMuted}}>
        <Card style={{marginBottom:20,borderLeft:`3px solid ${t.yellow}`,padding:22}}>
          <h3 style={{margin:"0 0 6px",fontSize:15,fontWeight:700,color:t.yellow}}>Executive Summary</h3>
          <p style={{margin:0}}>18 metrics across 8 categories yield a composite score of <strong style={{color:t.yellow}}>{OS}/100</strong>: <strong style={{color:t.yellow}}>Elevated but Not in a Bubble</strong>. Valuations are historically extreme but structural differences distinguish today from prior peaks.</p>
        </Card>
        <Card style={{marginBottom:20,padding:16,background:t.bgCardAlt}}>
          <h4 style={{margin:"0 0 8px",fontSize:13,fontWeight:700,color:t.accent}}>Methodology</h4>
          <p style={{margin:0,fontSize:12,lineHeight:1.6}}>Each metric scored 0-100 based on: (1) current vs. historical average, (2) proximity to crisis peaks, (3) rate of change, (4) structural adjustments. Composite = unweighted average. Traffic lights reflect qualitative judgment informed by scores and context.</p>
        </Card>
        <h3 style={{fontSize:17,fontWeight:700,color:t.text,marginBottom:10}}>1. Bull Case</h3>
        <p><strong style={{color:t.green}}>Earnings are real.</strong> 15.3% EPS growth on 8% revenue. Mag 7 = $400B+ FCF. Top 10 = 32.5% of earnings, justifying 40% market cap.</p>
        <p><strong style={{color:t.green}}>Households healthy.</strong> 88% debt/income — lowest in 30+ years. FICO ~740, 95%+ fixed-rate.</p>
        <p><strong style={{color:t.green}}>ERP positive.</strong> 1.5% vs negative in 2000.</p>
        <p><strong style={{color:t.green}}>Froth cooled.</strong> SPACs collapsed, IPOs subdued, sentiment below average.</p>
        <p><strong style={{color:t.green}}>No systemic mechanism.</strong> Banks well-capitalized (Basel III), credit orderly.</p>
        <h3 style={{fontSize:17,fontWeight:700,color:t.text,margin:"28px 0 10px"}}>2. Bear Case</h3>
        <p><strong style={{color:t.red}}>Extreme valuations.</strong> CAPE 38.1, Buffett 217% — all-time records.</p>
        <p><strong style={{color:t.red}}>Unprecedented concentration.</strong> Top 10 at 39% with passive feedback loop.</p>
        <p><strong style={{color:t.red}}>Credit complacency.</strong> HY spreads at 3.3% near historic tights.</p>
        <p><strong style={{color:t.yellow}}>AI capex risk.</strong> $300B+ committed; if returns disappoint, earnings evaporate.</p>
        <h3 style={{fontSize:17,fontWeight:700,color:t.text,margin:"28px 0 10px"}}>3. Historical Comparison</h3>
        <Card style={{marginBottom:20,padding:14}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
            <thead><tr style={{borderBottom:`2px solid ${t.border}`}}>{["Feature","1929","2000","2008","2026"].map(h => <th key={h} style={{padding:"7px 8px",textAlign:"left",color:h==="2026"?t.accent:t.textDim,fontWeight:700,fontSize:11}}>{h}</th>)}</tr></thead>
            <tbody>{[["Trigger","Margin","Tech mania","Subprime","TBD"],["Earnings","Cyclical","Fictional","Leveraged","Real"],["HH Leverage","Moderate","Moderate","133%","88%"],["Fed","Tightening","6.5%","5.25%","3.6%"],["Banks","Fragile","Stable","Failed","Strong"],["CAPE","32.6","44.2","27.5","38.1"]].map((r,i) => <tr key={i} style={{borderBottom:`1px solid ${t.border}44`}}>{r.map((c,j) => <td key={j} style={{padding:"7px 8px",color:j===0?t.text:j===4?t.accent:t.textMuted,fontWeight:j===0?600:400}}>{c}</td>)}</tr>)}</tbody>
          </table>
        </Card>
        <h3 style={{fontSize:17,fontWeight:700,color:t.text,margin:"28px 0 10px"}}>4. Scenarios</h3>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:16}}>
          {[{l:"Base",p:"55%",s:"green",d:"10-15% correction → recovery. 10Y returns 3-5% real."},{l:"Bull",p:"25%",s:"yellow",d:"AI boom validates multiples. CAPE compresses via earnings."},{l:"Bear",p:"20%",s:"red",d:"AI + credit event → 30-40% decline, 12-18mo."}].map((x,i) => (
            <Card key={i} style={{borderTop:`3px solid ${sigColor(x.s,t)}`,padding:14}}>
              <div style={{fontSize:10,color:sigColor(x.s,t),fontWeight:700,letterSpacing:1,textTransform:"uppercase"}}>{x.l} Case</div>
              <div style={{fontSize:24,fontWeight:900,color:sigColor(x.s,t),margin:"4px 0"}}>{x.p}</div>
              <div style={{fontSize:12,color:t.textMuted,lineHeight:1.5}}>{x.d}</div>
            </Card>
          ))}
        </div>
        <Card style={{margin:"20px 0",borderLeft:`3px solid ${t.accent}`,padding:22}}>
          <h3 style={{margin:"0 0 6px",fontSize:15,fontWeight:700,color:t.accent}}>Conclusion</h3>
          <p style={{margin:0}}>"Expensive" ≠ "bubble." A bubble requires disconnect between price and reality — that doesn't exist today. Companies profitable, consumers solvent, banks sound. Assessment: <strong style={{color:t.yellow}}>Elevated valuations with above-average correction risk, below the threshold of systemic bubble.</strong></p>
        </Card>
        <div style={{textAlign:"center",padding:"20px 0",borderTop:`1px solid ${t.border}`,marginTop:24}}>
          <p style={{fontSize:11,color:t.textDim}}>Monticello Fund Research · UVA Darden Capital Management<br />Data: FRED, FactSet, Shiller, S&P, FINRA, ICE BofA</p>
        </div>
      </div>
    </div>
  );
}

/* ══════════════ MAIN APP ══════════════ */
const TAB_COMPS = [null, TabEquity, TabMktStr, TabCredit, TabMacro, TabMoney, TabSent, TabHousing, TabGlobal, TabReport];

export default function App() {
  const [tab, setTab] = useState(0);
  const [isDark, setIsDark] = useState(true);
  const [fade, setFade] = useState(false);
  const scrollRef = useRef(null);
  const t = isDark ? themes.dark : themes.light;

  useEffect(() => { setFade(true); const x = setTimeout(() => setFade(false), 200); return () => clearTimeout(x); }, [tab]);
  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = 0; }, [tab]);

  const goTab = (i) => setTab(i);

  const ActiveTab = TAB_COMPS[tab];

  return (
    <Ctx.Provider value={t}>
      <div style={{minHeight:"100vh",background:t.bg,color:t.text,fontFamily:"'DM Sans',system-ui,sans-serif",transition:"background 0.4s,color 0.4s"}}>
        {/* Header */}
        <div style={{borderBottom:`1px solid ${t.border}`,background:t.headerBg,backdropFilter:"blur(14px)",position:"sticky",top:0,zIndex:50}}>
          <div style={{maxWidth:1200,margin:"0 auto",padding:"10px 20px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:8,height:8,borderRadius:"50%",background:t.yellow,boxShadow:`0 0 10px ${t.yellow}55`}} />
              <span style={{fontSize:14,fontWeight:800,letterSpacing:-0.5}}>BUBBLE RISK MONITOR</span>
              <span style={{fontSize:10,color:t.textDim,padding:"2px 6px",borderRadius:4,background:t.bgCardAlt,border:`1px solid ${t.border}`}}>v3</span>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:14}}>
              <span style={{fontSize:11,color:t.textDim}}>Mar 18, 2026</span>
              <button onClick={() => setIsDark(!isDark)} style={{position:"relative",width:50,height:26,borderRadius:13,border:`1px solid ${t.border}`,cursor:"pointer",padding:0,background:isDark?"linear-gradient(135deg,#1e293b,#334155)":"linear-gradient(135deg,#dbeafe,#c7d2fe)",transition:"all 0.3s"}}>
                <div style={{position:"absolute",top:2,left:isDark?26:2,width:20,height:20,borderRadius:"50%",background:isDark?"#fbbf24":"#4f46e5",transition:"all 0.3s cubic-bezier(0.4,0,0.2,1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11}}>{isDark?"☾":"☀"}</div>
              </button>
            </div>
          </div>
          <div style={{maxWidth:1200,margin:"0 auto",padding:"0 20px",display:"flex",overflowX:"auto"}}>
            {tabNames.map((n,i) => (
              <button key={i} onClick={() => setTab(i)} style={{padding:"9px 13px",fontSize:11,fontWeight:tab===i?700:500,color:tab===i?t.accent:t.textDim,background:"none",border:"none",cursor:"pointer",borderBottom:tab===i?`2px solid ${t.accent}`:"2px solid transparent",whiteSpace:"nowrap",fontFamily:"inherit"}}>{n}</button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div ref={scrollRef} style={{maxWidth:1200,margin:"0 auto",padding:"20px 20px 50px",opacity:fade?0.3:1,transition:"opacity 0.2s"}}>
          {tab === 0 ? <TabDash goTab={goTab} /> : ActiveTab ? <ActiveTab /> : null}
        </div>

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700;9..40,800;9..40,900&display=swap');
          * { box-sizing: border-box; }
          ::-webkit-scrollbar { height: 4px; width: 5px; }
          ::-webkit-scrollbar-track { background: transparent; }
          ::-webkit-scrollbar-thumb { background: ${t.border}; border-radius: 4px; }
        `}</style>
      </div>
    </Ctx.Provider>
  );
}
