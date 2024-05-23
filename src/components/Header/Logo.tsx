import { Text, Link } from "@chakra-ui/react";
import Image from 'next/image'
const logo = require('../../assets/logo.png')

export function Logo() {
  return (
    <Text
      fontSize={["2xl", "3xl"]}
      fontWeight="bold"
      letterSpacing="tight"
      w="64"
    >
       <Link href="/">
          <Image src={logo} alt="logo" width={100} />
        </Link>
    </Text>
  );
}