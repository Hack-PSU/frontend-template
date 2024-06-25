import React, { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

interface Props {
	name: string;
	onChange: (name: string, phone: string) => void;
}

const TelephoneFormatter: React.FC<Props> = ({ name, onChange }) => {
	const [phone, setPhone] = useState("");

	const handlePhoneChange = (phone: string) => {
		setPhone(phone);
		onChange(name, phone);
	};

	return (
		<>
			<PhoneInput
				key={`phone-input-${name}`}
				country={"us"}
				value={phone}
				onChange={(phone) => handlePhoneChange(phone)}
			/>
		</>
	);
};

export default TelephoneFormatter;
