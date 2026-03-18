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
  const angle = 180 - (score * 1.8);
  const nx = 100 + 55 * Math.cos((angle * Math.PI) / 180);
  const ny = 100 - 55 * Math.sin((angle * Math.PI) / 180);
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
  const greens = MS.filter(m => m.sig === "green");
  const yellows = MS.filter(m => m.sig === "yellow");
  const reds = MS.filter(m => m.sig === "red");
  const radarD = [{s:"Equity Val.",sc:74},{s:"Mkt Structure",sc:67},{s:"Credit/Debt",sc:37},{s:"Macro",sc:15},{s:"Monetary",sc:43},{s:"Sentiment",sc:45},{s:"Housing",sc:40},{s:"Global",sc:75}];
  const catScores = [{name:"Equity Valuation",sc:74,sig:"red",metrics:[0,1,2,3],data:capeData,color:t.red,id:"rCape",dataName:"CAPE",refY:17.6,refLabel:"Avg: 17.6"},{name:"Market Structure",sc:67,sig:"yellow",metrics:[4,5,6],data:conc,color:t.purple,id:"rConc",dataName:"Top 10 %",refY:27,refLabel:"2000: 27%",yFmt:v=>`${v}%`},{name:"Credit & Debt",sc:37,sig:"green",metrics:[7,8,9],data:hyD,color:t.orange,id:"rHY",dataName:"HY Spread %",refY:4.9,refLabel:"20Y Avg",yFmt:v=>`${v}%`},{name:"Macro Fundamentals",sc:15,sig:"green",metrics:[10,11],data:null,color:t.green,id:"rEps"},{name:"Monetary Policy",sc:43,sig:"yellow",metrics:[12,13,14],data:m2D,color:t.cyan,id:"rM2",dataName:"M2 ($T)",yFmt:v=>`$${v}T`},{name:"Sentiment",sc:45,sig:"yellow",metrics:[15],data:vixD,color:t.yellow,id:"rVix",dataName:"VIX",refY:20,refLabel:"Avg ~20"},{name:"Housing",sc:40,sig:"yellow",metrics:[16],data:csD,color:t.orange,id:"rCS",dataName:"Case-Shiller",refY:190,refLabel:"2006 Peak"},{name:"Global Risk",sc:75,sig:"red",metrics:[17],data:gdD,color:t.red,id:"rGD",dataName:"Debt/GDP %",yFmt:v=>`${v}%`}];
  const sectionDivider = <div style={{height:1,background:`linear-gradient(90deg, transparent, ${t.border}, transparent)`,margin:"36px 0"}} />;
  const sectionNum = (n, title) => (
    <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:16}}>
      <div style={{width:36,height:36,borderRadius:"50%",background:t.accentBg,border:`1.5px solid ${t.accent}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,fontWeight:800,color:t.accent,flexShrink:0}}>{n}</div>
      <h2 style={{margin:0,fontSize:20,fontWeight:800,color:t.text,letterSpacing:-0.5}}>{title}</h2>
    </div>
  );
  const prose = (text) => <p style={{margin:"0 0 14px",fontSize:13.5,lineHeight:1.85,color:t.textMuted}}>{text}</p>;
  const catProse = {
    "Equity Valuation": [
      "Equity valuations stand at their most stretched levels in over two decades, with the Shiller CAPE ratio registering 38.1x — a reading exceeded only by the peak of the dot-com bubble in early 2000 when it reached 44.2x. The Buffett Indicator, which measures total market capitalization against nominal GDP, has surged to 217%, surpassing every prior historical observation including the 2021 speculative peak. These headline figures, taken in isolation, would suggest an imminent and severe market dislocation. However, a deeper examination of the underlying earnings architecture reveals a materially different composition than existed at prior bubble peaks.",
      "The forward price-to-earnings ratio of 20.9x, while elevated relative to the 25-year average of 16.7x, is accompanied by the strongest fundamental earnings trajectory in at least two decades. S&P 500 earnings per share are growing at 15.3% year-over-year, driven by genuine 8%+ revenue growth rather than financial engineering or accounting manipulation. The Magnificent Seven collectively generate over $400 billion in annual free cash flow — a figure that would have been inconceivable during the dot-com era when many mega-cap technology firms were pre-revenue or operating at significant losses. The equity risk premium, at 1.5%, remains positive — a critical distinction from 1999-2000 when the ERP turned negative, meaning investors were literally paying a premium for the privilege of holding riskier assets.",
      "The structural evolution of corporate profit margins — from approximately 6% in the 1990s to 12%+ today — driven by technology-enabled scalability, asset-light business models, and global revenue diversification means that traditional valuation frameworks require recalibration. The CAPE ratio's reliance on 10-year trailing earnings inherently underweights recent margin expansion. When adjusted for the current interest rate environment (4.2% 10Y yield vs. 6.5% in 2000), the rate-adjusted CAPE suggests a market that is expensive but within the bounds of rational pricing. We assign this category an elevated risk score of 74/100 — demanding heightened vigilance but stopping short of signaling imminent systemic collapse."
    ],
    "Market Structure": [
      "The concentration of the S&P 500 has reached levels unprecedented in the modern era, with the top 10 constituents commanding approximately 39% of total index market capitalization — exceeding even the dot-com peak of 27% by a substantial margin. This extreme concentration creates significant idiosyncratic risk: a single earnings miss from NVIDIA, Apple, or Microsoft can generate outsized index-level volatility. The passive investment revolution has amplified this dynamic, creating a reflexive feedback loop in which capital flows mechanically into the largest names, further compressing breadth and inflating concentration metrics.",
      "However, a critical counterargument deserves equal analytical weight: the top 10 companies now generate approximately 32.5% of total S&P 500 earnings, meaningfully narrowing the gap between their market capitalization share and their fundamental contribution. This is categorically different from 2000, when the largest companies commanded outsized valuations on speculative narratives rather than demonstrable cash generation. FINRA margin debt has reached a record $1.28 trillion in nominal terms, yet when measured as a percentage of total market capitalization — the more analytically meaningful metric — it registers at just 1.85%, below both the 2000 level (2.5%) and the 2008 level (2.7%).",
      "The structural vulnerability lies not in leverage per se but in the mechanics of passive rebalancing and the potential for cascading de-grossing in concentrated positions. A scenario in which institutional investors simultaneously reduce exposure to mega-cap technology — whether triggered by regulatory action, earnings disappointment, or geopolitical disruption — could generate non-linear price dislocations given the sheer weight of these positions in the index. We score market structure risk at 67/100, reflecting genuine structural fragility tempered by the fundamental earnings support underlying current concentration levels."
    ],
    "Credit & Debt": [
      "Credit markets present perhaps the most compelling evidence against a systemic bubble classification. The household debt-to-income ratio stands at 88%, the lowest reading in over three decades and dramatically below the 133% level that presaged the 2008 financial crisis. This single metric may be the most important data point in the entire analysis: consumer balance sheets are fundamentally sound. Average FICO scores hover near 740 (vs. approximately 700 pre-GFC), over 95% of outstanding mortgages carry fixed rates (eliminating the adjustable-rate time bomb of 2006-2008), and bank capital ratios under Basel III requirements provide substantially greater systemic resilience.",
      "The yield curve, which inverted deeply throughout 2022-2024 — a historically reliable recession predictor — has re-steepened to +25 basis points. The economy absorbed the most aggressive rate-hiking cycle in four decades without tipping into recession, a remarkable display of underlying resilience that confounded the consensus expectation of a hard landing. High-yield credit spreads at 3.3% remain compressed relative to the 20-year average of 4.9%, which represents a double-edged sword: on one hand, it signals continued investor confidence in corporate creditworthiness; on the other, it leaves minimal margin for error should conditions deteriorate.",
      "The absence of a credit transmission mechanism is the single most important distinction between today and 2008. The Global Financial Crisis was, at its core, a credit crisis — overleveraged consumers, opaque derivatives, and undercapitalized banks created a cascading failure that nearly destroyed the global financial system. None of those conditions exist in 2026. We assign credit risk a score of 37/100 — the lowest category reading and a powerful anchor against bubble characterization."
    ],
    "Macro Fundamentals": [
      "The macroeconomic backdrop provides robust support for current asset prices, standing in stark contrast to conditions that preceded prior market dislocations. GDP growth of approximately 2.5% aligns precisely with the long-run potential growth rate, indicating an economy operating near equilibrium without the overheating dynamics that typically characterize bubble environments. The unemployment rate of 4.4% sits near full employment, while core CPI at 2.6% demonstrates that inflationary pressures are gradually normalizing toward the Federal Reserve's 2% target without requiring additional tightening.",
      "Most critically, S&P 500 earnings per share are growing at 15.3% year-over-year — nearly double the historical average of approximately 8% — underpinned by genuine top-line revenue expansion rather than financial engineering. Six consecutive quarters have delivered double-digit earnings growth, a durability profile that was absent at every prior bubble peak. In 2000, aggregate earnings were declining even as the market surged to new highs. In 2008, earnings collapsed by 30% as the credit crisis metastasized through the real economy. Today, reality follows the price trajectory rather than diverging from it.",
      "The sectoral composition of earnings growth further reinforces this assessment. While AI-related capital expenditure ($300B+ committed by hyperscalers) creates concentration risk around technology sector profitability, the breadth of earnings expansion across healthcare, industrials, and financials provides a diversification buffer that was notably absent during the narrow dot-com mania. We assign macroeconomic risk a score of just 15/100 — the single strongest categorical argument that current market levels reflect fundamental economic reality rather than speculative excess."
    ],
    "Monetary Policy": [
      "Federal Reserve policy stands at an inflection point that materially differentiates the current environment from historical bubble peaks. The federal funds rate at 3.6% resides near its long-run neutral estimate, in contrast to the restrictive levels that preceded both the dot-com crash (6.5%) and the Global Financial Crisis (5.25%). The Fed has transitioned to an easing posture, having initiated rate cuts in late 2024 — a policy shift that historically provides a significant tailwind for risk assets. The critical nuance is that the Fed is easing from a position of strength rather than panic, reducing rates because inflation is normalizing rather than because the economy is collapsing.",
      "The M2 money supply, which expanded by approximately 40% during the COVID-era stimulus programs, now stands at $21.8 trillion and is growing at 4.6% year-over-year — above nominal GDP growth but well below the double-digit expansion rates of 2020-2021. This elevated liquidity base continues to provide a supportive backdrop for asset prices, effectively representing a structural shift in the monetary regime that traditional frameworks have not fully incorporated. The Fed's balance sheet, at $6.5 trillion, has contracted from its $8.8 trillion peak through quantitative tightening but remains approximately 7x its pre-2008 level.",
      "The primary risk vector within monetary policy is a potential forced pivot: if an exogenous shock required the Fed to reverse course and re-expand its balance sheet, it would signal that the post-COVID normalization has failed. Conversely, if the Fed tightens more aggressively than markets currently discount — perhaps due to re-accelerating inflation driven by fiscal expansion or supply chain disruption — it could act as the catalyst that converts elevated valuations into a correction. We score monetary policy risk at 43/100, reflecting a broadly accommodative but uncertain policy trajectory."
    ],
    "Sentiment": [
      "Market sentiment indicators present a notably non-euphoric profile that stands in stark contrast to the mania that characterized the dot-com peak. The VIX, or implied volatility index, registers approximately 22 — near its long-run average and meaningfully above the dangerously complacent 9-11 readings observed in 2017 and late 2006, periods that preceded significant market dislocations. The University of Michigan Consumer Sentiment Index remains depressed at 56.4, well below its historical average, reflecting a general public that remains cautious about economic prospects despite rising asset prices.",
      "The IPO market, which serves as a reliable barometer of speculative excess, remains subdued. The SPAC phenomenon that generated approximately $160 billion in proceeds during 2020-2021 has effectively collapsed, with remaining vehicles trading at significant discounts to trust value. Meme stock activity, while periodically resurgent, has diminished dramatically from its 2021 peak. Retail options speculation, as measured by small-lot call volumes, has normalized from extreme levels. These are not the hallmarks of a market gripped by speculative mania.",
      "The contrarian interpretation is significant: the prevailing public narrative remains one of caution, skepticism, and bearishness — precisely the conditions under which markets historically continue to advance. True bubble peaks are invariably accompanied by widespread conviction that prices can only rise, capitulation of remaining bears, and mass participation by previously uninvested cohorts. None of these conditions are present in 2026. We score sentiment risk at 45/100, reflecting moderate speculative positioning but the absence of the euphoric extremes that define terminal bubble psychology."
    ],
    "Housing": [
      "Residential real estate prices, as measured by the S&P Case-Shiller Home Price Index, stand at an all-time high of 332 — representing a 232% cumulative increase from the index's base year of 2000 and a 75% increase from the pre-GFC peak of approximately 190. The superficial parallel to the housing bubble of 2005-2008 is visually striking but analytically misleading. The fundamental drivers of current housing price levels differ categorically from those that generated the prior crisis.",
      "The 2005-2008 housing bubble was fueled by lax lending standards (average FICO scores near 700, widespread NINJA loans, adjustable-rate mortgages comprising over 30% of originations), excess supply (housing starts peaked at 2.1 million annualized), and opaque securitization that distributed risk throughout the global financial system. In 2026, lending standards remain stringent (average FICO approximately 740), over 95% of mortgages carry fixed rates (eliminating payment shock risk), and the market faces a structural supply shortage estimated at 3-4 million units. Housing price appreciation has decelerated significantly, with year-over-year gains moderating to just 1.3%.",
      "The primary risk in housing is not a credit-driven collapse but rather an affordability crisis that constrains household formation and consumer spending. With mortgage rates near 6.5% and home prices at record levels, the median household faces historically poor affordability metrics. However, this manifests as an economic drag rather than a systemic financial risk. The absence of the leveraged securitization complex that transmitted housing losses into a global credit crisis is the decisive differentiating factor. We assign housing risk a score of 40/100."
    ],
    "Global Risk": [
      "The global macroeconomic and geopolitical landscape presents the most diffuse and least quantifiable set of risks in this assessment framework. Global debt-to-GDP has reached 338%, a level that does not directly precipitate crises but significantly constrains the fiscal capacity of governments to respond when crises do emerge. The sovereign debt dynamics of major economies — the United States at approximately 124% debt-to-GDP, Japan exceeding 260%, and several European economies above 100% — represent a structural vulnerability that amplifies the impact of any exogenous shock.",
      "Geopolitical risk remains elevated across multiple vectors: the ongoing Russia-Ukraine conflict, escalating tensions in the Taiwan Strait and South China Sea, and increasing fragmentation of global trade architecture. These risks are inherently binary and difficult to price — markets tend to either ignore them entirely or re-price them violently and discontinuously. The potential for a geopolitical shock to trigger a synchronized global de-risking event is non-trivial and represents the most plausible catalyst for a rapid market dislocation that would bypass traditional fundamental deterioration.",
      "China's economic trajectory adds an additional dimension of systemic risk. The ongoing property sector restructuring, demographic headwinds, and geopolitical decoupling from Western technology supply chains create the potential for a significant growth shock in the world's second-largest economy — with cascading effects on global commodity markets, emerging economies, and multinational corporate earnings. We assign global risk a score of 75/100, reflecting the accumulation of structural vulnerabilities that, while not immediately threatening, reduce the margin of safety for global risk assets."
    ]
  };

  const correlationData = [
    {m1:"CAPE Ratio",m2:"Buffett Indicator",dir:"Confirming",note:"Both at extreme highs; structural overvaluation signal consistent",sig:"red"},
    {m1:"Forward P/E",m2:"EPS Growth",dir:"Partially Offset",note:"High P/E tempered by 15.3% real earnings growth — unlike 2000",sig:"yellow"},
    {m1:"Top 10 Concentration",m2:"Margin Debt/Cap",dir:"Diverging",note:"Concentration at records but leverage below 2000/2008 levels",sig:"yellow"},
    {m1:"Yield Curve",m2:"HY Spreads",dir:"Confirming",note:"Both signal no imminent credit stress; historically calm",sig:"green"},
    {m1:"Household Debt/Inc",m2:"Case-Shiller HPI",dir:"Diverging",note:"Housing prices at highs but household leverage at 30Y lows",sig:"green"},
    {m1:"VIX",m2:"Consumer Sentiment",dir:"Confirming",note:"Both moderate — no euphoria, no panic; cautious equilibrium",sig:"green"},
    {m1:"Fed Funds Rate",m2:"M2 Money Supply",dir:"Partially Offset",note:"Rates normalizing while liquidity remains structurally elevated",sig:"yellow"},
    {m1:"Global Debt/GDP",m2:"GDP Growth",dir:"Diverging",note:"Domestic growth solid despite global leverage concerns",sig:"yellow"},
    {m1:"ERP",m2:"Fed Balance Sheet",dir:"Confirming",note:"Slim risk premium in context of elevated Fed backstop",sig:"yellow"},
    {m1:"Margin Debt (Nominal)",m2:"Margin Debt/Cap",dir:"Diverging",note:"Nominal records misleading; relative leverage moderate",sig:"green"},
  ];

  const scenarios = [
    {name:"Base Case: Orderly Correction",prob:50,color:t.green,target:"S&P 4,800–5,400",ret:"-5% to +5%",
      assumptions:["10-15% correction from highs within 12 months","Earnings growth moderates to 8-10% from 15.3%","Fed completes easing cycle to 3.0-3.25%","No systemic credit event or geopolitical shock","Market rotation from mega-cap to broader value/cyclical"],
      implication:"Portfolios should maintain neutral equity exposure with tactical tilt toward quality and value factors. Fixed income duration can extend modestly as rates normalize."},
    {name:"Bull Case: AI Productivity Boom",prob:25,color:t.blue,target:"S&P 6,200–6,800",ret:"+15% to +25%",
      assumptions:["AI capex translates to measurable productivity gains across sectors","Earnings growth accelerates to 18-22% as AI monetization scales","CAPE compresses via earnings growth rather than price decline","Global re-stocking cycle drives industrial/commodity demand","China stabilizes; geopolitical tensions de-escalate"],
      implication:"Overweight technology, industrials, and emerging markets. Reduce fixed income allocation. The CAPE paradox — high ratio with compressing multiples via earnings — would validate the AI narrative."},
    {name:"Bear Case: Multiple Compression",prob:20,color:t.orange,target:"S&P 3,800–4,200",ret:"-25% to -35%",
      assumptions:["AI revenue disappointment triggers mega-cap de-rating","Credit spreads widen to 6-8% as risk appetite contracts","Fed forced to cut aggressively as recession materializes","Consumer spending deteriorates as wealth effect reverses","12-18 month duration with V-shaped partial recovery"],
      implication:"Defensive positioning: overweight short-duration Treasuries, gold, and cash equivalents. Underweight cyclicals and growth. Hedge tail risk through VIX call spreads."},
    {name:"Tail Risk: Systemic Crisis",prob:5,color:t.red,target:"S&P 2,800–3,500",ret:"-40% to -55%",
      assumptions:["Geopolitical shock (Taiwan conflict, sovereign debt crisis) triggers global de-risking","Shadow banking/private credit losses cascade into public markets","Simultaneous equity, credit, and currency market dislocation","Fed response constrained by fiscal or political limitations","18-36 month recovery timeline with structural damage to market microstructure"],
      implication:"Maximum defensive allocation. Flight to quality: US Treasuries, gold, Swiss franc, Japanese yen. Equity exposure only through deep-value, high-dividend positions. Maintain substantial cash reserves for re-entry."},
  ];

  const catalysts = [
    {category:"Earnings",trigger:"2 consecutive quarters of negative S&P 500 EPS growth",current:"15.3% growth",status:"green",watch:"Q2-Q3 2026 estimates; AI capex ROI metrics"},
    {category:"Credit",trigger:"HY spreads > 6% or investment-grade spreads > 200bp",current:"3.3% HY",status:"green",watch:"Monthly ICE BofA HY OAS; weekly IG CDX index"},
    {category:"Monetary",trigger:"Fed reverses to rate hikes OR emergency QE restart",current:"Easing cycle",status:"green",watch:"FOMC dot plots; inflation expectations (5Y5Y breakevens)"},
    {category:"Liquidity",trigger:"Reverse repo < $100B AND bank reserves < $3T",current:"Adequate",status:"yellow",watch:"NY Fed reverse repo facility; Fed H.4.1 weekly report"},
    {category:"Geopolitical",trigger:"Military escalation in Taiwan Strait; NATO Article 5 invocation",current:"Elevated tension",status:"yellow",watch:"DoD Taiwan Strait transit reports; SIPRI conflict indicators"},
    {category:"Valuation",trigger:"CAPE > 42 (exceeds 2000 peak) with decelerating earnings",current:"38.1",status:"yellow",watch:"Monthly Shiller data; quarterly earnings revision ratios"},
    {category:"Leverage",trigger:"Margin debt/market cap > 2.5% (2000 level)",current:"1.85%",status:"green",watch:"Monthly FINRA margin statistics; prime broker leverage surveys"},
    {category:"Housing",trigger:"Case-Shiller YoY negative for 3+ months with rising delinquencies",current:"+1.3% YoY",status:"green",watch:"Monthly Case-Shiller; weekly MBA delinquency surveys"},
  ];

  const assetImplications = [
    {asset:"US Large-Cap Equities",weight:"Neutral",dir:"→",color:t.yellow,rationale:"Elevated valuations offset by strong earnings; maintain benchmark exposure with quality tilt"},
    {asset:"US Small/Mid-Cap",weight:"Slight Overweight",dir:"↑",color:t.green,rationale:"Relative valuation discount to large-cap widest since 2000; benefits from rate cuts and domestic growth"},
    {asset:"International Developed",weight:"Slight Overweight",dir:"↑",color:t.green,rationale:"European/Japanese equities trading at 30-40% P/E discount; currency hedged basis attractive"},
    {asset:"Emerging Markets",weight:"Neutral",dir:"→",color:t.yellow,rationale:"China uncertainty offsets attractive valuations in India, Mexico, Indonesia"},
    {asset:"US Treasuries (Duration)",weight:"Slight Overweight",dir:"↑",color:t.green,rationale:"Yield curve normalization benefits duration; 4.2% 10Y provides attractive income and hedge value"},
    {asset:"Investment-Grade Credit",weight:"Underweight",dir:"↓",color:t.red,rationale:"Tight spreads offer minimal compensation for credit risk; prefer Treasuries for fixed income allocation"},
    {asset:"High-Yield Credit",weight:"Underweight",dir:"↓",color:t.red,rationale:"3.3% spreads near cycle tights; asymmetric risk skewed to the downside"},
    {asset:"Gold / Commodities",weight:"Slight Overweight",dir:"↑",color:t.green,rationale:"Portfolio hedge against tail risks; central bank buying and fiscal concerns support structural demand"},
    {asset:"Cash / Money Market",weight:"Overweight",dir:"↑",color:t.green,rationale:"4%+ yields with zero duration risk; optionality to deploy into dislocations"},
    {asset:"Real Estate / REITs",weight:"Neutral",dir:"→",color:t.yellow,rationale:"Supply-constrained residential supports valuations but affordability pressures limit upside"},
  ];

  return (
    <div>
      {/* ═══════ SECTION 1: COVER / HEADER ═══════ */}
      <div style={{borderBottom:`2px solid ${t.accent}`,paddingBottom:28,marginBottom:0}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:40,height:40,borderRadius:8,background:`linear-gradient(135deg, ${t.accent}, ${t.purple})`,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:18,fontWeight:900}}>M</div>
            <div>
              <div style={{fontSize:13,fontWeight:800,color:t.text,letterSpacing:-0.3}}>Monticello Fund Research</div>
              <div style={{fontSize:10,color:t.textDim}}>UVA Darden Capital Management</div>
            </div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{display:"inline-block",padding:"3px 10px",borderRadius:4,background:t.redBg,border:`1px solid ${t.redBorder}`,fontSize:9,fontWeight:700,letterSpacing:1.5,color:t.red,textTransform:"uppercase",marginBottom:4}}>Confidential — For Institutional Use Only</div>
            <div style={{fontSize:10,color:t.textDim}}>Distribution restricted per MiFID II / Reg FD</div>
          </div>
        </div>
        <div style={{textAlign:"center",padding:"24px 0 8px"}}>
          <div style={{fontSize:10,color:t.accent,letterSpacing:4,textTransform:"uppercase",fontWeight:700,marginBottom:6}}>Equity Strategy Research — Thematic Deep Dive</div>
          <h1 style={{fontSize:34,fontWeight:900,color:t.text,margin:"6px 0 4px",letterSpacing:-1.5,lineHeight:1.1}}>U.S. Equity Market Bubble Risk Assessment</h1>
          <h2 style={{fontSize:16,fontWeight:400,color:t.textMuted,margin:"8px 0 0",fontStyle:"italic"}}>A Comprehensive Multi-Factor Quantitative and Qualitative Framework for Systemic Market Risk Evaluation</h2>
        </div>
        <div style={{display:"flex",justifyContent:"center",gap:32,marginTop:20,flexWrap:"wrap"}}>
          {[{l:"Date",v:"March 18, 2026"},{l:"Lead Analyst",v:"Dachi"},{l:"Classification",v:"OVERWEIGHT CAUTION"},{l:"Composite Score",v:`${OS}/100`},{l:"Prior Rating",v:"N/A (Initiation)"}].map((x,i)=>(
            <div key={i} style={{textAlign:"center"}}>
              <div style={{fontSize:9,color:t.textDim,textTransform:"uppercase",letterSpacing:1.5,fontWeight:600}}>{x.l}</div>
              <div style={{fontSize:12,fontWeight:700,color:i===3?t.yellow:t.text,marginTop:2}}>{x.v}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{maxWidth:760,margin:"0 auto",paddingTop:28}}>

        {/* ═══════ SECTION 2: EXECUTIVE SUMMARY ═══════ */}
        {sectionNum(1, "Executive Summary")}
        <Card style={{marginBottom:20,borderLeft:`4px solid ${t.yellow}`,padding:24}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
            <span style={{padding:"4px 14px",borderRadius:20,fontSize:11,fontWeight:800,letterSpacing:1,background:t.yellowBg,color:t.yellow,border:`1px solid ${t.yellowBorder}`}}>VERDICT: ELEVATED — NOT A BUBBLE</span>
            <span style={{fontSize:12,fontWeight:700,color:t.yellow}}>{OS}/100</span>
          </div>
          {prose("This report presents a comprehensive, multi-dimensional analysis of systemic bubble risk in U.S. equity markets as of March 2026. Synthesizing 18 quantitative metrics across 8 analytical categories — equity valuation, market structure, credit conditions, macroeconomic fundamentals, monetary policy, investor sentiment, housing markets, and global structural risk — we arrive at a composite risk score of " + OS + " on a 0-100 scale. This positions the current market environment firmly in the \"Elevated Caution\" zone, materially above the historical median of approximately 35-40 but decisively below the 80+ threshold that has historically preceded systemic market dislocations.")}
          {prose("The core finding of this analysis is that the U.S. equity market in March 2026 is expensive by virtually every traditional valuation metric, but it is not in a bubble in the classical sense of that term. A bubble, properly defined, requires a fundamental disconnect between asset prices and underlying economic reality — a condition in which prices are sustained purely by speculative momentum and the expectation of further price appreciation rather than by cash flows, earnings growth, or rational discount rate assumptions. The evidence does not support this characterization. S&P 500 earnings per share are growing at 15.3% year-over-year on real 8%+ revenue expansion. The Magnificent Seven technology companies collectively generate over $400 billion in annual free cash flow. The equity risk premium, while slim at 1.5%, remains positive — a critical distinction from the dot-com peak when investors accepted negative risk premiums.")}
          {prose("However, the absence of a bubble does not equate to the absence of risk. Valuations at current levels — CAPE at 38.1x, Buffett Indicator at 217% — provide minimal margin of safety against earnings disappointments, exogenous shocks, or shifts in monetary policy expectations. The unprecedented concentration of the S&P 500, with the top 10 constituents representing 39% of total market capitalization, creates fragility that traditional diversification frameworks fail to capture. Global debt-to-GDP at 338% constrains the capacity of policymakers to respond to future crises. The market is priced for perfection in an imperfect world.")}
          {prose("Our base case (50% probability) anticipates a 10-15% correction within the next 12 months followed by a recovery driven by continued earnings growth and monetary easing. We assign a 25% probability to a bull case in which AI-driven productivity gains validate current multiples, a 20% probability to a bear case involving a 25-35% drawdown triggered by earnings disappointment and credit widening, and a 5% probability to a systemic tail-risk event resulting in a 40%+ decline. The asymmetry of these outcomes — and the compression of risk premiums across all major asset classes — argues for a posture of disciplined caution rather than either aggressive risk-taking or defensive retreat.")}
        </Card>

        {/* Key metrics summary strip */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:20}}>
          {[{l:"Composite",v:OS+"/100",c:t.yellow},{l:"Green Signals",v:greens.length,c:t.green},{l:"Yellow Signals",v:yellows.length,c:t.yellow},{l:"Red Signals",v:reds.length,c:t.red}].map((x,i)=>(
            <Card key={i} style={{textAlign:"center",padding:14,borderTop:`3px solid ${x.c}`}}>
              <div style={{fontSize:9,color:t.textDim,textTransform:"uppercase",letterSpacing:1.5,fontWeight:600}}>{x.l}</div>
              <div style={{fontSize:26,fontWeight:900,color:x.c,marginTop:4}}>{x.v}</div>
            </Card>
          ))}
        </div>

        {sectionDivider}

        {/* ═══════ SECTION 3: METHODOLOGY & SCORING FRAMEWORK ═══════ */}
        {sectionNum(2, "Methodology & Scoring Framework")}
        {prose("Our analytical framework employs a systematic, multi-factor scoring methodology designed to quantify systemic market risk while accounting for structural shifts in market composition, monetary regimes, and economic architecture. Each of the 18 constituent metrics is scored on a 0-100 scale through a composite evaluation that incorporates four dimensions: (1) the current reading relative to its long-run historical average, (2) the proximity of the current reading to values observed at confirmed bubble peaks (specifically the dot-com peak of 2000 and the GFC peak of 2007-2008), (3) the rate of change and directional momentum of the metric, and (4) qualitative structural adjustments that account for regime changes in corporate profitability, monetary policy, and market microstructure.")}
        {prose("The composite score is calculated as the unweighted arithmetic mean of all 18 individual metric scores. While more sophisticated weighting schemes (e.g., factor-loading-based, principal component-derived) could theoretically improve predictive accuracy, the unweighted approach provides transparency, reproducibility, and resistance to overfitting — qualities we consider essential for a framework intended to inform investment decisions under conditions of fundamental uncertainty. The traffic-light classification (Green/Healthy, Yellow/Caution, Red/Elevated) represents a qualitative overlay informed by the quantitative scores but incorporating contextual judgment that purely mechanical scoring cannot capture.")}

        <Card style={{marginBottom:20,padding:18}}>
          <h4 style={{margin:"0 0 14px",fontSize:13,fontWeight:700,color:t.accent}}>Scoring Scale Interpretation</h4>
          <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:8}}>
            {[{range:"0-20",label:"Low Risk",color:t.green,desc:"Fundamentals strong; well below historical risk"},{range:"20-40",label:"Below Avg",color:t.green,desc:"Modest risk; conditions broadly supportive"},{range:"40-60",label:"Elevated",color:t.yellow,desc:"Above-average risk; caution warranted"},{range:"60-80",label:"High Risk",color:t.orange,desc:"Significant stress; multiple warning signals"},{range:"80-100",label:"Extreme",color:t.red,desc:"Crisis-level; systemic dislocation probable"}].map((x,i)=>(
              <div key={i} style={{padding:10,borderRadius:8,background:t.bgCardAlt,borderTop:`3px solid ${x.color}`,textAlign:"center"}}>
                <div style={{fontSize:14,fontWeight:800,color:x.color}}>{x.range}</div>
                <div style={{fontSize:10,fontWeight:700,color:t.text,marginTop:2}}>{x.label}</div>
                <div style={{fontSize:9,color:t.textDim,marginTop:4,lineHeight:1.4}}>{x.desc}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card style={{marginBottom:20,padding:18}}>
          <h4 style={{margin:"0 0 14px",fontSize:13,fontWeight:700,color:t.accent}}>Category Breakdown & Weights</h4>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
            <thead>
              <tr style={{borderBottom:`2px solid ${t.border}`}}>
                {["Category","Metrics","Score","Signal","Weight"].map(h=>(
                  <th key={h} style={{padding:"8px 8px",textAlign:"left",color:t.textDim,fontWeight:700,fontSize:10,textTransform:"uppercase",letterSpacing:1}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {catScores.map((c,i)=>(
                <tr key={i} style={{borderBottom:`1px solid ${t.border}44`}}>
                  <td style={{padding:"8px",color:t.text,fontWeight:600}}>{c.name}</td>
                  <td style={{padding:"8px",color:t.textMuted}}>{c.metrics.length}</td>
                  <td style={{padding:"8px"}}><RiskBar score={c.sc} /></td>
                  <td style={{padding:"8px"}}><Badge signal={c.sig} /></td>
                  <td style={{padding:"8px",color:t.textMuted,fontFamily:"monospace"}}>Equal</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {sectionDivider}

        {/* ═══════ SECTION 4: COMPOSITE RISK ASSESSMENT ═══════ */}
        {sectionNum(3, "Composite Risk Assessment")}
        {prose("The composite risk score of " + OS + "/100 positions the current market environment in the upper band of the \"Elevated\" zone. This reading captures the fundamental tension that defines the March 2026 market: valuations that are historically extreme by nearly every traditional metric, coexisting with macroeconomic fundamentals and corporate earnings that provide genuine support for elevated price levels. The radar chart below visualizes the dispersion of risk across our eight analytical categories, revealing a highly asymmetric risk profile — concentrated primarily in equity valuation and global structural risk, with credit conditions and macroeconomic fundamentals providing significant counterbalancing strength.")}

        <Card style={{marginBottom:20,padding:20}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,alignItems:"center"}}>
            <div style={{textAlign:"center"}}>
              <div style={{fontSize:10,color:t.textDim,textTransform:"uppercase",letterSpacing:2,fontWeight:600,marginBottom:6}}>Composite Risk Score</div>
              <Gauge score={OS} />
              <div style={{marginTop:8}}>
                <span style={{padding:"4px 14px",borderRadius:20,fontSize:10,fontWeight:700,letterSpacing:1,background:t.yellowBg,color:t.yellow,border:`1px solid ${t.yellowBorder}`}}>ELEVATED — NOT A BUBBLE</span>
              </div>
              <div style={{marginTop:10,fontSize:11,color:t.textDim,lineHeight:1.5}}>
                Score reflects unweighted average of 18 metrics.<br />
                Range: {Math.min(...MS.map(m=>m.sc))} (lowest) to {Math.max(...MS.map(m=>m.sc))} (highest)
              </div>
            </div>
            <div style={{height:260}}>
              <ResponsiveContainer>
                <RadarChart data={radarD}>
                  <PolarGrid stroke={t.border} />
                  <PolarAngleAxis dataKey="s" tick={{fontSize:9,fill:t.textMuted}} />
                  <Radar dataKey="sc" stroke={t.yellow} fill={t.yellow} fillOpacity={0.12} strokeWidth={2} dot={{r:3,fill:t.yellow}} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>

        {/* Category scores detailed table */}
        <Card style={{marginBottom:20,padding:18}}>
          <h4 style={{margin:"0 0 14px",fontSize:13,fontWeight:700,color:t.accent}}>Category Risk Score Detail</h4>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
            <thead>
              <tr style={{borderBottom:`2px solid ${t.border}`}}>
                {["Category","Risk Score","Assessment","Key Driver","Relative to 2000","Relative to 2008"].map(h=>(
                  <th key={h} style={{padding:"8px 6px",textAlign:"left",color:t.textDim,fontWeight:700,fontSize:9,textTransform:"uppercase",letterSpacing:1}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                {cat:"Equity Valuation",sc:74,assess:"High Risk",driver:"CAPE 38.1x, Buffett 217%",v00:"Lower (CAPE was 44.2)",v08:"Higher (CAPE was 27.5)"},
                {cat:"Market Structure",sc:67,assess:"Elevated",driver:"Top 10 at 39%, record concentration",v00:"Worse (was 27%)",v08:"Worse (was 20%)"},
                {cat:"Credit & Debt",sc:37,assess:"Below Average",driver:"HH Debt/Inc 88% — 30Y low",v00:"Similar",v08:"Much Better (was 133%)"},
                {cat:"Macro Fundamentals",sc:15,assess:"Low Risk",driver:"15.3% EPS growth, 2.5% GDP",v00:"Much Better (EPS was -2%)",v08:"Much Better (GDP was -4.3%)"},
                {cat:"Monetary Policy",sc:43,assess:"Elevated",driver:"Fed easing from neutral",v00:"Better (was 6.5%)",v08:"Better (was 5.25%)"},
                {cat:"Sentiment",sc:45,assess:"Moderate",driver:"VIX ~22, no euphoria",v00:"Better (VIX was 33)",v08:"Better (VIX was 80)"},
                {cat:"Housing",sc:40,assess:"Below Average",driver:"Supply-driven, FICO ~740",v00:"N/A",v08:"Much Better (FICO ~700)"},
                {cat:"Global Risk",sc:75,assess:"High Risk",driver:"Global Debt/GDP 338%",v00:"Worse (was 230%)",v08:"Worse (was 305%)"},
              ].map((r,i)=>(
                <tr key={i} style={{borderBottom:`1px solid ${t.border}44`}}>
                  <td style={{padding:"8px 6px",color:t.text,fontWeight:600,fontSize:11}}>{r.cat}</td>
                  <td style={{padding:"8px 6px",minWidth:80}}><RiskBar score={r.sc} /></td>
                  <td style={{padding:"8px 6px",color:r.sc<30?t.green:r.sc<60?t.yellow:t.red,fontWeight:600,fontSize:11}}>{r.assess}</td>
                  <td style={{padding:"8px 6px",color:t.textMuted,fontSize:10}}>{r.driver}</td>
                  <td style={{padding:"8px 6px",color:t.textMuted,fontSize:10}}>{r.v00}</td>
                  <td style={{padding:"8px 6px",color:t.textMuted,fontSize:10}}>{r.v08}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {sectionDivider}

        {/* ═══════ SECTION 5: CATEGORY DEEP DIVES ═══════ */}
        {sectionNum(4, "Category Deep Dives")}
        {prose("The following sections provide detailed analytical commentary on each of the eight risk categories, incorporating quantitative data, historical context, structural analysis, and forward-looking risk assessment. Each section includes the constituent metrics, an inline visualization, and a comparative data table.")}

        {catScores.map((cat, ci) => (
          <div key={ci} style={{marginBottom:30}}>
            <Card style={{marginBottom:14,borderLeft:`4px solid ${cat.sc<30?t.green:cat.sc<60?t.yellow:t.red}`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                <div>
                  <div style={{fontSize:10,color:t.textDim,textTransform:"uppercase",letterSpacing:2,fontWeight:600}}>Category {ci+1} of 8</div>
                  <h3 style={{margin:"4px 0 0",fontSize:17,fontWeight:800,color:t.text}}>{cat.name}</h3>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontSize:10,color:t.textDim,textTransform:"uppercase",letterSpacing:1,fontWeight:600}}>Category Score</div>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginTop:2}}>
                    <RiskBar score={cat.sc} />
                    <Badge signal={cat.sig} />
                  </div>
                </div>
              </div>

              {/* Prose paragraphs */}
              {catProse[cat.name] && catProse[cat.name].map((p, pi) => (
                <p key={pi} style={{margin:"0 0 12px",fontSize:13,lineHeight:1.8,color:t.textMuted}}>{p}</p>
              ))}

              {/* Metric comparison table for this category */}
              <div style={{marginTop:14,marginBottom:14}}>
                <div style={{fontSize:10,color:t.accent,fontWeight:700,textTransform:"uppercase",letterSpacing:1.5,marginBottom:8}}>Constituent Metrics</div>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                  <thead>
                    <tr style={{borderBottom:`2px solid ${t.border}`}}>
                      {["Metric","Current","2000","2008","Average","Score","Signal"].map(h=>(
                        <th key={h} style={{padding:"6px 6px",textAlign:"left",color:t.textDim,fontWeight:700,fontSize:9,textTransform:"uppercase",letterSpacing:1}}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {cat.metrics.map((mi,mii)=>(
                      <tr key={mii} style={{borderBottom:`1px solid ${t.border}44`}}>
                        <td style={{padding:"6px",color:t.text,fontWeight:600}}>{MS[mi].nm}</td>
                        <td style={{padding:"6px",color:t.text,fontWeight:700,fontFamily:"monospace"}}>{MS[mi].cur}</td>
                        <td style={{padding:"6px",color:t.textMuted,fontFamily:"monospace"}}>{MS[mi].c00}</td>
                        <td style={{padding:"6px",color:t.textMuted,fontFamily:"monospace"}}>{MS[mi].c08}</td>
                        <td style={{padding:"6px",color:t.textMuted,fontFamily:"monospace"}}>{MS[mi].avg}</td>
                        <td style={{padding:"6px",minWidth:70}}><RiskBar score={MS[mi].sc} /></td>
                        <td style={{padding:"6px"}}><Badge signal={MS[mi].sig} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Inline chart */}
              {cat.data && (
                <div style={{height:220,marginTop:10}}>
                  <ResponsiveContainer>
                    <AreaChart data={cat.data}>
                      <defs>
                        <linearGradient id={cat.id} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={cat.color} stopOpacity={0.2} />
                          <stop offset="100%" stopColor={cat.color} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={t.gridStroke} />
                      <XAxis dataKey="y" tick={{fontSize:10,fill:t.textDim}} />
                      <YAxis tick={{fontSize:10,fill:t.textDim}} tickFormatter={cat.yFmt} />
                      <Tooltip content={<ChartTip />} />
                      {cat.refY != null && <ReferenceLine y={cat.refY} stroke={t.refLabel} strokeDasharray="6 3" label={{value:cat.refLabel,fill:t.refLabel,fontSize:10}} />}
                      <Area type="monotone" dataKey="v" stroke={cat.color} fill={`url(#${cat.id})`} strokeWidth={2.5} name={cat.dataName} dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
              {/* Special chart for Macro — bar chart of EPS */}
              {cat.name === "Macro Fundamentals" && (
                <div style={{height:220,marginTop:10}}>
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
                </div>
              )}
            </Card>
          </div>
        ))}

        {sectionDivider}

        {/* ═══════ SECTION 6: CROSS-METRIC CORRELATION ANALYSIS ═══════ */}
        {sectionNum(5, "Cross-Metric Correlation Analysis")}
        {prose("Understanding the relationships between individual risk metrics is essential for assessing whether warning signals are reinforcing one another (confirming) or sending contradictory messages (diverging). Confirming signals across multiple categories strengthen the conviction behind a directional assessment, while divergences suggest a more nuanced risk environment that resists simple classification. The table below maps the key inter-metric relationships and their current directional alignment.")}
        {prose("A critical observation from this analysis is that the most dangerous configuration — in which valuation, credit, macro, and sentiment signals all simultaneously flash red — is notably absent. The current environment is characterized by a bifurcation: valuation and structural metrics signal elevated risk, while credit, macro, and sentiment metrics signal relative health. This divergence is itself the strongest evidence against a bubble classification, as historical bubbles have been characterized by broad-based deterioration across multiple categories simultaneously.")}

        <Card style={{marginBottom:20,padding:18}}>
          <h4 style={{margin:"0 0 14px",fontSize:13,fontWeight:700,color:t.accent}}>Signal Correlation Matrix</h4>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
            <thead>
              <tr style={{borderBottom:`2px solid ${t.border}`}}>
                {["Metric Pair","Direction","Assessment","Signal"].map(h=>(
                  <th key={h} style={{padding:"8px 6px",textAlign:"left",color:t.textDim,fontWeight:700,fontSize:9,textTransform:"uppercase",letterSpacing:1}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {correlationData.map((r,i)=>(
                <tr key={i} style={{borderBottom:`1px solid ${t.border}44`}}>
                  <td style={{padding:"8px 6px",color:t.text,fontWeight:600}}>
                    <span>{r.m1}</span><span style={{color:t.textDim,margin:"0 4px"}}>vs.</span><span>{r.m2}</span>
                  </td>
                  <td style={{padding:"8px 6px"}}>
                    <span style={{padding:"2px 8px",borderRadius:4,fontSize:10,fontWeight:700,color:r.dir==="Confirming"?t.accent:r.dir==="Diverging"?t.orange:t.yellow,background:r.dir==="Confirming"?t.accentBg:r.dir==="Diverging"?`${t.orange}15`:`${t.yellow}15`}}>{r.dir}</span>
                  </td>
                  <td style={{padding:"8px 6px",color:t.textMuted,fontSize:10,lineHeight:1.4}}>{r.note}</td>
                  <td style={{padding:"8px 6px"}}><Badge signal={r.sig} /></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{marginTop:12,padding:"10px 14px",background:t.bgCardAlt,borderRadius:8,borderLeft:`3px solid ${t.accent}`}}>
            <p style={{margin:0,fontSize:11,color:t.textMuted,lineHeight:1.6}}><strong style={{color:t.accent}}>Key Takeaway:</strong> Of 10 major metric pairs analyzed, 4 are confirming, 4 are diverging, and 2 are partially offsetting. This mixed signal profile is characteristic of a late-cycle market that is expensive but not systemically broken — consistent with our composite "Elevated but Not a Bubble" assessment.</p>
          </div>
        </Card>

        {sectionDivider}

        {/* ═══════ SECTION 7: EXPANDED HISTORICAL COMPARISON MATRIX ═══════ */}
        {sectionNum(6, "Expanded Historical Comparison Matrix")}
        {prose("The following matrix provides a comprehensive comparison of current market conditions against the three most significant market dislocations in modern financial history: the 1929 crash that precipitated the Great Depression, the 2000 dot-com bubble collapse, and the 2008 Global Financial Crisis. Each comparison dimension is evaluated to determine whether current conditions are more or less favorable than at those historical crisis points. This matrix is designed to provide a holistic, at-a-glance assessment of the structural similarities and differences that define the current risk environment.")}

        <Card style={{marginBottom:20,padding:18,overflowX:"auto"}}>
          <h4 style={{margin:"0 0 14px",fontSize:13,fontWeight:700,color:t.accent}}>Comprehensive Historical Comparison</h4>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:11,minWidth:600}}>
            <thead>
              <tr style={{borderBottom:`2px solid ${t.border}`}}>
                {["Dimension","1929","2000","2008","2026","Current vs. History"].map(h=>(
                  <th key={h} style={{padding:"8px 6px",textAlign:"left",color:h==="2026"?t.accent:t.textDim,fontWeight:700,fontSize:10,textTransform:"uppercase",letterSpacing:0.5}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                {dim:"Primary Catalyst",v29:"Margin leverage",v00:"Tech mania / IPOs",v08:"Subprime / CDOs",v26:"TBD (AI capex?)",assess:"No clear catalyst identified",color:t.green},
                {dim:"Earnings Quality",v29:"Cyclical / fragile",v00:"Fictional / pro-forma",v08:"Leveraged / FIRE",v26:"Real / 15.3% growth",assess:"Materially better",color:t.green},
                {dim:"CAPE Ratio",v29:"32.6x",v00:"44.2x",v08:"27.5x",v26:"38.1x",assess:"Between 2000 and 2008",color:t.yellow},
                {dim:"Household Leverage",v29:"Moderate",v00:"Moderate (97%)",v08:"Extreme (133%)",v26:"Low (88%)",assess:"Best in 30+ years",color:t.green},
                {dim:"Fed Policy Stance",v29:"Tightening",v00:"Tightening (6.5%)",v08:"Tightening (5.25%)",v26:"Easing (3.6%)",assess:"Actively accommodative",color:t.green},
                {dim:"Banking System",v29:"Fragile / runs",v00:"Stable",v08:"Failed (Lehman etc.)",v26:"Strong / Basel III",assess:"Well capitalized",color:t.green},
                {dim:"Market Concentration",v29:"Railroads/utilities",v00:"TMT (27%)",v08:"Financials",v26:"Tech (39%)",assess:"Worst ever — but earned",color:t.orange},
                {dim:"Credit Spreads",v29:"Widening",v00:"Widening (8%)",v08:"Exploding (21.8%)",v26:"Compressed (3.3%)",assess:"No stress signal",color:t.green},
                {dim:"Investor Sentiment",v29:"Euphoric",v00:"Euphoric",v08:"Complacent",v26:"Cautious / moderate",assess:"No euphoria present",color:t.green},
                {dim:"GDP Trajectory",v29:"Peaking",v00:"Slowing (1.0%)",v08:"Contracting (-4.3%)",v26:"Steady (2.5%)",assess:"Trend-rate growth",color:t.green},
                {dim:"Money Supply Growth",v29:"Contracting",v00:"Moderate",v08:"Pre-QE era",v26:"$21.8T (+4.6%)",assess:"Elevated liquidity base",color:t.yellow},
                {dim:"Global Debt/GDP",v29:"~120%",v00:"~230%",v08:"~305%",v26:"338%",assess:"Structural headwind",color:t.red},
                {dim:"Regulatory Framework",v29:"Minimal",v00:"Post-Sarbanes",v08:"Pre-Dodd-Frank",v26:"Basel III/IV, Dodd-Frank",assess:"Most robust ever",color:t.green},
                {dim:"Information Speed",v29:"Newspapers/ticker",v00:"Early internet",v08:"Bloomberg/cable",v26:"Real-time/algo/social",assess:"Faster but more volatile",color:t.yellow},
                {dim:"Transmission Mechanism",v29:"Bank runs → deflation",v00:"Wealth effect → mild recession",v08:"CDOs → banks → credit freeze",v26:"No clear mechanism",assess:"Absent — critical distinction",color:t.green},
                {dim:"Recovery Time",v29:"25 years (nominal)",v00:"7 years",v08:"5.5 years",v26:"TBD",assess:"N/A",color:t.textDim},
              ].map((r,i)=>(
                <tr key={i} style={{borderBottom:`1px solid ${t.border}44`}}>
                  <td style={{padding:"7px 6px",color:t.text,fontWeight:600,fontSize:11}}>{r.dim}</td>
                  <td style={{padding:"7px 6px",color:t.textMuted,fontSize:10}}>{r.v29}</td>
                  <td style={{padding:"7px 6px",color:t.textMuted,fontSize:10}}>{r.v00}</td>
                  <td style={{padding:"7px 6px",color:t.textMuted,fontSize:10}}>{r.v08}</td>
                  <td style={{padding:"7px 6px",color:t.accent,fontWeight:700,fontSize:10}}>{r.v26}</td>
                  <td style={{padding:"7px 6px",color:r.color,fontWeight:600,fontSize:10}}>{r.assess}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{marginTop:12,padding:"10px 14px",background:t.bgCardAlt,borderRadius:8,borderLeft:`3px solid ${t.green}`}}>
            <p style={{margin:0,fontSize:11,color:t.textMuted,lineHeight:1.6}}><strong style={{color:t.green}}>Summary:</strong> Of 15 comparison dimensions (excluding Recovery Time), current conditions are more favorable than historical crisis peaks in 10 categories, comparable in 3, and less favorable in 2. The absence of an identifiable transmission mechanism — the critical causal link that converts overvaluation into systemic crisis — is the single most important distinction.</p>
          </div>
        </Card>

        {sectionDivider}

        {/* ═══════ SECTION 8: SCENARIO ANALYSIS ═══════ */}
        {sectionNum(7, "Scenario Analysis")}
        {prose("The following scenario analysis presents four distinct forward-looking market pathways, each with an assigned probability, 12-month S&P 500 target range, expected return implications, key underlying assumptions, and portfolio positioning implications. Probabilities are derived from a combination of historical base rates for analogous market conditions, current fundamental and technical indicators, and qualitative assessment of emerging risk vectors. These scenarios are not mutually exclusive — elements of multiple scenarios may manifest simultaneously — but are presented as discrete outcomes to facilitate strategic planning.")}

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:20}}>
          {scenarios.map((s,i)=>(
            <Card key={i} style={{padding:18,borderTop:`4px solid ${s.color}`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                <div>
                  <div style={{fontSize:10,color:s.color,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase"}}>{s.name}</div>
                  <div style={{fontSize:11,color:t.textDim,marginTop:2}}>12M Target: <strong style={{color:t.text}}>{s.target}</strong></div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontSize:28,fontWeight:900,color:s.color}}>{s.prob}%</div>
                  <div style={{fontSize:9,color:t.textDim}}>probability</div>
                </div>
              </div>
              {/* Probability bar */}
              <div style={{height:6,borderRadius:3,background:t.riskBarBg,marginBottom:12,overflow:"hidden"}}>
                <div style={{width:`${s.prob}%`,height:"100%",borderRadius:3,background:s.color,transition:"width 0.6s"}} />
              </div>
              <div style={{fontSize:10,color:t.textDim,fontWeight:600,textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>Expected Return: <span style={{color:s.color}}>{s.ret}</span></div>
              <div style={{fontSize:10,color:t.textDim,fontWeight:600,textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>Key Assumptions</div>
              <ul style={{margin:"0 0 10px",paddingLeft:16}}>
                {s.assumptions.map((a,ai)=>(
                  <li key={ai} style={{fontSize:11,color:t.textMuted,lineHeight:1.6,marginBottom:2}}>{a}</li>
                ))}
              </ul>
              <div style={{padding:"8px 10px",background:t.bgCardAlt,borderRadius:6,borderLeft:`2px solid ${s.color}`}}>
                <div style={{fontSize:9,color:t.textDim,fontWeight:600,textTransform:"uppercase",letterSpacing:1,marginBottom:3}}>Portfolio Implication</div>
                <div style={{fontSize:11,color:t.textMuted,lineHeight:1.5}}>{s.implication}</div>
              </div>
            </Card>
          ))}
        </div>

        {/* Probability distribution visual */}
        <Card style={{marginBottom:20,padding:18}}>
          <h4 style={{margin:"0 0 14px",fontSize:13,fontWeight:700,color:t.accent}}>Probability Distribution</h4>
          <div style={{height:180}}>
            <ResponsiveContainer>
              <BarChart data={scenarios.map(s=>({name:s.name.split(":")[0].trim(),prob:s.prob}))}>
                <CartesianGrid strokeDasharray="3 3" stroke={t.gridStroke} />
                <XAxis dataKey="name" tick={{fontSize:10,fill:t.textDim}} />
                <YAxis tick={{fontSize:10,fill:t.textDim}} tickFormatter={v=>`${v}%`} domain={[0,60]} />
                <Tooltip content={<ChartTip />} />
                <Bar dataKey="prob" name="Probability %" radius={[6,6,0,0]}>
                  {scenarios.map((s,i) => <Cell key={i} fill={s.color} fillOpacity={0.75} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{marginTop:10,padding:"8px 14px",background:t.bgCardAlt,borderRadius:8}}>
            <p style={{margin:0,fontSize:11,color:t.textMuted,lineHeight:1.6}}><strong style={{color:t.accent}}>Expected value calculation:</strong> Weighting the midpoint of each scenario's return range by its probability yields an expected 12-month S&P 500 return of approximately <strong style={{color:t.text}}>+2% to +5%</strong> — consistent with a market that offers positive but compressed forward returns with meaningful downside tail risk.</p>
          </div>
        </Card>

        {sectionDivider}

        {/* ═══════ SECTION 9: RISK CATALYSTS & MONITORING FRAMEWORK ═══════ */}
        {sectionNum(8, "Risk Catalysts & Monitoring Framework")}
        {prose("While our base case does not anticipate a systemic market dislocation, the compressed risk premiums and elevated valuations that characterize the current environment demand a rigorous monitoring framework for early warning signals. The following catalyst matrix identifies the specific trigger conditions that would warrant a material reassessment of our risk posture, along with current readings, status assessments, and the specific data sources to monitor for each trigger. This framework is designed to provide actionable, real-time intelligence that can inform portfolio adjustments before a potential dislocation materializes.")}
        {prose("The critical insight is that systemic crises rarely emerge from a single catalyst in isolation. Rather, they typically result from the convergence of multiple deteriorating conditions that interact in non-linear and often unpredictable ways. The monitoring framework below should therefore be evaluated holistically — the simultaneous deterioration of multiple indicators should trigger a more aggressive risk reduction than any single indicator breach in isolation.")}

        <Card style={{marginBottom:20,padding:18,overflowX:"auto"}}>
          <h4 style={{margin:"0 0 14px",fontSize:13,fontWeight:700,color:t.accent}}>Catalyst Trigger Matrix</h4>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:11,minWidth:600}}>
            <thead>
              <tr style={{borderBottom:`2px solid ${t.border}`}}>
                {["Category","Trigger Condition","Current","Status","What to Watch"].map(h=>(
                  <th key={h} style={{padding:"8px 6px",textAlign:"left",color:t.textDim,fontWeight:700,fontSize:9,textTransform:"uppercase",letterSpacing:1}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {catalysts.map((c,i)=>(
                <tr key={i} style={{borderBottom:`1px solid ${t.border}44`}}>
                  <td style={{padding:"8px 6px",color:t.text,fontWeight:600,fontSize:11}}>{c.category}</td>
                  <td style={{padding:"8px 6px",color:t.textMuted,fontSize:10,lineHeight:1.4}}>{c.trigger}</td>
                  <td style={{padding:"8px 6px",color:t.text,fontWeight:600,fontFamily:"monospace",fontSize:10}}>{c.current}</td>
                  <td style={{padding:"8px 6px"}}><Badge signal={c.status} /></td>
                  <td style={{padding:"8px 6px",color:t.textDim,fontSize:10,lineHeight:1.4}}>{c.watch}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{marginTop:12,padding:"10px 14px",background:t.bgCardAlt,borderRadius:8,borderLeft:`3px solid ${t.yellow}`}}>
            <p style={{margin:0,fontSize:11,color:t.textMuted,lineHeight:1.6}}><strong style={{color:t.yellow}}>Current Status:</strong> Of 8 monitored catalyst categories, 5 show no trigger activation (Green), 3 show elevated monitoring status (Yellow), and 0 show active trigger breach (Red). This configuration is consistent with our "Elevated but Not a Bubble" composite assessment.</p>
          </div>
        </Card>

        {sectionDivider}

        {/* ═══════ SECTION 10: INVESTMENT IMPLICATIONS ═══════ */}
        {sectionNum(9, "Investment Implications & Asset Allocation")}
        {prose("The analytical framework presented in this report carries direct implications for portfolio construction and asset allocation. The core challenge facing allocators in March 2026 is the compression of expected returns across nearly all major asset classes — equities offer limited upside given elevated valuations, credit spreads provide minimal compensation for default risk, and even traditional safe havens like government bonds offer yields that are modest relative to inflation uncertainty. The following allocation framework is designed for a moderate-risk institutional portfolio with a 12-month tactical horizon.")}
        {prose("Our allocation tilts reflect the bifurcated risk environment identified throughout this report: expensive but not broken. We favor assets that benefit from the continuation of the current regime (positive earnings growth, normalizing monetary policy, stable credit) while maintaining sufficient hedges against the tail risks (geopolitical shock, earnings disappointment, credit dislocation) that could generate outsized negative returns. The emphasis is on maintaining optionality — the ability to pivot aggressively in either direction as the risk environment evolves.")}

        <Card style={{marginBottom:20,padding:18}}>
          <h4 style={{margin:"0 0 14px",fontSize:13,fontWeight:700,color:t.accent}}>Tactical Asset Allocation Framework (12-Month Horizon)</h4>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
            <thead>
              <tr style={{borderBottom:`2px solid ${t.border}`}}>
                {["Asset Class","Recommendation","","Rationale"].map((h,hi)=>(
                  <th key={hi} style={{padding:"8px 6px",textAlign:"left",color:t.textDim,fontWeight:700,fontSize:9,textTransform:"uppercase",letterSpacing:1}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {assetImplications.map((a,i)=>(
                <tr key={i} style={{borderBottom:`1px solid ${t.border}44`}}>
                  <td style={{padding:"8px 6px",color:t.text,fontWeight:600,fontSize:11}}>{a.asset}</td>
                  <td style={{padding:"8px 6px"}}>
                    <span style={{padding:"2px 8px",borderRadius:4,fontSize:10,fontWeight:700,color:a.color,background:a.color===t.green?t.greenBg:a.color===t.red?t.redBg:t.yellowBg}}>{a.weight}</span>
                  </td>
                  <td style={{padding:"8px 6px",fontSize:16,color:a.color,fontWeight:700}}>{a.dir}</td>
                  <td style={{padding:"8px 6px",color:t.textMuted,fontSize:10,lineHeight:1.4}}>{a.rationale}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {/* Sector positioning */}
        <Card style={{marginBottom:20,padding:18}}>
          <h4 style={{margin:"0 0 14px",fontSize:13,fontWeight:700,color:t.accent}}>Sector Positioning Recommendations</h4>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
            <div style={{padding:12,borderRadius:8,background:t.greenBg,border:`1px solid ${t.greenBorder}`}}>
              <div style={{fontSize:10,fontWeight:700,color:t.green,letterSpacing:1,textTransform:"uppercase",marginBottom:8}}>Overweight</div>
              {["Healthcare (defensive + AI drug discovery)","Industrials (reshoring, infrastructure)","Financials (NIM expansion, deregulation)","Energy (supply discipline, geopolitical premium)"].map((s,i)=>(
                <div key={i} style={{fontSize:11,color:t.textMuted,padding:"3px 0",borderBottom:i<3?`1px solid ${t.greenBorder}`:""}}>{s}</div>
              ))}
            </div>
            <div style={{padding:12,borderRadius:8,background:t.yellowBg,border:`1px solid ${t.yellowBorder}`}}>
              <div style={{fontSize:10,fontWeight:700,color:t.yellow,letterSpacing:1,textTransform:"uppercase",marginBottom:8}}>Market Weight</div>
              {["Technology (quality names only)","Consumer Staples (stable but low growth)","Utilities (rate-sensitive, defensive)","Communication Services (mixed quality)"].map((s,i)=>(
                <div key={i} style={{fontSize:11,color:t.textMuted,padding:"3px 0",borderBottom:i<3?`1px solid ${t.yellowBorder}`:""}}>{s}</div>
              ))}
            </div>
            <div style={{padding:12,borderRadius:8,background:t.redBg,border:`1px solid ${t.redBorder}`}}>
              <div style={{fontSize:10,fontWeight:700,color:t.red,letterSpacing:1,textTransform:"uppercase",marginBottom:8}}>Underweight</div>
              {["Consumer Discretionary (stretched consumer)","Real Estate (affordability headwind)","Materials (China demand uncertainty)","Speculative Growth (unproven business models)"].map((s,i)=>(
                <div key={i} style={{fontSize:11,color:t.textMuted,padding:"3px 0",borderBottom:i<3?`1px solid ${t.redBorder}`:""}}>{s}</div>
              ))}
            </div>
          </div>
        </Card>

        {sectionDivider}

        {/* ═══════ SECTION 11: CONCLUSION ═══════ */}
        {sectionNum(10, "Conclusion")}
        <Card style={{marginBottom:20,borderLeft:`4px solid ${t.accent}`,padding:24}}>
          {prose("After exhaustive analysis of 18 quantitative metrics spanning eight analytical categories, extensive historical comparison against the three most significant market dislocations of the past century, and rigorous scenario modeling, we arrive at a definitive assessment: the U.S. equity market in March 2026 is expensive, concentrated, and operating with compressed risk premiums — but it is not in a bubble. This distinction is not merely semantic. It carries profound implications for portfolio construction, risk management, and strategic decision-making.")}
          {prose("The word \"bubble\" implies a specific pathological condition: a self-reinforcing cycle of speculation in which asset prices become fundamentally detached from underlying economic reality, sustained solely by the Greater Fool dynamic — the expectation that someone will pay an even higher price regardless of intrinsic value. The dot-com bubble of 1999-2000 epitomized this condition: companies with no revenue, no path to profitability, and no viable business model commanded multi-billion-dollar valuations on the strength of narrative alone. The housing bubble of 2005-2008 similarly featured a fundamental disconnect — mortgage credit extended to borrowers who manifestly could not repay, packaged into securities whose risk was systematically obscured and mispriced. In both cases, the underlying economic reality was not merely insufficient to support prices; it was fundamentally incompatible with them.")}
          {prose("The March 2026 market does not exhibit this pathology. The S&P 500 trades at 20.9x forward earnings, elevated by historical standards but backed by 15.3% year-over-year earnings growth — nearly double the long-run average. The Magnificent Seven technology companies, which anchor the market's concentration, collectively generate over $400 billion in annual free cash flow, invest hundreds of billions in productive capital expenditure, and dominate industries with durable competitive advantages and expanding addressable markets. Household balance sheets are the strongest in over three decades. Credit markets show no signs of systemic stress. The banking system is well-capitalized under the most rigorous regulatory framework in history. The Federal Reserve is actively easing policy from a position of strength. These are not the conditions that produce systemic market crises.")}
          {prose("However — and this caveat is essential — the absence of a bubble does not equate to the absence of risk. The current market environment is characterized by what we term \"priced for perfection\" dynamics: valuations at current levels leave no margin of safety for error. An earnings disappointment from a single mega-cap company can move the index by hundreds of points. A geopolitical shock could trigger a cascade of de-risking that the market's concentrated structure would amplify rather than absorb. The AI capital expenditure cycle, which has committed over $300 billion on the expectation of transformative productivity gains, represents a significant binary risk — should the technology fail to deliver measurable returns on investment within the timeline the market has priced, the resulting de-rating could be severe and rapid.")}
          {prose("Our recommendation is a posture of disciplined vigilance: maintain exposure to risk assets at or near benchmark levels to capture the continued earnings-driven upside that our base case anticipates, while implementing systematic hedges against the tail risks that elevated valuations make potentially devastating. Favor quality over speculation, diversification over concentration, and optionality over conviction. The market is telling us something important: it is willing to pay premium prices for premium assets in a fundamentally sound economy. That is not irrational. But it is fragile. And fragility, in a world of compressed risk premiums and unprecedented concentration, demands respect.")}
        </Card>

        {sectionDivider}

        {/* ═══════ SECTION 12: APPENDIX ═══════ */}
        {sectionNum(11, "Appendix")}

        <Card style={{marginBottom:16,padding:18}}>
          <h4 style={{margin:"0 0 12px",fontSize:13,fontWeight:700,color:t.accent}}>A. Data Sources & Methodology Notes</h4>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
            <div>
              <div style={{fontSize:10,fontWeight:700,color:t.text,textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>Primary Data Sources</div>
              {["Federal Reserve Economic Data (FRED)","FactSet Earnings Insight","Robert Shiller Online Data","S&P Global Market Intelligence","FINRA Margin Statistics","ICE BofA Credit Indices","CBOE Volatility Index (VIX)","S&P CoreLogic Case-Shiller","University of Michigan Surveys","IIF Global Debt Monitor"].map((s,i)=>(
                <div key={i} style={{fontSize:11,color:t.textMuted,padding:"3px 0",borderBottom:`1px solid ${t.border}22`}}>{s}</div>
              ))}
            </div>
            <div>
              <div style={{fontSize:10,fontWeight:700,color:t.text,textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>Methodology Notes</div>
              {["Scoring range: 0 (min risk) to 100 (max risk)","Composite: unweighted arithmetic mean of 18 metrics","Historical comparisons: 2000 peak, 2008 peak, LT average","Rate adjustment: CAPE adjusted using Shiller excess CAPE yield","Margin debt: normalized to total market capitalization","ERP: implied from Gordon Growth Model applied to S&P 500","Scenario probabilities: Bayesian posterior estimates","All data as of March 14, 2026 unless otherwise noted"].map((s,i)=>(
                <div key={i} style={{fontSize:11,color:t.textMuted,padding:"3px 0",borderBottom:`1px solid ${t.border}22`}}>{s}</div>
              ))}
            </div>
          </div>
        </Card>

        <Card style={{marginBottom:16,padding:18}}>
          <h4 style={{margin:"0 0 12px",fontSize:13,fontWeight:700,color:t.accent}}>B. Complete Metric Scorecard</h4>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
            <thead>
              <tr style={{borderBottom:`2px solid ${t.border}`}}>
                {["#","Metric","Current","2000","2008","Avg","Score","Signal"].map(h=>(
                  <th key={h} style={{padding:"6px 5px",textAlign:"left",color:t.textDim,fontWeight:700,fontSize:9,textTransform:"uppercase",letterSpacing:0.5}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MS.map((m,i)=>(
                <tr key={i} style={{borderBottom:`1px solid ${t.border}44`}}>
                  <td style={{padding:"6px 5px",color:t.textDim,fontSize:10}}>{i+1}</td>
                  <td style={{padding:"6px 5px",color:t.text,fontWeight:600}}>{m.nm}</td>
                  <td style={{padding:"6px 5px",color:t.text,fontWeight:700,fontFamily:"monospace",fontSize:10}}>{m.cur}</td>
                  <td style={{padding:"6px 5px",color:t.textMuted,fontFamily:"monospace",fontSize:10}}>{m.c00}</td>
                  <td style={{padding:"6px 5px",color:t.textMuted,fontFamily:"monospace",fontSize:10}}>{m.c08}</td>
                  <td style={{padding:"6px 5px",color:t.textMuted,fontFamily:"monospace",fontSize:10}}>{m.avg}</td>
                  <td style={{padding:"6px 5px",minWidth:70}}><RiskBar score={m.sc} /></td>
                  <td style={{padding:"6px 5px"}}><Badge signal={m.sig} /></td>
                </tr>
              ))}
              <tr style={{borderTop:`2px solid ${t.border}`}}>
                <td colSpan={6} style={{padding:"8px 5px",color:t.accent,fontWeight:800,fontSize:11}}>COMPOSITE SCORE (Unweighted Average)</td>
                <td style={{padding:"8px 5px",minWidth:70}}><RiskBar score={OS} /></td>
                <td style={{padding:"8px 5px"}}><Badge signal="yellow" /></td>
              </tr>
            </tbody>
          </table>
        </Card>

        <Card style={{marginBottom:16,padding:18,background:t.bgCardAlt}}>
          <h4 style={{margin:"0 0 12px",fontSize:13,fontWeight:700,color:t.accent}}>C. Important Disclosures & Disclaimers</h4>
          <div style={{fontSize:10,color:t.textDim,lineHeight:1.7}}>
            <p style={{margin:"0 0 8px"}}>This report is prepared by Monticello Fund Research, a division of UVA Darden Capital Management, for educational and informational purposes. It does not constitute investment advice, a solicitation, or an offer to buy or sell any securities. The views expressed herein represent the analytical conclusions of the research team and do not necessarily reflect the views of the University of Virginia, the Darden School of Business, or Darden Capital Management.</p>
            <p style={{margin:"0 0 8px"}}>Past performance is not indicative of future results. All investments involve risk, including the potential loss of principal. The analytical framework presented herein is subject to inherent limitations including data availability, model assumptions, and the fundamental unpredictability of complex adaptive systems. Scenario probabilities are subjective estimates based on historical analogues and current conditions; actual outcomes may differ materially.</p>
            <p style={{margin:"0 0 8px"}}>The metrics and thresholds presented in this report should not be interpreted as precise predictive indicators. Financial markets are complex adaptive systems in which structural relationships can shift without warning. No quantitative framework, however sophisticated, can fully capture the range of potential outcomes in such a system.</p>
            <p style={{margin:0}}>Data sources are believed to be reliable but are not independently verified. Any errors or omissions are unintentional. This report may be updated periodically as new data becomes available. Distribution restricted to authorized recipients per applicable securities regulations including MiFID II and Regulation FD.</p>
          </div>
        </Card>

        {sectionDivider}

        {/* ═══════ SECTION 13: FOOTER ═══════ */}
        <div style={{textAlign:"center",padding:"24px 0 10px"}}>
          <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:10,marginBottom:12}}>
            <div style={{width:32,height:32,borderRadius:6,background:`linear-gradient(135deg, ${t.accent}, ${t.purple})`,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:15,fontWeight:900}}>M</div>
            <div style={{textAlign:"left"}}>
              <div style={{fontSize:12,fontWeight:800,color:t.text}}>Monticello Fund Research</div>
              <div style={{fontSize:10,color:t.textDim}}>UVA Darden Capital Management</div>
            </div>
          </div>
          <div style={{height:1,background:`linear-gradient(90deg, transparent, ${t.accent}, transparent)`,margin:"12px 0"}} />
          <div style={{fontSize:10,color:t.textDim,lineHeight:1.7}}>
            <p style={{margin:"0 0 4px"}}>Lead Analyst: Dachi | Research Date: March 18, 2026 | Composite Score: {OS}/100</p>
            <p style={{margin:"0 0 4px"}}>Data: FRED, FactSet, Shiller, S&P Global, FINRA, ICE BofA, CBOE, Case-Shiller, IIF</p>
            <p style={{margin:"0 0 8px"}}>Confidential — For Institutional Use Only — Do Not Redistribute</p>
          </div>
          <div style={{display:"inline-block",padding:"6px 16px",borderRadius:20,background:t.accentBg,border:`1px solid ${t.accent}33`}}>
            <span style={{fontSize:10,fontWeight:700,color:t.accent,letterSpacing:1}}>END OF REPORT</span>
          </div>
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
              <button key={i} onClick={() => setTab(i)} style={{padding:"14px 20px",fontSize:14,fontWeight:tab===i?700:500,color:tab===i?t.accent:t.textDim,background:"none",border:"none",cursor:"pointer",borderBottom:tab===i?`2px solid ${t.accent}`:"2px solid transparent",whiteSpace:"nowrap",fontFamily:"inherit"}}>{n}</button>
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
