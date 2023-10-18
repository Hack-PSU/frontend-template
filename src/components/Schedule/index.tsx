"use client";
import Divider from "../common/Divider";
import React, { useEffect } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { EventModel } from "@/interfaces";
import parse from "html-react-parser";
import { createTheme, ThemeProvider } from "@mui/material/styles";

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
	const [Workshops, setWorkshops] = React.useState<EventModel[]>([]);

	useEffect(() => { //gives us set of workshops
		const apiEndpoint =
			"https://api-v3-production-oz3dekgbpa-uk.a.run.app/events";

		fetch(apiEndpoint)
			.then((response) => {
				if (!response.ok) {
					throw new Error(`Network response was not ok: ${response.status}`);
				}
				return response.json();
			})
			.then((data) => {
				setWorkshops(data); 
			})
			.catch((error) => {
				console.error("Error fetching workshops:", error);
			});
	}, []);

	return (
		<section id="schedule" className="flex flex-col items-center w-full">
			<div className="w-4/12 flex flex-col items-center">
				<h1 className="font-bold text-6xl cornerstone-font">Schedule</h1>
				<Divider />	
			</div>
      <span className="h-px"></span>
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
              <div className="grid grid-cols-2 gap-y-3 text-white md:text-3xl sm:text-lg">
                <div className="w-3/4">Opening Ceremonies</div>
                <div className="text-right">12:00PM</div>

                <div className="w-3/4">Lunch</div>
                <div className="text-right">1:30 - 4:00PM</div>
                
                <div className="w-3/4">Hacking Starts</div>
                <div className="text-right">2:00PM</div>
                
                <div className="w-3/4">Workshops</div>
                <div className="text-right">2:00 - 7:00PM</div>
                
                <div className="w-3/4">Internship Panel</div>
                <div className="text-right">5:00 - 6:00PM</div>
                
                <div className="w-3/4">Dinner</div>
                <div className="text-right">7:00 - 9:00PM</div>
                
                <div className="w-3/4">Entertainment Events</div>
                <div className="text-right">All Day</div>
                
                <div className="w-3/4">Midnight Snack</div>
                <div className="text-right">12:00 - 1:00AM</div>
                
                <div className="w-3/4">Entertainment Events</div>
                <div className="text-right">6:00AM - 2:00PM</div>
                
                <div className="w-3/4">Workshops</div>
                <div className="text-right">9:00AM - 2:00PM</div>
                
                <div className="w-3/4">Brunch</div>
                <div className="text-right">10:00AM - 12:00PM</div>
                
                <div className="w-3/4">Judging Expo</div>
                <div className="text-right">2:00PM</div>
                
                <div className="w-3/4">Post-judging Snack</div>
                <div className="text-right">3:00PM</div>
                
                <div className="w-3/4">Closing Ceremonies</div>
                <div className="text-right">4:00PM</div>
              </div>
            </div>
          </div>
        </CustomTabPanel> 
        <CustomTabPanel value={value} index={1}>
          <div id="workshop-container" className="container-fluid nopadding">
            <div className="col-xl-1"></div>
            <div className="container-fluid">
			  {Workshops.filter((workshop) => workshop.type === "workshop").sort((workshopA, workshopB) => workshopA.startTime - workshopB.startTime).map((workshop) => <WorkshopComponent{...workshop}/>)}
            </div>
          </div>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          <div id="schedule" className="w-10/12 mx-auto">
            <div className="container-fluid w-full bg-black rounded-lg p-10 shadow-lg text-white text-3xl">
              <div className="-mx-6 grid grid-cols-2 gap-y-0.5">
                <div>Opening Ceremony</div>
                <div className="text-right">12:00PM</div>

                <div>Lunch</div>
                <div className="text-right">1:30 - 4:00 PM</div>
                
                <div>Hacking Starts</div>
                <div className="text-right">2:00PM</div>
                
                <div>Workshops</div>
                <div className="text-right">2:00 - 7:00PM</div>
                
                <div>Internship Panel</div>
                <div className="text-right">5:00 - 6:00PM</div>
                
                <div>Dinner</div>
                <div className="text-right">7:00 - 9:00PM</div>
                
                <div>Entertainment Events</div>
                <div className="text-right">All Day</div>
                
                <div>Midnight Snack</div>
                <div className="text-right">12:00 - 1:00AM</div>
                
                <div>Entertainment Events</div>
                <div className="text-right">6:00AM - 2:00PM</div>
                
                <div>Workshops</div>
                <div className="text-right">9:00AM - 2:00PM</div>
                
                <div>Brunch</div>
                <div className="text-right">10:00AM - 12:00PM</div>
                
                <div>Hacking Ends / Judging Expo</div>
                <div className="text-right">2:00PM</div>
                
                <div>Post-judging Snack</div>
                <div className="text-right">3:00PM</div>
                
                <div>Closing Ceremony</div>
                <div className="text-right">4:00PM</div>
              </div>
            </div>
          </div>
        </CustomTabPanel>
      </Box>
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

        <div id="module">
          <p><b>Location:</b> {workshop.location.name}</p>
		  <br/>
          {parse(workshop.description ?? "")}
          <br/>
          <div><p><b>Skills/Software:</b> {workshop.wsRelevantSkills}</p></div>
          <div className="mt-10"><b>Presenters:</b></div>
          <div>
            <div className="row">{workshop.wsPresenterNames}</div>
			{/* Uncomment below line for workshop image support */}
            {/* <div className="workshop-card-image tooltipped" data-position="bottom" id="presenter1"></div> */}
          </div>
        </div>
      </div>
    );
  }
};

export default Schedule;
