// shared/hooks/useImageManager.ts

import { useState, useCallback } from 'react';

interface ImageManagerState {
  existingImages: string[];
  removedImages: string[];
  newFiles: File[];
  newPreviews: string[];
}

interface ImageManagerResult {
  allPreviews: string[];
  newFiles: File[];
  removedImages: string[];
  handleImages: (files: File[], previews: string[]) => void;
  reset: (initial?: string[]) => void;
}

export function useImageManager(initialImages: string[] = []): ImageManagerResult {
  const [state, setState] = useState<ImageManagerState>({
    existingImages: initialImages,
    removedImages: [],
    newFiles: [],
    newPreviews: [],
  });

  const allPreviews = [...state.existingImages, ...state.newPreviews];

  const handleImages = useCallback((files: File[], previews: string[]) => {
    if (files.length > 0) {
      setState((prev) => ({
        ...prev,
        newFiles: [...prev.newFiles, ...files],
        newPreviews: [...prev.newPreviews, ...previews],
      }));
    } else {
      setState((prev) => {
        const removedExisting = prev.existingImages.filter((url) => !previews.includes(url));
        const keptExisting = prev.existingImages.filter((url) => previews.includes(url));
        const keptNewPreviews = prev.newPreviews.filter((url) => previews.includes(url));
        const removedNewIdxs = prev.newPreviews
          .map((url, i) => (previews.includes(url) ? -1 : i))
          .filter((i) => i !== -1);

        return {
          existingImages: keptExisting,
          removedImages: [...prev.removedImages, ...removedExisting],
          newPreviews: keptNewPreviews,
          newFiles: prev.newFiles.filter((_, i) => !removedNewIdxs.includes(i)),
        };
      });
    }
  }, []);

  const reset = useCallback((initial: string[] = []) => {
    setState({
      existingImages: initial,
      removedImages: [],
      newFiles: [],
      newPreviews: [],
    });
  }, []);

  return {
    allPreviews,
    newFiles: state.newFiles,
    removedImages: state.removedImages,
    handleImages,
    reset,
  };
}
