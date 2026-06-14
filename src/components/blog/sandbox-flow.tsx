/* ---- execution-surface-only sandboxing: host file tools, container command execution ---- */

export function SandboxFlow() {
  return (
    <div className="flow">
      <svg
        viewBox="0 0 720 300"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="File tools (read, edit, write, git) run on the host worktree. Only shell command execution is routed into a Docker container via the CommandExecutor seam. A bind mount keeps the worktree and the container's /work directory in sync, so host edits are instantly visible in the container."
      >
        <defs>
          <marker id="sbAmber" viewBox="0 0 10 10" refX="8.2" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="#e07d2e" />
          </marker>
          <marker id="sbGreen" viewBox="0 0 10 10" refX="8.2" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="#4f9a66" />
          </marker>
        </defs>

        {/* host */}
        <g className="node">
          <rect x="40" y="66" width="260" height="160" rx="16" />
          <text x="60" y="98" className="cap">HOST</text>
          <text x="60" y="126" className="etitle">Worktree — your files</text>
          <text x="60" y="148" className="fs">read · edit · write · git</text>
          <rect x="60" y="160" width="186" height="26" rx="8" fill="#1a160e" stroke="#c79a55" strokeOpacity="0.5" />
          <text x="72" y="177" className="b89t">cwd → ./worktree</text>
        </g>

        {/* container (subtle pulse = isolated sandbox) */}
        <rect className="enginePulse" x="420" y="66" width="260" height="160" rx="16" fill="none" stroke="#f0a93c" strokeWidth="1.2" strokeOpacity="0.5" />
        <g className="node">
          <rect x="420" y="66" width="260" height="160" rx="16" />
          <text x="440" y="98" className="cap">CONTAINER · docker exec</text>
          <text x="440" y="126" className="etitle">Sandboxed shell</text>
          <text x="440" y="148" className="fs">bash + background shells</text>
          <rect x="440" y="160" width="166" height="26" rx="8" fill="#1a160e" stroke="#c79a55" strokeOpacity="0.5" />
          <text x="452" y="177" className="b89t">execCwd → /work</text>
        </g>

        {/* command execution: host -> container */}
        <text x="360" y="100" textAnchor="middle" className="fs">command execution</text>
        <text x="360" y="116" textAnchor="middle" className="b89t" style={{ fontSize: "10px" }}>CommandExecutor</text>
        <path d="M302,128 L418,128" className="conn" stroke="#e07d2e" strokeWidth="1.6" markerEnd="url(#sbAmber)" />

        {/* bind mount: bidirectional sync */}
        <path d="M302,184 L418,184" className="conn" stroke="#4f9a66" strokeWidth="1.6" markerStart="url(#sbGreen)" markerEnd="url(#sbGreen)" />
        <text x="360" y="178" textAnchor="middle" className="fs" style={{ fill: "#6fbf86" }}>bind mount</text>
        <text x="360" y="206" textAnchor="middle" className="fs">edits sync instantly</text>

        {/* footnote chips */}
        <text x="170" y="252" textAnchor="middle" className="fs">host-side git stays fast</text>
        <text x="550" y="252" textAnchor="middle" className="fs">no port / dep collisions</text>
      </svg>
    </div>
  );
}
