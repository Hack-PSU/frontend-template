"use client";
import { Disclosure } from "@headlessui/react";
import { MinusSmallIcon, PlusSmallIcon } from "@heroicons/react/24/outline";

import "./customCollapsible.css";

interface Props {
	question: string;
	answer: string;
	link?: {
		target: string;
		text?: string | undefined;
	};
}

export default function CustomCollapsible({ question, answer, link }: Props) {
	return (
		<Disclosure as="div" key={question} className="faq-collapsible">
			{({ open }) => (
				<>
					<dt>
						<Disclosure.Button className="faq-button-header flex w-full items-start justify-between text-left text-gray-900">
							<span className="text-base font-semibold">{question}</span>
							<span className="flex h-7 items-center">
								{open ? (
									<MinusSmallIcon className="h-6 w-6" aria-hidden="true" />
								) : (
									<PlusSmallIcon className="h-6 w-6" aria-hidden="true" />
								)}
							</span>
						</Disclosure.Button>
					</dt>
					<Disclosure.Panel
						as="dd"
						className={`faq-button-content ${open ? "" : "hidden"}`}
					>
						<p className="text-white-custom">{answer}</p>
						{link && (
							<a
								href={link.target}
								target="_blank"
								rel="noopener noreferrer"
								className="text-blue-custom"
							>
								{link.text || link.target}
							</a>
						)}
					</Disclosure.Panel>
				</>
			)}
		</Disclosure>
	);
}
