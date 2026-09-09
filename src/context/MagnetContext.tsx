import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import ResourceModal from "../components/ResourceModal";

interface MagnetContextValue {
  open: () => void;
  close: () => void;
  isOpen: boolean;
}

const MagnetContext = createContext<MagnetContextValue | null>(null);

/**
 * 免费资料包（Lead Magnet）全局触发器。
 * 把 ResourceModal 提升为全局单例，Hero 主按钮、右下浮动按钮、以及未来的任意入口
 * 都通过 useMagnet().open() 打开同一个弹窗，避免重复挂载与状态分散。
 */
export function MagnetProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  return (
    <MagnetContext.Provider value={{ open, close, isOpen }}>
      {children}
      <ResourceModal isOpen={isOpen} onClose={close} />
    </MagnetContext.Provider>
  );
}

export function useMagnet(): MagnetContextValue {
  const ctx = useContext(MagnetContext);
  if (!ctx) {
    throw new Error("useMagnet 必须在 <MagnetProvider> 内使用");
  }
  return ctx;
}
