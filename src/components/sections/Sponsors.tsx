import Divider from "../Divider";
import Image from "next/image";

import NAISS_placeholder_img from '../../../assets/sponsors/naiss_placeholder.svg'
import NAISS_placeholder_img2 from '../../../assets/sponsors/naiss_placeholder.svg'


const sponsors = [
	{
	  id: 1,
	  name: 'NAISS',
	  image: NAISS_placeholder_img,
	  website: 'https://nittanyai.psu.edu/',
	},
	{
	  id: 2,
	  name: 'NAISS2',
	  image: NAISS_placeholder_img2,
	  website: 'https://nittanyai.psu.edu/',
	},
];

const Sponsors = () => {
	return (
		<section className="flex flex-col items-center w-full gap-8">
			<div className="w-4/12 flex flex-col items-center">
				<h1 className="font-bold text-6xl">Sponsors</h1>
				<Divider />
				<div className="flex gap-8">
					{sponsors.map((sponsor) => (
						<a key={sponsor.id} href={sponsor.website} target="_blank" rel="noopener noreferrer" className="w-100 h-50">
							<Image src={sponsor.image} alt={sponsor.name} width={200} height={100} objectFit="contain" />
						</a>
					))}
				</div>
			</div>
		</section>
	);
};

export default Sponsors;
