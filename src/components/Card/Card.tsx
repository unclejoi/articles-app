import * as React from 'react';
import { Button } from '../Button/Button';
import './card.css';

interface ICardProps {
  id: number;
  userId: number;
  title: string;
  body: string;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  onEdit?: () => void;
}

export const Card = (props: ICardProps) => {
  const { title, body, onClick } = props;
  const [isOver, setIsOver] = React.useState<boolean>(false);
  return (
    <div
      className="card"
      onClick={onClick}
      onMouseOver={() => setIsOver(true)}
      onMouseOut={() => setIsOver(false)}
    >
      <div className="card-title font-weight-600"> {title} </div>
      <div className="card-body"> {body} </div>
      {isOver && props.onEdit && (
        <div className="card hoverEffect">
          <Button caption="Edit" onClick={props.onEdit} />
        </div>
      )}
    </div>
  );
};
