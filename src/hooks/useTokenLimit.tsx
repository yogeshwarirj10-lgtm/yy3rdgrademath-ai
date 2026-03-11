import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const TOKEN_LIMIT = 5_000_000;
export const CONTACT_EMAIL = "rj.yogeshwari@gmail.com";

export function useTokenLimit() {
  const [totalTokens, setTotalTokens] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTokens = async () => {
      const { data } = await supabase
        .from("ai_token_usage")
        .select("total_tokens");
      if (data) {
        setTotalTokens(data.reduce((sum, r) => sum + (r.total_tokens || 0), 0));
      }
      setLoading(false);
    };
    fetchTokens();
  }, []);

  const limitReached = totalTokens >= TOKEN_LIMIT;
  const warningThreshold = totalTokens >= TOKEN_LIMIT * 0.9 && !limitReached;
  const remaining = Math.max(0, TOKEN_LIMIT - totalTokens);
  const usagePercent = Math.min(100, (totalTokens / TOKEN_LIMIT) * 100);

  return { totalTokens, remaining, usagePercent, limitReached, warningThreshold, loading };
}
