/**
 * Per-subreddit feature flags. Toggle features on/off per subreddit.
 * Subreddit names are case-insensitive (use lowercase in config).
 * Subreddits not listed default to all features disabled.
 */

/** Reddit username (without u/) to receive PMs when mods use enhanced moderation. */
export const TARGET_ACCOUNT = "CustomModBot";

export type FeatureConfig = {
  enhancedModeration: boolean;
};

export const SUBREDDIT_FEATURES: Record<string, FeatureConfig> = {
  // Add subreddits here – use lowercase name without r/
  bayarea: { enhancedModeration: true },
};

export function isFeatureEnabled(
  subredditName: string,
  feature: keyof FeatureConfig
): boolean {
  const key = subredditName.toLowerCase().replace(/^r\//, "");
  const subConfig = SUBREDDIT_FEATURES[key];
  if (!subConfig) return false;
  return subConfig[feature] ?? false;
}
