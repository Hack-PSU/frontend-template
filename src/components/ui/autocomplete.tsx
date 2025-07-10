"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

interface AutocompleteProps {
	data: string[];
	placeholder: string;
	value?: string;
	onSelectionChange: (value: string) => void;
}

export function Autocomplete({
	data,
	placeholder,
	value: controlledValue,
	onSelectionChange,
}: AutocompleteProps) {
	const [open, setOpen] = React.useState(false);
	const [internalValue, setInternalValue] = React.useState("");

	const value = controlledValue !== undefined ? controlledValue : internalValue;
	const setValue =
		controlledValue !== undefined ? onSelectionChange : setInternalValue;

	const handleSelect = (currentValue: string) => {
		const newValue = currentValue === value ? "" : currentValue;
		setValue(newValue);
		if (controlledValue === undefined) {
			onSelectionChange(newValue);
		}
		setOpen(false);
	};

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className="w-full justify-between bg-transparent"
				>
					{value
						? data.find((item) => item.toLowerCase() === value.toLowerCase()) ||
							value
						: placeholder}
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[--radix-popover-trigger-width] p-0">
				<Command>
					<CommandInput
						placeholder={`Search ${placeholder.toLowerCase()}...`}
					/>
					<CommandList>
						<CommandEmpty>No results found.</CommandEmpty>
						<CommandGroup>
							{data.map((item) => (
								<CommandItem
									key={item}
									value={item}
									onSelect={(currentValue) => handleSelect(currentValue)}
								>
									<Check
										className={cn(
											"mr-2 h-4 w-4",
											value.toLowerCase() === item.toLowerCase()
												? "opacity-100"
												: "opacity-0"
										)}
									/>
									{item}
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
