// 타입만 임포트 (verbatimModuleSyntax 대응)
import type { AnchorHTMLAttributes, MouseEvent } from "react";
import { navigate } from "./history";

type Props = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "href" | "onClick"
> & {
  to: string;
  replace?: boolean;
  state?: unknown; // any 사용 금지 룰 대응
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
};

export default function Link({ to, replace, state, onClick, ...rest }: Props) {
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    // 새창/수정키/외부 링크는 기본 동작 유지
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
    // 내부 라우팅: 기본 동작 막고 History API 사용
    e.preventDefault();
    onClick?.(e);
    navigate(to, { replace, state });
  };

  return <a href={to} onClick={handle} {...rest} />;
}
