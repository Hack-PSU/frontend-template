import * as Collapsible from "@radix-ui/react-collapsible";
import { FaPlus } from "react-icons/fa";
import { FaMinus } from "react-icons/fa";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CCollapsible = (props: any) => {
	const [isCollapsed, setIsCollapsed] = useState(true);

	const toggleCollapsed = () => {
		setIsCollapsed(!isCollapsed);
	};

	const contentVariants = {
		open: { opacity: 1, height: "auto" },
		closed: { opacity: 0, height: 0 },
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
			<AnimatePresence>
				{!isCollapsed && (
					<motion.div
						initial="closed"
						animate="open"
						exit="closed"
						variants={contentVariants}
						transition={{ duration: 0.3 }}
					>
						<Collapsible.Content>
							<p className="text-white pt-4 w-80">{props.content}</p>
						</Collapsible.Content>
					</motion.div>
				)}
			</AnimatePresence>
		</Collapsible.Root>
	);
};

export default CCollapsible;