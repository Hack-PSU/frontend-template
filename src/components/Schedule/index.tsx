"use client";
import Divider from "../common/Divider";
import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { EventModel } from "@/interfaces";
import parse from "html-react-parser";

const testWorkshop: EventModel = {
	id: "asdfasdf",
	name: "Test Workshop Title",
	type: "workshop",
	startTime: 1697925600000,
	endTime: 1697929200000,
	description: "<p>This is a test event.</p>",
	locationId: 1,
	location: { id: 1, name: "Business Building 104" },
	wsPresenterNames: "Person 1, Person 2",
	wsSkillLevel: "beginner",
	wsRelevantSkills: "",
	wsUrls: [""],
	hackathonId: ""
};

const Schedule = () => {
	return (
		<section id="schedule" className="flex flex-col items-center w-full">
			<div className="w-4/12 flex flex-col items-center">
				<h1 className="font-bold text-6xl">Schedule</h1>
				<Divider />	
			</div>
			<BasicTabs />
		</section>
	);



	interface TabPanelProps {
	children?: React.ReactNode;
	index: number;
	value: number;
	}

	function CustomTabPanel(props: TabPanelProps) {
	const { children, value, index, ...other } = props;

	return (
		<div
		role="tabpanel"
		hidden={value !== index}
		id={`simple-tabpanel-${index}`}
		aria-labelledby={`simple-tab-${index}`}
		{...other}
		>
		{value === index && (
			<Box sx={{ p: 3 }}>
			<Typography>{children}</Typography>
			</Box>
		)}
		</div>
	);
	}

	function a11yProps(index: number) {
	return {
		id: `simple-tab-${index}`,
		'aria-controls': `simple-tabpanel-${index}`,
	};
	}

	function BasicTabs() {
	const [value, setValue] = React.useState(0);

	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		setValue(newValue);
	};

	return (
		<Box sx={{ width: '100%' }}>
		<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
			<Tabs value={value} onChange={handleChange} aria-label="Schedule" centered>
			<Tab label="Overview" {...a11yProps(0)} />
			<Tab label="Workshops" {...a11yProps(1)} />
			<Tab label="Entertainment" {...a11yProps(2)} />
			</Tabs>
		</Box>
		<CustomTabPanel value={value} index={0}>
		<div id="schedule" className="w-10/12 mx-auto">
			<div className="container-fluid w-full bg-black rounded-lg p-10 shadow-lg text-white text-3xl">
				<div className="-mx-6 grid grid-cols-2 gap-y-0.5">
					<div>
						Opening Ceremony
					</div>
					<div className="text-right">
						12:00PM
					</div>
					<div>
						Lunch
					</div>
					<div className="text-right">
						1:30 - 4:00 PM
					</div>
					<div>
						Hacking Starts
					</div>
					<div className="text-right">
						2:00PM
					</div>
					<div>
						Workshops
					</div>
					<div className="text-right">
						2:00 - 7:00PM
					</div>
					<div>
						Internship Panel
					</div>
					<div className="text-right">
						5:00 - 6:00PM
					</div>
					<div>
						Dinner
					</div>
					<div className="text-right">
						7:00 - 9:00PM
					</div>
					<div>
						Entertainment Events
					</div>
					<div className="text-right">
						All Day
					</div>
					<div>
						Midnight Snack
					</div>
					<div className="text-right">
						12:00 - 1:00AM
					</div>
					<div>
						Entertainment Events
					</div>
					<div className="text-right">
						6:00AM - 2:00PM
					</div>
					<div>
						Workshops
					</div>
					<div className="text-right">
						9:00AM - 2:00PM
					</div>
					<div>
						Brunch
					</div>
					<div className="text-right">
						10:00AM - 12:00PM
					</div>
					<div>
						Hacking Ends / Judging Expo
					</div>
					<div className="text-right">
						2:00PM
					</div>
					<div>
						Post-judging Snack
					</div>
					<div className="text-right">
						3:00PM
					</div>
					<div>
						Closing Ceremony
					</div>
					<div className="text-right">
						4:00PM
					</div>			
				</div>
			</div>
		</div>
		</CustomTabPanel> 
		<CustomTabPanel value={value} index={1}>
			<div id="workshop-container" className="container-fluid nopadding">
				<div className="row no padding">
				<div className="col-xl-1"></div>
				<div className="container-fluid">
					<div className="col-12">
						<WorkshopComponent {...testWorkshop}/>
					{/* <div *ngFor="let workshop of workshops">
						<div
						style="max-width: 800px; margin: auto">
						<app-live-workshop
							[title]="workshop.event_title"
							[description]="workshop.event_description"
							[date]="workshop.event_start_time"
							[endTime]="workshop.event_end_time"
							[location]="workshop.location_name"
							[skills]="
							workshop.ws_relevant_skills ? workshop.ws_relevant_skills.split(',') : []
							"
							[presenters]="
							workshop.ws_presenter_names ? workshop.ws_presenter_names.split(',') : []
							"
							[eventIcon]="workshop.event_icon ? workshop.event_icon.split(',') : []"
							[downloads]="workshop.ws_urls"
							collapseID="css/html"
						>
						</app-live-workshop>
						</div>*/}
					</div> 
					</div>
				</div>
			</div>			
		</CustomTabPanel>
		<CustomTabPanel value={value} index={2}>
		<div id="schedule" className="w-10/12 mx-auto">
			<div className="container-fluid w-full bg-black rounded-lg p-10 shadow-lg text-white text-3xl">
				<div className="-mx-6 grid grid-cols-2 gap-y-0.5">
					<div>
						Opening Ceremony
					</div>
					<div className="text-right">
						12:00PM
					</div>
					<div>
						Lunch
					</div>
					<div className="text-right">
						1:30 - 4:00 PM
					</div>
					<div>
						Hacking Starts
					</div>
					<div className="text-right">
						2:00PM
					</div>
					<div>
						Workshops
					</div>
					<div className="text-right">
						2:00 - 7:00PM
					</div>
					<div>
						Internship Panel
					</div>
					<div className="text-right">
						5:00 - 6:00PM
					</div>
					<div>
						Dinner
					</div>
					<div className="text-right">
						7:00 - 9:00PM
					</div>
					<div>
						Entertainment Events
					</div>
					<div className="text-right">
						All Day
					</div>
					<div>
						Midnight Snack
					</div>
					<div className="text-right">
						12:00 - 1:00AM
					</div>
					<div>
						Entertainment Events
					</div>
					<div className="text-right">
						6:00AM - 2:00PM
					</div>
					<div>
						Workshops
					</div>
					<div className="text-right">
						9:00AM - 2:00PM
					</div>
					<div>
						Brunch
					</div>
					<div className="text-right">
						10:00AM - 12:00PM
					</div>
					<div>
						Hacking Ends / Judging Expo
					</div>
					<div className="text-right">
						2:00PM
					</div>
					<div>
						Post-judging Snack
					</div>
					<div className="text-right">
						3:00PM
					</div>
					<div>
						Closing Ceremony
					</div>
					<div className="text-right">
						4:00PM
					</div>			
				</div>
			</div>
		</div>
		</CustomTabPanel>
		</Box>
	);
}

function WorkshopComponent(workshop: EventModel) {
	return (
	<div className="workshop-card" >
	<div className="inline">
		<p className="workshop-card-title inline">{ workshop.name }</p>
		<p className="dateTime">October 21st<br />{ `${new Date(workshop.startTime).getHours() - 12}:00PM` } - { `${new Date(workshop.endTime).getHours() - 12}:00PM` }</p>
	</div>

	<div id="module">
		<p><b>Location:</b> { workshop.location.name }</p>
		{/* <div *ngIf="isRichTextDescription(); else elseBlock">
		<b>Description:</b>
		<div [innerHTML]="description"></div>
		</div>
		<ng-template #elseBlock>
		<p><b>Description:</b> {{ description }}</p>
		</ng-template>
	</div> */}
		{parse(workshop.description ?? "")}
	<br />
	<div>
		<p><b>Skills/Software: </b> { workshop.wsRelevantSkills }</p>
	</div>
	<div className = "mt-10">
		<b>Presenters:</b>
	</div>
	<div>
		<div className="row">
		{/* <div *ngFor="let presenterName of presenters || []; index as i">
			{{ presenterName }}{{ i !== presenters.length - 1 ? ',&nbsp;' : '' }}
		</div> */} {workshop.wsPresenterNames}
		</div>
		<div
		className="workshop-card-image tooltipped"
		data-position="bottom"
		// [ngStyle]="{ background: 'url(' + eventIcon[0] + ')' }"
		id="presenter1"
		></div>
	</div>
	</div>
	</div>
	);
}
};
export default Schedule;
