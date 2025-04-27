import Rules from "@/components/common/Rules/index";
import FAQ from "@/components/FAQ";

function FAQPage() {
	return (
		<div id="faq" className="flex-col md:flex-row mt-20 w-full">
			<div className="flex-1 mb-4 md:mb-0 flex justify-center">
				<Rules />
			</div>
			<div className="flex-1 flex justify-center">
				<FAQ />
			</div>
		</div>
	);
}

export default FAQPage;
