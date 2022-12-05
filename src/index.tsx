import React, { useState, Suspense, lazy, useEffect } from "react";
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

	class ErrorBoundary extends React.Component<{ children: JSX.Element, date: Date; }, { hasError: boolean, isNotAvailable: boolean; }> {
		constructor(props: { children: JSX.Element, date: Date; }) {
			super(props);
			this.state = { hasError: false, isNotAvailable: false };
		}

		handleDateChange = () => {
			this.setState({ hasError: false, isNotAvailable: false });
		};

		static getDerivedStateFromError(error: any) {
			// Update state so the next render will show the fallback UI.
			if (error.toString().includes("TypeError: Cannot read properties of undefined (reading 'Semaine1')")) {
				return { isNotAvailable: true, hasError: true };
			}
			return { hasError: true };
		}

		render() {
			if (this.state.hasError) {
				// You can render any custom fallback UI
				return (
					this.state.isNotAvailable ?
						<h1>Les menus pour le jour sélectionné ne sont pas encore disponibles!</h1>
						: <h1>Une erreur s'est produite!</h1>
				);
			}

			return this.props.children;
		}
	}

	return (
		<>
			<div className="menu">
				{
					weekend ?
						<h1>Les menus ne sont pas disponibles le week-end!</h1> :
						<ErrorBoundary date={date}>
							<Suspense fallback={<h1>Récupération des données... Veuillez patienter.</h1>}>
								<Menu
									date={date}
								/>
							</Suspense>
						</ErrorBoundary>
				}
			</div>
			<div className="center">
				<Calendar onChange={setDate} value={date} />
			</div>
		</>
	);
}
