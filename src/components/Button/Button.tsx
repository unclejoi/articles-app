import * as React from 'react';
import { CarretDown } from '../../assets/icons/caret-down';
import './Button.css';
import { filterType } from '../../Routes/Articles/Landing';

interface IButtonProps {
  caption: string;
  onClick?: () => void;
  options?: IOptions[];
  type?: 'reset' | 'submit' | 'button';
  className?: string;
  wrapperClassName?: string;
}

type IOptions = {
  name: string;
  onClick: (value: filterType) => void;
};

export const Button = (props: IButtonProps) => {
  const wrapperRef = React.useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  // click away listener
  React.useEffect(() => {
    document.addEventListener('mousedown', onClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', onClickOutside);
    };
  }, [wrapperRef]);

  const onClickOutside = (e: MouseEvent) => {
    if (
      wrapperRef.current &&
      !wrapperRef.current.contains(e.target as HTMLElement)
    ) {
      setIsOpen(false);
    }
  };

  const onClickBtn = () => {
    if (props.onClick) props.onClick();
    setIsOpen(!isOpen);
  };

  const onClickOptions = (item: IOptions) => {
    item.onClick(item.name as filterType);
    setIsOpen(false);
  };

  return (
    <div
      style={{ position: 'relative' }}
      className={props.wrapperClassName}
      ref={wrapperRef}
    >
      <button
        type={props.type}
        className={`${props.className} menuButton`}
        onClick={onClickBtn}
        style={{
          borderBottomLeftRadius: isOpen ? '0px' : '5px',
          borderBottomRightRadius: isOpen ? '0px' : '5px',
          borderBottom: isOpen ? '1px solid transparent' : undefined,
          justifyContent: !props.options ? 'center' : undefined,
        }}
      >
        {' '}
        {props.caption}
        {props.options && (
          <div
            style={{
              marginLeft: '5px',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <CarretDown />{' '}
          </div>
        )}
      </button>
      {props.options && isOpen ? (
        <ul className="dropdown-list">
          {props.options.map((item, index: number) => (
            <li
              style={{
                borderBottomLeftRadius:
                  index === props.options?.length || 0 - 1 ? '5px' : '0px',
                borderBottomRightRadius:
                  index === props.options?.length || 0 - 1 ? '5px' : '0px',
              }}
              key={index}
              className="list-item"
              onClick={() => onClickOptions(item)}
            >
              {' '}
              {item.name}{' '}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
};
