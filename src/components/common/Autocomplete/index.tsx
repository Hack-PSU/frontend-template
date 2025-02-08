import React, { useState } from "react";
import { Combobox } from "@headlessui/react";
import countryData from "./assets/countries.json";
import majorData from "./assets/majors.json";
import referralData from "./assets/referrals.json";
import schoolData from "./assets/schools.json";
import "./autocomplete.css";

interface Props {
	data: "country" | "major" | "referral" | "university";
	onSelectionChange: (name: string, selection: string) => void;
	searchTermMin?: number;
}

const Autocomplete: React.FC<Props> = ({
	data,
	onSelectionChange,
	searchTermMin = 2,
}) => {
	const [query, setQuery] = useState("");

	const getData = (data: string): object => {
		switch (data) {
			case "country":
				return countryData;
			case "major":
				return majorData;
			case "referral":
				return referralData;
			case "university":
				return schoolData;
			default:
				return countryData;
		}
	};

	const options = Object.keys(getData(data));

	const filteredData =
		query.length >= searchTermMin
			? options.filter((item) =>
					item.toLowerCase().includes(query.toLowerCase())
				)
			: [];

	const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;
		onSelectionChange(data, value);
		setQuery(value);
	};

	const handleSelectionChange = (selection: string) => {
		onSelectionChange(data, selection);
		setQuery(selection);
	};

	return (
		<div className="combobox" id={`${data}-autocomplete`}>
			<Combobox value={query} onChange={handleSelectionChange} as="ul">
				<Combobox.Input
					className="combobox-input"
					onChange={handleTextChange}
					placeholder="Type to search..."
				/>
				{filteredData.length > 0 && (
					<Combobox.Options className="combobox-options">
						{filteredData.map((country, idx) => (
							<Combobox.Option
								key={idx}
								value={country}
								as="li"
								// Use Headless UI's className as a function syntax
								className={({ active }) =>
									active ? "option-hovered" : "option-item"
								}
							>
								{country}
							</Combobox.Option>
						))}
					</Combobox.Options>
				)}
			</Combobox>
		</div>
	);
};

export default Autocomplete;
