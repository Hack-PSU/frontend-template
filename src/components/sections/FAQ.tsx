import Divider from "../Divider";
import CCollapsible from "../Collapsible";
import Link from "next/link";
import React from "react";
import faq from "./FAQ.json";

// Helper function to assist in parsing JSON data to render components as CCollapsibles
const renderInfoAsCCollapsible = (obj: any) => {
	function nextIsNotBreak(lst: Array<any>, currentIndex: number) {
		return lst.length > currentIndex +1 && lst[currentIndex + 1] !== '\n' && !(lst[currentIndex + 1].length >= 5 && lst[currentIndex + 1].substring(0,5) == '\\link');
	}
	
	let formattedContent: any = [];

	let content: Array<any> = obj.content.split(' ');
	for (var i = 0; i < content.length; i++) {
		// if newline - insert a break
		if (content[i] == '\n') { 
			formattedContent.push(<div><br></br></div>);
		}
		// if link - insert a link (format: \link[src,text])
		else if (content[i].length >= 5 && content[i].substring(0,5) == '\\link') { 
			let contentLinkInfo = content[i].substring(content[i].indexOf('[')+1, content[i].indexOf(']')).split(',');
			let linkInfo: any = { "src": contentLinkInfo[0], "text": contentLinkInfo[1] };
			
			formattedContent.push(<div className="m-0 p-0 inline-block">&nbsp;<Link className="text-blue-500 underline" href={linkInfo["src"]}>{linkInfo["text"]}</Link>&nbsp;</div>);
		}
		// if not newline or link - insert a div with the text
		else { 
			let element: string = content[i];
			while (nextIsNotBreak(content, i)) {
				element += ' ' + content[i+1];
				i++;
			}
			formattedContent.push(<div className="m-0 p-0 inline-block">{element}</div>);
		}
	
	}
	return <CCollapsible
			title = {obj.title}
			content = {<div>{formattedContent}</div>}
			/>;	
};


const FAQ = () => {

	return (
		<section className="flex flex-col items-center w-full gap-8">		
			<div className="w-4/12 flex flex-col items-center">
				<h1 className="font-bold text-6xl">FAQ</h1>
				<Divider />
			</div>

			<div className ="grid grid-cols-2 rows-2 w-1/2 gap-4"> 
				{faq.map((obj: any) => renderInfoAsCCollapsible(obj))} 
			</div>
		
		</section>
	);
};

export default FAQ;
