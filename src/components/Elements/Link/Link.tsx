import clsx from 'clsx';
import { Link as RouteLink, LinkProps } from 'react-router-dom';

export const Link = ({ className = '', children, ...props }: LinkProps) => {
  return (
    <RouteLink
      className={clsx(
        'text-mainRed transition-colors hover:text-lightGray',
        className,
      )}
      {...props}
    >
      {children}
    </RouteLink>
  );
};
