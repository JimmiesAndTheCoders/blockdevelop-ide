import {
  useEffect,
  useRef,
  useId,
  type FC,
  type ReactNode,
  type MouseEvent as ReactMouseEvent,
} from 'react';
import { createPortal } from 'react-dom';
import { clsx } from 'clsx';
import { Icon } from '../Icon/Icon';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: ReactNode | undefined;
  icon?: string | ReactNode | undefined;
  children: ReactNode;
  footer?: ReactNode | undefined;
  size?: ModalSize | undefined;
  closeOnEsc?: boolean | undefined;
  closeOnOverlayClick?: boolean | undefined;
  showCloseButton?: boolean | undefined;
  className?: string | undefined;
  bodyClassName?: string | undefined;
}

const sizeClassesMap: Record<ModalSize, string> = {
  sm: 'max-w-md w-full',
  md: 'max-w-lg w-full',
  lg: 'max-w-2xl w-full',
  xl: 'max-w-4xl w-full',
  full: 'max-w-[95vw] w-full h-[90vh]',
};

/**
 * Accessible IDE Modal/Dialog component with backdrop blur, focus trapping, Escape key dismissal, and portal rendering.
 */
export const Modal: FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  icon,
  children,
  footer,
  size = 'md',
  closeOnEsc = true,
  closeOnOverlayClick = true,
  showCloseButton = true,
  className,
  bodyClassName,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const titleId = useId();

  // Handle ESC key listener & focus trapping
  useEffect(() => {
    if (!isOpen) return;

    // Store previously focused element
    previousFocusRef.current = document.activeElement as HTMLElement | null;

    // Lock body scrolling
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Focus first focusable element inside modal
    const focusableSelector =
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

    const timer = setTimeout(() => {
      if (modalRef.current) {
        const firstFocusable = modalRef.current.querySelector<HTMLElement>(focusableSelector);
        if (firstFocusable) {
          firstFocusable.focus();
        } else {
          modalRef.current.focus();
        }
      }
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && closeOnEsc) {
        e.preventDefault();
        onClose();
        return;
      }

      // Focus trapping via TAB key
      if (e.key === 'Tab' && modalRef.current) {
        const focusables = Array.from(
          modalRef.current.querySelectorAll<HTMLElement>(focusableSelector)
        );
        if (focusables.length === 0) return;

        const firstElement = focusables[0];
        const lastElement = focusables[focusables.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement && lastElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement && firstElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);

      // Restore focus on close
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    };
  }, [isOpen, closeOnEsc, onClose]);

  if (!isOpen || typeof document === 'undefined') {
    return null;
  }

  const handleOverlayClick = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && closeOnOverlayClick) {
      onClose();
    }
  };

  const renderIconSlot = (iconItem: string | ReactNode) => {
    if (typeof iconItem === 'string') {
      return <Icon name={iconItem} size="md" color="accent" />;
    }
    return iconItem;
  };

  const modalContent = (
    <div
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150"
    >
      <div
        ref={modalRef}
        role="dialog"
        tabIndex={-1}
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        className={clsx(
          'relative flex flex-col bg-workspace-panel border border-workspace-border rounded-lg shadow-ide-modal text-gray-200 outline-none overflow-hidden max-h-[90vh]',
          sizeClassesMap[size],
          className
        )}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between px-4 py-3 bg-workspace-header border-b border-workspace-border shrink-0">
            <div className="flex items-center gap-2 font-semibold text-sm text-gray-100 min-w-0 truncate">
              {icon && <span className="inline-flex shrink-0">{renderIconSlot(icon)}</span>}
              {title && (
                <h2 id={titleId} className="truncate">
                  {title}
                </h2>
              )}
            </div>

            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close dialog"
                className="p-1 rounded hover:bg-workspace-hover text-gray-400 hover:text-white transition-colors shrink-0"
              >
                <Icon name="close" size="sm" />
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className={clsx('flex-1 p-4 overflow-y-auto text-xs', bodyClassName)}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-2 px-4 py-3 bg-workspace-dark border-t border-workspace-border shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export const Dialog = Modal;
export type DialogProps = ModalProps;
