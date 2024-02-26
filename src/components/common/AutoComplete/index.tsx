import React, { useState, Fragment } from "react";
import { Combobox } from "@headlessui/react";
import countryData from "/Users/aaryasoni/frontend-template/src/components/common/AutoComplete/Assests/countries.json";

// Convert JSON object keys (country names) into an array of strings
const countryNames = Object.keys(countryData);

interface Props {
	onSelectionChange: (selection: string) => void;
}

const Autocomplete: React.FC<Props> = ({ onSelectionChange }) => {
	const [query, setQuery] = useState("");

	const filteredCountries = countryNames.filter((country) =>
		country.toLowerCase().includes(query.toLowerCase())
	);

	return (
		<div className="flex flex-col items-center justify-center mt-2 mb-4">
			<Combobox value={query} onChange={onSelectionChange}>
				<Combobox.Input
					className="ComboboxInput"
					onChange={(event) => setQuery(event.target.value)}
					placeholder="Type to search..."
				/>
				{filteredCountries.length > 0 && (
					<Combobox.Options className="ComboboxOptions">
						{filteredCountries.map((country, idx) => (
							<Combobox.Option key={idx} value={country} as={Fragment}>
								{({ active }) => (
									<li
										className={`OptionItem ${active ? "OptionItemActive" : ""}`}
									>
										{country}
									</li>
								)}
							</Combobox.Option>
						))}
					</Combobox.Options>
				)}
			</Combobox>
		</div>
	);
};

export default Autocomplete;
