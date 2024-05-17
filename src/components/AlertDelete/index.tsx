import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  //@ts-ignore
  Button
} from '@chakra-ui/react'
import React, { useCallback, useRef } from 'react'
import { useToast } from '@chakra-ui/react'
import { MutableRefObject } from 'react';

// Defina o tipo FocusableElement manualmente
type FocusableElement = HTMLElement | SVGElement | null;


interface IModalProps {
  isOpen: boolean
  setIsOpen: () => void
  handleRemove: (id: string) => void
}

const AlertDelete: React.FC<IModalProps> = ({
  isOpen,
  setIsOpen,
  handleRemove,
}) => {
  const handleSubmit = useCallback(
  //@ts-ignore
    (event) => {
      event.preventDefault()
      //@ts-ignore
      handleRemove()
      setIsOpen()
    },
    [handleRemove, setIsOpen],
  )

  function sair() {
    setIsOpen()
  }

  const toast = useToast()
  const cancelRef = React.useRef()
  const leastDestructiveRef = useRef<FocusableElement>(null);

  return (
    <>
      
      <AlertDialog isOpen={isOpen} leastDestructiveRef={leastDestructiveRef} onClose={() => setIsOpen()} lockFocusAcrossFrames={undefined}>
        <AlertDialogOverlay>
          <AlertDialogContent as="form" onSubmit={handleSubmit}>
            <AlertDialogHeader
              fontSize="lg"
              fontWeight="bold"
              textColor="gray.800"
            >
              Excluir Registro
            </AlertDialogHeader>

            <AlertDialogBody textColor="gray.800">
              Tem certeza que deseja excluir este registro?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button onClick={sair}>Cancelar</Button>
              <Button
                onClick={() =>
                  toast({
                    title: 'Registro excluído.',
                    description: 'O registro foi excluido com sucesso.',
                    status: 'success',
                    duration: 9000,
                    isClosable: true,
                  })
                }
                colorScheme="red"
                type="submit"
                ml={3}
              >
                Sim
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}

export default AlertDelete
