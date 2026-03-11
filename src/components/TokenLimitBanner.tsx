import { AlertTriangle, Mail } from "lucide-react";
import { CONTACT_EMAIL } from "@/hooks/useTokenLimit";

export default function TokenLimitBanner() {
  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="max-w-md w-full rounded-2xl border border-destructive/30 bg-card p-8 text-center shadow-2xl">
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-5">
          <AlertTriangle size={32} className="text-destructive" />
        </div>
        <h2 className="text-xl font-extrabold text-foreground mb-2">
          Account Deactivated
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Your AI token limit of 5,000,000 tokens has been reached. All quiz and exam generation features are currently disabled.
        </p>
        <div className="rounded-xl bg-muted/50 border border-border p-4 mb-6">
          <p className="text-sm font-semibold text-foreground mb-1">
            To reactivate your account, please contact:
          </p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="inline-flex items-center gap-2 text-primary font-bold text-base hover:underline"
          >
            <Mail size={16} />
            {CONTACT_EMAIL}
          </a>
        </div>
        <p className="text-xs text-muted-foreground">
          Thank you for using NJSLA Grade 3 Math Practice!
        </p>
      </div>
    </div>
  );
}
