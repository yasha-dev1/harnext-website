"use client";

import { useEffect, useState } from "react";

/* ---- traveling dots (SMIL), rendered after mount so reduced-motion is respected ---- */

function Dot({ path, color, dur, begin, r }: { path: string; color: string; dur: number; begin: number; r: number }) {
  return (
    <circle r={r} fill={color}>
      <animateMotion dur={`${dur}s`} repeatCount="indefinite" begin={`${begin}s`}>
        <mpath href={`#${path}`} />
      </animateMotion>
    </circle>
  );
}

function useMotionOK() {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = requestAnimationFrame(() => setOk(true));
    return () => cancelAnimationFrame(id);
  }, []);
  return ok;
}

function FlowDots({
  sources,
  outs,
  sdur,
  odur = 2.2,
  r = 3.4,
  stag,
}: {
  sources: { id: string; c: string }[];
  outs: string[];
  sdur: number;
  odur?: number;
  r?: number;
  stag: number;
}) {
  const ok = useMotionOK();
  if (!ok) return null;
  return (
    <g>
      {sources.map((s, i) => (
        <g key={s.id}>
          <Dot path={s.id} color={s.c} dur={sdur} begin={i * stag} r={r} />
          <Dot path={s.id} color={s.c} dur={sdur} begin={i * stag + sdur / 2} r={r} />
        </g>
      ))}
      {outs.map((id, i) => (
        <g key={id}>
          <Dot path={id} color="#f8c24f" dur={odur} begin={i * 0.4} r={r + 0.4} />
          <Dot path={id} color="#f8c24f" dur={odur} begin={i * 0.4 + odur / 2} r={r + 0.4} />
        </g>
      ))}
    </g>
  );
}

/* ---- hero panel flow: 4 sources → Context Engine → 3 harnesses ---- */

export function HeroFlow() {
  return (
    <div className="heroflow">
      <svg
        viewBox="0 0 520 300"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Slack, HubSpot, Stripe and Jira events flow into the Context Engine and out to the harness"
      >
        <defs>
          <filter id="heroSoft" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="20" />
          </filter>
        </defs>
        {/* connectors */}
        <path id="hs0" className="conn" d="M168,46 C 210,46 214,150 250,150" />
        <path id="hs1" className="conn" d="M168,114 C 210,114 218,150 250,150" />
        <path id="hs2" className="conn" d="M168,182 C 210,182 218,150 250,150" />
        <path id="hs3" className="conn" d="M168,250 C 210,250 214,150 250,150" />
        <path id="ho0" className="conn out" d="M370,150 C 388,150 388,70 398,70" />
        <path id="ho1" className="conn out" d="M370,150 L 398,150" />
        <path id="ho2" className="conn out" d="M370,150 C 388,150 388,230 398,230" />
        <FlowDots
          sources={[
            { id: "hs0", c: "#e8537a" },
            { id: "hs1", c: "#ff7a59" },
            { id: "hs2", c: "#8b82ff" },
            { id: "hs3", c: "#4d94ff" },
          ]}
          outs={["ho0", "ho1", "ho2"]}
          sdur={2.4}
          stag={0.38}
          r={3.2}
        />
        <g>
          <rect x="396" y="12" width="118" height="21" rx="10.5" fill="#322610" stroke="#f0a93c" strokeOpacity="0.45" />
          <text x="455" y="26" textAnchor="middle" className="b89t" style={{ fontSize: "9.5px" }}>−89% tokens</text>
        </g>
        {/* engine */}
        <ellipse cx="311" cy="150" rx="74" ry="60" fill="#f0a93c" opacity="0.07" filter="url(#heroSoft)" />
        <rect className="enginePulse" x="252" y="112" width="118" height="76" rx="15" fill="none" stroke="#f0a93c" strokeWidth="1.3" />
        <rect x="252" y="112" width="118" height="76" rx="15" fill="#1c1a14" stroke="#f0a93c" strokeOpacity="0.65" strokeWidth="1.3" />
        <use href="#logoMark" x="299" y="121" width="24" height="26" style={{ color: "#f0a93c" }} />
        <text x="311" y="171" textAnchor="middle" className="etitle" style={{ fontSize: "12px" }}>Context Engine</text>
        {/* sources */}
        <g className="node">
          <rect x="6" y="24" width="162" height="44" rx="11" />
          <rect className="tile" x="15" y="32" width="28" height="28" rx="7" />
          <image href="/brands/slack-icon.svg" x="19" y="36" width="20" height="20" />
          <text x="52" y="51" className="fb" style={{ fontSize: "13px" }}>Slack</text>
        </g>
        <g className="node">
          <rect x="6" y="92" width="162" height="44" rx="11" />
          <rect className="tile" x="15" y="100" width="28" height="28" rx="7" />
          <image href="/brands/hubspot.svg" x="19" y="104" width="20" height="20" />
          <text x="52" y="119" className="fb" style={{ fontSize: "13px" }}>HubSpot</text>
        </g>
        <g className="node">
          <rect x="6" y="160" width="162" height="44" rx="11" />
          <rect className="tile" x="15" y="168" width="28" height="28" rx="7" />
          <image href="/brands/stripe.svg" x="19" y="172" width="20" height="20" />
          <text x="52" y="187" className="fb" style={{ fontSize: "13px" }}>Stripe</text>
        </g>
        <g className="node">
          <rect x="6" y="228" width="162" height="44" rx="11" />
          <rect className="tile" x="15" y="236" width="28" height="28" rx="7" />
          <image href="/brands/jira.svg" x="19" y="240" width="20" height="20" />
          <text x="52" y="255" className="fb" style={{ fontSize: "13px" }}>Jira</text>
        </g>
        {/* harnesses */}
        <g className="node">
          <rect x="398" y="48" width="116" height="44" rx="10" />
          <rect className="tile brand" x="406" y="55" width="30" height="30" rx="8" />
          <use href="#logoMark" x="408" y="57" width="26" height="27" style={{ color: "#f0a93c" }} />
          <text x="440" y="73" className="fb" style={{ fontSize: "10.5px" }}>harnext</text>
        </g>
        <g className="node">
          <rect x="398" y="128" width="116" height="44" rx="10" />
          <rect className="tile" x="406" y="135" width="30" height="30" rx="8" />
          <image href="/brands/anthropic-icon.svg" x="409" y="138" width="24" height="24" />
          <text x="440" y="153" className="fb" style={{ fontSize: "10.5px" }}>Claude Code</text>
        </g>
        <g className="node">
          <rect x="398" y="208" width="116" height="44" rx="10" />
          <rect className="tile" x="406" y="215" width="30" height="30" rx="8" />
          <image href="/brands/openai-icon.svg" x="409" y="218" width="24" height="24" />
          <text x="440" y="233" className="fb" style={{ fontSize: "10.5px" }}>Codex</text>
        </g>
      </svg>
    </div>
  );
}

/* ---- full events-flow graph: org sources → Context Engine → agents & harnesses ---- */

export function ContextFlow() {
  return (
    <svg
      viewBox="0 0 1040 560"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Organization events flow into the Context Engine, which serves token-efficient context to agents and harnesses"
    >
      <defs>
        <filter id="soft" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="20" />
        </filter>
      </defs>

      <text x="20" y="30" className="cap">YOUR ORGANIZATION</text>
      <text x="530" y="30" textAnchor="middle" className="cap">TOKEN-EFFICIENT CONTEXT</text>
      <text x="1020" y="30" textAnchor="end" className="cap">AGENTS &amp; HARNESSES</text>

      {/* connectors */}
      <path id="s0" className="conn" d="M272,84 C 352,84 362,280 440,280" />
      <path id="s1" className="conn" d="M272,160 C 352,160 362,280 440,280" />
      <path id="s2" className="conn" d="M272,236 C 352,236 372,280 440,280" />
      <path id="s3" className="conn" d="M272,312 C 352,312 372,280 440,280" />
      <path id="s4" className="conn" d="M272,388 C 352,388 362,280 440,280" />
      <path id="s5" className="conn" d="M272,464 C 352,464 362,280 440,280" />
      <path id="o0" className="conn out" d="M620,280 C 702,280 706,170 792,170" />
      <path id="o1" className="conn out" d="M620,280 C 700,280 720,280 792,280" />
      <path id="o2" className="conn out" d="M620,280 C 702,280 706,390 792,390" />

      <FlowDots
        sources={[
          { id: "s0", c: "#8b82ff" },
          { id: "s1", c: "#e8537a" },
          { id: "s2", c: "#cfd3d8" },
          { id: "s3", c: "#4d94ff" },
          { id: "s4", c: "#22c3b3" },
          { id: "s5", c: "#f0a93c" },
        ]}
        outs={["o0", "o1", "o2"]}
        sdur={2.9}
        stag={0.42}
      />

      {/* engine */}
      <ellipse cx="530" cy="280" rx="120" ry="94" fill="#f0a93c" opacity="0.06" filter="url(#soft)" />
      <rect className="enginePulse" x="440" y="210" width="180" height="140" rx="18" fill="none" stroke="#f0a93c" strokeWidth="1.4" />
      <rect x="440" y="210" width="180" height="140" rx="18" fill="#1c1a14" stroke="#f0a93c" strokeOpacity="0.65" strokeWidth="1.4" />
      <use href="#logoMark" x="510" y="228" width="40" height="42" style={{ color: "#f0a93c" }} />
      <text x="530" y="300" textAnchor="middle" className="etitle">Context Engine</text>

      {/* sources */}
      <g className="node">
        <rect x="20" y="57" width="252" height="54" rx="12" />
        <rect className="tile" x="31" y="66" width="36" height="36" rx="9" />
        <image href="/brands/stripe.svg" x="36" y="71" width="26" height="26" />
        <text x="80" y="82" className="fb">Stripe</text>
        <text x="80" y="99" className="fs">payment events</text>
      </g>
      <g className="node">
        <rect x="20" y="133" width="252" height="54" rx="12" />
        <rect className="tile" x="31" y="142" width="36" height="36" rx="9" />
        <image href="/brands/slack-icon.svg" x="36" y="147" width="26" height="26" />
        <text x="80" y="158" className="fb">Slack</text>
        <text x="80" y="175" className="fs">messages &amp; threads</text>
      </g>
      <g className="node">
        <rect x="20" y="209" width="252" height="54" rx="12" />
        <rect className="tile" x="31" y="218" width="36" height="36" rx="9" />
        <image href="/brands/github-icon.svg" x="36" y="223" width="26" height="26" />
        <text x="80" y="234" className="fb">GitHub</text>
        <text x="80" y="251" className="fs">commits &amp; PRs</text>
      </g>
      <g className="node">
        <rect x="20" y="285" width="252" height="54" rx="12" />
        <rect className="tile" x="31" y="294" width="36" height="36" rx="9" />
        <image href="/brands/jira.svg" x="36" y="299" width="26" height="26" />
        <text x="80" y="310" className="fb">Jira</text>
        <text x="80" y="327" className="fs">issues &amp; sprints</text>
      </g>
      <g className="node">
        <rect x="20" y="361" width="252" height="54" rx="12" />
        <rect className="tile" x="31" y="370" width="36" height="36" rx="9" />
        <g transform="translate(36,375) scale(1.083)">
          <path d="M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-8l-5 4v-4H5a2 2 0 0 1-2-2z" fill="#17a2a2" />
        </g>
        <text x="80" y="386" className="fb">LiveAgent</text>
        <text x="80" y="403" className="fs">support tickets</text>
      </g>
      <g className="node">
        <rect x="20" y="437" width="252" height="54" rx="12" />
        <rect className="tile" x="31" y="446" width="36" height="36" rx="9" />
        <g transform="translate(36,451) scale(1.083)">
          <circle cx="12" cy="12" r="9.2" fill="none" stroke="#4b5563" strokeWidth="1.5" />
          <path d="M3 12h18 M12 2.8c3 3 3 15.4 0 18.4 M12 2.8c-3 3-3 15.4 0 18.4" fill="none" stroke="#4b5563" strokeWidth="1.3" />
        </g>
        <text x="80" y="462" className="fb">Website</text>
        <text x="80" y="479" className="fs">pages &amp; docs</text>
      </g>

      {/* consumers */}
      <g>
        <rect x="838" y="62" width="182" height="28" rx="14" fill="#322610" stroke="#f0a93c" strokeOpacity="0.45" />
        <text x="929" y="80" textAnchor="middle" className="b89t">−89% tokens / query</text>
      </g>
      <g className="node">
        <rect x="788" y="143" width="232" height="54" rx="12" />
        <rect className="tile brand" x="799" y="152" width="36" height="36" rx="9" />
        <use href="#logoMark" x="801" y="153" width="32" height="34" style={{ color: "#f0a93c" }} />
        <text x="848" y="168" className="fb">harnext</text>
        <text x="848" y="185" className="fs">the coding harness</text>
      </g>
      <g className="node">
        <rect x="788" y="253" width="232" height="54" rx="12" />
        <rect className="tile" x="799" y="262" width="36" height="36" rx="9" />
        <image href="/brands/anthropic-icon.svg" x="804" y="267" width="26" height="26" />
        <text x="848" y="278" className="fb">Claude Code</text>
        <text x="848" y="295" className="fs">coding agent</text>
      </g>
      <g className="node">
        <rect x="788" y="363" width="232" height="54" rx="12" />
        <rect className="tile" x="799" y="372" width="36" height="36" rx="9" />
        <image href="/brands/openai-icon.svg" x="804" y="377" width="26" height="26" />
        <text x="848" y="388" className="fb">Codex</text>
        <text x="848" y="405" className="fs">coding agent</text>
      </g>
    </svg>
  );
}
