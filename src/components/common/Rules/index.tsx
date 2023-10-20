import Divider from "../Divider";
import "./rules.css";

const Rules = () => {
	return (
		<section className="flex flex-col items-center w-full gap-8">
			<div className="w-11/12 md:w-5/12 flex flex-col items-center">
				<h1 className="custom-font">Rules</h1>
				<Divider />
			</div>
			<div className="w-10/12">
				<div
					className="w-full rules-border rounded-lg p-10 shadow-lg"
					style={{
						backgroundImage: 'url("/SCREEN.png")',
						backgroundSize: "cover",
						backgroundPosition: "center",
					}}
				>
					<ul className="list-inside list-disc text-white font-lato text-lg md:text-lg shadowtext-on-grid">
						<li key={0}>
              All participants must be at least 18 years old and a student of some university
              (or a recent PSU graduate within less than one year).
              All participants must bring a valid form of identification.
						</li>
						<li key={1}>
              Teams may be comprised of up to five members.
              A team may only submit one project, and no participant may be a member of multiple teams.
            </li>
						<li key={2}>
							Projects should be original works created on site. Coming with an idea
              in mind is perfectly fine, working on an existing project is not.
						</li>
						<li key={3}>
							All projects must be submitted through {" "}
              <a href="http://devpost.hackpsu.org" className="link-light-blue">
                Devpost  
              </a>
              {" "} by 12PM on Sunday (even if not completed!) and can be edited until 1:45PM Sunday.
						</li>
            <li key={4}>
              All project code must be attached to the project{"'"}s Devpost submission.
            </li>
						<li key={5}>
							Students are permitted to come and go from the venue as they
							please.
						</li>
						<li key={6}>
							Anything you create is your work, HackPSU and its partners have no
							claim over intellectual property produced at the event.
						</li>
						<li key={7}>
							All participants must agree to the{" "}
							<a href="https://static.mlh.io/docs/mlh-code-of-conduct.pdf" className="link-light-blue">
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
