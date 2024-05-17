import Link, { LinkProps } from "next/link";
import { useRouter } from "next/router";
import { cloneElement, ReactElement } from "react";

interface ActiveLinkProps {
  children: ReactElement;
  shouldMatchExactHref?: boolean;
}
export function ActiveLink({
  children,
  shouldMatchExactHref = false,
  ...rest
}: ActiveLinkProps) {
  let isActive = false;
  const { asPath } = useRouter();

  if (
    !shouldMatchExactHref &&
    (asPath.startsWith(String((rest as { href?: string, as?: string }).href)) || asPath.startsWith(String((rest as { href?: string, as?: string }).as)))
  ) {
    isActive = true;
  }

  return (
    <Link href={(rest as { href?: string }).href || ''} {...rest}>
      {cloneElement(children, {
        color: isActive ? "green.400" : "gray.50",
      })}
    </Link>
  );
}
