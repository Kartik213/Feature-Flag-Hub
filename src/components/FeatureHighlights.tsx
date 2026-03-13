import { Flag, Zap, Shield, BarChart3, Users, Code } from "lucide-react";

const FEATURES = [
  { icon: Flag, text: "Unlimited feature flags" },
  { icon: Users, text: "Team & organization support" },
  { icon: Zap, text: "Instant rollout control" },
  { icon: BarChart3, text: "Percentage-based rollouts" },
  { icon: Shield, text: "Targeting rules engine" },
  { icon: Code, text: "Lightweight SDK integration" },
];

export const FeatureHighlights = () => {
    return (
        <div className="hidden md:flex w-72 flex-col justify-center bg-muted/50 border-l border-border p-8">
          <h2 className="text-sm font-bold text-primary mb-5 uppercase tracking-wider">
            What you get
          </h2>
          <ul className="space-y-4">
            {FEATURES.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3">
                <div className="flex items-center justify-center size-5 rounded-full bg-primary/10 shrink-0">
                  <Icon className="size-3 text-primary" />
                </div>
                <span className="text-sm text-foreground">{text}</span>
              </li>
            ))}
          </ul>
        </div>
    )
}