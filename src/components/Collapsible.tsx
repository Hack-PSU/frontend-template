import * as Collapsible from "@radix-ui/react-collapsible";
import { FaPlus } from "react-icons/fa";
import { FaMinus } from "react-icons/fa";
import { useState } from "react";
import styled, { css, keyframes } from "styled-components";

const slideDown = keyframes`
  from {
    height: 0;
  }
  to {
    height: var(--radix-collapsible-content-height);
  }
`;

const slideUp = keyframes`
  from {
    height: var(--radix-collapsible-content-height);
  }
  to {
    height: 0;
  }
`;

const CollapsibleContent = styled(Collapsible.Content)`
  overflow: hidden;
  width: 340px;

  ${(props) =>
    props["data-state"] === "open" &&
    css`
      animation: ${slideDown} 300ms ease-out;
    `}

  ${(props) =>
    props["data-state"] === "closed" &&
    css`
      animation: ${slideUp} 300ms ease-out;
    `}
`;

const CCollapsible = (props: any) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleCollapsed = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <Collapsible.Root className="bg-black p-4 rounded-sm">
      <Collapsible.Trigger
        className="flex flex-row gap-8 text-white font-bold"
        onClick={toggleCollapsed}
      >
        <p>{props.title}</p>
        {isCollapsed ? <FaPlus size={20} /> : <FaMinus size={20} />}
      </Collapsible.Trigger>
      <CollapsibleContent
        data-state={isCollapsed ? "closed" : "open"}
      >
        <div className="text-white pt-4">{props.content}</div>
      </CollapsibleContent>
    </Collapsible.Root>
  );
};

export default CCollapsible;