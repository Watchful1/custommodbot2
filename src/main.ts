import { Devvit } from "@devvit/public-api";

import { isFeatureEnabled } from "./config.js";

/** Reddit username (without u/) to receive PMs when mods use "Report to account" on posts. */
const TARGET_ACCOUNT = "Watchful1";

Devvit.configure({
  redditAPI: true,
});

Devvit.addMenuItem({
  label: "Apply enhanced moderation",
  description:
    "Trigger enhanced moderation on a thread. For large threads this can take several minutes.",
  location: "post",
  forUserType: "moderator",
  onPress: async (_event, context) => {
    if (!context.postId || !context.subredditName) {
      context.ui.showToast("Could not get post context.");
      return;
    }
    if (!isFeatureEnabled(context.subredditName, "enhancedModeration")) {
      context.ui.showToast(
        "Enhanced moderation is not enabled for this subreddit."
      );
      return;
    }
    try {
      const user = await context.reddit.getCurrentUser();
      const messagePayload = {
        username: user?.username ?? "unknown",
        postId: context.postId,
        subredditName: context.subredditName,
        action: "enhancedModeration",
      };
      await context.reddit.sendPrivateMessage({
        to: TARGET_ACCOUNT,
        subject: `Post report`,
        text: JSON.stringify(messagePayload),
      });
      context.ui.showToast("Enhanced moderation triggered.");
    } catch (err) {
      console.error(err);
      context.ui.showToast("Failed to send message.");
    }
  },
});

export default Devvit;
