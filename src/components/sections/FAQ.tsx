import Divider from "../Divider";
import CCollapsible from "../Collapsible";

const FAQ = () => {
	return (
		<section className="flex flex-col items-center w-full gap-8">
			<div className="w-4/12 flex flex-col items-center">
				<h1 className="font-bold text-6xl">FAQ</h1>
				<Divider />
			</div>
			<CCollapsible
				title="Where can I go to get help?"
				content="We have an info booth in-person!"
			/>
		</section>
	);
};

export default FAQ;
