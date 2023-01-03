import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Select as ChakraSelect,
  InputProps as ChakraInputProps,
  Option,
} from "@chakra-ui/react";

import { forwardRef, ForwardRefRenderFunction } from "react";
import { FieldError } from "react-hook-form";

interface Options {
  id: string;
  value: string;
  label: string;
}

interface InputProps extends ChakraInputProps {
  name: string;
  label?: string;
  options?: Options[];
  error?: FieldError;
}
const SelectBase: ForwardRefRenderFunction<HTMLInputElement, InputProps> = (
  { name, options, label, error = null, ...rest },
  ref
) => {
  return (
    <FormControl isInvalid={!!error}>
      {!!label && <FormLabel htmlFor={label}>{label}</FormLabel>}
      <ChakraSelect
        name={name}
        id={name}
        focusBorderColor="green.500"
        bgColor="gray.900"
        variant="filled"
        _hover={{ bgColor: "gray.900" }}
        size="lg"
        ref={ref}
        {...rest}
      >
        {options &&
          options.map((option) => (
            <option
              style={{
                color: "black",
              }}
              key={option.id}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
      </ChakraSelect>
      {!!error && <FormErrorMessage>{error.message}</FormErrorMessage>}
    </FormControl>
  );
};

export const Select = forwardRef(SelectBase);
