import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from '@/shared/components/ui/Toast';
import { MESSAGE_MAX_ATTACHMENTS_PER_MESSAGE } from '../api/adapters/messages.adapter';
import type { UploadMessageAttachmentRequest } from '../api/messages.contract';
import { revokeMessageAttachmentPreview } from '../lib/messageAttachmentPreviewRegistry';
import type { DraftComposerAttachment } from '../pages/messagesPage.types';
import {
  buildDraftComposerAttachment,
  buildDraftComposerAttachmentFromUploadRequest,
} from '../pages/messagesPage.utils';

interface ClearDraftAttachmentOptions {
  preservePreviewUrls?: Set<string>;
  preserveUploadedAttachmentIds?: Set<string>;
}

export function useDraftComposerAttachments() {
  const [draftAttachments, setDraftAttachments] = useState<DraftComposerAttachment[]>([]);
  const draftAttachmentsRef = useRef<DraftComposerAttachment[]>([]);

  useEffect(() => {
    draftAttachmentsRef.current = draftAttachments;
  }, [draftAttachments]);

  const releaseDraftAttachmentResources = useCallback(
    (attachment: DraftComposerAttachment, options?: ClearDraftAttachmentOptions) => {
      const shouldPreservePreviewUrl =
        !!attachment.previewUrl && options?.preservePreviewUrls?.has(attachment.previewUrl);
      const uploadedAttachmentId = attachment.uploadedAttachment?.id;
      const shouldPreserveUploadedAttachment =
        !!uploadedAttachmentId && options?.preserveUploadedAttachmentIds?.has(uploadedAttachmentId);

      if (uploadedAttachmentId && !shouldPreserveUploadedAttachment) {
        revokeMessageAttachmentPreview(uploadedAttachmentId);
      }

      if (attachment.previewUrl && !shouldPreservePreviewUrl) {
        URL.revokeObjectURL(attachment.previewUrl);
      }
    },
    [],
  );

  const clearDraftAttachments = useCallback(
    (options?: ClearDraftAttachmentOptions) => {
      setDraftAttachments((previous) => {
        previous.forEach((attachment) => {
          releaseDraftAttachmentResources(attachment, options);
        });

        return [];
      });
    },
    [releaseDraftAttachmentResources],
  );

  const removeDraftAttachment = useCallback(
    (attachmentId: string) => {
      setDraftAttachments((previous) => {
        const attachmentToRemove = previous.find((attachment) => attachment.id === attachmentId);
        if (attachmentToRemove) {
          releaseDraftAttachmentResources(attachmentToRemove);
        }

        return previous.filter((attachment) => attachment.id !== attachmentId);
      });
    },
    [releaseDraftAttachmentResources],
  );

  const addFilesToDraft = useCallback((files: File[], viewerMemberId: string) => {
    if (files.length === 0) {
      return;
    }

    const remainingSlots = Math.max(
      0,
      MESSAGE_MAX_ATTACHMENTS_PER_MESSAGE - draftAttachmentsRef.current.length,
    );

    if (remainingSlots === 0) {
      toast.info(`You can attach up to ${MESSAGE_MAX_ATTACHMENTS_PER_MESSAGE} files per message.`);
      return;
    }

    const acceptedFiles = files.slice(0, remainingSlots);
    if (acceptedFiles.length < files.length) {
      toast.info(
        `Only ${MESSAGE_MAX_ATTACHMENTS_PER_MESSAGE} attachments can be added to one message.`,
      );
    }

    const nextAttachments = acceptedFiles.map((file) =>
      buildDraftComposerAttachment(file, viewerMemberId),
    );

    setDraftAttachments((previous) => [...previous, ...nextAttachments]);
  }, []);

  const stageDraftVoiceNote = useCallback(
    (attachmentRequest: UploadMessageAttachmentRequest, previewUrl?: string) => {
      if (draftAttachmentsRef.current.length >= MESSAGE_MAX_ATTACHMENTS_PER_MESSAGE) {
        toast.info(
          `You can attach up to ${MESSAGE_MAX_ATTACHMENTS_PER_MESSAGE} files per message.`,
        );
        return;
      }

      setDraftAttachments((previous) => [
        ...previous,
        buildDraftComposerAttachmentFromUploadRequest(attachmentRequest, {
          previewUrl,
        }),
      ]);
    },
    [],
  );

  const restoreDraftAttachments = useCallback((attachments: DraftComposerAttachment[]) => {
    setDraftAttachments(attachments);
  }, []);

  useEffect(() => {
    return () => {
      draftAttachmentsRef.current.forEach((attachment) => {
        releaseDraftAttachmentResources(attachment);
      });
    };
  }, [releaseDraftAttachmentResources]);

  return {
    draftAttachments,
    addFilesToDraft,
    clearDraftAttachments,
    removeDraftAttachment,
    restoreDraftAttachments,
    setDraftAttachments,
    stageDraftVoiceNote,
  };
}
