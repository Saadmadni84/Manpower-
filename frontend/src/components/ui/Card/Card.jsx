import React from 'react';
import styles from './Card.module.css';

const Card = ({ 
  children, 
  className = '', 
  hover = false,
  padding = 'medium',
  ...props 
}) => {
  const cardClasses = [
    styles.card,
    hover ? styles.hover : '',
    styles[padding],
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={cardClasses} {...props}>
      {children}
    </div>
  );
};

export default Card;

