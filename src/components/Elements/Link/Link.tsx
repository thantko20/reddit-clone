import clsx from 'clsx';
import {
  Link as RouteLink,
  LinkProps as RouteLinkProps,
} from 'react-router-dom';

const colours = {
  gray: 'text-lightGray hover:text-mainRed',
  red: 'text-mainRed hover:text-lightGray',
};

interface LinkProps extends RouteLinkProps {
  colour?: keyof typeof colours;
}

export const Link = ({
  className = '',
  children,
  colour = 'gray',
  ...props
}: LinkProps) => {
  return (
    <RouteLink
      className={clsx('transition-colors', colours[colour], className)}
      {...props}
    >
      {children}
    </RouteLink>
  );
};
