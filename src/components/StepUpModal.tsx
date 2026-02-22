import { useState, useRef, useEffect, useCallback } from "react";
import { ShieldCheck, X, Lock } from "lucide-react";

interface StepUpModalProps {
  open: boolean;
  onVerified: () => void;
  onClose: () => void;
}

const CORRECT_PIN = "2026";

const StepUpModal = ({ open, onVerified, onClose }: StepUpModalProps) => {
  const [digits, setDigits] = useState(["", "", "", ""]);
  const [error, setError] = useState(false);
  const [verified, setVerified] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (open) {
      setDigits(["", "", "", ""]);
      setError(false);
      setVerified(false);
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
  }, [open]);

  const handleChange = useCallback(
    (index: number, value: string) => {
      if (!/^\d?$/.test(value)) return;
      const next = [...digits];
      next[index] = value;
      setDigits(next);
      setError(false);

      if (value && index < 3) {
        inputRefs.current[index + 1]?.focus();
      }

      if (index === 3 && value) {
        const pin = next.join("");
        if (pin === CORRECT_PIN) {
          setVerified(true);
          setTimeout(() => onVerified(), 800);
        } else {
          setError(true);
          setTimeout(() => {
            setDigits(["", "", "", ""]);
            inputRefs.current[0]?.focus();
          }, 600);
        }
      }
    },
    [digits, onVerified]
  );

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-md" onClick={onClose} />
      <div className="relative glass-strong rounded-2xl p-6 max-w-sm w-full space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-primary" />
            <h2 className="text-sm font-display font-bold text-foreground">
              Step-Up Verification
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-secondary"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed">
          This resource contains sensitive details. Enter the 4-digit security
          PIN to verify access. No personal data is stored.
        </p>

        {!verified ? (
          <div className="space-y-4">
            <div className="flex justify-center gap-3">
              {digits.map((d, i) => (
                <input
                  key={i}
                  ref={(el) => {
                    inputRefs.current[i] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={d}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  className={`w-12 h-14 text-center text-xl font-bold rounded-xl border-2 bg-secondary text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                    error
                      ? "border-destructive animate-shake"
                      : d
                        ? "border-primary"
                        : "border-border"
                  }`}
                />
              ))}
            </div>
            {error && (
              <p className="text-xs text-destructive text-center font-medium">
                Incorrect PIN. Please try again.
              </p>
            )}
          </div>
        ) : (
          <div className="text-center py-4">
            <ShieldCheck className="w-8 h-8 text-pin-food mx-auto mb-2" />
            <p className="text-sm font-medium text-foreground">
              Verified — Access granted
            </p>
          </div>
        )}

        <p className="text-[10px] text-center text-muted-foreground">
          Protected by Step-Up Security &bull; EquityMap
        </p>
      </div>
    </div>
  );
};

export default StepUpModal;
