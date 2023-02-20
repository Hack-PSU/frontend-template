import * as Collapsible from "@radix-ui/react-collapsible";
import { FaPlus } from "react-icons/fa";
import { FaMinus } from "react-icons/fa";
import { useState } from "react";

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
			<Collapsible.Content className="w-80">
				<div className="text-white pt-4">{props.content}</div>
			</Collapsible.Content>
		</Collapsible.Root>
	);
};

export default CCollapsible;
