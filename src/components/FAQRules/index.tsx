import Rules from "@/components/common/Rules/index"; // Import the Rules component
import FAQ from "@/components/common/FAQ"; // Import the FAQ component

function FAQPage() {
	return (
		<div className="flex">
			<div className="flex-1">
				<Rules />
			</div>
			<div className="flex-1">
				<FAQ />
			</div>
		</div>
	);
}

export default FAQPage;
