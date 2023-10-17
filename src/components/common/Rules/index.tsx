import Divider from "../Divider";

const Rules = () => {
	return (
		<section className="flex flex-col items-center w-full gap-8">
			<div className="w-4/12 flex flex-col items-center">
				<h1 className="font-bold text-6xl">Rules</h1>
				<Divider />
			</div>
			<div className="w-10/12">
				<div className="w-full bg-black rounded-lg p-10 shadow-lg">
					<ul className="text-white list-disc text-xl font-lato">
						<li>
							All participants must be 18 or older, and must bring a valid form
							of identification.
						</li>
						<li>Teams may be comprised of up to five members.</li>
						<li>
							Projects should be original works created on site. Coming with an
							idea in mind is perfectly fine, working on an existing project is
							not.
						</li>
						<li>
							All projects must be submitted through DevPost by 12PM on Sunday
							(even if not completed!) and can be edited until 1:45PM Sunday.
						</li>
						<li>
							Students are permitted to come and go from the venue as they
							please.
						</li>
						<li>
							Anything you create is your work, HackPSU and its partners have no
							claim over intellectual property produced at the event.
						</li>
						<li>
							All participants must agree to the{" "}
							<a href="https://static.mlh.io/docs/mlh-code-of-conduct.pdf">
								MLH Code of Conduct
							</a>
							.
						</li>
					</ul>
				</div>
			</div>
		</section>
	);
};

export default Rules;
