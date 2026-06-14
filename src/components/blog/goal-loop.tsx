/* ---- /goal two-model loop: smart planner/evaluator <-> executor ---- */

export function GoalLoop() {
  return (
    <div className="flow">
      <svg
        viewBox="0 0 720 300"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="A /goal prompt enters the smart model, which plans the work and delegates each step to the executor model. The executor writes code and returns a diff; the smart model evaluates it, loops back on reject, and releases the approved diff to you."
      >
        <defs>
          <marker id="ahAmber" viewBox="0 0 10 10" refX="8.2" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="#e07d2e" />
          </marker>
          <marker id="ahGreen" viewBox="0 0 10 10" refX="8.2" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="#4f9a66" />
          </marker>
          <marker id="ahGold" viewBox="0 0 10 10" refX="8.2" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="#f0a93c" />
          </marker>
        </defs>

        {/* incoming /goal */}
        <text x="10" y="113" className="b89t" style={{ fontSize: "12px" }}>
          /goal <tspan className="fs" style={{ fontSize: "12px" }}>&lt;task&gt;</tspan>
        </text>
        <path d="M12,126 L58,126" className="conn" stroke="#e07d2e" strokeWidth="1.6" markerEnd="url(#ahAmber)" />

        {/* subtle pulse on the smart model — it's the brain of the loop */}
        <rect className="enginePulse" x="60" y="60" width="230" height="130" rx="16" fill="none" stroke="#f0a93c" strokeWidth="1.2" strokeOpacity="0.5" />

        {/* smart model — planner + evaluator */}
        <g className="node">
          <rect x="60" y="60" width="230" height="130" rx="16" />
          <text x="80" y="91" className="cap">PLANNER · EVALUATOR</text>
          <text x="80" y="119" className="etitle">Smart model</text>
          <text x="80" y="140" className="fs">Plans &amp; reviews the work</text>
          <rect x="80" y="151" width="150" height="24" rx="8" fill="#1a160e" stroke="#c79a55" strokeOpacity="0.5" />
          <text x="92" y="167" className="b89t">claude-opus-4-8</text>
        </g>

        {/* executor model — generator */}
        <g className="node">
          <rect x="430" y="60" width="230" height="130" rx="16" />
          <text x="450" y="91" className="cap">GENERATOR · EXECUTOR</text>
          <text x="450" y="119" className="etitle">Executor model</text>
          <text x="450" y="140" className="fs">Writes &amp; runs the code</text>
          <rect x="450" y="151" width="162" height="24" rx="8" fill="#1a160e" stroke="#c79a55" strokeOpacity="0.5" />
          <text x="462" y="167" className="b89t">claude-sonnet-4-6</text>
        </g>

        {/* delegate (smart -> executor) */}
        <text x="360" y="88" textAnchor="middle" className="fs">delegate step</text>
        <path d="M292,101 L428,101" className="conn" stroke="#e07d2e" strokeWidth="1.6" markerEnd="url(#ahAmber)" />

        {/* return diff (executor -> smart) */}
        <path d="M428,150 L292,150" className="conn" stroke="#4f9a66" strokeWidth="1.6" markerEnd="url(#ahGreen)" />
        <text x="360" y="167" textAnchor="middle" className="fs">returns the diff</text>
        <text x="360" y="184" textAnchor="middle" className="fs" style={{ fill: "#c8766a" }}>✗ reject → retry</text>

        {/* approved output (smart -> you) */}
        <path d="M175,190 L175,234" className="conn out" stroke="#f0a93c" strokeWidth="1.6" markerEnd="url(#ahGold)" />
        <rect x="60" y="236" width="230" height="40" rx="12" fill="#15140f" stroke="#c79a55" strokeOpacity="0.5" />
        <text x="175" y="261" textAnchor="middle" className="b89t" style={{ fontSize: "12px" }}>✓ approved diff → you</text>
      </svg>
    </div>
  );
}
