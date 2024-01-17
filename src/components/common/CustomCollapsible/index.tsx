"use client";
import { Disclosure } from "@headlessui/react";
import { MinusSmallIcon, PlusSmallIcon } from "@heroicons/react/24/outline";

interface Props {
	question: string;
	answer: string;
	link?: string | undefined;
}

export default function CustomCollapsible({ question, answer, link }: Props) {
	return (
		<Disclosure as="div" key={question} className="pt-2">
			{({ open }) => (
				<>
					<dt>
						<Disclosure.Button className="flex w-full items-start justify-between text-left text-gray-900">
							<span className="text-base font-semibold pl-2">{question}</span>
							<span className="ml-6 flex h-7 items-center">
								{open ? (
									<MinusSmallIcon className="h-6 w-6" aria-hidden="true" />
								) : (
									<PlusSmallIcon className="h-6 w-6" aria-hidden="true" />
								)}
							</span>
						</Disclosure.Button>
					</dt>
					<Disclosure.Panel as="dd" className="mt-2 pl-2 pr-12">
						<dd>
							<p className="font-lato text-sm md:text-base leading-7 text-gray-600">
								{answer}
							</p>
							{true ? (
								<a href={link} target="_blank">
									<p className="font-lato text-base leading-7 link-light-blue">
										{link}
									</p>
								</a>
							) : (
								<></>
							)}
						</dd>
					</Disclosure.Panel>
				</>
			)}
		</Disclosure>
	);
}
