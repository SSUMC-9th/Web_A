import React from "react";

const HamburgerIcon = (
  props: React.SVGProps<SVGSVGElement> // props: React.SVGProps<SVGSVGElement> 타입으로
) => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 48 48" //0 0에서 시작하여 가로 48, 세로 48의 공간을 사용하겠다고 선언
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="4"
      d="M7.95 11.95h32m-32 12h32m-32 12h32"
    />
  </svg>
);

export default HamburgerIcon;
