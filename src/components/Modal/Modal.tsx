import * as React from 'react';
import './Modal.css';
import { Button } from '../Button/Button';

interface IModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactElement;
  renderButtons?: {
    caption: string;
    onClick: () => void;
    className?: string;
  }[];
}

const Modal = (props: IModalProps) => {
  const modalWrap = React.useRef<HTMLDivElement | null>(null);

  // Click away listener
  React.useEffect(() => {
    document.addEventListener('mousedown', onClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', onClickOutside);
    };
  });

  const onClickOutside = (e: MouseEvent) => {
    if (
      modalWrap.current &&
      !modalWrap.current.contains(e.target as HTMLElement)
    ) {
      props.onClose();
    }
  };

  return (
    <div
      className={`${'modal'} ${props.open ? 'display-block' : 'display-none'}`}
    >
      <div className="modal-main" ref={modalWrap}>
        <div className="modal-body">{props.children}</div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'end',
            padding: '20px',
          }}
        >
          {props.renderButtons &&
            props.renderButtons.map((button, index) => (
              <Button
                key={index}
                wrapperClassName="modal-buttons"
                caption={button.caption}
                onClick={button.onClick}
                className={button.className}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default Modal;
