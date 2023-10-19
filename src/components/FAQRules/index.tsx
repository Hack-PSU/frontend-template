import Rules from "@/components/common/Rules/index"; // Import the Rules component
import FAQ from "@/components/common/FAQ"; // Import the FAQ component

function FAQPage() {
	return (
		<div id="faq" className="flex flex-col md:flex-row mt-20">
			<div className="flex-1 mb-4 md:mb-0">
				<Rules />
			</div>
			<div className="flex-1">
				<FAQ />
			</div>
		</div>
	);
}

export default FAQPage;
