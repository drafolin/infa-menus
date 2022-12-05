import { useState, Suspense, lazy } from "react";
import { useParams } from "react-router-dom";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
const Menu = lazy(() => import("./components/menu"));


export default function Index() {
	let dateComponents = useParams().date?.split('-');
	if (useParams().date !== undefined && (dateComponents?.length || 3) < 3) {
		window.location.href = window.location.host;
	}
	console.log("rerender");
	const [date, setDate] = useState<Date>(useParams().date ? new Date(parseInt((dateComponents || ["0", "0", "0"])[2]), parseInt((dateComponents || ["1", "1"])[1]) - 1, parseInt((dateComponents || ["0"])[0])) : new Date(Date.now()));
	const weekend = date.getDay() === 6 || date.getDay() === 0;
	return (
		<>
			<div className="menu">
				{
					weekend ?
						<h1>Les menus ne sont pas disponibles le week-end!</h1> :
						<Suspense fallback={<h1>Récupération des données... Veuillez patienter.</h1>}>
							<Menu
								date={date}
							/>
						</Suspense>
				}
			</div>
			<div className="center">
				<Calendar onChange={setDate} value={date} />
			</div>
		</>
	);
}
