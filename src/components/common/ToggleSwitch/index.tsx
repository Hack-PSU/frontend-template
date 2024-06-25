import React from "react";
import * as Switch from "@radix-ui/react-switch";
import "./styles.css";

interface Props {
	name: string;
	onChange: (name: string, isChecked: boolean) => void;
	on: string;
	off: string;
}

const SwitchDemo: React.FC<Props> = ({ name, onChange, on, off }) => {
	return (
		<>
			<div className="flex items-center justify-center mt-2 mb-4">
				<label className="LabelOff" style={{ paddingRight: 15 }}>
					{off}
				</label>
				<Switch.Root
					className="SwitchRoot"
					id={name}
					onCheckedChange={(e) => onChange(name, e)}
				>
					<Switch.Thumb className="SwitchThumb" />
				</Switch.Root>
				<label className="LabelOn" style={{ paddingLeft: 15 }}>
					{on}
				</label>
			</div>
		</>
	);
};

export default SwitchDemo;
