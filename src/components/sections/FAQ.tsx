import Divider from "../Divider";
import CCollapsible from "../Collapsible";
import Link from "next/link";

const FAQ = () => {
	return (
		<section className="flex flex-col items-center w-full gap-8">
			<div className="w-4/12 flex flex-col items-center">
				<h1 className="font-bold text-6xl">FAQ</h1>
				<Divider />
			</div>

			<div className="flex flex-col items-center w-full gap-8">

				<CCollapsible
					title="Where can I go to get help?"
					content=<div> We have an info booth in-person! </div>
				/>
				<CCollapsible
					title="Do I need to stay at the event the whole time?"
					content=<div>
						You are free to come and go as you please to get some rest, fresh air,
						or take a break! If you feel like throwing in the towel for the
						weekend, that's fine too! All that we ask is that you only work on
						your project while on the premises.
					</div>
				/>
				<CCollapsible
					title="How do I submit a project?"
					content=<div>
						All projects will be submitted through the HackPSU Devpost by Sunday
						12:00pm (even if not completed), then you'll be able to edit your
						devpost submission until 1:45pm. We will then have a judging expo in
						the building main area. Do NOT submit your project via email, Discord,
						slide into a DM, messenger pigeon, drone, overnight express mail, etc.
						Both hardware and software projects are allowed. Only one Devpost
						submission per team is needed. View more requirements when submitting
						a project in the Devpost Rules. Link:&nbsp;
						<Link className="text-blue-500 underline" href="http://devpost.hackpsu.org">
							http://devpost.hackpsu.org
						</Link>
					</div>
					/>
					
				<CCollapsible
					title="Can I sleep at the event?"
					content=<div>Yes! We have air mattresses for checkout at the registration table starting at 10pm. 
					All we ask is that you treat them nicely and please return them when you're done!
					</div>
				/>


			</div>
		
			<div className="section2">
				<CCollapsible
					title="When can I get travel reimbursement?"
					content=<div>Travel reimbursements will be handled at the registration table Saturday after 3pm and Sunday 
					from 11am-1pm. Please come to the table with everyone that you traveled with, and the receipts for your
					transportation costs. If you spoke with us directly about special consideration, please have any emails/messages shared open and ready!</div>
				/>

				<CCollapsible
					title="How does extra credit work?"
					content=
					<div>If you are attending and a professor is offering extra credit for being at HackPSU, 
					please refer to the requirements they set out for receiving extra credit. 
					We will be tracking attendance to events like workshops, and will be reporting 
					back to professors with data so that they may confirm you were participating. 
						<br></br><br></br>
						Click <Link className="text-blue-500 underline" href="https://hackpsu.org/profile">
						here
						</Link> 
						&nbsp;to sign up for extra credit!
					</div>
				/>
	
				<CCollapsible
					title="Where did the old website go?"
					content=<div>Where did the old website go?
					It's right&nbsp; 
					<Link className="text-blue-500 underline" href="https://app.hackpsu.org/">
					here
					</Link>
					!
					</div>
				/>

				<CCollapsible
					title="What is Devpost?"
					content=<div>Devpost is a project submission platform used by many hackathons and technology-focused events. 
					You and/or your team will be asked to submit your project through our Spring 2023 Devpost. For those who have
					never used Devpost before or would like a refresher, head over to the info booth!</div>
				/>

				<CCollapsible
					title="When are Devpost submissions due?"
					content=<div>You must have a Devpost submission created by Sunday 12pm 
					(even if not completed) in our HackPSU Spring 2023 Devpost so we know how many projects we have to judge. 
					That doesn't mean you have to stop working on it though! You can keep editing your Devpost all the way until 
					hacking ends on Sunday at 1:45pm.</div>
				/>
			</div>
		</section>
	);
};

export default FAQ;
