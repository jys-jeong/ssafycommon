import type { ReactNode } from "react";
import BasicButton from "../atoms/Buttons/BasicButton";
import type { basicButtonVariant } from "@/utils/buttonColors";

interface ModalProps {
  children: ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText: string;
  cancelText: string;
  confirmColor: basicButtonVariant;
  cancelColor: basicButtonVariant;
}

export default function Modal({ children, onConfirm, onCancel, confirmText, confirmColor, cancelText, cancelColor }: ModalProps) {
  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white break-words rounded-3xl p-8 w-60 shadow-lg relative text-black flex flex-col">
        {children}
        <div className="flex gap-5 items-center justify-center mt-6">
          <BasicButton
            variant={confirmColor}
            onClick={onConfirm}
            className="w-20"
          >
            {confirmText}
          </BasicButton>

          <BasicButton
            variant={cancelColor}
            onClick={onCancel}
            className="w-20"
          >
            {cancelText}
          </BasicButton>

        </div>
      </div>
    </div>
  );
}
