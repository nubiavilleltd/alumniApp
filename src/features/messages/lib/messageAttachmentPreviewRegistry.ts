const attachmentPreviewRegistry = new Map<string, string>();

function revokePreviewUrl(previewUrl?: string) {
  if (!previewUrl || !previewUrl.startsWith('blob:')) return;
  URL.revokeObjectURL(previewUrl);
}

export function registerMessageAttachmentPreview(attachmentId: string, previewUrl: string) {
  if (!attachmentId || !previewUrl) return;

  const existingPreviewUrl = attachmentPreviewRegistry.get(attachmentId);
  if (existingPreviewUrl && existingPreviewUrl !== previewUrl) {
    revokePreviewUrl(existingPreviewUrl);
  }

  attachmentPreviewRegistry.set(attachmentId, previewUrl);
}

export function getMessageAttachmentPreviewUrl(attachmentId: string) {
  if (!attachmentId) return undefined;
  return attachmentPreviewRegistry.get(attachmentId);
}

export function revokeMessageAttachmentPreview(attachmentId: string) {
  if (!attachmentId) return;

  const existingPreviewUrl = attachmentPreviewRegistry.get(attachmentId);
  revokePreviewUrl(existingPreviewUrl);
  attachmentPreviewRegistry.delete(attachmentId);
}

export function resetMessageAttachmentPreviews() {
  attachmentPreviewRegistry.forEach((previewUrl) => {
    revokePreviewUrl(previewUrl);
  });

  attachmentPreviewRegistry.clear();
}
