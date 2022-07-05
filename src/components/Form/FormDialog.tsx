import { Transition, Dialog } from '@headlessui/react';
import { Button } from 'components/Elements';
import { Formik } from 'formik';
import { useDisclosure } from 'hooks/useDisclosure';
import { cloneElement, Fragment, ReactElement, ReactNode, useRef } from 'react';
import { Form } from './Form';

export interface FormDialogProps {
  triggerButton: ReactElement;
  cancelButtonText?: string;
  children: ReactNode;
  title: string;
  submitButtonText?: string;
  submitState?: boolean;
  initialValues: any;
  validationSchema: any;
  onSubmit: (values: any, close: () => void) => void;
}

export const FormDialog = ({
  triggerButton,
  cancelButtonText = 'Cancel',
  submitButtonText = 'Submit',
  submitState = false,
  children,
  title,
  initialValues,
  validationSchema,
  onSubmit,
}: FormDialogProps) => {
  const { isOpen, open, close } = useDisclosure();
  const cancelRef = useRef(null);

  return (
    <>
      {cloneElement(triggerButton, { onClick: open })}
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
            enter='ease-in-out duration-300'
            enterFrom='opacity-50 scale-90'
            enterTo='opacity-100 scale-100'
            leave='ease-in-out duration-200'
            leaveFrom='opacity-100 scale-100'
            leaveTo='opacity-0 scale-0'
          >
            <div className='fixed inset-0 flex justify-center items-start top-[10%] text-lightGray'>
              <Dialog.Panel className='bg-body py-6 px-8 rounded-lg'>
                <Dialog.Title className='text-lg font-bold'>
                  {title}
                </Dialog.Title>
                <div className='mt-6'>
                  <Formik
                    initialValues={initialValues}
                    onSubmit={(values, actions) => {
                      onSubmit(values, close);
                    }}
                    validationSchema={validationSchema}
                  >
                    <Form>
                      {children}
                      <div className='self-end flex items-center justify-end gap-2'>
                        <Button onClick={close} variant='secondary'>
                          {cancelButtonText}
                        </Button>
                        <Button
                          type='submit'
                          variant='primary'
                          isLoading={submitState}
                        >
                          {submitButtonText}
                        </Button>
                      </div>
                    </Form>
                  </Formik>
                </div>
              </Dialog.Panel>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
};
