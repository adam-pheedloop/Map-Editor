import { useState, useRef } from "react";

type SizeMode = "resize-canvas" | "fit-image";

interface BackgroundImageDialogProps {
  canvasWidth: number;
  canvasHeight: number;
  onConfirm: (
    dataUrl: string,
    imageWidth: number,
    imageHeight: number,
    mode: SizeMode
  ) => void;
  onClose: () => void;
}

export function BackgroundImageDialog({
  canvasWidth,
  canvasHeight,
  onConfirm,
  onClose,
}: BackgroundImageDialogProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>(null);
  const [mode, setMode] = useState<SizeMode>("fit-image");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const img = new Image();
      img.onload = () => {
        setPreview(dataUrl);
        setImageSize({ width: img.width, height: img.height });
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleConfirm = () => {
    if (!preview || !imageSize) return;
    onConfirm(preview, imageSize.width, imageSize.height, mode);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-xl w-[480px] flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <h2 className="text-sm font-semibold text-gray-800">
            Background Image
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-lg leading-none cursor-pointer"
          >
            &times;
          </button>
        </div>

        <div className="p-4 flex flex-col gap-4">
          {!preview ? (
            <div
              onClick={() => fileRef.current?.click()}
              className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-400 hover:bg-gray-50 transition-colors"
            >
              <span className="text-sm text-gray-500">
                Click to select an image
              </span>
              <span className="text-xs text-gray-400 mt-1">
                PNG, JPG, SVG
              </span>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          ) : (
            <>
              <div className="flex items-center justify-center h-40 bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={preview}
                  alt="Preview"
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              {imageSize && (
                <div className="text-xs text-gray-500">
                  Image: {imageSize.width} &times; {imageSize.height}px
                  &nbsp;&middot;&nbsp;
                  Canvas: {canvasWidth} &times; {canvasHeight}px
                </div>
              )}

              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="sizeMode"
                    checked={mode === "fit-image"}
                    onChange={() => setMode("fit-image")}
                    className="accent-primary-600"
                  />
                  <div>
                    <span className="text-xs font-medium text-gray-700">
                      Fit image to canvas
                    </span>
                    <p className="text-[11px] text-gray-400">
                      Scale the image to match the current canvas size
                    </p>
                  </div>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="sizeMode"
                    checked={mode === "resize-canvas"}
                    onChange={() => setMode("resize-canvas")}
                    className="accent-primary-600"
                  />
                  <div>
                    <span className="text-xs font-medium text-gray-700">
                      Resize canvas to match image
                    </span>
                    <p className="text-[11px] text-gray-400">
                      Change the floor plan dimensions to fit the image
                    </p>
                  </div>
                </label>
              </div>

              <button
                onClick={() => {
                  setPreview(null);
                  setImageSize(null);
                }}
                className="text-xs text-gray-400 hover:text-gray-600 cursor-pointer self-start"
              >
                Choose different image
              </button>
            </>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs text-gray-600 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!preview}
            className="px-3 py-1.5 text-xs text-white bg-primary-600 rounded hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
