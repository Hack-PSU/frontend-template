import Divider from "../common/Divider";
import CustomCollapsible from "../common/CustomCollapsible";

const FAQ = () => {
	return (
		<section className="flex flex-col items-center w-full gap-8">
			<div className="w-4/12 flex flex-col items-center">
				<h1 className="font-bold text-6xl">FAQ</h1>
				<Divider />
				<CustomCollapsible
					question="This is a question?"
					answer="This is an answer"
				/>
			</div>
		</section>
	);
};

export default FAQ;
