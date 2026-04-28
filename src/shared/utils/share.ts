// shared/utils/share.ts

export async function handleShare({
  title,
  text,
  url,
}: {
  title: string;
  text?: string;
  url: string;
}) {
  try {
    if (navigator.share) {
      await navigator.share({ title, text, url });
      return { success: true };
    }

    await navigator.clipboard.writeText(url);
    return { success: true, copied: true };
  } catch (error) {
    return { success: false };
  }
}
