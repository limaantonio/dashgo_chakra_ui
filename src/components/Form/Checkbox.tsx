import {
    Checkbox as ChakraCheckbox,
    CheckboxProps as ChakraCheckboxProps,
    FormControl,
    FormLabel,
    FormErrorMessage,
  } from "@chakra-ui/react";
  import { forwardRef, ForwardRefRenderFunction } from "react";
  import { FieldError } from "react-hook-form";
  
  interface CheckboxProps extends ChakraCheckboxProps {
    name: string;
    label?: string;
    error?: FieldError;
  }
  
  const CheckboxBase: ForwardRefRenderFunction<HTMLInputElement, CheckboxProps> = (
    { name, label, error = null, ...rest },
    ref
  ) => {
    return (
      <FormControl isInvalid={!!error}>
        {!!label && <FormLabel htmlFor={name}>{label}</FormLabel>}
        <ChakraCheckbox
          name={name}
          id={name}
          ref={ref}
          size="lg"
          colorScheme="green"
          {...rest}
        />
        {!!error && <FormErrorMessage>{error.message}</FormErrorMessage>}
      </FormControl>
    );
  };
  
  export const Checkbox = forwardRef(CheckboxBase);
  