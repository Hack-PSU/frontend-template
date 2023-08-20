import Divider from "../common/Divider";

export default function Sponsors() {
	return (
		<section className="flex flex-col items-center w-full gap-8">
			<div className="w-4/12 flex flex-col items-center">
				<h1 className="font-bold text-6xl">Sponsors</h1>
				<Divider />
			</div>
			<div className="bg-white">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="-mx-6 grid grid-cols-2 gap-0.5 overflow-hidden sm:mx-0 sm:rounded-2xl md:grid-cols-3">
						<div className="bg-gray-400/5 p-8 sm:p-10">
							<img
								className="max-h-12 w-full object-contain"
								src="https://tailwindui.com/img/logos/158x48/transistor-logo-gray-900.svg"
								alt="Transistor"
								width={158}
								height={48}
							/>
						</div>
						<div className="bg-gray-400/5 p-6 sm:p-10">
							<img
								className="max-h-12 w-full object-contain"
								src="https://tailwindui.com/img/logos/158x48/reform-logo-gray-900.svg"
								alt="Reform"
								width={158}
								height={48}
							/>
						</div>
						<div className="bg-gray-400/5 p-6 sm:p-10">
							<img
								className="max-h-12 w-full object-contain"
								src="https://tailwindui.com/img/logos/158x48/tuple-logo-gray-900.svg"
								alt="Tuple"
								width={158}
								height={48}
							/>
						</div>
						<div className="bg-gray-400/5 p-6 sm:p-10">
							<img
								className="max-h-12 w-full object-contain"
								src="https://tailwindui.com/img/logos/158x48/laravel-logo-gray-900.svg"
								alt="Laravel"
								width={158}
								height={48}
							/>
						</div>
						<div className="bg-gray-400/5 p-6 sm:p-10">
							<img
								className="max-h-12 w-full object-contain"
								src="https://tailwindui.com/img/logos/158x48/savvycal-logo-gray-900.svg"
								alt="SavvyCal"
								width={158}
								height={48}
							/>
						</div>
						<div className="bg-gray-400/5 p-6 sm:p-10">
							<img
								className="max-h-12 w-full object-contain"
								src="https://tailwindui.com/img/logos/158x48/statamic-logo-gray-900.svg"
								alt="Statamic"
								width={158}
								height={48}
							/>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
