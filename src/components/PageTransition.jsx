"use client";
import React, { useRef } from "react";
import { usePathname } from "next/navigation";
import { CSSTransition, SwitchTransition } from "react-transition-group";

export default function PageTransition({ children }) {
  const pathname = usePathname();
  const nodeRef = useRef(null);

  return (
    <SwitchTransition>
      <CSSTransition
        key={pathname}
        timeout={400}
        classNames="fade"
        unmountOnExit
        nodeRef={nodeRef}
      >
        <div ref={nodeRef}>{children}</div>
      </CSSTransition>
    </SwitchTransition>
  );
}