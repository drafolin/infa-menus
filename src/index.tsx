import { useEffect, useState } from "react";
import fetchMenu from "./fetchMenu";
import Menu from './components/menu';
import { useParams } from "react-router-dom";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import darkVercel from "./assets/Vercel/logotype/dark/vercel-logotype-dark.svg";
import lightVercel from "./assets/Vercel/logotype/light/vercel-logotype-light.svg";
import { useMediaPredicate } from "react-media-hook";
import reactLogo from "./assets/reactjs_logo_icon.svg";

// Changes XML to JSON
function xmlToJson(xml: any) {

	// Create the return object
	var obj = {} as { [index: string]: any; };

	if (xml.nodeType == 1) { // element
		// do attributes
		if (xml.attributes.length > 0) {
			obj["@attributes"] = {};
			for (var j = 0; j < xml.attributes.length; j++) {
				var attribute = xml.attributes.item(j);
				obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
			}
		}
	} else if (xml.nodeType == 3) { // text
		obj = { root: xml.nodeValue } || { root: "" };
	}

	// do children
	if (xml.hasChildNodes()) {
		for (var i = 0; i < xml.childNodes.length; i++) {
			var item = xml.childNodes.item(i);
			var nodeName = item.nodeName;
			if (typeof (obj[nodeName]) == "undefined") {
				obj[nodeName] = xmlToJson(item);
			} else {
				if (typeof (obj[nodeName].push) == "undefined") {
					var old = obj[nodeName];
					obj[nodeName] = [];
					obj[nodeName].push(old);
				}
				obj[nodeName].push(xmlToJson(item));
			}
		}
	}
	return obj;
};

const translateDay = [
	"Dimanche",
	"Lundi",
	"Mardi",
	"Mercredi",
	"Jeudi",
	"Vendredi"
];


export default function Index() {
	let dateComponents = useParams().date?.split('-');
	if (useParams().date !== undefined && dateComponents?.length || 3 < 3) {
		window.location.href = window.location.host;
	}
	const [date, setDate] = useState<Date>(useParams().date ? new Date(parseInt((dateComponents || ["0", "0", "0"])[2]), parseInt((dateComponents || ["1", "1"])[1]) - 1, parseInt((dateComponents || ["0"])[0])) : new Date(Date.now()));
	const [loading, setLoading] = useState<boolean>(true);
	const [menu, setMenu] = useState<string[]>([]);
	const [weekend, setWeekend] = useState<boolean>(false);
	useEffect(() => {
		console.log(date?.getDay());
		if (
			date.getDay() === 6 ||
			date.getDay() === 0
		) {
			setWeekend(true);
			console.log(true);
			return;
		} else {
			setWeekend(false);
			console.log(false);
		}
		try {
			fetchMenu(date)
				.then((res) => {
					const parser = new DOMParser;
					let menuObject = xmlToJson(parser.parseFromString(res, "application/xml"));
					let menus = menuObject?.Semaines.Semaine1.Jours[
						translateDay[date.getDay()]
					].Menus || {};
					let result = [
						menus.Menu1.CorpsFr["#text"].root,
						menus.Menu2.CorpsFr["#text"].root
					];
					setMenu(result);
					setLoading(false);
				});
			setLoading(true);
		} catch (e: any) {
			alert(e);
		}
	}, [date]);
	return (
		<>
			<main>
				<Menu weekend={weekend} menu={menu} loading={loading} title={
					date === undefined || (
						date?.getFullYear() === new Date(Date.now()).getFullYear() &&
						date?.getMonth() === new Date(Date.now()).getMonth() &&
						date?.getDate() === new Date(Date.now()).getDate()) ?
						undefined :
						`Plat du ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
				} />
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
