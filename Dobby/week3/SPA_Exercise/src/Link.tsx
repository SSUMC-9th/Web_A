// 타입만 가져오기 (verbatimModuleSyntax 대응)
import type { AnchorHTMLAttributes, MouseEvent } from "react";
import { navigate } from "./history";

type Props = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "href" | "onClick"
> & {
  to: string;
  replace?: boolean;
  state?: unknown; // no-explicit-any 회피
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
};

export default function Link({ to, replace, state, onClick, ...rest }: Props) {
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    if (
      e.defaultPrevented ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey ||
      rest.target === "_blank" ||
      new URL(to, location.origin).origin !== location.origin
    ) {
      onClick?.(e);
      return;
    }
    e.preventDefault();
    onClick?.(e);
    navigate(to, { replace, state });
  };

  return <a href={to} onClick={handle} {...rest} />;
}
