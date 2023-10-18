"use client";
import Box from '@mui/material/Box';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import parse from "html-react-parser";
import React, { useEffect } from 'react';

import { EventModel } from "@/interfaces";
import Divider from "../common/Divider";
import { GenericScheduleEntity, createGenericScheduleEntity } from './generic-schedule-entity';
import "./schedule.css";

// TOOD: Pull these as a distinguishable catgeory from the API so that we don't have to hardcode them.
const genericScheduleEventsSaturday = [
  createGenericScheduleEntity("Check-In", "11AM"),
  createGenericScheduleEntity("Opening Ceremonies", "12PM - 1PM"),
  createGenericScheduleEntity("Team Building", "1PM - 2PM"),
  createGenericScheduleEntity("Workshops", "1PM - 7PM"),
  createGenericScheduleEntity("Lunch", "1PM - 4PM"),
  createGenericScheduleEntity("Hacking Begins", "2PM"),
  createGenericScheduleEntity("Dinner", "7PM - 9PM"),
];

const genericScheduleEventsSunday = [
  createGenericScheduleEntity("Midnight Snack", "12AM - 1AM"),
  createGenericScheduleEntity("Elliott's Early Morning Yoga", "3AM - 3:30AM"),
  createGenericScheduleEntity("Brunch", "10AM - 12PM"),
  createGenericScheduleEntity("Hacking Ends", "1:45PM"),
  createGenericScheduleEntity("Judging Expo", "2PM - 3:30PM"),
  createGenericScheduleEntity("Closing Ceremonies", "4:30PM - 5:30PM"),
];

const entertainmentEvents = [
  createGenericScheduleEntity("Football: PSU vs. OSU", "12PM - 3:30PM"),
  createGenericScheduleEntity("Fun Mini-events", "4PM - 6PM"),
  createGenericScheduleEntity("Stand-up Comedy", "7:30PM"),
  createGenericScheduleEntity("Bob Ross MSPaint", "9:00PM"),
  createGenericScheduleEntity("Trivia", "10:00PM"),
  createGenericScheduleEntity("Geoguesser", "10:30PM"),
];

// TODO: Figure out to correctly style the indicator in plain CSS without having to do this CSS-in-JS weirdness.
const scheduleTabsTheme = createTheme({
  components: {
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: "black"
        },
      }
    },
  }
});

const Schedule = () => {
	const [events, setEvents] = React.useState<EventModel[]>([]);

	useEffect(() => {
		// Fetch the set of events from the API.
    const apiEndpoint = "https://api-v3-production-oz3dekgbpa-uk.a.run.app/events";
		fetch(apiEndpoint)
			.then((response) => {
				if (!response.ok) {
					throw new Error(`Network response was not ok: ${response.status}`);
				}
				return response.json();
			})
			.then((data) => {
				setEvents(data); 
			})
			.catch((error) => {
				console.error("Error fetching events:", error);
			});
	}, []);

	return (
		<section id="schedule" className="flex flex-col items-center w-full">
			<div className="w-4/12 flex flex-col items-center">
				<h1 className="font-bold text-6xl cornerstone-font">Schedule</h1>
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
          {children}
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
        <ThemeProvider theme={scheduleTabsTheme}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }} >
            <Tabs value={value} onChange={handleChange} aria-label="Schedule" centered>
              <Tab label="Overview" {...a11yProps(0)} className="schedule-tab" />
              <Tab label="Workshops" {...a11yProps(1)} className="schedule-tab" />
              <Tab label="Entertainment" {...a11yProps(2)} className="schedule-tab" />
            </Tabs>
          </Box>          
        </ThemeProvider>
        <CustomTabPanel value={value} index={0}>
          <div id="schedule" className="w-10/12 mx-auto">
            <div className="container-fluid generic-schedule-container p-10 mx-auto">
              <div className="text-white text-center text-bold underline md:text-4xl sm:text-2lg">SATURDAY</div>
              <div className="grid grid-cols-2 gap-y-3 text-white md:text-3xl sm:text-lg">
                {genericScheduleEventsSaturday.map((event, index) => (
                  <GenericScheduleComponent {...event} key={index} />
                ))}
              </div>
              <div className="text-white text-center text-bold underline md:text-4xl sm:text-2lg mt-10">SUNDAY</div>
              <div className="grid grid-cols-2 gap-y-3 text-white md:text-3xl sm:text-lg">
                {genericScheduleEventsSunday.map((event, index) => (
                  <GenericScheduleComponent {...event} key={index} />
                ))}
              </div>
            </div>
          </div>
        </CustomTabPanel> 
        <CustomTabPanel value={value} index={1}>
          <div id="workshop-container" className="container-fluid nopadding">
            <div className="col-xl-1"></div>
            <div className="container-fluid">
      			  {events
                .filter((event) => event.type === "workshop")
                .sort((eventA, eventB) => eventA.startTime - eventB.startTime)
                .map((workshop, index) => (
                  <WorkshopComponent{...workshop} key={index}/>
                ))
              }
            </div>
          </div>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          <div id="schedule" className="w-10/12 mx-auto">
            <div className="container-fluid generic-schedule-container p-10 mx-auto">
              <div className="text-white text-center text-bold underline md:text-4xl sm:text-2lg">SATURDAY</div>
              <div className="grid grid-cols-2 gap-y-3 text-white md:text-3xl sm:text-lg">
                {entertainmentEvents.map((event, index) => (
                  <GenericScheduleComponent {...event} key={index} />
                ))}
              </div>
            </div>
          </div>
        </CustomTabPanel>
      </Box>
    );
  }

  function GenericScheduleComponent(event: GenericScheduleEntity) {
    return (
      <>
        <div className="w-3/4">{event.title}</div>
        <div className="text-right">{event.timing}</div>
      </>
    );
  }

  function WorkshopComponent(workshop: EventModel) {
    return (
      <div className="workshop-card mx-auto my-3">
        <div className="inline">
          <p className="workshop-card-title inline">{workshop.name}</p>
          <p className="dateTime">
            October 21st
            <br/>
            {`${new Date(workshop.startTime).getHours() - 12}:00PM`} - {`${new Date(workshop.endTime).getHours() - 12}:00PM`}
          </p>
        </div>
        <p><b>Location:</b> {workshop.location.name}</p>
        <br/>
        {parse(workshop.description ?? "")}
        <br/>
        {/* Uncomment the below line for workshop relevant skills/tags support. */}
        {/* <div><p><b>Skills/Software:</b> {workshop.wsRelevantSkills}</p></div> */}
        <div className="mt-10"><b>Presenters:</b></div>
        <div>
          <div className="row">{workshop.wsPresenterNames}</div>
          {/* Uncomment below line for workshop image support */}
          {/* <div className="workshop-card-image tooltipped" data-position="bottom" id="presenter1"></div> */}
        </div>
      </div>
    );
  }
};

export default Schedule;
