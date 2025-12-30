import { BentoItem } from "@/components/ui/terminal-bento-grid";
import { Activity, GitBranch, Container, Workflow, ScrollText, Cpu } from "lucide-react";

export default function DemoPage() {
  return (
    <div className="terminal-container terminal-theme-scope">
      <div className="w-full max-w-5xl z-10">
        <h1 className="text-4xl md:text-5xl text-center mb-10 blinking-cursor tracking-wider">
          SYSTEM DASHBOARD
        </h1>

        <div className="bento-grid">
          <BentoItem className="col-span-2">
            <div className="flex items-center gap-3 mb-3">
              <GitBranch className="w-6 h-6" />
              <h2 className="text-xl md:text-2xl">{">"} REPOSITORY: MAIN_BRANCH</h2>
            </div>
            <p className="text-base md:text-lg opacity-80">
              Status: Synced. Last commit: 4 hours ago.
            </p>
            <div className="mt-4 text-sm opacity-60 font-mono">
              <p>+ 127 additions</p>
              <p>- 43 deletions</p>
            </div>
          </BentoItem>

          <BentoItem>
            <div className="flex items-center gap-3 mb-3">
              <Activity className="w-6 h-6" />
              <h2 className="text-xl md:text-2xl">{">"} API STATUS</h2>
            </div>
            <p className="text-base md:text-lg terminal-status-ok">
              ● All systems operational
            </p>
            <p className="text-sm opacity-60 mt-2">Uptime: 99.98%</p>
          </BentoItem>

          <BentoItem>
            <div className="flex items-center gap-3 mb-3">
              <Container className="w-6 h-6" />
              <h2 className="text-xl md:text-2xl">{">"} DOCKER</h2>
            </div>
            <p className="text-base md:text-lg">3 containers running</p>
            <div className="mt-3 text-sm opacity-70">
              <p>● api-server: healthy</p>
              <p>● postgres: healthy</p>
              <p>● redis: healthy</p>
            </div>
          </BentoItem>

          <BentoItem className="col-span-2">
            <div className="flex items-center gap-3 mb-3">
              <Workflow className="w-6 h-6" />
              <h2 className="text-xl md:text-2xl">{">"} CI/CD PIPELINE</h2>
            </div>
            <p className="text-base md:text-lg terminal-status-ok">
              Last build successful. Ready to deploy.
            </p>
            <div className="mt-4 flex gap-4 text-sm">
              <span className="terminal-status-ok">✓ Build</span>
              <span className="terminal-status-ok">✓ Test</span>
              <span className="terminal-status-ok">✓ Lint</span>
              <span className="opacity-50">○ Deploy</span>
            </div>
          </BentoItem>

          <BentoItem className="col-span-2">
            <div className="flex items-center gap-3 mb-3">
              <ScrollText className="w-6 h-6" />
              <h2 className="text-xl md:text-2xl">{">"} REAL-TIME LOGS</h2>
            </div>
            <div className="font-mono text-sm space-y-1 opacity-80">
              <p>
                <span className="terminal-status-ok">[200]</span> GET /api/users - 5ms
              </p>
              <p>
                <span className="terminal-status-ok">[200]</span> GET /api/dashboard - 12ms
              </p>
              <p>
                <span className="terminal-status-error">[404]</span> GET /api/data - 2ms
              </p>
              <p>
                <span className="terminal-status-ok">[201]</span> POST /api/sessions - 34ms
              </p>
            </div>
          </BentoItem>

          <BentoItem>
            <div className="flex items-center gap-3 mb-3">
              <Cpu className="w-6 h-6" />
              <h2 className="text-xl md:text-2xl">{">"} RESOURCES</h2>
            </div>
            <div className="space-y-2 text-sm">
              <div>
                <span className="opacity-60">CPU:</span>
                <span className="ml-2">42%</span>
              </div>
              <div>
                <span className="opacity-60">MEM:</span>
                <span className="ml-2">2.1GB / 8GB</span>
              </div>
              <div>
                <span className="opacity-60">DISK:</span>
                <span className="ml-2">67GB / 256GB</span>
              </div>
            </div>
          </BentoItem>
        </div>

        <div className="mt-8 text-center text-sm opacity-50">
          <p>TERMINAL| Session: {new Date().toISOString().split("T")[0]}</p>
        </div>
      </div>
    </div>
  );
}

