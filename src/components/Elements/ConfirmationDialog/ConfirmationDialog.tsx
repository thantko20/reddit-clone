import { cloneElement, Fragment, ReactElement, ReactNode, useRef } from 'react';
import { useDisclosure } from 'hooks/useDisclosure';
import { Dialog, Transition } from '@headlessui/react';
import { Button } from '../Button';

export interface ConfirmationDialogProps {
  triggerButton: ReactElement;
  cancelButtonText?: string;
  children?: ReactNode;
  title: string;
  confirmText?: string;
  confirmAction: () => void;
}

export const ConfirmationDialog = ({
  cancelButtonText = 'Cancel',
  confirmText = 'Ok',
  ...props
}: ConfirmationDialogProps) => {
  const { isOpen, open, close } = useDisclosure();
  const cancelRef = useRef(null);

  return (
    <>
      {cloneElement(props.triggerButton, { onClick: open })}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as='div'
          onClose={close}
          initialFocus={cancelRef}
          className='relative z-50'
        >
          <Transition.Child
            as={Fragment}
            enter='ease-in duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <Dialog.Overlay className='fixed inset-0 bg-black/60' />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter='ease-in duration-300'
            enterFrom='opacity-0 scale-50'
            enterTo='opacity-100 scale-100'
            leave='ease-out duration-200'
            leaveFrom='opacity-100 scale-100'
            leaveTo='opacity-0 scale-0'
          >
            <div className='flex items-center justify-center fixed inset-0'>
              <Dialog.Panel className='bg-body rounded-lg text-lightGray p-6 flex flex-col items-start'>
                <Dialog.Title className='text-2xl font-bold'>
                  {props.title}
                </Dialog.Title>
                <Dialog.Description className='mt-6 text-gray-400'>
                  {props.children}
                </Dialog.Description>
                <div className='self-end flex gap-2 justify-start mt-4'>
                  <Button variant='secondary' onClick={close}>
                    {cancelButtonText}
                  </Button>
                  <Button onClick={props.confirmAction}>{confirmText}</Button>
                </div>
              </Dialog.Panel>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
};
