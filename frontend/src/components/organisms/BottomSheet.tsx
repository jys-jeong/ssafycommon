import { motion, useMotionValue } from "framer-motion";
import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import MarkerDetails from "./MarkerDetails";
import DefaultMenu from "./DefaultMenu";

interface BottomSheetProps {
  children?: React.ReactNode;
  data?: any;
}
export interface BottomSheetRef {
  handleTouchStart: (e: React.TouchEvent) => void;
  handleTouchMove: (e: React.TouchEvent) => void;
  handleTouchEnd: (e: React.TouchEvent) => void;
  isDragging: boolean;
  openWithData: (data: any) => void;
  close: () => void;
}

export const BottomSheet = forwardRef<BottomSheetRef, BottomSheetProps>(
  ({ children, data }, ref) => {
    const y = useMotionValue(
      typeof window !== "undefined" ? window.innerHeight - 150 : 500
    );
    const [isDragging, setIsDragging] = useState(false);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [startY, setStartY] = useState(0);
    const [currentY, setCurrentY] = useState(0);
    const [initialSheetY, setInitialSheetY] = useState(0);
    const [sheetData, setSheetData] = useState<any>(data);

    useEffect(() => {
      setSheetData(data);
    }, [data]);

    const openWithData = (newData: any) => {
      setSheetData(newData);
      y.set(50);
      setIsSheetOpen(true);
    };
    const close = () => {
      y.set(window.innerHeight - 150);
      setIsSheetOpen(false);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
      setStartY(e.touches[0].clientY);
      setCurrentY(e.touches[0].clientY);
      setInitialSheetY(y.get());
    };
    const handleTouchMove = (e: React.TouchEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      e.stopPropagation();
      const touchY = e.touches[0].clientY;
      const deltaY = touchY - startY;
      setCurrentY(touchY);
      const minY = 50;
      const maxY = window.innerHeight - 150;
      const newY = initialSheetY + deltaY;
      const clampedY = Math.max(minY, Math.min(maxY, newY));
      y.set(clampedY);
      const midPoint = (minY + maxY) / 2;
      setIsSheetOpen(clampedY < midPoint);
    };
    const handleTouchEnd = (e: React.TouchEvent) => {
      if (!isDragging) return;
      setIsDragging(false);
      const currentPosition = y.get();
      const deltaY = currentY - startY;
      const velocity = Math.abs(deltaY) / 100;
      const midPoint = (50 + (window.innerHeight - 150)) / 2;
      const isQuickUpSwipe = velocity > 2 && deltaY < 0;
      const isQuickDownSwipe = velocity > 2 && deltaY > 0;
      if (isQuickUpSwipe) {
        y.set(50);
        setIsSheetOpen(true);
      } else if (isQuickDownSwipe) {
        y.set(window.innerHeight - 150);
        setIsSheetOpen(false);
      } else {
        if (currentPosition < midPoint) {
          y.set(50);
          setIsSheetOpen(true);
        } else {
          y.set(window.innerHeight - 150);
          setIsSheetOpen(false);
        }
      }
    };
    const handleBackgroundClick = () => {
      y.set(window.innerHeight - 150);
      setIsSheetOpen(false);
    };
    useImperativeHandle(ref, () => ({
      handleTouchStart, handleTouchMove, handleTouchEnd, isDragging, openWithData, close
    }));

    return (
      <>
        <motion.div
          className="fixed bottom-[94px] left-0 w-full bg-white rounded-t-[20px] shadow-2xl z-50"
          style={{ y, height: "80vh" }}
          transition={isDragging ? false : { type: "spring", damping: 25, stiffness: 300 }}
        >
          <div
            className="w-full flex justify-center py-4 pointer-events-auto cursor-grab rounded-t-[20px]"
            style={{ touchAction: "none" }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="w-12 h-[4px] rounded-full bg-[#3A8049] shadow-sm" />
          </div>
          <div className="w-full h-px bg-gray-100"></div>
          <div className="overflow-y-auto max-h-[calc(80vh-80px)] bg-gray-50">
            {sheetData ? <MarkerDetails data={sheetData} /> : <DefaultMenu>{children}</DefaultMenu>}
          </div>
        </motion.div>
        {isSheetOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={handleBackgroundClick}
          />
        )}
      </>
    );
  }
);

export default BottomSheet;
