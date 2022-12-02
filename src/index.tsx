import { useState, Suspense, lazy } from "react";
import { useParams } from "react-router-dom";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import darkVercel from "./assets/Vercel/logotype/dark/vercel-logotype-dark.svg";
import lightVercel from "./assets/Vercel/logotype/light/vercel-logotype-light.svg";
import { useMediaPredicate } from "react-media-hook";
import reactLogo from "./assets/reactjs_logo_icon.svg";
const Menu = lazy(() => import("./components/menu"));


export default function Index() {
	let dateComponents = useParams().date?.split('-');
	if (useParams().date !== undefined && dateComponents?.length || 3 < 3) {
		window.location.href = window.location.host;
	}
	console.log("rerender");
	const [date, setDate] = useState<Date>(useParams().date ? new Date(parseInt((dateComponents || ["0", "0", "0"])[2]), parseInt((dateComponents || ["1", "1"])[1]) - 1, parseInt((dateComponents || ["0"])[0])) : new Date(Date.now()));
	return (
		<>
			<main>
				<Suspense fallback={<h1>Récupération des données... Veuillez patienter.</h1>}>
					<Menu
						date={date}
					/>
				</Suspense>
				<div className="center">
					<Calendar onChange={setDate} value={date} />
				</div>
			</main>

			<footer>
				<p>Merci à <a href="https://github.com/Tobias-Glauser">Tobias Glauser</a> pour la récupération du lien de l'api</p>
				<p>Hébergé chez
					<a href="https://vercel.com">
						<img
							src={
								useMediaPredicate("(prefers-color-scheme: dark)") ?
									lightVercel :
									darkVercel
							}
							alt="Vercel"
						/>
					</a>
					, construit avec
					<a href="https://reactjs.com">
						<img src={reactLogo} alt="React icon" height={"13px"} />
						React
					</a>.
				</p>
			</footer>
		</>
	);
}
