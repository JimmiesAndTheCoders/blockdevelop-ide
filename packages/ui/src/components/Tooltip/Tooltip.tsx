import { useState, useRef, useEffect, type ReactNode, type FC, useId } from 'react';
import { clsx } from 'clsx';

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps {
  content: ReactNode;
  position?: TooltipPosition | undefined;
  delay?: number | undefined;
  shortcut?: string | undefined;
  disabled?: boolean | undefined;
  children: ReactNode;
  className?: string | undefined;
}

const positionClassesMap: Record<TooltipPosition, string> = {
  top: '-top-1 left-1/2 -translate-x-1/2 -translate-y-full mb-1',
  bottom: '-bottom-1 left-1/2 -translate-x-1/2 translate-y-full mt-1',
  left: 'top-1/2 -left-1 -translate-y-1/2 -translate-x-full mr-1',
  right: 'top-1/2 -right-1 -translate-y-1/2 translate-x-full ml-1',
};

const arrowPositionMap: Record<TooltipPosition, string> = {
  top: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 border-t-workspace-border border-l-transparent border-r-transparent border-b-transparent',
  bottom:
    'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 border-b-workspace-border border-l-transparent border-r-transparent border-t-transparent',
  left: 'right-0 top-1/2 -translate-y-1/2 translate-x-1/2 border-l-workspace-border border-t-transparent border-b-transparent border-r-transparent',
  right:
    'left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 border-r-workspace-border border-t-transparent border-b-transparent border-l-transparent',
};

/**
 * Accessible hover/focus Tooltip component with configurable delay (e.g. 400ms), keyboard shortcuts, and dark panel styling.
 */
export const Tooltip: FC<TooltipProps> = ({
  content,
  position = 'top',
  delay = 400,
  shortcut,
  disabled = false,
  children,
  className,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tooltipId = useId();

  const handleShow = () => {
    if (disabled || !content) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (delay > 0) {
      timeoutRef.current = setTimeout(() => {
        setIsVisible(true);
      }, delay);
    } else {
      setIsVisible(true);
    }
  };

  const handleHide = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  if (disabled || !content) {
    return <>{children}</>;
  }

  return (
    <div
      className="relative inline-flex shrink-0"
      onMouseEnter={handleShow}
      onMouseLeave={handleHide}
      onFocus={handleShow}
      aria-describedby={isVisible ? tooltipId : undefined}
      onBlur={handleHide}
    >
      {children}

      {isVisible && (
        <div
          id={tooltipId}
          role="tooltip"
          className={clsx(
            'absolute z-50 pointer-events-none flex items-center gap-2 px-2 py-1 text-2xs font-sans font-medium text-gray-200 bg-workspace-panel border border-workspace-border rounded shadow-ide-dropdown whitespace-nowrap animate-in fade-in duration-150',
            positionClassesMap[position],
            className
          )}
        >
          <span>{content}</span>

          {shortcut && (
            <kbd className="px-1 py-0.5 text-2xs font-mono text-gray-400 bg-workspace-dark border border-workspace-border rounded leading-none">
              {shortcut}
            </kbd>
          )}

          <div className={clsx('absolute w-0 h-0 border-4', arrowPositionMap[position])} />
        </div>
      )}
    </div>
  );
};
