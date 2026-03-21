import { useState, useEffect, useRef, useId, createContext, useContext } from "react";
import ReactDOM from "react-dom";
import { AreaChart, Area, BarChart, Bar, ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, Line } from "recharts";

/* ══════════════ THEMES ══════════════ */
const themes = {
  dark: {
    bg:"#07090f",bgCard:"rgba(14,18,30,0.75)",bgCardAlt:"rgba(10,14,24,0.9)",bgHover:"rgba(30,35,52,0.7)",
    border:"rgba(255,255,255,0.06)",borderLight:"rgba(255,255,255,0.1)",
    text:"#e8e4db",textMuted:"#9b978e",textDim:"#5c5a54",
    green:"#34d399",greenBg:"rgba(52,211,153,0.08)",greenBorder:"rgba(52,211,153,0.2)",
    yellow:"#f59e0b",yellowBg:"rgba(245,158,11,0.08)",yellowBorder:"rgba(245,158,11,0.2)",
    red:"#ef6461",redBg:"rgba(239,100,97,0.08)",redBorder:"rgba(239,100,97,0.2)",
    blue:"#5b9cf5",purple:"#a78bfa",cyan:"#22d3ee",orange:"#e8944a",
    accent:"#c9a84c",accentBg:"rgba(201,168,76,0.06)",
    gridStroke:"rgba(255,255,255,0.04)",tooltipBg:"rgba(14,18,30,0.95)",headerBg:"rgba(7,9,15,0.85)",
    refLabel:"#7a7770",riskBarBg:"rgba(255,255,255,0.06)",
    shadow:"0 20px 60px rgba(0,0,0,0.5)",cardShadow:"0 4px 16px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.04)",
  },
  light: {
    bg:"#f7f4ee",bgCard:"#ffffff",bgCardAlt:"#f2efe8",bgHover:"#eae7e0",
    border:"#ddd9d0",borderLight:"#c8c4bb",
    text:"#1a1916",textMuted:"#555249",textDim:"#8b877e",
    green:"#0d9668",greenBg:"rgba(13,150,104,0.06)",greenBorder:"rgba(13,150,104,0.18)",
    yellow:"#d97706",yellowBg:"rgba(217,119,6,0.06)",yellowBorder:"rgba(217,119,6,0.18)",
    red:"#c53030",redBg:"rgba(197,48,48,0.05)",redBorder:"rgba(197,48,48,0.15)",
    blue:"#2563eb",purple:"#7c3aed",cyan:"#0891b2",orange:"#c2410c",
    accent:"#1a2744",accentBg:"rgba(26,39,68,0.05)",
    gridStroke:"#e8e4db",tooltipBg:"#ffffff",headerBg:"rgba(247,244,238,0.88)",
    refLabel:"#8b877e",riskBarBg:"#e8e4db",
    shadow:"0 20px 60px rgba(0,0,0,0.06)",cardShadow:"0 4px 16px rgba(0,0,0,0.05), 0 0 0 1px rgba(0,0,0,0.03)",
  },
};

/* ══════════════ DATA ══════════════ */
let capeData=[{y:"1920",v:5},{y:"1929",v:32.6},{y:"1932",v:5.6},{y:"1950",v:12},{y:"1966",v:24.1},{y:"1982",v:6.6},{y:"1990",v:17},{y:"1995",v:23},{y:"2000",v:44.2},{y:"2002",v:22},{y:"2007",v:27.5},{y:"2009",v:13.3},{y:"2015",v:26},{y:"2020",v:31},{y:"2022",v:28},{y:"2024",v:36},{y:"2026",v:37.5}];
let fwdPE=[{y:"1995",v:14.5},{y:"1999",v:25.5},{y:"2000",v:26},{y:"2003",v:16},{y:"2007",v:15.2},{y:"2009",v:10.5},{y:"2013",v:15},{y:"2020",v:22},{y:"2022",v:17},{y:"2024",v:21},{y:"2026",v:21.8}];
let buffett=[{y:"1970",v:75},{y:"1982",v:33},{y:"1990",v:58},{y:"1995",v:92},{y:"2000",v:148},{y:"2002",v:80},{y:"2007",v:110},{y:"2009",v:60},{y:"2015",v:120},{y:"2020",v:170},{y:"2021",v:200},{y:"2025",v:220},{y:"2026",v:230}];
let erpD=[{y:"1995",v:4},{y:"1999",v:0.5},{y:"2000",v:-0.5},{y:"2004",v:3.5},{y:"2009",v:8},{y:"2015",v:4},{y:"2020",v:4.5},{y:"2022",v:2.5},{y:"2026",v:0.3}];
let conc=[{y:"1990",v:16},{y:"1995",v:17},{y:"2000",v:27},{y:"2005",v:19},{y:"2010",v:20},{y:"2015",v:19},{y:"2020",v:28},{y:"2024",v:37},{y:"2025",v:41},{y:"2026",v:37.2}];
let mDebt=[{y:"1997",v:132},{y:"2000",v:278},{y:"2007",v:381},{y:"2009",v:173},{y:"2014",v:451},{y:"2018",v:568},{y:"2021",v:936},{y:"2023",v:743},{y:"2026",v:1214}];
let mDebtPct=[{y:"1997",v:2.1},{y:"2000",v:2.5},{y:"2003",v:1.6},{y:"2007",v:2.7},{y:"2009",v:1.5},{y:"2014",v:1.9},{y:"2018",v:2.0},{y:"2021",v:1.7},{y:"2023",v:1.8},{y:"2026",v:1.68}];
let ycD=[{y:"1990",v:0.3},{y:"1995",v:1},{y:"2000",v:-0.5},{y:"2007",v:-0.2},{y:"2009",v:2.7},{y:"2013",v:2.4},{y:"2019",v:-0.05},{y:"2023",v:-1},{y:"2025",v:0.3},{y:"2026",v:0.52}];
let hyD=[{y:"1997",v:3},{y:"2000",v:8},{y:"2007",v:2.6},{y:"2008",v:21.8},{y:"2011",v:5.5},{y:"2015",v:5.5},{y:"2018",v:3.5},{y:"2020",v:10.9},{y:"2024",v:3},{y:"2026",v:3.3}];
let hhD=[{y:"1990",v:83},{y:"1995",v:90},{y:"2000",v:97},{y:"2005",v:125},{y:"2007",v:133},{y:"2010",v:118},{y:"2015",v:100},{y:"2020",v:95},{y:"2024",v:90},{y:"2026",v:93}];
let m2D=[{y:"1990",v:51.0},{y:"1995",v:52.7},{y:"2000",v:48.7},{y:"2005",v:50.9},{y:"2010",v:59.7},{y:"2015",v:65.4},{y:"2020",v:90.1},{y:"2022",v:81.7},{y:"2026",v:71.4}];
let fedB=[{y:"2002",v:6.0},{y:"2004",v:6.0},{y:"2008",v:6.2},{y:"2010",v:16.8},{y:"2015",v:24.7},{y:"2019",v:17.8},{y:"2020",v:33.8},{y:"2022",v:34.4},{y:"2026",v:21.2}];
let vixD=[{y:"1995",v:12.5},{y:"2000",v:33},{y:"2004",v:14},{y:"2008",v:80},{y:"2013",v:12},{y:"2017",v:9.1},{y:"2020",v:82.7},{y:"2024",v:15},{y:"2026",v:24.1}];
let csD=[{y:"1990",v:77},{y:"2000",v:100},{y:"2006",v:190},{y:"2009",v:140},{y:"2015",v:170},{y:"2020",v:220},{y:"2022",v:305},{y:"2026",v:332.0}];
let gdD=[{y:"2001",v:190.9},{y:"2008",v:216.6},{y:"2012",v:227.9},{y:"2020",v:285.0},{y:"2022",v:240.3},{y:"2025",v:246.3}];
let capexGdpD=[{y:"1995",v:12.6},{y:"2000",v:14.6},{y:"2005",v:12.5},{y:"2007",v:13.6},{y:"2008",v:13.1},{y:"2010",v:11.8},{y:"2015",v:13.6},{y:"2020",v:13.3},{y:"2022",v:13.6},{y:"2025",v:13.9}];
let capexCfD=[{y:"1995",v:120.2},{y:"2000",v:142.3},{y:"2005",v:100.2},{y:"2007",v:121.6},{y:"2009",v:92.2},{y:"2015",v:109.4},{y:"2020",v:113.2},{y:"2022",v:119.4},{y:"2025",v:111.0}];
let gdpGrowthD=[{y:"1990",v:1.9},{y:"1995",v:2.7},{y:"2000",v:1.0},{y:"2003",v:2.9},{y:"2007",v:2.0},{y:"2008",v:-0.1},{y:"2009",v:-2.6},{y:"2015",v:2.9},{y:"2020",v:-2.2},{y:"2021",v:5.8},{y:"2022",v:1.9},{y:"2024",v:2.8},{y:"2026",v:2.0}];
let fedFundsD=[{y:"1995",v:5.8},{y:"2000",v:6.5},{y:"2003",v:1.0},{y:"2006",v:5.25},{y:"2008",v:2.0},{y:"2009",v:0.2},{y:"2016",v:0.5},{y:"2019",v:2.4},{y:"2021",v:0.1},{y:"2023",v:5.3},{y:"2025",v:4.4},{y:"2026",v:3.6}];
let epsQ=[
  {period:"1997-Q1",label:"Q1'97",actual:15.0,estimate:null},
  {period:"1998-Q1",label:"Q1'98",actual:-3.1,estimate:null},
  {period:"1999-Q1",label:"Q1'99",actual:-4.6,estimate:null},
  {period:"2000-Q1",label:"Q1'00",actual:27.9,estimate:null},
  {period:"2001-Q1",label:"Q1'01",actual:-13.4,estimate:null},
  {period:"2008-Q1",label:"Q1'08",actual:-30.2,estimate:null},
  {period:"2009-Q1",label:"Q1'09",actual:-88.6,estimate:null},
  {period:"2020-Q1",label:"Q1'20",actual:-14.8,estimate:null},
  {period:"2024-Q1",label:"Q1'24",actual:5.6,estimate:null},
  {period:"2025-Q3",label:"Q3'25",actual:16.9,estimate:16.9},
  {period:"2026-Q1",label:"Q1'26E",actual:null,estimate:13.0},
];

/* ══════════════ CHART UPDATE MAP ══════════════ */
// Maps metric index → chart array and optional value transform
// For most metrics, chart value = metric nv
// Most charts update only the latest point locally; longer history replacements come from /api/metrics
const CHART_MAP = {
  0: () => capeData,
  1: () => fwdPE,
  2: () => buffett,
  3: () => erpD,
  4: () => conc,
  5: () => mDebt,
  6: () => mDebtPct,
  7: () => ycD,
  8: () => hyD,
  9: () => hhD,
  11: () => gdpGrowthD,
  12: () => fedFundsD,
  13: () => m2D,
  14: () => fedB,
  15: () => vixD,
  16: () => csD,
  17: () => gdD,
  18: () => capexGdpD,
  19: () => capexCfD,
};

function updateChart(idx, val) {
  const getArr = CHART_MAP[idx];
  if (!getArr) return;
  const arr = getArr();
  const last = arr[arr.length - 1];
  if (last && (last.y === "2026" || last.y === "2025")) {
    last.v = Math.round(val * 100) / 100;
  }
}

/* ══════════════ RISK SCORING ══════════════ */
const riskScore = (nv, na, nc, dir) => {
  const raw = dir === 1
    ? ((nv - na) / (nc - na)) * 100
    : ((na - nv) / (na - nc)) * 100;
  return Math.round(Math.max(0, Math.min(100, raw)));
};
const sigFromScore = sc => sc <= 33 ? "green" : sc <= 66 ? "yellow" : "red";

/* ══════════════ METRICS ══════════════ */
let MS = [
  {nm:"Shiller CAPE Ratio",cur:"37.5",c00:"44.2",c08:"27.5",avg:"17.4",dir:1,nv:37.5,na:17.4,nc:44.2,sc:riskScore(37.5,17.4,44.2,1),sig:sigFromScore(riskScore(37.5,17.4,44.2,1)),tab:1,
    info:"How many years of profits are you paying for? Take the S&P 500 price ÷ 10-year average inflation-adjusted earnings. Example: A lemonade stand earning $10/year — if you pay $375, the CAPE is 37.5. You're paying nearly 38 years' profits upfront. Average is ~17.4, so at 37.5 you pay more than double the normal price.",
    calc:"S&P 500 Price ÷ 10Y Avg Inflation-Adj EPS",
    src:"Multpl / Shiller",srcUrl:"https://www.multpl.com/shiller-pe",asOf:"Mar 17, 2026",freq:"daily"},
  {nm:"Forward P/E",cur:"21.8",c00:"25.5",c08:"15.2",avg:"16.7",dir:1,nv:21.8,na:16.7,nc:25.5,sc:riskScore(21.8,16.7,25.5,1),sig:sigFromScore(riskScore(21.8,16.7,25.5,1)),tab:1,
    info:"How much you pay for NEXT year's expected profits. If Apple earns $7/share next year and trades at $153, its P/E is ~21.8x. For the S&P 500 at 21.8x, you pay $21.80 per $1 of expected earnings. Unlike 2000, today's expectations are backed by real earnings growth.",
    calc:"S&P 500 Price ÷ Next-12-Month Expected EPS",
    src:"Yardeni Research Morning Briefing",srcUrl:"https://archive.yardeni.com/morning-briefing-2026/",asOf:"Mar 21, 2026",freq:"weekly"},
  {nm:"Buffett Indicator",cur:"230%",c00:"148%",c08:"110%",avg:"90%",dir:1,nv:230,na:90,nc:148,sc:riskScore(230,90,148,1),sig:sigFromScore(riskScore(230,90,148,1)),tab:1,
    info:"Buffett's favorite: total stock market value vs. the entire economy. If all companies are worth $67T but the economy produces $29T/year = 230%. Like a restaurant valued at 2.3x annual revenue. BUT: companies earn a large share overseas, and GDP only counts domestic output, so the ratio structurally overstates.",
    calc:"Total US Market Cap ÷ US GDP × 100",
    src:"GuruFocus",srcUrl:"https://www.gurufocus.com/stock-market-valuations.php",asOf:"Mar 17, 2026",freq:"daily"},
  {nm:"Equity Risk Premium (Fwd EY − 10Y)",cur:"0.3%",c00:"−0.5%",c08:"2.0%",avg:"4.0%",dir:-1,nv:0.3,na:4.0,nc:-0.5,sc:riskScore(0.3,4.0,-0.5,-1),sig:sigFromScore(riskScore(0.3,4.0,-0.5,-1)),tab:1,
    info:"The 'bonus return' stocks offer over safe bonds, measured as forward earnings yield minus the 10-year Treasury yield. If the S&P 500 forward earnings yield is 4.6% and the 10Y Treasury pays 4.3%, the ERP is 0.3%. In 2000, this went NEGATIVE — investors accepted LESS return from risky stocks than safe bonds. Today, the premium is still positive, but razor-thin.",
    calc:"Forward Earnings Yield − 10Y Treasury Yield",
    src:"Derived from Yardeni + FRED DGS10",srcUrl:"https://archive.yardeni.com/morning-briefing-2026/",asOf:"Mar 19, 2026",freq:"daily"},
  {nm:"Top 10 Concentration",cur:"37.2%",c00:"27%",c08:"20%",avg:"19%",dir:1,nv:37.2,na:19,nc:27,sc:riskScore(37.2,19,27,1),sig:sigFromScore(riskScore(37.2,19,27,1)),tab:2,
    info:"What % of the S&P 500 is just the 10 biggest companies. Imagine 500 students where the top 10 hold 37.2% of all lunch money. If one has a bad day, everyone suffers. Apple + Microsoft + NVIDIA alone still account for a huge share of the index. Concentration remains historically extreme.",
    calc:"Top 10 Market Caps ÷ Total S&P 500 Cap × 100",
    src:"S&P / SlickCharts",srcUrl:"https://www.slickcharts.com/sp500",asOf:"Mar 14, 2026",freq:"weekly"},
  {nm:"FINRA Margin Debt",cur:"$1.21T",c00:"$278B",c08:"$381B",avg:"$347B",dir:1,nv:1214,na:347,nc:381,sc:riskScore(1214,347,381,1),sig:sigFromScore(riskScore(1214,347,381,1)),tab:2,
    info:"Money borrowed to buy stocks. You have $100K, borrow $100K more from your broker = margin debt. Roughly $1.21T is currently borrowed nationwide. Danger: if stocks drop, brokers demand repayment ('margin call'), forcing selling → prices drop → more margin calls. A cascade.\n\n⚠️ IMPORTANT: This nominal figure is NOT inflation-adjusted and naturally grows with the economy. For a meaningful cross-era comparison, see Margin Debt / Market Cap, which shows leverage is still below 2000 and 2008 levels.",
    calc:"Total dollars borrowed from brokers to buy securities",
    src:"FINRA",srcUrl:"https://www.finra.org/rules-guidance/key-topics/margin-accounts/margin-statistics",asOf:"Jan 2026",freq:"monthly"},
  {nm:"Margin Debt / Mkt Cap",cur:"1.68%",c00:"2.5%",c08:"2.7%",avg:"2.0%",dir:1,nv:1.68,na:2.0,nc:2.7,sc:riskScore(1.68,2.0,2.7,1),sig:sigFromScore(riskScore(1.68,2.0,2.7,1)),tab:2,
    info:"Borrowed money RELATIVE to market size — the fairer measure. Borrowing $100K is risky at $500K portfolio (20%) but modest at $5M (2%). At 1.68%, today's leverage is BELOW both 2000 (2.5%) and 2008 (2.7%). Less aggressive than the raw nominal debt number suggests.",
    calc:"Margin Debt ÷ Total Market Cap × 100",
    src:"FINRA / market cap",srcUrl:"https://www.finra.org/rules-guidance/key-topics/margin-accounts/margin-statistics",asOf:"Jan 2026",freq:"monthly"},
  {nm:"Yield Curve (10Y−2Y)",cur:"+52bp",c00:"−50bp",c08:"−20bp",avg:"+100bp",dir:-1,nv:0.52,na:1.0,nc:-0.5,sc:riskScore(0.52,1.0,-0.5,-1),sig:sigFromScore(riskScore(0.52,1.0,-0.5,-1)),tab:3,
    info:"Difference between long-term and short-term bond rates. Normally long rates are higher. When short > long ('inverted'), recession follows in 12-24 months. Like a 2-year CD paying 4.5% while a 10-year pays only 4.0% — something's off. Today at +52bp, positively sloped — a healthy sign.",
    calc:"10Y Treasury Yield − 2Y Treasury Yield (100bp = 1%)",
    src:"FRED T10Y2Y",srcUrl:"https://fred.stlouisfed.org/series/T10Y2Y",asOf:"Mar 17, 2026",freq:"daily"},
  {nm:"HY Credit Spread",cur:"3.3%",c00:"8.0%",c08:"21.8%",avg:"4.9%",dir:-1,nv:3.3,na:4.9,nc:2.0,sc:riskScore(3.3,4.9,2.0,-1),sig:sigFromScore(riskScore(3.3,4.9,2.0,-1)),tab:3,
    info:"Extra interest risky companies pay vs. the government. Govt borrows at 4%, junk-rated company at 7.2% — spread = 3.2%. Tight spread = investors feel safe. Before 2008, spreads were 2.6% — then exploded to 21.8%. Today's 3.2% signals calm, possibly too calm.",
    calc:"High-Yield Bond Yield − Treasury Yield",
    src:"FRED BAMLH0A0HYM2",srcUrl:"https://fred.stlouisfed.org/series/BAMLH0A0HYM2",asOf:"Mar 17, 2026",freq:"daily"},
  {nm:"Household Debt/Income",cur:"93%",c00:"97%",c08:"133%",avg:"100%",dir:1,nv:93,na:100,nc:133,sc:riskScore(93,100,133,1),sig:sigFromScore(riskScore(93,100,133,1)),tab:3,
    info:"How much families owe vs. earn (FRED Z.1 Financial Accounts series). Earn $100K, owe $93K total = 93%. In 2008, 133% — families owed MORE than a year's income. At 93%, consumers remain in strong shape. Arguably the strongest 'not a bubble' data point: the consumer isn't overleveraged.",
    calc:"Total Household Debt ÷ Disposable Income × 100",
    src:"FRED Z.1",srcUrl:"https://fred.stlouisfed.org/series/BOGZ1FL154190006Q",asOf:"Q3 2025",freq:"quarterly"},
  {nm:"S&P 500 EPS Growth (Est.)",cur:"+15.2%",c00:"−2%",c08:"−30%",avg:"+8%",dir:-1,nv:15.2,na:8,nc:-30,sc:riskScore(15.2,8,-30,-1),sig:sigFromScore(riskScore(15.2,8,-30,-1)),tab:4,
    info:"How fast company profits grow year-over-year. Earned $200/share last year, $230 this year = +15%. High prices are only 'bubbly' if earnings don't keep up. At +15.2%, nearly double the average. In 2000, earnings FELL. In 2008, they collapsed −30%.",
    calc:"Current Year EPS ÷ Prior Year EPS − 1",
    src:"Yardeni Research Morning Briefing",srcUrl:"https://archive.yardeni.com/morning-briefing-2026/",asOf:"Mar 21, 2026",freq:"weekly"},
  {nm:"Real GDP Growth (YoY)",cur:"2.0%",c00:"1.0%",c08:"−4.3%",avg:"2.5%",dir:-1,nv:2.0,na:2.5,nc:-4.3,sc:riskScore(2.0,2.5,-4.3,-1),sig:sigFromScore(riskScore(2.0,2.5,-4.3,-1)),tab:4,
    info:"Real (inflation-adjusted) growth of the entire US economy, year-over-year. At 2.0%, the economy is expanding slightly below its long-run average of 2.5%. Before 2008, GDP SHRANK 4.3%. Today the economy grows at a solid pace, meaning the real economy supports stock prices.",
    calc:"Change in Inflation-Adjusted GDP (annualized %)",
    src:"FRED / BEA",srcUrl:"https://fred.stlouisfed.org/series/A191RL1Q225SBEA",asOf:"Q4 2025",freq:"quarterly"},
  {nm:"Fed Funds Rate",cur:"3.6%",c00:"6.5%",c08:"5.25%",avg:"3.5%",dir:1,nv:3.6,na:3.5,nc:6.5,sc:riskScore(3.6,3.5,6.5,1),sig:sigFromScore(riskScore(3.6,3.5,6.5,1)),tab:5,
    info:"The rate banks charge each other overnight — the most important rate in the world. Ripples through mortgages, car loans, everything. At 3.6%, near average. Before 2000 and 2008, the Fed pushed to 5-6.5%, choking the economy. Today the Fed is CUTTING — tailwinds, not headwinds.",
    calc:"Set by the Fed's FOMC at 8 meetings/year",
    src:"FRED DFF",srcUrl:"https://fred.stlouisfed.org/series/DFF",asOf:"Mar 17, 2026",freq:"daily"},
  {nm:"M2 Money Supply",cur:"$22.4T",c00:"$4.9T",c08:"$8.0T",avg:"N/A",dir:1,nv:72,na:60,nc:93,scoreNote:"Scored as M2/GDP ratio",sc:riskScore(72,60,93,1),sig:sigFromScore(riskScore(72,60,93,1)),tab:5,
    info:"All money in the economy: cash, checking, savings. Think of M2 as 'water' in the economic pool. During COVID the Fed pumped 40% more in ($15T → $21.7T). More money chasing same goods = higher prices. At $22.4T growing 4.6%/yr (above GDP), the pool is still very full.",
    calc:"Currency + checking + savings + money market funds",
    src:"FRED M2SL",srcUrl:"https://fred.stlouisfed.org/series/M2SL",asOf:"Jan 2026",freq:"monthly"},
  {nm:"Fed Balance Sheet",cur:"$6.7T",c00:"$0.6T",c08:"$0.9T",avg:"N/A",dir:1,nv:21.2,na:6,nc:37.8,scoreNote:"Scored as Fed BS/GDP ratio",sc:riskScore(21.2,6,37.8,1),sig:sigFromScore(riskScore(21.2,6,37.8,1)),tab:5,
    info:"How much the Fed 'owns' — bonds bought to pump money in. Imagine a giant shopping cart: $0.9T before 2008, then $8.8T by 2022 via buying sprees. Now slowly putting things back ($6.7T). More buying = higher prices. The unwinding is orderly but slow.",
    calc:"Total Fed assets (bonds, MBS, etc.)",
    src:"FRED WALCL",srcUrl:"https://fred.stlouisfed.org/series/WALCL",asOf:"Mar 11, 2026",freq:"weekly"},
  {nm:"VIX",cur:"24.1",c00:"33",c08:"80",avg:"19",dir:-1,nv:24.1,na:19,nc:10,sc:riskScore(24.1,19,10,-1),sig:sigFromScore(riskScore(24.1,19,10,-1)),tab:6,
    info:"The 'fear gauge': expected market swings over 30 days from options prices. VIX 24.1 = market expects roughly 24% annual moves. Below 12 = dangerously calm. Above 30 = fear. Pre-bubble VIX was LOW (9-11 in 2006-07) = complacency. Today's reading is actually healthier than an ultra-low VIX.",
    calc:"From S&P 500 options; annualized expected volatility",
    src:"FRED VIXCLS",srcUrl:"https://fred.stlouisfed.org/series/VIXCLS",asOf:"Mar 17, 2026",freq:"daily"},
  {nm:"Case-Shiller HPI",cur:"332.0",c00:"100",c08:"190→140",avg:"N/A",dir:1,nv:332.0,na:150,nc:305,sc:riskScore(332.0,150,305,1),sig:sigFromScore(riskScore(332.0,150,305,1)),tab:7,
    info:"Home prices across 20 cities, indexed to 100 in 2000. At 332.0, homes cost 3.3x what they did then. In 2006 it peaked near 190 before crashing. But the driver is different: 2006 = reckless lending; today = housing shortage. FICO ~740 (vs ~700), 95% fixed-rate.",
    calc:"Repeat-sale index tracking same homes, 20 metros",
    src:"FRED CSUSHPINSA",srcUrl:"https://fred.stlouisfed.org/series/CSUSHPINSA",asOf:"Dec 2025",freq:"monthly (2mo lag)"},
  {nm:"Global Debt/GDP (BIS Proxy)",cur:"246.3%",c00:"190.9%*",c08:"216.6%",avg:"227.8%",dir:1,nv:246.3,na:227.8,nc:285.0,sc:riskScore(246.3,227.8,285.0,1),sig:sigFromScore(riskScore(246.3,227.8,285.0,1)),tab:8,
    info:"A BIS-based proxy for global leverage using total credit to the non-financial sector across all reporting economies, expressed as a percentage of GDP. It captures sovereign, household, and corporate leverage across the BIS reporting aggregate. The latest reading is 246.3% of GDP. This proxy is lower than IIF-style global total debt measures, but it is fully dynamic, sourced directly from BIS, and methodologically transparent.",
    calc:"BIS Total Credit to Non-Financial Sector (All Reporting Economies, Market Value) ÷ GDP × 100",
    src:"BIS Total Credit Dashboard",srcUrl:"https://data.bis.org/topics/TOTAL_CREDIT/tables-and-dashboards",asOf:"2025-Q3",freq:"quarterly"},
  {nm:"Capex / GDP",cur:"13.9%",c00:"14.6%",c08:"13.1%",avg:"13.0%",dir:1,nv:13.9,na:13.0,nc:14.6,sc:riskScore(13.9,13.0,14.6,1),sig:sigFromScore(riskScore(13.9,13.0,14.6,1)),tab:2,
    info:"Private nonresidential fixed investment as a percentage of GDP — measures how aggressively corporations are investing relative to the economy. At 13.9%, approaching the dot-com peak of 14.6% when companies massively overinvested in telecom infrastructure. The current AI capex boom ($300B+ committed by hyperscalers) is driving this higher. Overinvestment becomes dangerous when spending exceeds what the economy can productively absorb.",
    calc:"FRED PNFI ÷ Nominal GDP × 100",
    src:"FRED PNFI / GDP",srcUrl:"https://fred.stlouisfed.org/series/PNFI",asOf:"Q4 2025",freq:"quarterly"},
  {nm:"Capex / Operating Cash Flow (FRED Proxy)",cur:"111%",c00:"142.3%",c08:"135.2%",avg:"120.0%",dir:1,nv:111.0,na:120.0,nc:142.3,sc:riskScore(111.0,120.0,142.3,1),sig:sigFromScore(riskScore(111.0,120.0,142.3,1)),tab:2,
    info:"A dynamic proxy for capex intensity using private nonresidential fixed investment divided by corporate net cash flow with IVA (inventory valuation adjustment). It is broader than the original S&P 500-only metric, but it updates automatically from FRED and tracks whether corporate capex is outrunning internally generated cash.",
    calc:"FRED PNFI ÷ FRED CNCF × 100",
    src:"FRED PNFI / CNCF",srcUrl:"https://fred.stlouisfed.org/series/CNCF",asOf:"Q4 2025",freq:"quarterly"},
];
let OS_SUM = MS.reduce((a,m) => a + m.sc, 0);
let OS = Math.round(OS_SUM / MS.length);

const tabNames = ["Dashboard","Equity Valuation","Market Structure","Credit & Debt","Macro","Monetary Policy","Sentiment","Housing","Global Risk","Data Health","Report"];
const primaryNavTabs = [
  { idx:0, label:"Dashboard" },
  { idx:1, label:"Equity Valuation" },
  { idx:2, label:"Market Structure" },
  { idx:3, label:"Credit & Debt" },
  { idx:4, label:"Macro" },
  { idx:5, label:"Monetary Policy" },
  { idx:6, label:"Sentiment" },
  { idx:7, label:"Housing" },
  { idx:8, label:"Global Risk" },
  { idx:10, label:"Report" },
];
const METRIC_SCROLL_TARGETS = [
  { tab:1, anchorId:"metric-cape" },
  { tab:1, anchorId:"metric-forward-pe" },
  { tab:1, anchorId:"metric-buffett" },
  { tab:1, anchorId:"metric-erp" },
  { tab:2, anchorId:"metric-top-10-concentration" },
  { tab:2, anchorId:"metric-margin-debt" },
  { tab:2, anchorId:"metric-margin-debt-market-cap" },
  { tab:3, anchorId:"metric-yield-curve" },
  { tab:3, anchorId:"metric-hy-credit-spread" },
  { tab:3, anchorId:"metric-household-debt-income" },
  { tab:4, anchorId:"metric-eps-growth" },
  { tab:4, anchorId:"metric-real-gdp-growth" },
  { tab:5, anchorId:"metric-fed-funds-rate" },
  { tab:5, anchorId:"metric-m2-money-supply" },
  { tab:5, anchorId:"metric-fed-balance-sheet" },
  { tab:6, anchorId:"metric-vix" },
  { tab:7, anchorId:"metric-case-shiller" },
  { tab:8, anchorId:"metric-global-debt-gdp" },
  { tab:2, anchorId:"metric-capex-gdp" },
  { tab:2, anchorId:"metric-capex-operating-cash-flow" },
];

/* ══════════════ CONTEXT ══════════════ */
const Ctx = createContext(themes.dark);
const useT = () => useContext(Ctx);

function SunIcon({ color = "#7c2d12" }) {
  return (
    <svg width="12" height="12" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="3.5" fill={color} />
      {[
        [10, 1.5, 10, 4],
        [10, 16, 10, 18.5],
        [1.5, 10, 4, 10],
        [16, 10, 18.5, 10],
        [4, 4, 5.8, 5.8],
        [14.2, 14.2, 16, 16],
        [4, 16, 5.8, 14.2],
        [14.2, 5.8, 16, 4],
      ].map(([x1, y1, x2, y2], i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="1.6" strokeLinecap="round" />
      ))}
    </svg>
  );
}

function MoonIcon({ color = "#0f172a" }) {
  return (
    <svg width="12" height="12" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M12.8 2.4a7.9 7.9 0 1 0 4.8 14.1A8.6 8.6 0 0 1 12.8 2.4Z"
        fill={color}
        opacity="0.95"
      />
    </svg>
  );
}

/* ══════════════ SMALL COMPONENTS ══════════════ */
const sigColor = (s, t) => s === "green" ? t.green : s === "yellow" ? t.yellow : t.red;
const sigBg = (s, t) => s === "green" ? t.greenBg : s === "yellow" ? t.yellowBg : t.redBg;
const sigBd = (s, t) => s === "green" ? t.greenBorder : s === "yellow" ? t.yellowBorder : t.redBorder;
const healthToSignal = status => status === "error" ? "red" : status === "warn" ? "yellow" : "green";
const formatDateTime = value => {
  if (!value) return "N/A";
  const dt = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(dt.getTime())) return String(value);
  return dt.toLocaleString([], { month:"short", day:"numeric", year:"numeric", hour:"numeric", minute:"2-digit" });
};
const formatCalendarDate = value => {
  if (!value) return "N/A";
  const dt = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(dt.getTime())) return String(value);
  return dt.toLocaleDateString([], { month:"short", day:"numeric", year:"numeric" });
};
const formatCalcNumber = value => (
  Number.isFinite(value)
    ? Number(value.toFixed(2)).toString()
    : String(value)
);

function Badge({ signal }) {
  const t = useT();
  const c = sigColor(signal, t);
  return (
    <span className={signal === "red" ? "badge-elevated" : ""} style={{display:"inline-flex",alignItems:"center",gap:5,padding:"3px 10px",borderRadius:20,fontSize:9,fontWeight:700,letterSpacing:1.2,background:sigBg(signal,t),color:c,border:`1px solid ${sigBd(signal,t)}`}}>
      <span style={{width:5,height:5,borderRadius:"50%",background:c,boxShadow:`0 0 6px ${c}55`}} />
      {signal === "green" ? "HEALTHY" : signal === "yellow" ? "CAUTION" : "ELEVATED"}
    </span>
  );
}

function HealthBadge({ status }) {
  return <Badge signal={healthToSignal(status)} />;
}

function RiskBar({ score }) {
  const t = useT();
  const c = score < 30 ? t.green : score < 60 ? t.yellow : t.red;
  return (
    <div style={{display:"flex",alignItems:"center",gap:6,minWidth:80}}>
      <div style={{flex:1,height:5,borderRadius:3,background:t.riskBarBg,overflow:"hidden"}}>
        <div className="risk-bar-fill" style={{width:`${score}%`,height:"100%",borderRadius:3,background:`linear-gradient(90deg, ${c}88, ${c})`}} />
      </div>
      <span style={{fontSize:10,fontWeight:700,color:c,minWidth:18,fontFamily:"'JetBrains Mono',monospace"}}>{score}</span>
    </div>
  );
}

function InfoBtn({ info, calc, name }) {
  const t = useT();
  const [open, setOpen] = useState(false);
  const btnRef = useRef(null);
  const popRef = useRef(null);
  const [pos, setPos] = useState({top:0,left:0});

  useEffect(() => {
    if (!open) return;
    const fn = (e) => {
      if (btnRef.current?.contains(e.target)) return;
      if (popRef.current && !popRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, [open]);

  useEffect(() => {
    if (open && btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      const popW = 340;
      let left = r.left + r.width / 2 - popW / 2;
      if (left < 8) left = 8;
      if (left + popW > window.innerWidth - 8) left = window.innerWidth - popW - 8;
      let top = r.bottom + 8;
      if (top + 300 > window.innerHeight) top = r.top - 308;
      if (top < 8) top = 8;
      setPos({top, left});
    }
  }, [open]);

  return (
    <span style={{display:"inline-flex",verticalAlign:"middle"}}>
      <button ref={btnRef} onClick={(e) => { e.stopPropagation(); setOpen(!open); }} style={{
        width:18,height:18,borderRadius:"50%",border:`1.5px solid ${open ? t.accent : t.borderLight}`,
        background:open ? t.accentBg : "transparent",color:open ? t.accent : t.textDim,
        fontSize:11,fontWeight:700,cursor:"pointer",display:"inline-flex",alignItems:"center",
        justifyContent:"center",padding:0,marginLeft:6,fontFamily:"Georgia,serif",fontStyle:"italic"
      }}>i</button>
      {open && ReactDOM.createPortal(
        <div ref={popRef} className="animate-scale-in" onClick={(e) => e.stopPropagation()} style={{
          position:"fixed",top:pos.top,left:pos.left,width:340,zIndex:10000,
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
              <div style={{fontSize:11,color:t.accent,fontFamily:"'JetBrains Mono',monospace",fontWeight:600}}>{calc}</div>
            </div>
          )}
        </div>,
        document.body
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
              <span style={{fontSize:11,color:t.accent,fontFamily:"'JetBrains Mono',monospace",fontWeight:600}}>{calc}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Card({ children, style }) {
  const t = useT();
  return <div className="card-hover mobile-pad" style={{background:t.bgCard,border:`1px solid ${t.border}`,borderRadius:16,padding:20,boxShadow:t.cardShadow,backdropFilter:"blur(12px)",WebkitBackdropFilter:"blur(12px)",...style}}>{children}</div>;
}

function ChartTip({ active, payload, label }) {
  const t = useT();
  const rows = payload?.filter(p => p.name);
  if (!active || !rows?.length) return null;
  return (
    <div style={{background:t.tooltipBg,border:`1px solid ${t.border}`,borderRadius:8,padding:"8px 14px",boxShadow:t.shadow}}>
      <p style={{color:t.textDim,fontSize:11,margin:0}}>{label}</p>
      {rows.map((p, i) => <p key={i} style={{color:p.color,fontSize:13,fontWeight:700,margin:"3px 0 0"}}>{p.name}: {typeof p.value === "number" ? p.value.toLocaleString() : p.value}{p.unit || ""}</p>)}
    </div>
  );
}

function ChartCard({ title, sub, children, signal, interp, anchorId }) {
  const t = useT();
  return (
    <section id={anchorId} style={{margin:0,scrollMarginTop:140}}>
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
        <div style={{marginTop:14,padding:"12px 16px",background:t.bgCardAlt,borderRadius:10}}>
          <p style={{margin:0,fontSize:13,lineHeight:1.65,color:t.textMuted}}>{interp}</p>
        </div>
      )}
    </Card>
    </section>
  );
}

function buildYearTicks(data, step = 5) {
  const years = data
    .map((row) => Number(row.y))
    .filter((year) => Number.isFinite(year));
  if (!years.length || years.length !== data.length) return undefined;

  const firstYear = years[0];
  const lastYear = years[years.length - 1];
  const ticks = data
    .filter((row) => {
      const year = Number(row.y);
      return year === firstYear || (year - firstYear) % step === 0;
    })
    .map((row) => row.y);

  const lastTickYear = Number(ticks[ticks.length - 1]);
  if (!ticks.includes(String(lastYear)) && lastYear - lastTickYear >= Math.max(2, Math.floor(step / 2))) {
    ticks.push(String(lastYear));
  }

  return ticks;
}

function StatBox({ label, value, sub, color }) {
  const t = useT();
  return (
    <div style={{textAlign:"center",padding:"10px 4px"}}>
      <div style={{fontSize:9,color:t.textDim,textTransform:"uppercase",letterSpacing:1.5,fontWeight:600}}>{label}</div>
      <div style={{fontSize:26,fontWeight:400,color:color || t.text,marginTop:4,fontFamily:"'Instrument Serif',Georgia,serif"}}>{value}</div>
      {sub && <div style={{fontSize:10,color:t.textMuted,marginTop:2}}>{sub}</div>}
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
    <svg viewBox="0 0 200 120" style={{width:"100%",maxWidth:200,display:"block",margin:"0 auto"}}>
      <defs>
        <filter id="arcGlow"><feGaussianBlur stdDeviation="4" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>
      <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke={t.riskBarBg} strokeWidth="10" strokeLinecap="round" />
      <path className="gauge-arc" d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke={c} strokeWidth="10" strokeLinecap="round"
        strokeDasharray={`${score * 2.51} 251`} filter="url(#arcGlow)" />
      <line x1="100" y1="100" x2={nx} y2={ny} stroke={t.text} strokeWidth="2" strokeLinecap="round" />
      <circle cx="100" cy="100" r="3.5" fill={t.text} />
      <text x="100" y="82" textAnchor="middle" fill={c} fontSize="32" fontWeight="400" fontFamily="'Instrument Serif',Georgia,serif">{score}</text>
      <text x="100" y="115" textAnchor="middle" fill={t.textDim} fontSize="8" fontWeight="600" letterSpacing="3">OF 100</text>
    </svg>
  );
}

/* ══════════════ AREA CHART HELPER ══════════════ */
function AC({ data, color, id, yFmt, refY, refLabel, refColor, name, domainY, unit, baseValue, xTicks }) {
  const t = useT();
  const years = data.map(d => d.y);
  const hasDotCom = years.includes("2000");
  const hasGFC = years.includes("2008") || years.includes("2007") || years.includes("2009");
  const gfcYear = years.includes("2008") ? "2008" : years.includes("2007") ? "2007" : years.includes("2009") ? "2009" : null;
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
        <XAxis dataKey="y" ticks={xTicks} interval={xTicks ? 0 : undefined} tick={{fontSize:10,fill:t.textDim}} />
        <YAxis tick={{fontSize:10,fill:t.textDim}} tickFormatter={yFmt} domain={domainY} />
        <Tooltip content={<ChartTip />} />
        {hasDotCom && <ReferenceLine x="2000" stroke={t.orange} strokeDasharray="4 4" strokeOpacity={0.6} label={{value:"Tech Bubble",fill:t.orange,fontSize:9,fontWeight:600,position:"insideTopRight",dy:4}} />}
        {hasGFC && gfcYear && <ReferenceLine x={gfcYear} stroke={t.red} strokeDasharray="4 4" strokeOpacity={0.6} label={{value:"GFC",fill:t.red,fontSize:9,fontWeight:600,position:"insideTopRight",dy:4}} />}
        {refY != null && <ReferenceLine y={refY} stroke={refColor || t.refLabel} strokeDasharray="6 3" label={{value:refLabel,fill:refColor || t.refLabel,fontSize:10,position:"insideTopLeft",dy:-8}} />}
        <Area type="monotone" dataKey="v" stroke={color} fill={`url(#${id})`} strokeWidth={2.5} name={name} unit={unit} dot={false} baseValue={baseValue} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function EpsHistoryChart({ data }) {
  const t = useT();
  const fillId = useId().replace(/:/g, "");
  const series = data.map((row) => ({
    ...row,
    shade: row.estimate ?? row.actual,
  }));
  const yearTicks = series
    .filter((row) => row.period?.endsWith("-Q1"))
    .filter((row, idx, rows) => {
      const year = Number(row.period.slice(0, 4));
      const lastYear = Number(rows[rows.length - 1]?.period.slice(0, 4) || year);
      return idx === 0 || year === lastYear || year % 4 === 0;
    })
    .map((row) => row.period);
  return (
    <ResponsiveContainer>
      <ComposedChart data={series}>
        <defs>
          <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={t.green} stopOpacity={0.2} />
            <stop offset="100%" stopColor={t.green} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={t.gridStroke} />
        <XAxis
          dataKey="period"
          ticks={yearTicks}
          interval={0}
          tick={{fontSize:9,fill:t.textDim}}
          tickFormatter={(value) => value?.slice(0, 4)}
        />
        <YAxis tick={{fontSize:10,fill:t.textDim}} tickFormatter={(v) => `${v}%`} />
        <Tooltip content={<ChartTip />} />
        <ReferenceLine x="2000-Q1" stroke={t.orange} strokeDasharray="4 4" strokeOpacity={0.6} label={{value:"Tech Bubble",fill:t.orange,fontSize:9,fontWeight:600,position:"insideTopRight",dy:4}} />
        <ReferenceLine x="2008-Q1" stroke={t.red} strokeDasharray="4 4" strokeOpacity={0.6} label={{value:"GFC",fill:t.red,fontSize:9,fontWeight:600,position:"insideTopRight",dy:4}} />
        <ReferenceLine y={0} stroke={t.refLabel} strokeDasharray="6 3" label={{value:"Zero",fill:t.refLabel,fontSize:10,position:"insideTopLeft",dy:-8}} />
        <Area type="monotone" dataKey="shade" stroke="none" fill={`url(#${fillId})`} baseValue={0} isAnimationActive={false} />
        <Line type="monotone" dataKey="actual" stroke={t.green} strokeWidth={2.5} dot={false} connectNulls name="Actual" unit="%" />
        <Line type="monotone" dataKey="estimate" stroke={t.green} strokeWidth={2.5} strokeDasharray="6 4" dot={false} connectNulls name="Estimate" unit="%" />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

/* ══════════════ SOURCE NOTE HELPER ══════════════ */
function SrcNote({ m }) {
  const t = useT();
  if (!m.src) return null;
  return (
    <div style={{fontSize:10,color:t.textDim,marginTop:6}}>
      Source: <a href={m.srcUrl} target="_blank" rel="noreferrer" style={{color:t.accent,textDecoration:"none"}}>{m.src}</a>
      {m.asOf ? ` · as of ${m.asOf}` : ""}
      {m.freq ? ` · ${m.freq}` : ""}
    </div>
  );
}

/* ══════════════ TABS ══════════════ */
function TabDash({ goToMetric, dataHealth }) {
  const t = useT();
  const isDarkTheme = t === themes.dark;
  const methodologyModalBg = isDarkTheme ? "#101522" : t.bgCard;
  const methodologyInsetBg = isDarkTheme ? "#0b1020" : t.bgCardAlt;
  const [methOpen, setMethOpen] = useState(false);
  const liveSignal = healthToSignal(dataHealth?.summary?.status || "ok");
  const greens = MS.filter(m => m.sig === "green");
  const reds = MS.filter(m => m.sig === "red");
  const radarD = [
    {s:"Equity", sc: Math.round([0,1,2,3].reduce((a,i) => a + MS[i].sc, 0) / 4)},
    {s:"Mkt Str.", sc: Math.round([4,5,6,18,19].reduce((a,i) => a + MS[i].sc, 0) / 5)},
    {s:"Credit", sc: Math.round([7,8,9].reduce((a,i) => a + MS[i].sc, 0) / 3)},
    {s:"Macro", sc: Math.round([10,11].reduce((a,i) => a + MS[i].sc, 0) / 2)},
    {s:"Money", sc: Math.round([12,13,14].reduce((a,i) => a + MS[i].sc, 0) / 3)},
    {s:"Sent.", sc: MS[15].sc},
    {s:"Housing", sc: MS[16].sc},
    {s:"Global", sc: MS[17].sc},
  ];

  return (
    <div>
      <div style={{textAlign:"center",padding:"28px 0 20px"}}>
        <div style={{fontSize:10,color:t.accent,letterSpacing:4,textTransform:"uppercase",fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
  <span style={{display:"inline-block",width:6,height:6,borderRadius:"50%",background:sigColor(liveSignal, t),boxShadow:`0 0 8px ${sigColor(liveSignal, t)}`,animation:"pulse-live 2s ease-in-out infinite"}} />
  Live Multi-Factor Analysis
</div>
        <h1 className="main-title" style={{fontSize:40,fontWeight:400,color:t.text,margin:"8px 0",letterSpacing:-0.5,fontFamily:"'Instrument Serif',Georgia,serif"}}>Bubble Risk Monitor</h1>
        <p className="main-subtitle" style={{color:t.textMuted,fontSize:13,maxWidth:700,margin:"0 auto",letterSpacing:0.3}}>20 indicators compared against the Dot-Com Bubble (2000) and Global Financial Crisis (2008).</p>
      </div>

      <Card style={{marginBottom:16}}>
        <div className="grid-dash-main" style={{display:"grid",gridTemplateColumns:"1fr 2fr 1fr",gap:16,alignItems:"center"}}>
          <div style={{textAlign:"center",position:"relative"}}>
            <div style={{fontSize:10,color:t.textDim,textTransform:"uppercase",letterSpacing:2,fontWeight:600,marginBottom:4,display:"flex",alignItems:"center",justifyContent:"center",gap:4}}>
              Composite Risk
              <button onClick={() => setMethOpen(true)} style={{
                width:16,height:16,borderRadius:"50%",border:`1.5px solid ${t.borderLight}`,
                background:"transparent",color:t.textDim,fontSize:10,fontWeight:700,cursor:"pointer",
                display:"inline-flex",alignItems:"center",justifyContent:"center",padding:0,
                fontFamily:"Georgia,serif",fontStyle:"italic"
              }}>i</button>
            </div>
            <Gauge score={OS} />
            <div style={{marginTop:6}}>
              <span style={{padding:"4px 12px",borderRadius:20,fontSize:10,fontWeight:700,letterSpacing:1,background:t.yellowBg,color:t.yellow,border:`1px solid ${t.yellowBorder}`}}>ELEVATED — NOT A BUBBLE</span>
            </div>
            {methOpen && ReactDOM.createPortal(
              <div onClick={() => setMethOpen(false)} style={{position:"fixed",top:0,left:0,right:0,bottom:0,zIndex:10000,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
                <div className="animate-scale-in" onClick={e => e.stopPropagation()} style={{width:"min(440px, calc(100vw - 32px))",maxHeight:"80vh",overflow:"auto",background:methodologyModalBg,border:`1px solid ${t.border}`,borderRadius:14,padding:"20px 22px",boxShadow:t.shadow,textAlign:"left"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                    <div style={{fontSize:13,fontWeight:700,color:t.accent,letterSpacing:0.5}}>Composite Score Methodology</div>
                    <button onClick={() => setMethOpen(false)} style={{background:"none",border:"none",color:t.textDim,cursor:"pointer",fontSize:18,padding:0,lineHeight:1}}>×</button>
                  </div>
                  <div style={{fontSize:12,color:t.textMuted,marginBottom:8,lineHeight:1.6}}>Each metric scored 0–100 based on where its current value sits between the historical average (score 0) and the worst crisis-era peak (score 100).</div>
                  <div style={{fontSize:11,color:t.textDim,marginBottom:14,lineHeight:1.5,fontFamily:"'JetBrains Mono',monospace",padding:"8px 10px",background:methodologyInsetBg,borderRadius:8,border:`1px solid ${t.border}`}}>Formula: (Current − Avg) / (Crisis − Avg) × 100, clamped 0–100. For metrics where lower = riskier, the formula inverts.</div>
                  <div style={{marginBottom:14}}>
                    {MS.map((m,i) => (
                      <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"5px 0",borderBottom:`1px solid ${t.border}`,gap:8}}>
                        <span style={{fontSize:11,color:t.text,flex:1,minWidth:0}}>{m.nm}</span>
                        <span style={{fontSize:10,color:t.textDim,fontFamily:"'JetBrains Mono',monospace",whiteSpace:"nowrap"}}>
                          {m.dir === 1
                            ? `(${formatCalcNumber(m.nv)}−${formatCalcNumber(m.na)})/(${formatCalcNumber(m.nc)}−${formatCalcNumber(m.na)})`
                            : `(${formatCalcNumber(m.na)}−${formatCalcNumber(m.nv)})/(${formatCalcNumber(m.na)}−${formatCalcNumber(m.nc)})`}
                        </span>
                        <span style={{fontSize:11,fontWeight:700,fontFamily:"'JetBrains Mono',monospace",color:sigColor(m.sig,t),minWidth:24,textAlign:"right"}}>{m.sc}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{borderTop:`1px solid ${t.border}`,paddingTop:10}}>
                    <div style={{fontSize:12,color:t.text,fontFamily:"'JetBrains Mono',monospace",lineHeight:1.6}}>
                      <span style={{color:t.textMuted}}>Sum:</span> {OS_SUM} <span style={{color:t.textMuted}}>÷</span> {MS.length} <span style={{color:t.textMuted}}>metrics =</span> <strong style={{color:t.yellow}}>{(OS_SUM / MS.length).toFixed(1)} ≈ {OS}</strong>
                    </div>
                  </div>
                </div>
              </div>,
              document.body
            )}
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

      <div className="grid-2-col" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
        <Card style={{padding:16}}>
          <div style={{fontSize:10,color:t.green,textTransform:"uppercase",letterSpacing:1.5,fontWeight:700,marginBottom:8}}>Strongest Bull Signals</div>
          {greens.slice(0,3).map((m,i) => (
            <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:i < 2 ? `1px solid ${t.border}` : "none"}}>
              <span style={{fontSize:12,color:t.text}}>{m.nm}</span>
              <span style={{fontSize:12,fontWeight:700,color:t.green,fontFamily:"'JetBrains Mono',monospace"}}>{m.cur}</span>
            </div>
          ))}
        </Card>
        <Card style={{padding:16}}>
          <div style={{fontSize:10,color:t.red,textTransform:"uppercase",letterSpacing:1.5,fontWeight:700,marginBottom:8}}>Key Risk Signals</div>
          {reds.slice(0,3).map((m,i) => (
            <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:i < 2 ? `1px solid ${t.border}` : "none"}}>
              <span style={{fontSize:12,color:t.text}}>{m.nm}</span>
              <span style={{fontSize:12,fontWeight:700,color:t.red,fontFamily:"'JetBrains Mono',monospace"}}>{m.cur}</span>
            </div>
          ))}
        </Card>
      </div>

      <Card style={{marginBottom:16}}>
        <h3 style={{margin:"0 0 6px",fontSize:14,fontWeight:700,color:t.accent}}>THESIS: Stretched but Not a Bubble</h3>
        <p style={{margin:0,fontSize:13,lineHeight:1.7,color:t.textMuted}}>Valuations (CAPE {MS[0].cur}, Buffett {MS[2].cur}) are extreme, but household balance sheets remain healthy ({MS[9].cur} vs {MS[9].c08} in 2008). ERP remains positive at {MS[3].cur} versus {MS[3].c00} around the dot-com peak. Expensive, concentrated, and still fundamentally supported.</p>
      </Card>

      <Card>
        <h3 style={{margin:"0 0 14px",fontSize:15,fontWeight:700,color:t.text}}>Complete Scorecard — 20 Metrics</h3>
        <div className="table-responsive" style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
            <thead>
              <tr style={{borderBottom:`2px solid ${t.border}`}}>
                {["Metric","Current","Dot-Com","GFC","Avg","Risk","Signal"].map(h => (
                  <th key={h} style={{padding:"9px 8px",textAlign:"left",color:t.textDim,fontWeight:700,fontSize:10,textTransform:"uppercase",letterSpacing:1}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MS.map((m, i) => (
                <tr key={i} onClick={() => goToMetric(i)} className="table-row-hover" style={{borderBottom:`1px solid ${t.border}`,cursor:"pointer"}}
                  onMouseEnter={e => e.currentTarget.style.background = t.bgHover}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <td style={{padding:"9px 8px",color:t.text,fontWeight:600}}>
                    <span style={{display:"inline-flex",alignItems:"center"}}>{m.nm}<InfoBtn info={m.info} calc={m.calc} name={m.nm} /></span>
                  </td>
                  <td style={{padding:"9px 8px",color:t.text,fontWeight:700,fontFamily:"'JetBrains Mono',monospace"}}>{m.cur}</td>
                  <td style={{padding:"9px 8px",color:t.textMuted,fontFamily:"'JetBrains Mono',monospace"}}>{m.c00}</td>
                  <td style={{padding:"9px 8px",color:t.textMuted,fontFamily:"'JetBrains Mono',monospace"}}>{m.c08}</td>
                  <td style={{padding:"9px 8px",color:t.textMuted,fontFamily:"'JetBrains Mono',monospace"}}>{m.avg}</td>
                  <td style={{padding:"9px 8px",minWidth:86}}><RiskBar score={m.sc} /></td>
                  <td style={{padding:"9px 8px"}}><Badge signal={m.sig} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{marginTop:8,fontSize:11,color:t.textDim,fontStyle:"italic"}}>Click any row to jump to its detailed analysis →</div>
        <div style={{marginTop:6,fontSize:10,color:t.textDim}}>Data dates vary by metric. Click info icons for details.</div>
      </Card>
      <Card style={{marginTop:20,padding:14,background:t.bgCardAlt}}>
        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}>
          <span style={{display:"inline-block",width:5,height:5,borderRadius:"50%",background:sigColor(liveSignal, t),boxShadow:`0 0 6px ${sigColor(liveSignal, t)}`}} />
          <span style={{fontSize:10,fontWeight:700,color:t.textDim,textTransform:"uppercase",letterSpacing:1}}>Live Data Sources</span>
        </div>
        <div style={{fontSize:10,color:t.textDim,lineHeight:1.8}}>
          FRED CSV feeds · multpl.com · currentmarketvaluation.com · Yardeni Research · Slickcharts · BIS Total Credit Dashboard
        </div>
        <div style={{fontSize:9,color:t.textDim,marginTop:6,fontStyle:"italic"}}>
          20/20 metrics now refresh through one backend pipeline. Automated health checks run every 6 hours and surface failures in the Data Health tab.
        </div>
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
      <div className="grid-4-col" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:16}}>
        <Card><StatBox label="CAPE" value={MS[0].cur} sub={`vs ${MS[0].avg} avg`} color={sigColor(MS[0].sig,t)} /></Card>
        <Card><StatBox label="Fwd P/E" value={MS[1].cur} sub={`vs ${MS[1].avg} avg`} color={sigColor(MS[1].sig,t)} /></Card>
        <Card><StatBox label="Buffett" value={MS[2].cur} sub={`vs ${MS[2].avg} avg`} color={sigColor(MS[2].sig,t)} /></Card>
        <Card><StatBox label="ERP" value={MS[3].cur} sub={`vs ${MS[3].avg} avg`} color={sigColor(MS[3].sig,t)} /></Card>
      </div>
      {[0,1,2,3].map(i => <Explainer key={i} title={MS[i].nm} info={MS[i].info} calc={MS[i].calc} />)}
      <ChartCard anchorId="metric-cape" title="Shiller CAPE Ratio (1920–2026)" signal={MS[0].sig} interp={`CAPE at ${MS[0].cur} remains among the highest readings in the dataset. It still doesn't adjust for today's rate regime or higher-margin tech business models, so the signal is stretched but not automatically irrational.`}>
        <AC data={capeData} color={t.red} id="cF" name="CAPE" refY={17.4} refLabel="Avg: 17.4" />
      </ChartCard>
      <ChartCard anchorId="metric-forward-pe" title="Forward P/E (1995–2026)" signal={MS[1].sig} interp={`At ${MS[1].cur}x, the market remains above its long-run average but below the dot-com peak. The key offset is that expected earnings growth is still running at ${MS[10].cur}.`}>
        <AC data={fwdPE} color={t.yellow} id="fF" name="Fwd P/E" refY={16.7} refLabel="25Y Avg" domainY={[8,30]} />
      </ChartCard>
      <ChartCard anchorId="metric-buffett" title="Buffett Indicator (1970–2026)" signal={MS[2].sig} interp={`At ${MS[2].cur}, the Buffett Indicator remains historically extreme. Even after adjusting for global revenues and structurally higher margins, it still deserves respect as a mean-reversion warning.`}>
        <AC data={buffett} color={t.red} id="bF" name="Mkt Cap/GDP" unit="%" yFmt={v => `${v}%`} refY={90} refLabel="Avg: 90%" />
      </ChartCard>
      <ChartCard anchorId="metric-erp" title="Equity Risk Premium (1995–2026)" signal={MS[3].sig} interp={`ERP at ${MS[3].cur} is still positive, but investors are barely being paid for equity risk. That is less extreme than 2000, but it remains one of the clearest valuation warning lights.`}>
        <AC data={erpD} color={t.blue} id="eF" name="ERP" unit="%" yFmt={v => `${v}%`} refY={0} refLabel="Zero (Danger)" refColor={t.red} />
      </ChartCard>
      <Card style={{marginTop:20,padding:16,background:t.bgCardAlt}}>
        <div style={{fontSize:11,fontWeight:700,color:t.textDim,textTransform:"uppercase",letterSpacing:1,marginBottom:10}}>Sources</div>
        {[0,1,2,3].map(i => <SrcNote key={`src${i}`} m={MS[i]} />)}
      </Card>
    </div>
  );
}

function TabMktStr() {
  const t = useT();
  return (
    <div>
      <h2 style={{fontSize:22,fontWeight:800,color:t.text,marginBottom:4}}>Market Structure & Breadth</h2>
      <p style={{color:t.textMuted,fontSize:13,marginBottom:16}}>How narrow is the rally and how much leverage exists?</p>
      <div className="grid-5-col" style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:10,marginBottom:16}}>
        <Card><StatBox label="Top 10" value={MS[4].cur} sub={`vs ${MS[4].avg} avg`} color={sigColor(MS[4].sig,t)} /></Card>
        <Card><StatBox label="Margin Debt" value={MS[5].cur} sub="Nominal" color={sigColor(MS[5].sig,t)} /></Card>
        <Card><StatBox label="Margin/Cap" value={MS[6].cur} sub={`vs ${MS[6].c00} in 2000`} color={sigColor(MS[6].sig,t)} /></Card>
        <Card><StatBox label="Capex/GDP" value={MS[18].cur} color={sigColor(MS[18].sig,t)} /></Card>
        <Card><StatBox label="Capex/OpCF" value={MS[19].cur} color={sigColor(MS[19].sig,t)} /></Card>
      </div>
      {[4,5,6,18,19].map(i => <Explainer key={i} title={MS[i].nm} info={MS[i].info} calc={MS[i].calc} />)}
      <ChartCard anchorId="metric-top-10-concentration" title="Top 10 Concentration (1990–2026)" signal={MS[4].sig} interp={`At ${MS[4].cur}, concentration remains well above the dot-com peak. That creates real idiosyncratic risk even if the largest companies are also delivering unusually strong earnings and cash flow.`}>
        <AC data={conc} color={t.purple} id="coF" name="Top 10" unit="%" yFmt={v => `${v}%`} refY={27} refLabel="2000: 27%" refColor={t.yellow} />
      </ChartCard>
      <ChartCard anchorId="metric-margin-debt" title="FINRA Margin Debt ($B) — Nominal, Not Inflation-Adjusted" signal={MS[5].sig} interp={`⚠️ Nominal margin debt will often hit records over time. The raw ${MS[5].cur} number is less useful than the normalized leverage chart below.`}>
        <ResponsiveContainer>
          <BarChart data={mDebt}>
            <CartesianGrid strokeDasharray="3 3" stroke={t.gridStroke} />
            <XAxis dataKey="y" tick={{fontSize:10,fill:t.textDim}} />
            <YAxis tick={{fontSize:10,fill:t.textDim}} tickFormatter={v => `$${v}B`} />
            <Tooltip content={<ChartTip />} cursor={false} />
            <ReferenceLine x="2000" stroke={t.orange} strokeDasharray="4 4" strokeOpacity={0.6} label={{value:"Tech Bubble",fill:t.orange,fontSize:9,fontWeight:600,position:"insideTopRight",dy:4}} />
            <ReferenceLine x="2007" stroke={t.red} strokeDasharray="4 4" strokeOpacity={0.6} label={{value:"GFC",fill:t.red,fontSize:9,fontWeight:600,position:"insideTopRight",dy:4}} />
            <Bar dataKey="v" name="Margin ($B)" radius={[6,6,0,0]} activeBar={{fillOpacity:1}}>
              {mDebt.map((d,i) => <Cell key={i} fill={d.v > 900 ? t.red : d.v > 500 ? t.yellow : t.blue} fillOpacity={0.7} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
      <Card style={{marginBottom:8,padding:"10px 16px",background:t.greenBg,border:`1px solid ${t.greenBorder}`,borderRadius:10}}>
        <p style={{margin:0,fontSize:12,color:t.green,fontWeight:600}}>👇 The chart below is the meaningful measure — margin debt relative to market size. At {MS[6].cur}, leverage is still below both 2000 and 2008 levels.</p>
      </Card>
      <ChartCard anchorId="metric-margin-debt-market-cap" title="Margin Debt / Market Cap (%) — The Normalized View" signal={MS[6].sig} interp={`At ${MS[6].cur}, leverage relative to market size is still below both the 2000 level (${MS[6].c00}) and the 2008 level (${MS[6].c08}). This is the metric that matters.`}>
        <AC data={mDebtPct} color={t.green} id="mdPctF" name="Margin/MktCap" unit="%" yFmt={v => `${v}%`} refY={2.5} refLabel="2000: 2.5%" refColor={t.red} domainY={[0,3.5]} />
      </ChartCard>
      <ChartCard anchorId="metric-capex-gdp" title="Capex / GDP (%)" signal={MS[18].sig} interp={`At ${MS[18].cur}, capex intensity is approaching the dot-com overinvestment peak of ${MS[18].c00}. Sustained movement through that level would be a more serious overinvestment warning.`}>
        <AC data={capexGdpD} color={t.orange} id="cxF" name="Capex/GDP" unit="%" yFmt={v => `${v}%`} refY={14.6} refLabel="2000 Peak" refColor={t.red} />
      </ChartCard>
      <ChartCard anchorId="metric-capex-operating-cash-flow" title="Capex / Operating Cash Flow (%)" signal={MS[19].sig} interp={`The current proxy reading is ${MS[19].cur}. This broader corporate-sector proxy is fully dynamic and helps flag when capex starts outrunning internally generated cash on a sustained basis.`}>
        <AC data={capexCfD} color={t.purple} id="cfF" name="Capex/OpCF" unit="%" yFmt={v => `${v}%`} refY={55} refLabel="2000 Peak" refColor={t.red} />
      </ChartCard>
      <Card style={{marginTop:20,padding:16,background:t.bgCardAlt}}>
        <div style={{fontSize:11,fontWeight:700,color:t.textDim,textTransform:"uppercase",letterSpacing:1,marginBottom:10}}>Sources</div>
        {[4,5,6,18,19].map(i => <SrcNote key={`src${i}`} m={MS[i]} />)}
      </Card>
    </div>
  );
}

function TabCredit() {
  const t = useT();
  return (
    <div>
      <h2 style={{fontSize:22,fontWeight:800,color:t.text,marginBottom:4}}>Credit & Debt Metrics</h2>
      <p style={{color:t.textMuted,fontSize:13,marginBottom:16}}>Credit is the lifeblood of bubbles. 2008 was a credit crisis.</p>
      <div className="grid-3-col" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:16}}>
        <Card><StatBox label="Yield Curve" value={MS[7].cur} sub="Positively sloped" color={sigColor(MS[7].sig,t)} /></Card>
        <Card><StatBox label="HY Spread" value={MS[8].cur} sub={`vs ${MS[8].avg} avg`} color={sigColor(MS[8].sig,t)} /></Card>
        <Card><StatBox label="HH Debt/Inc" value={MS[9].cur} sub={`vs ${MS[9].c08} (2008)`} color={sigColor(MS[9].sig,t)} /></Card>
      </div>
      {[7,8,9].map(i => <Explainer key={i} title={MS[i].nm} info={MS[i].info} calc={MS[i].calc} />)}
      <ChartCard anchorId="metric-yield-curve" title="Yield Curve: 10Y − 2Y" signal={MS[7].sig} interp={`The curve has re-steepened to ${MS[7].cur} after the deep 2022-24 inversion. That is a healthier configuration than the one that preceded prior downturns.`}>
        <ResponsiveContainer>
          <ComposedChart data={ycD}>
            <CartesianGrid strokeDasharray="3 3" stroke={t.gridStroke} />
            <XAxis dataKey="y" tick={{fontSize:10,fill:t.textDim}} />
            <YAxis tick={{fontSize:10,fill:t.textDim}} tickFormatter={v => `${v}%`} />
            <Tooltip content={<ChartTip />} />
            <ReferenceLine x="2000" stroke={t.orange} strokeDasharray="4 4" strokeOpacity={0.6} label={{value:"Tech Bubble",fill:t.orange,fontSize:9,fontWeight:600,position:"insideTopRight",dy:4}} />
            <ReferenceLine x="2007" stroke={t.red} strokeDasharray="4 4" strokeOpacity={0.6} label={{value:"GFC",fill:t.red,fontSize:9,fontWeight:600,position:"insideTopRight",dy:4}} />
            <ReferenceLine y={0} stroke={t.red} strokeWidth={2} label={{value:"Inversion",fill:t.red,fontSize:10,position:"insideTopLeft",dy:-8}} />
            <Area type="monotone" dataKey="v" fill={t.blue} fillOpacity={0.06} stroke="none" />
            <Line type="monotone" dataKey="v" stroke={t.cyan} strokeWidth={2.5} dot={false} name="10Y-2Y" unit="%" />
          </ComposedChart>
        </ResponsiveContainer>
      </ChartCard>
      <ChartCard anchorId="metric-hy-credit-spread" title="HY Credit Spreads" signal={MS[8].sig} interp={`At ${MS[8].cur}, spreads are still below the long-run average of ${MS[8].avg}. Credit remains calm, perhaps too calm, but it is not yet flashing systemic stress.`}>
        <AC data={hyD} color={t.orange} id="hF" name="HY Spread" unit="%" yFmt={v => `${v}%`} refY={4.9} refLabel="20Y Avg" />
      </ChartCard>
      <ChartCard anchorId="metric-household-debt-income" title="Household Debt-to-Income" signal={MS[9].sig} interp={`At ${MS[9].cur}, household leverage remains well below the 2008 peak. That is still one of the strongest arguments against a credit-driven bubble.`}>
        <AC data={hhD} color={t.green} id="hhF" name="Debt/Inc" unit="%" yFmt={v => `${v}%`} domainY={[40,140]} refY={133} refLabel="2008 Peak" refColor={t.red} />
      </ChartCard>
      <Card style={{marginTop:20,padding:16,background:t.bgCardAlt}}>
        <div style={{fontSize:11,fontWeight:700,color:t.textDim,textTransform:"uppercase",letterSpacing:1,marginBottom:10}}>Sources</div>
        {[7,8,9].map(i => <SrcNote key={`src${i}`} m={MS[i]} />)}
      </Card>
    </div>
  );
}

function TabMacro() {
  const t = useT();
  return (
    <div>
      <h2 style={{fontSize:22,fontWeight:800,color:t.text,marginBottom:4}}>Macro Fundamentals</h2>
      <p style={{color:t.textMuted,fontSize:13,marginBottom:16}}>Does the real economy support prices?</p>
      <div className="grid-4-col" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:16}}>
        <Card><StatBox label="EPS Growth" value={MS[10].cur} color={sigColor(MS[10].sig,t)} /></Card>
        <Card><StatBox label="GDP" value={MS[11].cur} color={sigColor(MS[11].sig,t)} /></Card>
        <Card><StatBox label="Unemp." value="4.4%" color={t.green} /></Card>
        <Card><StatBox label="Core CPI" value="2.6%" color={t.yellow} /></Card>
      </div>
      {[10,11].map(i => <Explainer key={i} title={MS[i].nm} info={MS[i].info} calc={MS[i].calc} />)}
      <Card style={{marginBottom:20}}>
        <h3 style={{margin:"0 0 6px",fontSize:14,fontWeight:700,color:t.green}}>Assessment: Fundamentally Sound</h3>
        <p style={{margin:0,fontSize:13,lineHeight:1.7,color:t.textMuted}}>EPS is growing {MS[10].cur} while real GDP is running at {MS[11].cur}. In 2000 earnings fell; in 2008 the economy contracted. Today, reality still supports prices better than it did in the major historical bubbles.</p>
      </Card>
      <ChartCard anchorId="metric-eps-growth" title="S&P 500 Earnings Growth (1997–2026)" sub="Historical quarterly growth with the latest consensus estimate when available" signal={MS[10].sig} interp={`Consensus earnings growth is currently ${MS[10].cur}. The longer history now shows clearly that today still looks much stronger than the 2001-02 and 2008-09 earnings collapses.`}>
        <EpsHistoryChart data={epsQ} />
      </ChartCard>
      <ChartCard anchorId="metric-real-gdp-growth" title="Real GDP Growth (YoY)" signal={MS[11].sig} interp={`GDP growth at ${MS[11].cur} is close enough to trend that this still looks expensive rather than terminal. Unlike 2008, the economy is still expanding.`}>
        <AC data={gdpGrowthD} color={t.green} id="gdpF" name="GDP Growth" unit="%" yFmt={v => `${v}%`} refY={2.5} refLabel="Long-Run Avg" baseValue={0} />
      </ChartCard>
      <Card style={{marginTop:20,padding:16,background:t.bgCardAlt}}>
        <div style={{fontSize:11,fontWeight:700,color:t.textDim,textTransform:"uppercase",letterSpacing:1,marginBottom:10}}>Sources</div>
        {[10,11].map(i => <SrcNote key={`src${i}`} m={MS[i]} />)}
      </Card>
    </div>
  );
}

function TabMoney() {
  const t = useT();
  return (
    <div>
      <h2 style={{fontSize:22,fontWeight:800,color:t.text,marginBottom:4}}>Monetary Policy & Liquidity</h2>
      <p style={{color:t.textMuted,fontSize:13,marginBottom:16}}>The Fed almost always pops the bubble.</p>
      <div className="grid-3-col" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:16}}>
        <Card><StatBox label="Fed Funds" value={MS[12].cur} color={sigColor(MS[12].sig,t)} /></Card>
        <Card><StatBox label="M2" value={MS[13].cur} sub="Scored vs GDP" color={sigColor(MS[13].sig,t)} /></Card>
        <Card><StatBox label="Fed BS" value={MS[14].cur} sub="Scored vs GDP" color={sigColor(MS[14].sig,t)} /></Card>
      </div>
      {[12,13,14].map(i => <Explainer key={i} title={MS[i].nm} info={MS[i].info} calc={MS[i].calc} />)}
      <ChartCard anchorId="metric-fed-funds-rate" title="Fed Funds Rate (%)" signal={MS[12].sig} interp={`Policy at ${MS[12].cur} is restrictive versus the post-GFC era, but still well below the 2000 tightening peak. The Fed is no longer actively choking liquidity.`}>
        <AC data={fedFundsD} color={t.green} id="ffF" name="Fed Funds" unit="%" yFmt={v => `${v}%`} refY={3.5} refLabel="Long-Run Avg" />
      </ChartCard>
      <ChartCard anchorId="metric-m2-money-supply" title="M2 / GDP (%)" sub="Chart matches the way this metric is actually scored" signal={MS[13].sig} interp={`M2 currently equals about ${MS[13].nv.toFixed(1)}% of GDP. That is still elevated versus the dot-com era, but well below the pandemic peak.`}>
        <AC data={m2D} color={t.cyan} id="m2F" name="M2 / GDP" unit="%" yFmt={v => `${v}%`} refY={60} refLabel="Long-Run Avg" xTicks={buildYearTicks(m2D, 5)} />
      </ChartCard>
      <ChartCard anchorId="metric-fed-balance-sheet" title="Fed Balance Sheet / GDP (%)" sub="Chart matches the way this metric is actually scored" signal={MS[14].sig} interp={`The Fed balance sheet currently equals about ${MS[14].nv.toFixed(1)}% of GDP. It remains far above pre-2008 levels, but it is well below the 2020-22 extreme.`}>
        <AC data={fedB} color={t.purple} id="feF" name="Fed BS / GDP" unit="%" yFmt={v => `${v}%`} refY={6} refLabel="Pre-QE Avg" />
      </ChartCard>
      <Card style={{marginTop:20,padding:16,background:t.bgCardAlt}}>
        <div style={{fontSize:11,fontWeight:700,color:t.textDim,textTransform:"uppercase",letterSpacing:1,marginBottom:10}}>Sources</div>
        {[12,13,14].map(i => <SrcNote key={`src${i}`} m={MS[i]} />)}
      </Card>
    </div>
  );
}

function TabSent() {
  const t = useT();
  return (
    <div>
      <h2 style={{fontSize:22,fontWeight:800,color:t.text,marginBottom:4}}>Sentiment</h2>
      <p style={{color:t.textMuted,fontSize:13,marginBottom:16}}>Capturing "irrational exuberance" — or the lack thereof.</p>
      <div className="grid-3-col" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:16}}>
        <Card><StatBox label="VIX" value={MS[15].cur} color={sigColor(MS[15].sig,t)} /></Card>
        <Card><StatBox label="UMich" value="56.4" sub="Below avg" color={t.yellow} /></Card>
        <Card><StatBox label="IPOs" value="Subdued" color={t.green} /></Card>
      </div>
      <Explainer title={MS[15].nm} info={MS[15].info} calc={MS[15].calc} />
      <ChartCard anchorId="metric-vix" title="VIX (1995–2026)" signal={MS[15].sig} interp={`VIX at ${MS[15].cur} is above the complacent pre-bubble lows. That suggests caution rather than outright mania.`}>
        <AC data={vixD} color={t.yellow} id="vF" name="VIX" refY={20} refLabel="Avg ~20" />
      </ChartCard>
      <Card style={{borderLeft:`3px solid ${t.green}`}}>
        <h3 style={{margin:"0 0 6px",fontSize:14,fontWeight:700,color:t.green}}>Verdict: No Mania</h3>
        <p style={{margin:0,fontSize:13,lineHeight:1.7,color:t.textMuted}}>No euphoric hallmarks. Sentiment below average, IPOs subdued, SPACs collapsed. Prevailing narrative is caution — contrarian bullish.</p>
      </Card>
      <Card style={{marginTop:20,padding:16,background:t.bgCardAlt}}>
        <div style={{fontSize:11,fontWeight:700,color:t.textDim,textTransform:"uppercase",letterSpacing:1,marginBottom:10}}>Sources</div>
        <SrcNote m={MS[15]} />
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
      <div className="grid-3-col" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:16}}>
        <Card><StatBox label="Case-Shiller" value={MS[16].cur} color={sigColor(MS[16].sig,t)} /></Card>
        <Card><StatBox label="YoY" value="+1.3%" color={t.green} /></Card>
        <Card><StatBox label="Avg FICO" value="~740" color={t.green} /></Card>
      </div>
      <Explainer title={MS[16].nm} info={MS[16].info} calc={MS[16].calc} />
      <ChartCard anchorId="metric-case-shiller" title="Case-Shiller HPI (1990–2026)" signal={MS[16].sig} interp={`Near all-time highs at ${MS[16].cur}, but still driven more by supply shortage than reckless lending. The housing setup is expensive, not obviously 2006-style fragile.`}>
        <AC data={csD} color={t.orange} id="csF" name="HPI" refY={190} refLabel="2006 Peak" refColor={t.red} />
      </ChartCard>
      <Card style={{marginTop:20,padding:16,background:t.bgCardAlt}}>
        <div style={{fontSize:11,fontWeight:700,color:t.textDim,textTransform:"uppercase",letterSpacing:1,marginBottom:10}}>Sources</div>
        <SrcNote m={MS[16]} />
      </Card>
    </div>
  );
}

function TabGlobal() {
  const t = useT();
  return (
    <div>
      <h2 style={{fontSize:22,fontWeight:800,color:t.text,marginBottom:4}}>Global & Structural Risk</h2>
      <p style={{color:t.textMuted,fontSize:13,marginBottom:16}}>Systemic vulnerabilities beyond the US market.</p>
      <div className="grid-3-col" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:16}}>
        <Card><StatBox label="Global Debt/GDP" value={MS[17].cur} color={sigColor(MS[17].sig,t)} /></Card>
        <Card><StatBox label="US Debt/GDP" value="~124%" color={t.red} /></Card>
        <Card><StatBox label="Geopolitical" value="Elevated" color={t.yellow} /></Card>
      </div>
      <Explainer title={MS[17].nm} info={MS[17].info} calc={MS[17].calc} />
      <ChartCard anchorId="metric-global-debt-gdp" title="Global Debt-to-GDP" signal={MS[17].sig} interp={`The BIS proxy currently sits at ${MS[17].cur}. It doesn't cause bubbles by itself, but it does measure the amount of leverage already embedded in the global system when shocks arrive.`}>
        <AC data={gdD} color={t.red} id="gdF" name="Debt/GDP" unit="%" yFmt={v => `${v}%`} />
      </ChartCard>
      <Card style={{marginTop:20,padding:16,background:t.bgCardAlt}}>
        <div style={{fontSize:11,fontWeight:700,color:t.textDim,textTransform:"uppercase",letterSpacing:1,marginBottom:10}}>Sources</div>
        <SrcNote m={MS[17]} />
      </Card>
    </div>
  );
}

function TabDataHealth({ dataHealth, refreshMetrics, isRefreshing, dataError }) {
  const t = useT();
  const summary = dataHealth?.summary;
  const metrics = dataHealth?.metrics || [];
  const activeError = dataError || dataHealth?.error || "";

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12,marginBottom:16,flexWrap:"wrap"}}>
        <div>
          <h2 style={{fontSize:22,fontWeight:800,color:t.text,marginBottom:4}}>Data Health</h2>
          <p style={{color:t.textMuted,fontSize:13,margin:0}}>Operational view of all 20 live metrics, source freshness, and parser status.</p>
        </div>
        <button
          onClick={refreshMetrics}
          disabled={isRefreshing}
          style={{
            padding:"10px 14px",borderRadius:10,border:`1px solid ${t.border}`,background:t.bgCard,
            color:t.text,fontSize:12,fontWeight:600,cursor:isRefreshing ? "default" : "pointer",
            opacity:isRefreshing ? 0.65 : 1,
          }}
        >
          {isRefreshing ? "Refreshing..." : "Refresh Data"}
        </button>
      </div>

      <div className="grid-4-col" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:16}}>
        <Card><StatBox label="Overall" value={summary ? summary.status.toUpperCase() : "LOADING"} color={sigColor(healthToSignal(summary?.status || "warn"), t)} /></Card>
        <Card><StatBox label="Healthy" value={summary ? `${summary.okCount}` : "0"} color={t.green} /></Card>
        <Card><StatBox label="Warnings" value={summary ? `${summary.warnCount}` : "0"} color={t.yellow} /></Card>
        <Card><StatBox label="Errors" value={summary ? `${summary.errorCount}` : "0"} color={t.red} /></Card>
      </div>

      <Card style={{marginBottom:16}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10,flexWrap:"wrap"}}>
          <div>
            <h3 style={{margin:"0 0 6px",fontSize:15,fontWeight:700,color:t.text}}>Monitoring Setup</h3>
            <p style={{margin:0,fontSize:13,lineHeight:1.7,color:t.textMuted}}>
              The app now pulls all 20 metrics from a single backend pipeline. GitHub Actions runs a scheduled health check every 6 hours with optional webhook alerts, and the Data Health tab shows the last live fetch status directly in the app.
            </p>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:10,color:t.textDim,textTransform:"uppercase",letterSpacing:1,fontWeight:700}}>Last Check</div>
            <div style={{fontSize:12,color:t.text,fontFamily:"'JetBrains Mono',monospace",marginTop:4}}>{formatDateTime(dataHealth?.checkedAt)}</div>
          </div>
        </div>
      </Card>

      {activeError && (
        <Card style={{marginBottom:16,background:t.redBg,border:`1px solid ${t.redBorder}`}}>
          <div style={{fontSize:11,fontWeight:700,color:t.red,textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>Data Fetch Error</div>
          <div style={{fontSize:12,color:t.text,lineHeight:1.7}}>
            The app could not load the live metrics payload. {activeError}
          </div>
        </Card>
      )}

      <Card>
        <div className="table-responsive" style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12,minWidth:920}}>
            <thead>
              <tr style={{borderBottom:`2px solid ${t.border}`}}>
                {["Metric","Pipeline","Status","Current","As Of","Source","Notes"].map((label) => (
                  <th key={label} style={{padding:"9px 8px",textAlign:"left",color:t.textDim,fontWeight:700,fontSize:10,textTransform:"uppercase",letterSpacing:1}}>{label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {metrics.length ? metrics.map((metric) => (
                <tr key={metric.id} style={{borderBottom:`1px solid ${t.border}`}}>
                  <td style={{padding:"10px 8px",color:t.text,fontWeight:600}}>{metric.name}</td>
                  <td style={{padding:"10px 8px",color:t.textMuted,fontFamily:"'JetBrains Mono',monospace"}}>{metric.pipeline}</td>
                  <td style={{padding:"10px 8px"}}><HealthBadge status={metric.status} /></td>
                  <td style={{padding:"10px 8px",color:t.text,fontWeight:700,fontFamily:"'JetBrains Mono',monospace"}}>{metric.display || "N/A"}</td>
                  <td style={{padding:"10px 8px",color:t.textMuted,fontFamily:"'JetBrains Mono',monospace"}}>{metric.asOf || "N/A"}</td>
                  <td style={{padding:"10px 8px"}}>
                    <a href={metric.sourceUrl} target="_blank" rel="noreferrer" style={{color:t.accent,textDecoration:"none"}}>{metric.source}</a>
                  </td>
                  <td style={{padding:"10px 8px",color:t.textMuted,lineHeight:1.5,fontSize:11}}>
                    {metric.notes?.length ? metric.notes.join(" ") : "Healthy."}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} style={{padding:"14px 8px",color:t.textMuted,fontSize:12}}>
                    {activeError ? "No live metric records could be loaded." : "No health records returned yet."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function TabReport() {
  const t = useT();
  const greens = MS.filter(m => m.sig === "green");
  const yellows = MS.filter(m => m.sig === "yellow");
  const reds = MS.filter(m => m.sig === "red");
  const radarD = [
    {s:"Equity Val.", sc: Math.round([0,1,2,3].reduce((a,i) => a + MS[i].sc, 0) / 4)},
    {s:"Mkt Structure", sc: Math.round([4,5,6,18,19].reduce((a,i) => a + MS[i].sc, 0) / 5)},
    {s:"Credit/Debt", sc: Math.round([7,8,9].reduce((a,i) => a + MS[i].sc, 0) / 3)},
    {s:"Macro", sc: Math.round([10,11].reduce((a,i) => a + MS[i].sc, 0) / 2)},
    {s:"Monetary", sc: Math.round([12,13,14].reduce((a,i) => a + MS[i].sc, 0) / 3)},
    {s:"Sentiment", sc: MS[15].sc},
    {s:"Housing", sc: MS[16].sc},
    {s:"Global", sc: MS[17].sc},
  ];
  const _catAvg = (idxs) => Math.round(idxs.reduce((a,i) => a + MS[i].sc, 0) / idxs.length);
  const catScores = [
    {name:"Equity Valuation",sc:_catAvg([0,1,2,3]),sig:sigFromScore(_catAvg([0,1,2,3])),metrics:[0,1,2,3],data:capeData,color:t.red,id:"rCape",dataName:"CAPE",refY:17.4,refLabel:"Avg: 17.4"},
    {name:"Market Structure",sc:_catAvg([4,5,6,18,19]),sig:sigFromScore(_catAvg([4,5,6,18,19])),metrics:[4,5,6,18,19],data:conc,color:t.purple,id:"rConc",dataName:"Top 10 %",refY:27,refLabel:"2000: 27%",yFmt:v=>`${v}%`},
    {name:"Credit & Debt",sc:_catAvg([7,8,9]),sig:sigFromScore(_catAvg([7,8,9])),metrics:[7,8,9],data:hyD,color:t.orange,id:"rHY",dataName:"HY Spread %",refY:4.9,refLabel:"20Y Avg",yFmt:v=>`${v}%`},
    {name:"Macro Fundamentals",sc:_catAvg([10,11]),sig:sigFromScore(_catAvg([10,11])),metrics:[10,11],data:null,color:t.green,id:"rEps"},
    {name:"Monetary Policy",sc:_catAvg([12,13,14]),sig:sigFromScore(_catAvg([12,13,14])),metrics:[12,13,14],data:m2D,color:t.cyan,id:"rM2",dataName:"M2 / GDP %",yFmt:v=>`${v}%`},
    {name:"Sentiment",sc:MS[15].sc,sig:MS[15].sig,metrics:[15],data:vixD,color:t.yellow,id:"rVix",dataName:"VIX",refY:20,refLabel:"Avg ~20"},
    {name:"Housing",sc:MS[16].sc,sig:MS[16].sig,metrics:[16],data:csD,color:t.orange,id:"rCS",dataName:"Case-Shiller",refY:190,refLabel:"2006 Peak"},
    {name:"Global Risk",sc:MS[17].sc,sig:MS[17].sig,metrics:[17],data:gdD,color:t.red,id:"rGD",dataName:"Debt/GDP %",yFmt:v=>`${v}%`},
  ];
  const sectionDivider = <div className="gradient-divider" style={{height:1,background:`linear-gradient(90deg, transparent, ${t.border}, transparent)`,margin:"36px 0"}} />;
  const sectionNum = (n, title) => (
    <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:16}}>
      <div style={{width:36,height:36,borderRadius:"50%",background:t.accentBg,border:`1.5px solid ${t.accent}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,fontWeight:800,color:t.accent,flexShrink:0}}>{n}</div>
      <h2 className="section-heading" style={{margin:0,fontSize:20,fontWeight:800,color:t.text,letterSpacing:-0.5}}>{title}</h2>
    </div>
  );
  const prose = (text) => <p style={{margin:"0 0 14px",fontSize:13.5,lineHeight:1.85,color:t.textMuted}}>{text}</p>;
  const catProse = {
    "Equity Valuation": [
      `Equity valuations remain stretched, with the Shiller CAPE ratio at ${MS[0].cur} versus ${MS[0].c00} at the dot-com peak. The Buffett Indicator sits at ${MS[2].cur}, still near historical extremes. Taken alone, those headline figures imply a highly expensive market. However, the underlying earnings architecture remains materially stronger than it was at prior bubble peaks.`,
      `The forward price-to-earnings ratio of ${MS[1].cur}x is elevated relative to the long-run average of ${MS[1].avg}, but it is paired with earnings growth of ${MS[10].cur}. The equity risk premium, at ${MS[3].cur}, remains positive — a critical distinction from 1999-2000 when the ERP turned negative.`,
      "The deeper question, however, is whether CAPE and the Buffett Indicator are structurally broken metrics in an AI world — and we believe the evidence increasingly suggests they are. The CAPE ratio's reliance on 10-year trailing earnings inherently underweights what may be a permanent step-change in corporate profitability. If AI drives corporate net margins from today's 12% toward 20%+ over the next 3-5 years — as it compresses labor costs across legal, financial, medical, engineering, and administrative functions — then current earnings represent the floor, not the ceiling, and the CAPE's historical denominator becomes an anachronism. The Buffett Indicator, which compares US market capitalization to domestic GDP, becomes similarly misleading when US-domiciled companies are capturing value from global AI deployment; the numerator reflects worldwide revenue generation while the denominator measures only domestic output. Furthermore, traditional software companies — the SaaS and enterprise incumbents that constitute a significant share of market capitalization — face existential disruption. When AI enables any organization to build custom software through natural language at a fraction of the cost, the entire value proposition of packaged CRM, ERP, and project management tools erodes. The 'expensive' market may actually be mispricing the massive creative destruction ahead: overvaluing software incumbents facing 50-80% revenue declines while still undervaluing the AI infrastructure layer that will replace them. We assign this category an elevated risk score of 78/100 by traditional metrics — but flag that these metrics may be fundamentally inadequate for pricing the AI era."
    ],
    "Market Structure": [
      `The concentration of the S&P 500 remains unprecedented in the modern era, with the top 10 constituents now representing ${MS[4].cur} of the index versus ${MS[4].c00} at the dot-com peak. However, this concentration is not purely speculative; it is tied to the companies building and monetizing the AI infrastructure stack.`,
      `A critical counterargument still deserves equal weight: today's leading companies also generate a far larger share of actual earnings and cash flow than the mega-caps of 2000. FINRA margin debt stands at ${MS[5].cur} in nominal terms, yet when normalized to market capitalization it is only ${MS[6].cur}, below both the 2000 level (${MS[6].c00}) and the 2008 level (${MS[6].c08}).`,
      "The real risk in market structure is not that the top 10 are too big — it is that everyone else may be too small to survive. Traditional software companies occupying mid-cap and small-cap indices face displacement by AI-native alternatives that can replicate their functionality at a fraction of the cost. The $600B+ traditional software industry — Salesforce, ServiceNow, Atlassian, Adobe, and hundreds of smaller SaaS vendors — faces existential disruption as AI agents and natural-language programming make packaged software increasingly obsolete. This creative destruction will manifest as a structural reweighting of indices, not a broad market crash. The vulnerability lies in the mechanics of passive rebalancing and the potential for cascading de-grossing in concentrated positions: a scenario in which institutional investors simultaneously reduce exposure to mega-cap technology — whether triggered by regulatory action, earnings disappointment, or geopolitical disruption — could generate non-linear price dislocations given the sheer weight of these positions. We score market structure risk at 67/100, reflecting genuine structural fragility tempered by the fundamental reality that concentration in AI infrastructure companies is the rational market response to the most significant technological transformation in economic history.",
      `The addition of capital expenditure metrics provides crucial quantitative grounding for the overinvestment thesis. Private nonresidential fixed investment stands at ${MS[18].cur} of GDP, approaching but not yet exceeding the dot-com peak of ${MS[18].c00}. The dynamic operating-cash-flow proxy currently reads ${MS[19].cur}. The question is not whether AI capex is high — it manifestly is — but whether productivity gains will justify the investment within a commercially reasonable timeframe.`
    ],
    "Credit & Debt": [
      "Credit markets present perhaps the most compelling evidence against a systemic bubble classification. The household debt-to-income ratio stands at 92%, well below historical averages and dramatically below the 133% level that presaged the 2008 financial crisis. This single metric may be the most important data point in the entire analysis: consumer balance sheets are fundamentally sound. Average FICO scores hover near 740 (vs. approximately 700 pre-GFC), over 95% of outstanding mortgages carry fixed rates (eliminating the adjustable-rate time bomb of 2006-2008), and bank capital ratios under Basel III requirements provide substantially greater systemic resilience.",
      "The yield curve, which inverted deeply throughout 2022-2024 — a historically reliable recession predictor — has re-steepened to +52 basis points. The economy absorbed the most aggressive rate-hiking cycle in four decades without tipping into recession, a remarkable display of underlying resilience that confounded the consensus expectation of a hard landing. High-yield credit spreads at 3.2% remain compressed relative to the 20-year average of 4.9%, which represents a double-edged sword: on one hand, it signals continued investor confidence in corporate creditworthiness; on the other, it leaves minimal margin for error should conditions deteriorate.",
      "The absence of a credit transmission mechanism is the single most important distinction between today and 2008. The Global Financial Crisis was, at its core, a credit crisis — overleveraged consumers, opaque derivatives, and undercapitalized banks created a cascading failure that nearly destroyed the global financial system. None of those conditions exist in 2026. We assign credit risk a score of 32/100 — the lowest category reading and a powerful anchor against bubble characterization."
    ],
    "Macro Fundamentals": [
      "The macroeconomic backdrop provides robust support for current asset prices, standing in stark contrast to conditions that preceded prior market dislocations. Real GDP growth of 2.0% is slightly below the long-run potential growth rate of 2.5%, indicating an economy expanding at a solid but measured pace without the overheating dynamics that typically characterize bubble environments. The unemployment rate of 4.4% sits near full employment, while core CPI at 2.6% demonstrates that inflationary pressures are gradually normalizing toward the Federal Reserve's 2% target without requiring additional tightening.",
      `Most critically, S&P 500 earnings per share are growing at ${MS[10].cur} year-over-year — nearly double the historical average of approximately 8% — and this may be just the beginning. Six consecutive quarters of double-digit earnings growth may not be a cyclical peak but the early phase of a structural acceleration.`,
      "The sectoral composition of earnings growth further reinforces this assessment. While AI-related capital expenditure ($300B+ committed by hyperscalers) creates concentration risk around technology sector profitability, the breadth of earnings expansion across healthcare, industrials, and financials provides a diversification buffer that was notably absent during the narrow dot-com mania. It is worth noting that GDP figures likely undercount AI's true economic impact: national accounts measure output in terms of human labor hours and established price indices, but AI-generated output — code written by language models, diagnoses assisted by medical AI, legal documents drafted by intelligent agents — is not fully captured in these frameworks. The real GDP growth rate may be structurally understated in an economy where an increasing share of cognitive output is produced at near-zero marginal cost. We assign macroeconomic risk a score of just 15/100 — the single strongest categorical argument that current market levels reflect fundamental economic reality, and one that may actually understate the bullish case if AI's productivity impact is as transformative as the early evidence suggests."
    ],
    "Monetary Policy": [
      "Federal Reserve policy stands at an inflection point that materially differentiates the current environment from historical bubble peaks. The federal funds rate at 3.6% resides near its long-run neutral estimate, in contrast to the restrictive levels that preceded both the dot-com crash (6.5%) and the Global Financial Crisis (5.25%). The Fed has transitioned to an easing posture, having initiated rate cuts in late 2024 — a policy shift that historically provides a significant tailwind for risk assets. The critical nuance is that the Fed is easing from a position of strength rather than panic, reducing rates because inflation is normalizing rather than because the economy is collapsing.",
      `The M2 money supply now stands at ${MS[13].cur}. Critically, the Fed's easing posture is well-timed for an AI investment supercycle. The Fed's balance sheet, at ${MS[14].cur}, has contracted from its post-pandemic peak through quantitative tightening but remains far above pre-2008 levels.`,
      "The primary risk vector within monetary policy is a potential forced pivot: if an exogenous shock required the Fed to reverse course and re-expand its balance sheet, it would signal that the post-COVID normalization has failed. Conversely, if the Fed tightens more aggressively than markets currently discount — perhaps due to re-accelerating inflation driven by fiscal expansion or supply chain disruption — it could act as the catalyst that converts elevated valuations into a correction. We score monetary policy risk at 43/100, reflecting a broadly accommodative but uncertain policy trajectory."
    ],
    "Sentiment": [
      `Market sentiment indicators present a notably non-euphoric profile that stands in stark contrast to the mania that characterized the dot-com peak. The VIX registers ${MS[15].cur} — near or above its long-run average and meaningfully above the dangerously complacent sub-12 readings that often precede more fragile setups.`,
      "The IPO market, which serves as a reliable barometer of speculative excess, remains subdued. The SPAC phenomenon that generated approximately $160 billion in proceeds during 2020-2021 has effectively collapsed, with remaining vehicles trading at significant discounts to trust value. Meme stock activity, while periodically resurgent, has diminished dramatically from its 2021 peak. Retail options speculation, as measured by small-lot call volumes, has normalized from extreme levels. These are not the hallmarks of a market gripped by speculative mania.",
      "The contrarian interpretation is significant — and, when viewed through the lens of the AI revolution, profoundly bullish. The prevailing public narrative remains one of caution, skepticism, and bearishness — precisely the conditions under which markets historically continue to advance. But the absence of euphoria takes on a deeper meaning in the context of AI: the general public does not yet understand the magnitude of what is coming. Most investors, consumers, and policymakers are still processing AI as an incremental technology improvement — a better search engine, a chatbot, an automation tool. They have not yet internalized that AI is a phase change in human civilization: a technology that replicates cognition itself, that can write software, draft legal briefs, diagnose diseases, design products, and generate scientific hypotheses. When AI begins to visibly displace entire job categories — starting with software development, customer service, content creation, and financial analysis — the public realization of its transformative power will drive a re-rating that makes today's 'elevated' valuations look cheap in hindsight. True bubble peaks are accompanied by widespread conviction that prices can only rise and mass participation by previously uninvested cohorts. We are nowhere near that point with AI — most retail investors cannot even articulate what a large language model does, let alone price its economic implications. We score sentiment risk at 45/100, reflecting moderate speculative positioning and, critically, the absence of the euphoric extremes that would signal a top — this is a market that has not yet woken up to the magnitude of the revolution underway."
    ],
    "Housing": [
      `Residential real estate prices, as measured by the S&P Case-Shiller Home Price Index, stand at ${MS[16].cur}. The superficial parallel to the housing bubble of 2005-2008 is visually striking but analytically misleading. The fundamental drivers of current housing price levels differ categorically from those that generated the prior crisis.`,
      "The 2005-2008 housing bubble was fueled by lax lending standards (average FICO scores near 700, widespread NINJA loans, adjustable-rate mortgages comprising over 30% of originations), excess supply (housing starts peaked at 2.1 million annualized), and opaque securitization that distributed risk throughout the global financial system. In 2026, lending standards remain stringent (average FICO approximately 740), over 95% of mortgages carry fixed rates (eliminating payment shock risk), and the market faces a structural supply shortage estimated at 3-4 million units. Housing price appreciation has decelerated significantly, with year-over-year gains moderating to just 1.3%.",
      "The primary risk in housing is not a credit-driven collapse but rather an affordability crisis that constrains household formation and consumer spending. With mortgage rates near 6.5% and home prices at record levels, the median household faces historically poor affordability metrics. However, this manifests as an economic drag rather than a systemic financial risk. The absence of the leveraged securitization complex that transmitted housing losses into a global credit crisis is the decisive differentiating factor. We assign housing risk a score of 40/100."
    ],
    "Global Risk": [
      `The global macroeconomic and geopolitical landscape presents the most diffuse and least quantifiable set of risks in this assessment framework. The BIS global debt proxy now stands at ${MS[17].cur}, above its long-run average of ${MS[17].avg} but still below the pandemic-era peak used in the scoring framework. That does not directly precipitate crises, but it does constrain the fiscal and balance-sheet room available when crises emerge.`,
      "Geopolitical risk remains elevated across multiple vectors: the ongoing Russia-Ukraine conflict, escalating tensions in the Taiwan Strait and South China Sea, and increasing fragmentation of global trade architecture. These risks are inherently binary and difficult to price — markets tend to either ignore them entirely or re-price them violently and discontinuously. The potential for a geopolitical shock to trigger a synchronized global de-risking event is non-trivial and represents the most plausible catalyst for a rapid market dislocation that would bypass traditional fundamental deterioration.",
      "China's economic trajectory adds an additional dimension of systemic risk. The ongoing property sector restructuring, demographic headwinds, and geopolitical decoupling from Western technology supply chains create the potential for a significant growth shock in the world's second-largest economy — with cascading effects on global commodity markets, emerging economies, and multinational corporate earnings. We assign global risk a score of 65/100, reflecting the accumulation of structural vulnerabilities that, while not immediately threatening, reduce the margin of safety for global risk assets."
    ]
  };

  const correlationData = [
    {m1:"CAPE Ratio",m2:"Buffett Indicator",dir:"Confirming",note:"Both at extreme highs; structural overvaluation signal consistent",sig:"red"},
    {m1:"Forward P/E",m2:"EPS Growth",dir:"Partially Offset",note:`High P/E tempered by ${MS[10].cur} earnings growth — unlike 2000`,sig:"yellow"},
    {m1:"Top 10 Concentration",m2:"Margin Debt/Cap",dir:"Diverging",note:"Concentration at records but leverage below 2000/2008 levels",sig:"yellow"},
    {m1:"Yield Curve",m2:"HY Spreads",dir:"Confirming",note:"Both signal no imminent credit stress; historically calm",sig:"green"},
    {m1:"Household Debt/Inc",m2:"Case-Shiller HPI",dir:"Diverging",note:"Housing prices near highs but household leverage well below average",sig:"green"},
    {m1:"VIX",m2:"Consumer Sentiment",dir:"Confirming",note:"Both moderate — no euphoria, no panic; cautious equilibrium",sig:"green"},
    {m1:"Fed Funds Rate",m2:"M2 Money Supply",dir:"Partially Offset",note:"Rates normalizing while liquidity remains structurally elevated",sig:"yellow"},
    {m1:"Global Debt/GDP",m2:"GDP Growth",dir:"Diverging",note:"Domestic growth solid despite global leverage concerns",sig:"yellow"},
    {m1:"ERP",m2:"Fed Balance Sheet",dir:"Confirming",note:"Slim risk premium in context of elevated Fed backstop",sig:"yellow"},
    {m1:"Margin Debt (Nominal)",m2:"Margin Debt/Cap",dir:"Diverging",note:"Nominal records misleading; relative leverage moderate",sig:"green"},
    {m1:"AI Capex ($300B+)",m2:"Traditional Software Revenue",dir:"Diverging",note:"The $300B+ in AI infrastructure investment is the leading indicator of creative destruction in the $600B traditional software industry",sig:"red"},
  ];

  const scenarios = [
    {name:"Base Case: AI-Driven Earnings Expansion",prob:45,color:t.green,target:"S&P 5,400–6,000",ret:"+5% to +15%",
      assumptions:["AI buildout delivers moderate but measurable productivity gains across sectors","Earnings growth sustains at 12-15% as AI monetization begins to scale","Fed completes easing cycle to 3.0-3.25%, supporting AI infrastructure investment","Traditional software companies experience 20-30% revenue compression as AI-native alternatives gain traction","Market grinds higher with periodic rotation from mega-cap to AI-adjacent industrials and infrastructure"],
      implication:"Maintain overweight in AI infrastructure (hyperscalers, semiconductors, data centers) while systematically reducing exposure to traditional SaaS and enterprise software incumbents. The earnings-driven grind higher rewards positioning, not timing."},
    {name:"Bull Case: AI Supercycle / Fourth Industrial Revolution",prob:30,color:t.blue,target:"S&P 6,500–7,500",ret:"+20% to +40%",
      assumptions:["AI delivers transformative productivity gains within 12-18 months — visible automation of cognitive labor at scale","Earnings growth accelerates to 20-25% as AI compresses costs across every industry","Traditional software companies face 50%+ revenue declines as AI-native tools proliferate, triggering massive creative destruction","The CAPE paradox resolves via explosive earnings growth — ratio compresses even as prices surge","Global adoption of AI infrastructure creates a capital expenditure supercycle comparable to post-WWII industrialization"],
      implication:"Maximum overweight AI infrastructure, semiconductors, and AI-native platforms. Aggressively underweight traditional software, legacy enterprise IT, and labor-intensive services. The CAPE paradox — a high ratio compressing via explosive earnings — would confirm that we are in the early innings of the most significant economic transformation in human history."},
    {name:"Bear Case: AI Capex Disappointment",prob:18,color:t.orange,target:"S&P 4,000–4,500",ret:"-15% to -25%",
      assumptions:["$300B+ in hyperscaler AI investment fails to show measurable ROI within 2-3 years","AI revenue monetization disappoints, triggering mega-cap de-rating and capex pullback","Credit spreads widen to 5-7% as risk appetite contracts from AI disillusionment","Traditional software companies paradoxically benefit temporarily as AI disruption timeline extends","12-18 month correction with partial recovery as AI development continues at a slower pace"],
      implication:"Defensive positioning: overweight short-duration Treasuries, gold, and cash equivalents. Reduce AI infrastructure exposure but maintain core positions in compute/semis for eventual recovery. The bear case delays the AI revolution — it does not cancel it."},
    {name:"Tail Risk: Geopolitical / AI Systemic Shock",prob:7,color:t.red,target:"S&P 2,800–3,500",ret:"-40% to -55%",
      assumptions:["Geopolitical shock — Taiwan conflict disrupting TSMC semiconductor supply, or sovereign debt crisis — triggers global de-risking","AI-specific risk: a major safety incident or coordinated global regulatory moratorium freezes AI development","Compute supply chain disruption (TSMC/Taiwan, energy grid constraints) halts AI infrastructure buildout","Simultaneous equity, credit, and currency market dislocation with Fed response constrained","18-36 month recovery timeline with structural damage to AI investment thesis and market microstructure"],
      implication:"Maximum defensive allocation. Flight to quality: US Treasuries, gold, Swiss franc. The TSMC/Taiwan vector is the single most underpriced risk in global markets — a disruption to advanced semiconductor manufacturing would simultaneously devastate AI infrastructure and trigger a global technology crisis. Maintain substantial cash reserves for re-entry."},
  ];

  const catalysts = [
    {category:"Earnings",trigger:"2 consecutive quarters of negative S&P 500 EPS growth",current:`${MS[10].cur} growth`,status:"green",watch:"Q2-Q3 2026 estimates; AI capex ROI metrics"},
    {category:"Credit",trigger:"HY spreads > 6% or investment-grade spreads > 200bp",current:"3.2% HY",status:"green",watch:"Monthly ICE BofA HY OAS; weekly IG CDX index"},
    {category:"Monetary",trigger:"Fed reverses to rate hikes OR emergency QE restart",current:"Easing cycle",status:"green",watch:"FOMC dot plots; inflation expectations (5Y5Y breakevens)"},
    {category:"Liquidity",trigger:"Reverse repo < $100B AND bank reserves < $3T",current:"Adequate",status:"yellow",watch:"NY Fed reverse repo facility; Fed H.4.1 weekly report"},
    {category:"Geopolitical",trigger:"Military escalation in Taiwan Strait; NATO Article 5 invocation",current:"Elevated tension",status:"yellow",watch:"DoD Taiwan Strait transit reports; SIPRI conflict indicators"},
    {category:"Valuation",trigger:"CAPE > 42 (exceeds 2000 peak) with decelerating earnings",current:MS[0].cur,status:"yellow",watch:"Monthly Shiller data; quarterly earnings revision ratios"},
    {category:"Leverage",trigger:"Margin debt/market cap > 2.5% (2000 level)",current:MS[6].cur,status:"green",watch:"Monthly FINRA margin statistics; prime broker leverage surveys"},
    {category:"Housing",trigger:"Case-Shiller YoY negative for 3+ months with rising delinquencies",current:"+1.3% YoY",status:"green",watch:"Monthly Case-Shiller; weekly MBA delinquency surveys"},
    {category:"AI Disruption",trigger:"Major SaaS company reports >20% revenue decline citing AI-native competition",current:"Early signs (GitHub Copilot replacing dev tools)",status:"yellow",watch:"Quarterly earnings of Salesforce, ServiceNow, Atlassian, Adobe; AI-native tool adoption curves"},
  ];

  const assetImplications = [
    {asset:"AI Infrastructure (Hyperscalers, Semis, Data Centers)",weight:"Overweight",dir:"↑",color:t.green,rationale:"The picks-and-shovels of the AI revolution; secular demand regardless of application-layer winners. $300B+ committed capex creates multi-year revenue visibility for compute, networking, and energy infrastructure."},
    {asset:"AI-Native Technology",weight:"Overweight",dir:"↑",color:t.green,rationale:"Companies building AI-first products and platforms — the application layer of the AI revolution. Favor companies with proprietary data moats and AI-native architectures over legacy tech adapting to AI."},
    {asset:"Traditional SaaS / Enterprise Software",weight:"Strong Underweight",dir:"↓",color:t.red,rationale:"Existential disruption risk; AI-native alternatives eliminate the need for packaged software at a fraction of the cost. Many incumbents face 50-80% revenue decline over 3-5 years as natural-language programming makes custom software free."},
    {asset:"US Large-Cap Equities (ex-Tech)",weight:"Neutral",dir:"→",color:t.yellow,rationale:"Elevated valuations offset by strong earnings; maintain benchmark exposure with quality tilt. AI productivity gains will benefit capital-light, data-rich businesses disproportionately."},
    {asset:"US Small/Mid-Cap",weight:"Neutral",dir:"→",color:t.yellow,rationale:"Relative valuation discount to large-cap widest since 2000, but many small/mid-cap software names face AI disruption. Selective exposure to AI-adjacent industrials and infrastructure over traditional tech."},
    {asset:"International Developed",weight:"Slight Overweight",dir:"↑",color:t.green,rationale:"European/Japanese equities trading at 30-40% P/E discount; currency hedged basis attractive. AI adoption lagging US creates both risk (competitiveness) and opportunity (catch-up)."},
    {asset:"Emerging Markets",weight:"Neutral",dir:"→",color:t.yellow,rationale:"China uncertainty offsets attractive valuations in India, Mexico, Indonesia. Semiconductor supply chain concentration in Taiwan is a systemic risk for AI infrastructure."},
    {asset:"US Treasuries (Duration)",weight:"Slight Overweight",dir:"↑",color:t.green,rationale:"Yield curve normalization benefits duration; 4.2% 10Y provides attractive income and hedge value against AI capex disappointment scenario."},
    {asset:"Investment-Grade Credit",weight:"Underweight",dir:"↓",color:t.red,rationale:"Tight spreads offer minimal compensation for credit risk; traditional software issuers face fundamental business model deterioration."},
    {asset:"High-Yield Credit",weight:"Underweight",dir:"↓",color:t.red,rationale:"3.2% spreads near cycle tights; asymmetric risk skewed to the downside. HY software names particularly vulnerable."},
    {asset:"Gold / Commodities",weight:"Slight Overweight",dir:"↑",color:t.green,rationale:"Portfolio hedge against tail risks; central bank buying and fiscal concerns support structural demand. Energy commodities benefit from AI data center power demand."},
    {asset:"Cash / Money Market",weight:"Neutral",dir:"→",color:t.yellow,rationale:"4%+ yields with zero duration risk; maintain sufficient liquidity for tactical deployment but avoid excessive cash drag during a potential AI supercycle."},
    {asset:"Real Estate / REITs",weight:"Neutral",dir:"→",color:t.yellow,rationale:"Data center REITs benefit from AI infrastructure buildout; traditional office/retail face AI-driven remote work and e-commerce headwinds."},
  ];

  return (
    <div>
      {/* ═══════ SECTION 1: COVER / HEADER ═══════ */}
      <div style={{borderBottom:`2px solid ${t.accent}`,paddingBottom:28,marginBottom:0}}>
        <div style={{textAlign:"center",padding:"24px 0 8px"}}>
          <div style={{fontSize:10,color:t.accent,letterSpacing:4,textTransform:"uppercase",fontWeight:700,marginBottom:6}}>Equity Strategy Research — Thematic Deep Dive</div>
          <h1 className="report-title" style={{fontSize:36,fontWeight:400,color:t.text,margin:"6px 0 4px",letterSpacing:-0.5,lineHeight:1.15,fontFamily:"'Instrument Serif',Georgia,serif"}}>U.S. Equity Market Bubble Risk Assessment</h1>
          <h2 className="report-subtitle" style={{fontSize:16,fontWeight:400,color:t.textMuted,margin:"8px 0 0",fontStyle:"italic"}}>A Comprehensive Multi-Factor Quantitative and Qualitative Framework for Systemic Market Risk Evaluation</h2>
        </div>
        <div className="report-header-meta" style={{display:"flex",justifyContent:"center",gap:32,marginTop:20,flexWrap:"wrap"}}>
          {[{l:"Date",v:"March 18, 2026"},{l:"Lead Analyst",v:"Dachi Gubadze"},{l:"Classification",v:"ELEVATED BUT SUPPORTED"},{l:"Composite Score",v:`${OS}/100`},{l:"Prior Rating",v:"N/A (Initiation)"}].map((x,i)=>(
            <div key={i} style={{textAlign:"center"}}>
              <div style={{fontSize:9,color:t.textDim,textTransform:"uppercase",letterSpacing:1.5,fontWeight:600}}>{x.l}</div>
              <div style={{fontSize:12,fontWeight:700,color:i===3?t.yellow:t.text,marginTop:2}}>{x.v}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="report-content" style={{maxWidth:760,margin:"0 auto",paddingTop:28}}>

        {/* ═══════ SECTION 2: EXECUTIVE SUMMARY ═══════ */}
        {sectionNum(1, "Executive Summary")}
        <Card style={{marginBottom:20,padding:24}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
            <span style={{padding:"4px 14px",borderRadius:20,fontSize:11,fontWeight:800,letterSpacing:1,background:t.yellowBg,color:t.yellow,border:`1px solid ${t.yellowBorder}`}}>VERDICT: ELEVATED — NOT A BUBBLE</span>
            <span style={{fontSize:12,fontWeight:700,color:t.yellow}}>{OS}/100</span>
          </div>
          {prose("This report presents a comprehensive, multi-dimensional analysis of systemic bubble risk in U.S. equity markets as of March 2026. Synthesizing 20 quantitative metrics across 8 analytical categories — equity valuation, market structure, credit conditions, macroeconomic fundamentals, monetary policy, investor sentiment, housing markets, and global structural risk — we arrive at a composite risk score of " + OS + " on a 0-100 scale. This positions the current market environment firmly in the \"Elevated Caution\" zone, materially above the historical median of approximately 35-40 but decisively below the 80+ threshold that has historically preceded systemic market dislocations.")}
          {prose(`The core finding of this analysis is that the U.S. equity market in March 2026 is expensive by virtually every traditional valuation metric, but it is not in a bubble in the classical sense of that term. A bubble, properly defined, requires a fundamental disconnect between asset prices and underlying economic reality. The evidence does not support that characterization. S&P 500 earnings per share are growing at ${MS[10].cur}, and the equity risk premium, while slim at ${MS[3].cur}, remains positive — a critical distinction from the dot-com peak when investors accepted negative risk premiums.`)}
          {prose(`However, the absence of a bubble does not equate to the absence of risk. Valuations at current levels — CAPE at ${MS[0].cur} and the Buffett Indicator at ${MS[2].cur} — provide minimal margin of safety against earnings disappointments, exogenous shocks, or shifts in monetary policy expectations. The unprecedented concentration of the S&P 500, with the top 10 constituents representing ${MS[4].cur} of total market capitalization, creates fragility that traditional diversification frameworks fail to capture. The BIS global debt proxy at ${MS[17].cur} also constrains the room policymakers have to respond to future crises.`)}
          {prose("However, this analysis must be situated within the defining variable of our era: the AI revolution. We are witnessing the onset of the most transformative technological shift in human history — a phase change comparable to the First and Second Industrial Revolutions compressed into five years. The internet connected information; artificial intelligence creates intelligence itself. This is not an incremental improvement in computing. It is a fundamental reconfiguration of how economic value is generated, captured, and distributed. Our composite score of ~" + OS + " is \"elevated\" by the standards of traditional valuation frameworks — but those frameworks were built for an industrial economy in which cognitive labor was exclusively human. If AI delivers even a fraction of its projected potential — automating knowledge work across legal, medical, financial, engineering, and creative domains — then current equity prices are not a bubble. They are early pricing of a civilizational transformation whose magnitude the market has only begun to discount.")}
          {prose("This observation does not eliminate risk — it reframes it. The real risk may not be that the market is too expensive, but that traditional valuation metrics are structurally incapable of pricing a technology that replicates cognition at near-zero marginal cost. The Magnificent Seven are not overpriced if they are building the infrastructure layer of a new civilization. Meanwhile, a $600 billion traditional software industry — companies selling packaged CRM, ERP, project management, and enterprise tools — faces existential disruption as AI enables anyone to build custom software through natural language. The creative destruction ahead may be the largest reallocation of economic value since electrification.")}
          {prose("Our base case (45% probability) anticipates AI-driven earnings expansion with moderate productivity gains, the S&P grinding higher to 5,400-6,000. We assign a 30% probability to a bull case in which the AI supercycle delivers transformative productivity gains and earnings growth accelerates to 20-25%, an 18% probability to a bear case in which AI capex disappoints and triggers a 25-35% drawdown, and a 7% probability to a systemic tail-risk event involving geopolitical disruption or AI-specific regulatory shock. The asymmetry of these outcomes — and the likelihood that AI's transformative impact is being underpriced rather than overpriced — argues for a posture of strategic conviction rather than defensive retreat, with particular emphasis on AI infrastructure positioning and active avoidance of traditional software incumbents facing displacement.")}
        </Card>

        {/* Key metrics summary strip */}
        <div className="grid-4-col" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:20}}>
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
        {prose("Our analytical framework employs a systematic, multi-factor scoring methodology designed to quantify systemic market risk while accounting for structural shifts in market composition, monetary regimes, and economic architecture. Each of the 20 constituent metrics is scored on a 0-100 scale through a composite evaluation that incorporates four dimensions: (1) the current reading relative to its long-run historical average, (2) the proximity of the current reading to values observed at confirmed bubble peaks (specifically the dot-com peak of 2000 and the GFC peak of 2007-2008), (3) the rate of change and directional momentum of the metric, and (4) qualitative structural adjustments that account for regime changes in corporate profitability, monetary policy, and market microstructure.")}
        {prose("The composite score is calculated as the unweighted arithmetic mean of all 20 individual metric scores. While more sophisticated weighting schemes (e.g., factor-loading-based, principal component-derived) could theoretically improve predictive accuracy, the unweighted approach provides transparency, reproducibility, and resistance to overfitting — qualities we consider essential for a framework intended to inform investment decisions under conditions of fundamental uncertainty. The traffic-light classification (Green/Healthy, Yellow/Caution, Red/Elevated) represents a qualitative overlay informed by the quantitative scores but incorporating contextual judgment that purely mechanical scoring cannot capture.")}
        {prose("A critical limitation of this framework — and indeed of all historical comparison-based valuation models — is that it benchmarks current conditions against crisis periods that occurred before the AI era. The 1929, 2000, and 2008 dislocations all took place in economies where cognitive labor was exclusively human, software was expensive to build and distribute, and productivity growth was constrained by biological limits on human output. No prior analytical framework accounts for a technology that can replicate, augment, and eventually surpass cognitive labor across virtually every economic domain. This means our historical comparisons may systematically overstate risk by anchoring to a world that no longer exists. We flag this not to dismiss the framework's utility — historical patterns remain the best available guide — but to acknowledge that if AI represents a genuine phase change in economic capability, then backward-looking metrics may be measuring the wrong baseline.")}

        <Card style={{marginBottom:20,padding:18}}>
          <h4 style={{margin:"0 0 14px",fontSize:13,fontWeight:700,color:t.accent}}>Scoring Scale Interpretation</h4>
          <div className="grid-5-col" style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:8}}>
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
          <div className="table-responsive">
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
                  <td style={{padding:"8px",color:t.textMuted,fontFamily:"'JetBrains Mono',monospace"}}>Equal</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </Card>

        {sectionDivider}

        {/* ═══════ SECTION 4: COMPOSITE RISK ASSESSMENT ═══════ */}
        {sectionNum(3, "Composite Risk Assessment")}
        {prose("The composite risk score of " + OS + "/100 positions the current market environment in the upper band of the \"Elevated\" zone. This reading captures the fundamental tension that defines the March 2026 market: valuations that are historically extreme by nearly every traditional metric, coexisting with macroeconomic fundamentals and corporate earnings that provide genuine support for elevated price levels. The radar chart below visualizes the dispersion of risk across our eight analytical categories, revealing a highly asymmetric risk profile — concentrated primarily in equity valuation and global structural risk, with credit conditions and macroeconomic fundamentals providing significant counterbalancing strength.")}

        <Card style={{marginBottom:20,padding:20}}>
          <div className="grid-report-gauge" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,alignItems:"center"}}>
            <div style={{textAlign:"center"}}>
              <div style={{fontSize:10,color:t.textDim,textTransform:"uppercase",letterSpacing:2,fontWeight:600,marginBottom:6}}>Composite Risk Score</div>
              <Gauge score={OS} />
              <div style={{marginTop:8}}>
                <span style={{padding:"4px 14px",borderRadius:20,fontSize:10,fontWeight:700,letterSpacing:1,background:t.yellowBg,color:t.yellow,border:`1px solid ${t.yellowBorder}`}}>ELEVATED — NOT A BUBBLE</span>
              </div>
              <div style={{marginTop:10,fontSize:11,color:t.textDim,lineHeight:1.5}}>
                Score reflects unweighted average of 20 metrics.<br />
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
          <div className="table-responsive">
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
                {cat:"Equity Valuation",sc:_catAvg([0,1,2,3]),assess:sigFromScore(_catAvg([0,1,2,3])) === "red" ? "High Risk" : sigFromScore(_catAvg([0,1,2,3])) === "yellow" ? "Elevated" : "Low Risk",driver:`CAPE ${MS[0].cur}, Buffett ${MS[2].cur}`,v00:`Lower (CAPE was ${MS[0].c00})`,v08:`Higher (CAPE was ${MS[0].c08})`},
                {cat:"Market Structure",sc:_catAvg([4,5,6,18,19]),assess:sigFromScore(_catAvg([4,5,6,18,19])) === "red" ? "High Risk" : sigFromScore(_catAvg([4,5,6,18,19])) === "yellow" ? "Elevated" : "Low Risk",driver:`Top 10 at ${MS[4].cur}, leverage ${MS[6].cur}`,v00:`Worse (was ${MS[4].c00})`,v08:`Worse (was ${MS[4].c08})`},
                {cat:"Credit & Debt",sc:32,assess:"Below Average",driver:"HH Debt/Inc 92%, YC +52bp",v00:"Similar",v08:"Much Better (was 133%)"},
                {cat:"Macro Fundamentals",sc:_catAvg([10,11]),assess:sigFromScore(_catAvg([10,11])) === "red" ? "High Risk" : sigFromScore(_catAvg([10,11])) === "yellow" ? "Elevated" : "Low Risk",driver:`${MS[10].cur} EPS growth, ${MS[11].cur} GDP`,v00:"Much Better (EPS was -2%)",v08:"Much Better (GDP was -4.3%)"},
                {cat:"Monetary Policy",sc:43,assess:"Elevated",driver:"Fed easing from neutral",v00:"Better (was 6.5%)",v08:"Better (was 5.25%)"},
                {cat:"Sentiment",sc:MS[15].sc,assess:MS[15].sig === "red" ? "High Risk" : MS[15].sig === "yellow" ? "Moderate" : "Low Risk",driver:`VIX ${MS[15].cur}, no euphoria`,v00:"Better (VIX was 33)",v08:"Better (VIX was 80)"},
                {cat:"Housing",sc:40,assess:"Below Average",driver:"Supply-driven, FICO ~740",v00:"N/A",v08:"Much Better (FICO ~700)"},
                {cat:"Global Risk",sc:MS[17].sc,assess:MS[17].sig === "red" ? "Elevated" : MS[17].sig === "yellow" ? "Moderate" : "Low Risk",driver:`BIS debt proxy ${MS[17].cur}`,v00:`Lower proxy baseline (${MS[17].c00})`,v08:`Below crisis peak (${MS[17].c08})`},
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
          </div>
        </Card>

        {sectionDivider}

        {/* ═══════ SECTION 5: CATEGORY DEEP DIVES ═══════ */}
        {sectionNum(4, "Category Deep Dives")}
        {prose("The following sections provide detailed analytical commentary on each of the eight risk categories, incorporating quantitative data, historical context, structural analysis, and forward-looking risk assessment. Each section includes the constituent metrics, an inline visualization, and a comparative data table.")}

        {catScores.map((cat, ci) => (
          <div key={ci} style={{marginBottom:30}}>
            <Card style={{marginBottom:14}}>
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
              <div className="table-responsive" style={{marginTop:14,marginBottom:14}}>
                <div style={{fontSize:10,color:t.accent,fontWeight:700,textTransform:"uppercase",letterSpacing:1.5,marginBottom:8}}>Constituent Metrics</div>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                  <thead>
                    <tr style={{borderBottom:`2px solid ${t.border}`}}>
                      {["Metric","Current","Dot-Com","GFC","Average","Score","Signal"].map(h=>(
                        <th key={h} style={{padding:"6px 6px",textAlign:"left",color:t.textDim,fontWeight:700,fontSize:9,textTransform:"uppercase",letterSpacing:1}}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {cat.metrics.map((mi,mii)=>(
                      <tr key={mii} style={{borderBottom:`1px solid ${t.border}44`}}>
                        <td style={{padding:"6px",color:t.text,fontWeight:600}}>{MS[mi].nm}</td>
                        <td style={{padding:"6px",color:t.text,fontWeight:700,fontFamily:"'JetBrains Mono',monospace"}}>{MS[mi].cur}</td>
                        <td style={{padding:"6px",color:t.textMuted,fontFamily:"'JetBrains Mono',monospace"}}>{MS[mi].c00}</td>
                        <td style={{padding:"6px",color:t.textMuted,fontFamily:"'JetBrains Mono',monospace"}}>{MS[mi].c08}</td>
                        <td style={{padding:"6px",color:t.textMuted,fontFamily:"'JetBrains Mono',monospace"}}>{MS[mi].avg}</td>
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
                      {cat.refY != null && <ReferenceLine y={cat.refY} stroke={t.refLabel} strokeDasharray="6 3" label={{value:cat.refLabel,fill:t.refLabel,fontSize:10,position:"insideTopLeft",dy:-8}} />}
                      <Area type="monotone" dataKey="v" stroke={cat.color} fill={`url(#${cat.id})`} strokeWidth={2.5} name={cat.dataName} dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
              {/* Special chart for Macro — bar chart of EPS */}
              {cat.name === "Macro Fundamentals" && (
                <div style={{height:220,marginTop:10}}>
                  <EpsHistoryChart data={epsQ} />
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
          <div className="table-responsive">
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
                    <span style={{display:"inline-flex",alignItems:"center",justifyContent:"center",minWidth:92,padding:"2px 8px",borderRadius:4,fontSize:10,fontWeight:700,lineHeight:1.3,textAlign:"center",color:r.dir==="Confirming"?t.accent:r.dir==="Diverging"?t.orange:t.yellow,background:r.dir==="Confirming"?t.accentBg:r.dir==="Diverging"?`${t.orange}15`:`${t.yellow}15`}}>{r.dir}</span>
                  </td>
                  <td style={{padding:"8px 6px",color:t.textMuted,fontSize:10,lineHeight:1.4}}>{r.note}</td>
                  <td style={{padding:"8px 6px"}}><Badge signal={r.sig} /></td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
          <div style={{marginTop:12,padding:"10px 14px",background:t.bgCardAlt,borderRadius:8}}>
            <p style={{margin:0,fontSize:11,color:t.textMuted,lineHeight:1.6}}><strong style={{color:t.accent}}>Key Takeaway:</strong> Of 11 major metric pairs analyzed, 5 are confirming, 4 are diverging, and 2 are partially offsetting. The most significant divergence is between AI infrastructure investment and traditional software revenue — a leading indicator of the creative destruction that will reshape the composition of equity indices over the next 3-5 years. This mixed signal profile is characteristic not of a late-cycle bubble, but of a market undergoing structural transformation driven by the AI revolution.</p>
          </div>
        </Card>

        {sectionDivider}

        {/* ═══════ SECTION 7: EXPANDED HISTORICAL COMPARISON MATRIX ═══════ */}
        {sectionNum(6, "Expanded Historical Comparison Matrix")}
        {prose("The following matrix provides a comprehensive comparison of current market conditions against the three most significant market dislocations in modern financial history: the 1929 crash that precipitated the Great Depression, the 2000 dot-com bubble collapse, and the 2008 Global Financial Crisis. Each comparison dimension is evaluated to determine whether current conditions are more or less favorable than at those historical crisis points. This matrix is designed to provide a holistic, at-a-glance assessment of the structural similarities and differences that define the current risk environment.")}

        <Card style={{marginBottom:20,padding:18,overflowX:"auto"}}>
          <h4 style={{margin:"0 0 14px",fontSize:13,fontWeight:700,color:t.accent}}>Comprehensive Historical Comparison</h4>
          <div className="table-responsive">
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
                {dim:"Earnings Quality",v29:"Cyclical / fragile",v00:"Fictional / pro-forma",v08:"Leveraged / FIRE",v26:`Real / ${MS[10].cur} growth`,assess:"Materially better",color:t.green},
                {dim:"CAPE Ratio",v29:"32.6x",v00:"44.2x",v08:"27.5x",v26:`${MS[0].cur}x`,assess:"Between 2000 and 2008",color:t.yellow},
                {dim:"Household Leverage",v29:"Moderate",v00:"Moderate (97%)",v08:"Extreme (133%)",v26:"Low (92%)",assess:"Well below average",color:t.green},
                {dim:"Fed Policy Stance",v29:"Tightening",v00:"Tightening (6.5%)",v08:"Tightening (5.25%)",v26:"Easing (3.6%)",assess:"Actively accommodative",color:t.green},
                {dim:"Banking System",v29:"Fragile / runs",v00:"Stable",v08:"Failed (Lehman etc.)",v26:"Strong / Basel III",assess:"Well capitalized",color:t.green},
                {dim:"Market Concentration",v29:"Railroads/utilities",v00:"TMT (27%)",v08:"Financials",v26:`Tech (${MS[4].cur})`,assess:"Worst ever — but earned",color:t.orange},
                {dim:"Credit Spreads",v29:"Widening",v00:"Widening (8%)",v08:"Exploding (21.8%)",v26:"Compressed (3.2%)",assess:"No stress signal",color:t.green},
                {dim:"Investor Sentiment",v29:"Euphoric",v00:"Euphoric",v08:"Complacent",v26:"Cautious / moderate",assess:"No euphoria present",color:t.green},
                {dim:"GDP Trajectory",v29:"Peaking",v00:"Slowing (1.0%)",v08:"Contracting (-4.3%)",v26:"Steady (2.0%)",assess:"Near trend-rate growth",color:t.green},
                {dim:"Money Supply Growth",v29:"Contracting",v00:"Moderate",v08:"Pre-QE era",v26:MS[13].cur,assess:"Elevated liquidity base",color:t.yellow},
                {dim:"Global Debt/GDP",v29:"N/A",v00:MS[17].c00,v08:MS[17].c08,v26:MS[17].cur,assess:"BIS proxy above average but below its pandemic peak",color:t.yellow},
                {dim:"Regulatory Framework",v29:"Minimal",v00:"Post-Sarbanes",v08:"Pre-Dodd-Frank",v26:"Basel III/IV, Dodd-Frank",assess:"Most robust ever",color:t.green},
                {dim:"Information Speed",v29:"Newspapers/ticker",v00:"Early internet",v08:"Bloomberg/cable",v26:"Real-time/algo/social",assess:"Faster but more volatile",color:t.yellow},
                {dim:"Transmission Mechanism",v29:"Bank runs → deflation",v00:"Wealth effect → mild recession",v08:"CDOs → banks → credit freeze",v26:"No clear mechanism",assess:"Absent — critical distinction",color:t.green},
                {dim:"Technological Catalyst",v29:"Radio / automobiles",v00:"Internet (connecting)",v08:"Financial engineering",v26:"AI (thinking machines)",assess:"Orders of magnitude more transformative — replicates cognition, not just connectivity",color:t.blue},
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
          </div>
          <div style={{marginTop:12,padding:"10px 14px",background:t.bgCardAlt,borderRadius:8}}>
            <p style={{margin:0,fontSize:11,color:t.textMuted,lineHeight:1.6}}><strong style={{color:t.green}}>Summary:</strong> Of 16 comparison dimensions (excluding Recovery Time), current conditions are more favorable than historical crisis peaks in 10 categories, comparable in 3, and less favorable in 2 — with the technological catalyst dimension representing an entirely new variable that no prior framework has had to account for. The AI revolution is not comparable to the internet; it is comparable to the invention of cognitive labor itself. The absence of an identifiable transmission mechanism and the presence of a technological catalyst of unprecedented magnitude together form the strongest argument that current valuations reflect rational pricing of a civilizational transformation rather than speculative excess.</p>
          </div>
        </Card>

        {sectionDivider}

        {/* ═══════ SECTION 8: SCENARIO ANALYSIS ═══════ */}
        {sectionNum(7, "Scenario Analysis")}
        {prose("The following scenario analysis presents four distinct forward-looking market pathways, each with an assigned probability, 12-month S&P 500 target range, expected return implications, key underlying assumptions, and portfolio positioning implications. Probabilities are derived from a combination of historical base rates for analogous market conditions, current fundamental and technical indicators, and qualitative assessment of emerging risk vectors. These scenarios are not mutually exclusive — elements of multiple scenarios may manifest simultaneously — but are presented as discrete outcomes to facilitate strategic planning.")}

        <div className="grid-scenarios" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:20}}>
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
              <div style={{padding:"8px 10px",background:t.bgCardAlt,borderRadius:6}}>
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
                <Tooltip content={<ChartTip />} cursor={false} />
                <Bar dataKey="prob" name="Probability" unit="%" radius={[6,6,0,0]} activeBar={{fillOpacity:1}}>
                  {scenarios.map((s,i) => <Cell key={i} fill={s.color} fillOpacity={0.75} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{marginTop:10,padding:"8px 14px",background:t.bgCardAlt,borderRadius:8}}>
            <p style={{margin:0,fontSize:11,color:t.textMuted,lineHeight:1.6}}><strong style={{color:t.accent}}>Expected value calculation:</strong> Weighting the midpoint of each scenario's return range by its probability yields an expected 12-month S&P 500 return of approximately <strong style={{color:t.text}}>+8% to +12%</strong> — reflecting the probability-weighted impact of the AI supercycle thesis. The positive skew relative to traditional frameworks reflects our conviction that AI's transformative potential is being underpriced rather than overpriced by current market levels.</p>
          </div>
        </Card>

        {sectionDivider}

        {/* ═══════ SECTION 9: RISK CATALYSTS & MONITORING FRAMEWORK ═══════ */}
        {sectionNum(8, "Risk Catalysts & Monitoring Framework")}
        {prose("While our base case does not anticipate a systemic market dislocation, the compressed risk premiums and elevated valuations that characterize the current environment demand a rigorous monitoring framework for early warning signals. The following catalyst matrix identifies the specific trigger conditions that would warrant a material reassessment of our risk posture, along with current readings, status assessments, and the specific data sources to monitor for each trigger. This framework is designed to provide actionable, real-time intelligence that can inform portfolio adjustments before a potential dislocation materializes.")}
        {prose("The critical insight is that systemic crises rarely emerge from a single catalyst in isolation. Rather, they typically result from the convergence of multiple deteriorating conditions that interact in non-linear and often unpredictable ways. The monitoring framework below should therefore be evaluated holistically — the simultaneous deterioration of multiple indicators should trigger a more aggressive risk reduction than any single indicator breach in isolation.")}

        <Card style={{marginBottom:20,padding:18,overflowX:"auto"}}>
          <h4 style={{margin:"0 0 14px",fontSize:13,fontWeight:700,color:t.accent}}>Catalyst Trigger Matrix</h4>
          <div className="table-responsive">
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
                  <td style={{padding:"8px 6px",color:t.text,fontWeight:600,fontFamily:"'JetBrains Mono',monospace",fontSize:10}}>{c.current}</td>
                  <td style={{padding:"8px 6px"}}><Badge signal={c.status} /></td>
                  <td style={{padding:"8px 6px",color:t.textDim,fontSize:10,lineHeight:1.4}}>{c.watch}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
          <div style={{marginTop:12,padding:"10px 14px",background:t.bgCardAlt,borderRadius:8}}>
            <p style={{margin:0,fontSize:11,color:t.textMuted,lineHeight:1.6}}><strong style={{color:t.yellow}}>Current Status:</strong> Of 9 monitored catalyst categories, 5 show no trigger activation (Green), 4 show elevated monitoring status (Yellow), and 0 show active trigger breach (Red). The AI Disruption catalyst deserves particular attention: while no major SaaS incumbent has yet reported a &gt;20% revenue decline attributable to AI-native competition, the early indicators — accelerating adoption of AI coding assistants, AI-generated customer service, and AI-native workflow tools — suggest this trigger may activate within 12-18 months.</p>
          </div>
        </Card>

        {sectionDivider}

        {/* ═══════ SECTION 10: INVESTMENT IMPLICATIONS ═══════ */}
        {sectionNum(9, "Investment Implications & Asset Allocation")}
        {prose("The analytical framework presented in this report carries direct and actionable implications for portfolio construction. The core challenge facing allocators in March 2026 is not the compression of expected returns across major asset classes — it is the unprecedented divergence between assets positioned to benefit from the AI revolution and those facing disruption by it. This is not a market that rewards passive, benchmark-hugging allocation. It rewards conviction about the direction of technological change and the willingness to position portfolios accordingly. The following framework is designed for an institutional portfolio with a 12-month tactical horizon and a structural view on AI's transformative impact.")}
        {prose("Our allocation tilts reflect the central thesis of this report: the AI revolution represents a phase change in economic productivity that will create massive winners and massive losers simultaneously. We aggressively overweight assets that are building the infrastructure layer of the AI economy — semiconductors, hyperscale cloud, data centers, energy infrastructure — while underweighting the traditional software incumbents facing existential disruption. We maintain hedges against the primary risk vectors (AI capex disappointment, geopolitical disruption of semiconductor supply chains, regulatory overreach) but size those hedges as tail-risk insurance rather than core positioning. The emphasis is on strategic conviction with tactical discipline — positioning for the revolution while managing the risks inherent in any transformation of this magnitude.")}

        <Card style={{marginBottom:20,padding:18}}>
          <h4 style={{margin:"0 0 14px",fontSize:13,fontWeight:700,color:t.accent}}>Tactical Asset Allocation Framework (12-Month Horizon)</h4>
          <div className="table-responsive">
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
                    <span style={{display:"inline-flex",alignItems:"center",justifyContent:"center",minWidth:110,padding:"2px 8px",borderRadius:4,fontSize:10,fontWeight:700,lineHeight:1.3,textAlign:"center",color:a.color,background:a.color===t.green?t.greenBg:a.color===t.red?t.redBg:t.yellowBg}}>{a.weight}</span>
                  </td>
                  <td style={{padding:"8px 6px",fontSize:16,color:a.color,fontWeight:700}}>{a.dir}</td>
                  <td style={{padding:"8px 6px",color:t.textMuted,fontSize:10,lineHeight:1.4}}>{a.rationale}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </Card>

        {/* Sector positioning */}
        <Card style={{marginBottom:20,padding:18}}>
          <h4 style={{margin:"0 0 14px",fontSize:13,fontWeight:700,color:t.accent}}>Sector Positioning Recommendations</h4>
          <div className="grid-3-col" style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
            <div style={{padding:12,borderRadius:8,background:t.greenBg,border:`1px solid ${t.greenBorder}`}}>
              <div style={{fontSize:10,fontWeight:700,color:t.green,letterSpacing:1,textTransform:"uppercase",marginBottom:8}}>Overweight</div>
              {["AI Infrastructure & Semiconductors (compute backbone of the revolution)","Technology — AI-native platforms only (not legacy SaaS)","Healthcare (defensive + AI drug discovery + diagnostics)","Industrials (reshoring, data center construction, energy infrastructure)","Financials (NIM expansion, deregulation, AI-driven efficiency)"].map((s,i)=>(
                <div key={i} style={{fontSize:11,color:t.textMuted,padding:"3px 0",borderBottom:i<4?`1px solid ${t.greenBorder}`:""}}>{s}</div>
              ))}
            </div>
            <div style={{padding:12,borderRadius:8,background:t.yellowBg,border:`1px solid ${t.yellowBorder}`}}>
              <div style={{fontSize:10,fontWeight:700,color:t.yellow,letterSpacing:1,textTransform:"uppercase",marginBottom:8}}>Market Weight</div>
              {["Consumer Staples (stable but low growth)","Utilities (rate-sensitive, but AI data center demand provides upside)","Communication Services (mixed quality)","Energy (supply discipline, geopolitical premium)"].map((s,i)=>(
                <div key={i} style={{fontSize:11,color:t.textMuted,padding:"3px 0",borderBottom:i<3?`1px solid ${t.yellowBorder}`:""}}>{s}</div>
              ))}
            </div>
            <div style={{padding:12,borderRadius:8,background:t.redBg,border:`1px solid ${t.redBorder}`}}>
              <div style={{fontSize:10,fontWeight:700,color:t.red,letterSpacing:1,textTransform:"uppercase",marginBottom:8}}>Underweight</div>
              {["Traditional SaaS / Packaged Software (existential disruption — AI makes custom software free)","Consumer Discretionary (stretched consumer)","Real Estate — Office/Retail (AI-driven remote work acceleration)","Materials (China demand uncertainty)","Speculative Growth (unproven, non-AI business models)"].map((s,i)=>(
                <div key={i} style={{fontSize:11,color:t.textMuted,padding:"3px 0",borderBottom:i<4?`1px solid ${t.redBorder}`:""}}>{s}</div>
              ))}
            </div>
          </div>
        </Card>

        {sectionDivider}

        {/* ═══════ SECTION 11: CONCLUSION ═══════ */}
        {sectionNum(10, "Conclusion")}
        <Card style={{marginBottom:20,padding:24}}>
          {prose("After exhaustive analysis of 20 quantitative metrics spanning eight analytical categories, extensive historical comparison against the most significant market dislocations of the past century, and rigorous scenario modeling, we arrive at a definitive assessment: the U.S. equity market in March 2026 is not in a bubble. It is in the early stages of the most transformative technological revolution in human history.")}
          {prose("The AI revolution is the First and Second Industrial Revolutions compressed into five years. The steam engine mechanized physical labor over the course of a century. Electrification transformed manufacturing over decades. The internet connected information over twenty years. Artificial intelligence creates intelligence itself — and it is doing so at the exponential pace of Moore's Law rather than the linear pace of industrial adoption. This is not an iteration on prior technologies. It is a phase change in human civilization: the first technology capable of replicating, augmenting, and eventually surpassing the cognitive capabilities that have defined economic production since the Enlightenment. The implications for asset prices, corporate earnings, and economic structure are not merely significant — they are without historical precedent.")}
          {prose(`Traditional valuation metrics — the CAPE at ${MS[0].cur}, the Buffett Indicator at ${MS[2].cur}, and the forward P/E at ${MS[1].cur}x — are backward-looking tools designed to measure an industrial economy. They compare current prices to historical earnings generated by human labor, historical GDP produced by human productivity, and historical growth rates constrained by biological limits on cognitive output. These frameworks have no mechanism to price a technology that can automate legal research, medical diagnostics, software engineering, financial analysis, content creation, and scientific discovery simultaneously, at near-zero marginal cost, and at global scale.`)}
          {prose(`The quantitative evidence supports this reframing. S&P 500 earnings per share are growing at ${MS[10].cur} — nearly double the historical average of 8% — and this growth is underpinned by genuine revenue expansion, not financial engineering. Household balance sheets are the strongest in three decades. Credit markets show no systemic stress. The banking system is well-capitalized. The Fed is easing from a position of strength. These are not the conditions of a bubble.`)}
          {prose("The real risk is not that the market is too expensive. It is that investors are not positioned aggressively enough for the disruption ahead. A $600 billion traditional software industry faces existential threat as AI enables custom software creation through natural language. Companies selling packaged CRM, ERP, project management, and enterprise tools — Salesforce, ServiceNow, Atlassian, Adobe, and hundreds of smaller SaaS vendors — face the real possibility that their entire value proposition can be replicated by AI agents at a fraction of the cost. Meanwhile, the companies building AI infrastructure — the semiconductor manufacturers, hyperscale cloud providers, data center operators, and energy suppliers — face decades of secular demand growth. The creative destruction ahead will be the largest reallocation of economic value since electrification replaced the steam economy.")}
          {prose("Our composite score of ~" + OS + " reflects a market that is expensive by the standards of the past. But we are not investing in the past. We are investing at the beginning of a transformation that will redefine the relationship between capital, labor, and productivity. The CAPE ratio may compress not through price decline but through explosive earnings growth as AI drives corporate margins from 12% toward 20%+. The Buffett Indicator may normalize not through market contraction but through GDP expansion as AI unlocks trillions in previously impossible economic output. The market concentration in mega-cap technology may intensify not as a sign of fragility but as the rational expression of winner-take-most dynamics in the most consequential platform technology ever created.")}
          {prose("Our recommendation is a posture of strategic conviction: overweight AI infrastructure aggressively, underweight traditional software incumbents facing existential disruption, and maintain the analytical discipline to distinguish between companies building the future and companies being displaced by it. The risks are real — AI capex disappointment, geopolitical disruption of the semiconductor supply chain, regulatory overreach — and they must be hedged. But the asymmetry of outcomes overwhelmingly favors positioning for the revolution rather than hiding from it.")}
          {prose("There is no bubble. There is a revolution.")}
        </Card>

        {sectionDivider}

        {/* ═══════ SECTION 12: APPENDIX ═══════ */}
        {sectionNum(11, "Appendix")}

        <Card style={{marginBottom:16,padding:18}}>
          <h4 style={{margin:"0 0 12px",fontSize:13,fontWeight:700,color:t.accent}}>A. Data Sources & Methodology Notes</h4>
          <div className="grid-2-col" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
            <div>
              <div style={{fontSize:10,fontWeight:700,color:t.text,textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>Primary Data Sources</div>
              {["Federal Reserve Economic Data (FRED)","Robert Shiller / multpl.com","Yardeni Research Morning Briefing","currentmarketvaluation.com","Slickcharts S&P 500","BIS Total Credit Dashboard","ICE BofA Credit Indices","CBOE Volatility Index (VIX)","S&P CoreLogic Case-Shiller","University of Michigan Surveys"].map((s,i)=>(
                <div key={i} style={{fontSize:11,color:t.textMuted,padding:"3px 0",borderBottom:`1px solid ${t.border}22`}}>{s}</div>
              ))}
            </div>
            <div>
              <div style={{fontSize:10,fontWeight:700,color:t.text,textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>Methodology Notes</div>
              {["Scoring range: 0 (min risk) to 100 (max risk)","Composite: unweighted arithmetic mean of 20 metrics","Historical comparisons: 2000 peak, 2008 peak, LT average","Rate adjustment: CAPE adjusted using Shiller excess CAPE yield","Margin debt: normalized to total market capitalization","ERP: implied from Gordon Growth Model applied to S&P 500","Scenario probabilities: Bayesian posterior estimates","All data as of March 14, 2026 unless otherwise noted"].map((s,i)=>(
                <div key={i} style={{fontSize:11,color:t.textMuted,padding:"3px 0",borderBottom:`1px solid ${t.border}22`}}>{s}</div>
              ))}
            </div>
          </div>
        </Card>

        <Card style={{marginBottom:16,padding:18}}>
          <h4 style={{margin:"0 0 12px",fontSize:13,fontWeight:700,color:t.accent}}>B. Complete Metric Scorecard</h4>
          <div className="table-responsive">
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
            <thead>
              <tr style={{borderBottom:`2px solid ${t.border}`}}>
                {["#","Metric","Current","Dot-Com","GFC","Avg","Score","Signal"].map(h=>(
                  <th key={h} style={{padding:"6px 5px",textAlign:"left",color:t.textDim,fontWeight:700,fontSize:9,textTransform:"uppercase",letterSpacing:0.5}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MS.map((m,i)=>(
                <tr key={i} style={{borderBottom:`1px solid ${t.border}44`}}>
                  <td style={{padding:"6px 5px",color:t.textDim,fontSize:10}}>{i+1}</td>
                  <td style={{padding:"6px 5px",color:t.text,fontWeight:600}}>{m.nm}</td>
                  <td style={{padding:"6px 5px",color:t.text,fontWeight:700,fontFamily:"'JetBrains Mono',monospace",fontSize:10}}>{m.cur}</td>
                  <td style={{padding:"6px 5px",color:t.textMuted,fontFamily:"'JetBrains Mono',monospace",fontSize:10}}>{m.c00}</td>
                  <td style={{padding:"6px 5px",color:t.textMuted,fontFamily:"'JetBrains Mono',monospace",fontSize:10}}>{m.c08}</td>
                  <td style={{padding:"6px 5px",color:t.textMuted,fontFamily:"'JetBrains Mono',monospace",fontSize:10}}>{m.avg}</td>
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
          </div>
        </Card>

        <Card style={{marginBottom:16,padding:18,background:t.bgCardAlt}}>
          <h4 style={{margin:"0 0 12px",fontSize:13,fontWeight:700,color:t.accent}}>C. Important Disclosures & Disclaimers</h4>
          <div style={{fontSize:10,color:t.textDim,lineHeight:1.7}}>
            <p style={{margin:"0 0 8px"}}>This report is prepared for educational and informational purposes only. It does not constitute investment advice, a solicitation, or an offer to buy or sell any securities. The views expressed herein represent the analytical conclusions of the author and are based on publicly available data.</p>
            <p style={{margin:"0 0 8px"}}>Past performance is not indicative of future results. All investments involve risk, including the potential loss of principal. The analytical framework presented herein is subject to inherent limitations including data availability, model assumptions, and the fundamental unpredictability of complex adaptive systems. Scenario probabilities are subjective estimates based on historical analogues and current conditions; actual outcomes may differ materially.</p>
            <p style={{margin:"0 0 8px"}}>The metrics and thresholds presented in this report should not be interpreted as precise predictive indicators. Financial markets are complex adaptive systems in which structural relationships can shift without warning. No quantitative framework, however sophisticated, can fully capture the range of potential outcomes in such a system.</p>
            <p style={{margin:0}}>Data sources are believed to be reliable but are not independently verified. Any errors or omissions are unintentional. This report may be updated periodically as new data becomes available.</p>
          </div>
        </Card>

        {sectionDivider}

        {/* ═══════ SECTION 13: FOOTER ═══════ */}
        <div style={{textAlign:"center",padding:"24px 0 10px"}}>
          <div className="gradient-divider" style={{height:1,background:`linear-gradient(90deg, transparent, ${t.accent}, transparent)`,margin:"12px 0"}} />
          <div style={{fontSize:10,color:t.textDim,lineHeight:1.7}}>
            <p style={{margin:"0 0 4px"}}>Lead Analyst: Dachi Gubadze | Research Date: {formatCalendarDate(new Date())} | Composite Score: {OS}/100</p>
            <p style={{margin:"0 0 4px",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
  <span style={{display:"inline-block",width:5,height:5,borderRadius:"50%",background:t.green,boxShadow:`0 0 6px ${t.green}`}} />
  Live Data: FRED CSV · multpl.com · currentmarketvaluation.com · Yardeni · Slickcharts · BIS
</p>
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
const TAB_COMPS = [null, TabEquity, TabMktStr, TabCredit, TabMacro, TabMoney, TabSent, TabHousing, TabGlobal, TabDataHealth, TabReport];
const TAB_PATHS = ["/","/equity-valuation","/market-structure","/credit-debt","/macro","/monetary-policy","/sentiment","/housing","/global-risk","/data-health","/report"];
const pathToTab = (p) => { const i = TAB_PATHS.indexOf(p); return i >= 0 ? i : 0; };

export default function App() {
  const [tab, setTab] = useState(() => pathToTab(window.location.pathname));
  const [isDark, setIsDark] = useState(false);
  const [fade, setFade] = useState(false);
  const headerRef = useRef(null);
  const pendingScrollTargetRef = useRef(null);
  const t = isDark ? themes.dark : themes.light;
  const [lastUpdated, setLastUpdated] = useState(null);
  const [dataHealth, setDataHealth] = useState(null);
  const [dataHealthError, setDataHealthError] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const getHeaderOffset = () => (headerRef.current?.getBoundingClientRect().height || 0) + 20;
  const scrollToAnchor = (anchorId, behavior = "smooth") => {
    const target = document.getElementById(anchorId);
    if (!target) return false;
    const top = window.scrollY + target.getBoundingClientRect().top - getHeaderOffset();
    window.scrollTo({ top: Math.max(top, 0), behavior });
    return true;
  };

  useEffect(() => { setFade(true); const x = setTimeout(() => setFade(false), 200); return () => clearTimeout(x); }, [tab]);
  useEffect(() => {
    let rafA = 0;
    let rafB = 0;

    if (!pendingScrollTargetRef.current) {
      window.scrollTo({ top:0, behavior:"auto" });
      return undefined;
    }

    rafA = window.requestAnimationFrame(() => {
      rafB = window.requestAnimationFrame(() => {
        const target = pendingScrollTargetRef.current;
        pendingScrollTargetRef.current = null;
        if (target?.anchorId) scrollToAnchor(target.anchorId, target.behavior);
      });
    });

    return () => {
      window.cancelAnimationFrame(rafA);
      window.cancelAnimationFrame(rafB);
    };
  }, [tab]);
  useEffect(() => { if (TAB_PATHS[tab] !== window.location.pathname) window.history.pushState(null, "", TAB_PATHS[tab]); }, [tab]);
  useEffect(() => {
    const fn = () => {
      pendingScrollTargetRef.current = null;
      setTab(pathToTab(window.location.pathname));
    };
    window.addEventListener("popstate", fn);
    return () => window.removeEventListener("popstate", fn);
  }, []);

  const refreshMetrics = async () => {
    setIsRefreshing(true);
    setDataHealthError("");
    try {
      const response = await fetch("/api/metrics", {
        cache:"no-store",
        headers:{ Accept:"application/json" },
      });
      const contentType = response.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        throw new Error("Metrics endpoint returned HTML instead of JSON. Check Vercel API routing for /api/metrics.");
      }

      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error || `Metrics request failed with HTTP ${response.status}`);
      if (!payload?.metrics?.length) throw new Error(payload?.error || "Metrics payload was empty");

      payload.metrics.forEach(metric => {
        const m = MS[metric.idx];
        if (!m || !Number.isFinite(metric.value)) return;
        m.nm = metric.name;
        m.cur = metric.display ?? m.cur;
        m.nv = metric.value;
        m.asOf = metric.asOf ?? m.asOf;
        m.freq = metric.frequency ?? m.freq;
        m.src = metric.source ?? m.src;
        m.srcUrl = metric.sourceUrl ?? m.srcUrl;
        m.healthStatus = metric.status;
        m.healthNotes = metric.notes || [];
        m.pipeline = metric.pipeline;
        m.sc = riskScore(m.nv, m.na, m.nc, m.dir);
        m.sig = sigFromScore(m.sc);
        const nextChartValue = [13,14].includes(metric.idx) ? metric.value : (metric.chartValue ?? metric.value);
        updateChart(metric.idx, nextChartValue);
      });

      if (payload.histories?.m2Ratio?.length) {
        m2D = payload.histories.m2Ratio;
      }
      if (payload.histories?.fedBalanceSheetRatio?.length) {
        fedB = payload.histories.fedBalanceSheetRatio;
      }
      if (payload.histories?.earningsGrowth?.length) {
        epsQ = payload.histories.earningsGrowth;
      }

      OS_SUM = MS.reduce((a,m) => a + m.sc, 0);
      OS = Math.round(OS_SUM / MS.length);

      setDataHealth(payload);
      setDataHealthError("");
      setLastUpdated(payload.checkedAt ? new Date(payload.checkedAt) : new Date());
    } catch (error) {
      console.warn("Metrics fetch failed:", error);
      const message = error instanceof Error ? error.message : "Metrics fetch failed.";
      setDataHealthError(message);
      setDataHealth({
        checkedAt: new Date().toISOString(),
        summary: {
          status: "error",
          total: 20,
          okCount: 0,
          warnCount: 0,
          errorCount: 20,
          updatedCount: 0,
        },
        metrics: [],
        error: message,
      });
      setLastUpdated(new Date());
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    refreshMetrics();
  }, []);

  const goTab = (i) => {
    pendingScrollTargetRef.current = null;
    setTab(i);
  };
  const goToMetric = (metricIdx) => {
    const target = METRIC_SCROLL_TARGETS[metricIdx];
    if (!target) return;
    if (target.tab === tab) {
      scrollToAnchor(target.anchorId);
      return;
    }
    pendingScrollTargetRef.current = { anchorId: target.anchorId, behavior:"smooth" };
    setTab(target.tab);
  };

  const ActiveTab = TAB_COMPS[tab];
  const dataHealthSignal = healthToSignal(dataHealth?.summary?.status || "warn");
  const liveSummary = dataHealth?.summary;
  const calendarDate = formatCalendarDate(lastUpdated || new Date());
  const themeToggleBg = isDark
    ? "linear-gradient(135deg,rgba(31,41,55,0.92),rgba(51,65,85,0.88))"
    : "linear-gradient(135deg,rgba(247,241,226,0.96),rgba(244,231,188,0.9))";
  const themeToggleBorder = isDark ? t.borderLight : "#d8c79d";
  const themeKnobBg = isDark
    ? "linear-gradient(135deg,#f6d365,#e8a126)"
    : "linear-gradient(135deg,#f3b547,#ed8a2f)";
  const themeKnobShadow = isDark
    ? "0 2px 6px rgba(232,161,38,0.22)"
    : "0 2px 6px rgba(237,138,47,0.16)";
  const themeToggleShadow = isDark
    ? "inset 0 1px 0 rgba(255,255,255,0.05)"
    : "inset 0 1px 0 rgba(255,255,255,0.45), 0 1px 2px rgba(201,168,76,0.08)";

  return (
    <Ctx.Provider value={t}>
      <div style={{minHeight:"100vh",background:t.bg,color:t.text,fontFamily:"'Outfit',system-ui,sans-serif",transition:"background 0.4s,color 0.4s"}}>
        {/* Header */}
        <div ref={headerRef} className="header-glass" style={{"--header-bg":t.bg,borderBottom:`1px solid ${t.border}`,background:t.headerBg,position:"sticky",top:0,zIndex:50}}>
          <div className="header-inner" style={{maxWidth:1200,margin:"0 auto",padding:"10px 20px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:6,height:6,borderRadius:"50%",background:t.text,boxShadow:`0 0 12px ${t.text}22`}} />
              <span style={{fontSize:11,fontWeight:700,letterSpacing:2.5}}>BUBBLE RISK MONITOR</span>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:14}}>
              <span style={{fontSize:10,color:t.textDim,fontFamily:"'JetBrains Mono',monospace",letterSpacing:0.5}}>{calendarDate}</span>
              <button
                onClick={() => setIsDark(!isDark)}
                aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
                style={{
                  position:"relative",
                  width:44,
                  height:24,
                  borderRadius:12,
                  border:`1px solid ${themeToggleBorder}`,
                  cursor:"pointer",
                  padding:0,
                  background:themeToggleBg,
                  boxShadow:themeToggleShadow,
                  transition:"all 0.3s"
                }}
              >
                <div
                  style={{
                    position:"absolute",
                    top:2,
                    left:isDark ? 24 : 2,
                    width:18,
                    height:18,
                    borderRadius:"50%",
                    background:themeKnobBg,
                    boxShadow:themeKnobShadow,
                    transition:"all 0.3s cubic-bezier(0.4,0,0.2,1)",
                    display:"flex",
                    alignItems:"center",
                    justifyContent:"center"
                  }}
                >
                  {isDark ? <MoonIcon color="#0f172a" /> : <SunIcon color="#7c2d12" />}
                </div>
              </button>
            </div>
          </div>
          <div className="tab-bar-outer" style={{position:"relative",maxWidth:1200,margin:"0 auto"}}>
          <div className="tab-bar-wrap" style={{padding:"0 20px",display:"flex",overflowX:"auto"}}>
            {primaryNavTabs.map(({ idx, label }) => (
              <button key={idx} onClick={() => goTab(idx)} className={"tab-btn" + (tab===idx ? " active" : "")} style={{padding:"14px 20px",fontSize:14,fontWeight:tab===idx?700:500,color:tab===idx?t.accent:t.textDim,background:"none",border:"none",cursor:"pointer",whiteSpace:"nowrap",fontFamily:"inherit"}}>{label}</button>
            ))}
          </div>
          </div>
          {lastUpdated && (
            <div style={{fontSize:9,color:sigColor(dataHealthSignal, t),textAlign:"center",padding:"3px 0",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
              <span style={{display:"inline-block",width:5,height:5,borderRadius:"50%",background:sigColor(dataHealthSignal, t),boxShadow:`0 0 6px ${sigColor(dataHealthSignal, t)}`}} />
              Live data · 20/20 metrics dynamic · {liveSummary ? `${liveSummary.okCount} healthy / ${liveSummary.warnCount} warn / ${liveSummary.errorCount} error` : "loading"} · {lastUpdated.toLocaleTimeString()}
            </div>
          )}
        </div>

        {/* Content */}
        <div className={(fade ? "" : "animate-fade-in") + " content-wrap"} style={{maxWidth:1200,margin:"0 auto",padding:"20px 20px 50px"}}>
          {tab === 0 ? (
            <TabDash goToMetric={goToMetric} dataHealth={dataHealth} />
          ) : tab === 9 ? (
            <TabDataHealth dataHealth={dataHealth} dataError={dataHealthError} refreshMetrics={refreshMetrics} isRefreshing={isRefreshing} />
          ) : ActiveTab ? (
            <ActiveTab />
          ) : null}
        </div>

        <div style={{maxWidth:1200,margin:"0 auto",padding:"0 20px 24px"}}>
          <div style={{borderTop:`1px solid ${t.border}`,paddingTop:10,display:"flex",justifyContent:"flex-end"}}>
            <button
              onClick={() => goTab(9)}
              style={{
                background:"none",
                border:"none",
                padding:0,
                cursor:"pointer",
                fontSize:11,
                letterSpacing:0.8,
                color:tab===9 ? t.accent : t.textDim,
                textTransform:"uppercase",
                fontWeight:tab===9 ? 700 : 500,
                fontFamily:"inherit",
              }}
            >
              Data Health
            </button>
          </div>
        </div>

      </div>
    </Ctx.Provider>
  );
}
