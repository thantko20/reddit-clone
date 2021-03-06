import { useState } from 'react';

export const useDisclosure = (): {
  isOpen: boolean;
  open: () => void;
  close: () => void;
} => {
  const [isOpen, setIsOpen] = useState(false);

  const open = () => setIsOpen(true);

  const close = () => setIsOpen(false);

  return { isOpen, open, close };
};
