import type { HvFileData } from "../File";

const uploadHandlers = new Map();

function clearUploadSimulationHandler(file: HvFileData) {
  clearInterval(uploadHandlers.get(file));
  uploadHandlers.delete(file);
}

const simulateUploadStep = (
  file: HvFileData,
  onProgress: (progress: number) => void,
  onComplete: () => void,
  uploadSpeed: number,
) => {
  const progress =
    file.progress != null && file.size != null
      ? Math.min(file.progress + uploadSpeed / 4, file.size)
      : 0;

  onProgress(progress);

  if (file.size === progress) {
    clearUploadSimulationHandler(file);

    onComplete();
  }
};

export const simulateUpload = (
  file: HvFileData,
  onProgress: (progress: number) => void,
  onComplete: () => void,
  uploadSpeed = 20000 /* bits per second */,
) => {
  uploadHandlers.set(
    file,
    setInterval(() => {
      simulateUploadStep(file, onProgress, onComplete, uploadSpeed);
    }, 250),
  );
};

export const cancelUpload = (file: HvFileData) => {
  clearUploadSimulationHandler(file);
};
