import { Devvit } from "@devvit/public-api";

/** Reddit username (without u/) to receive PMs when mods use "Report to account" on posts. */
const TARGET_ACCOUNT = "CustomModBot";

Devvit.configure({
  redditAPI: true,
});

Devvit.addMenuItem({
  label: "Report to account",
  description:
    "Send a private message about this post to the configured account.",
  location: "post",
  forUserType: "moderator",
  onPress: async (_event, context) => {
    if (!context.postId || !context.subredditName) {
      context.ui.showToast("Could not get post context.");
      return;
    }
    try {
      const post = await context.reddit.getPostById(context.postId);
      const user = await context.reddit.getCurrentUser();
      const postUrl = `https://www.reddit.com${post.permalink}`;
      await context.reddit.sendPrivateMessage({
        to: TARGET_ACCOUNT,
        subject: `Post report from r/${context.subredditName}`,
        text: `Mod u/${user?.username ?? "unknown"} reported this post:\n\n${postUrl}`,
      });
      context.ui.showToast("Message sent.");
    } catch (err) {
      console.error(err);
      context.ui.showToast("Failed to send message.");
    }
  },
});

export default Devvit;
