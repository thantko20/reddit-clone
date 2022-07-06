import clsx from 'clsx';

const sizes = {
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
  lg: 'w-10 h-10',
};

export interface AvatarProps {
  url: string;
  size?: keyof typeof sizes;
  className?: string;
  alt?: string;
}

export const Avatar = ({
  url,
  size = 'md',
  className = '',
  alt = 'avatar',
}: AvatarProps) => {
  return (
    <img
      className={clsx(
        'bg-white rounded-full overflow-hidden',
        sizes[size],
        className,
      )}
      src={url}
      alt={alt}
    />
  );
};
