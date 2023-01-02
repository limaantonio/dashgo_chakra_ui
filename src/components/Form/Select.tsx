// import {
//   FormControl,
//   FormErrorMessage,
//   FormLabel,
//   Input as ChakraInput,
//   InputProps as ChakraInputProps,
//   Select,
// } from "@chakra-ui/react";

// import { forwardRef, ForwardRefRenderFunction } from "react";
// import { FieldError } from "react-hook-form";

// interface InputProps extends ChakraInputProps {
//   name: string;
//   label?: string;
//   error?: FieldError;
// }
// const InputBase: ForwardRefRenderFunction<HTMLInputElement, InputProps> = (
//   { name, label, error = null, ...rest },
//   ref
// ) => {
//   return (
//     <FormControl isInvalid={!!error}>
//       {!!label && <FormLabel htmlFor={label}>{label}</FormLabel>}
//       <Select
//         name={name}
//         id={name}
//         type="email"
//         focusBorderColor="green.500"
//         bgColor="gray.900"
//         variant="filled"
//         _hover={{ bgColor: "gray.900" }}
//         size="lg"
//         ref={ref}
//         {...rest}
//       >
//         <option value="1">1</option>
//       </Select>
//       {!!error && <FormErrorMessage>{error.message}</FormErrorMessage>}
//     </FormControl>
//   );
// };

// export const Input = forwardRef(InputBase);
