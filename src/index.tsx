import { useEffect, useState } from "react";
import fetchMenu from "./fetchMenu";
import Menu from './components/menu';

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
	const [loading, setLoading] = useState<boolean>(true);
	const [menu, setMenu] = useState<string[]>([]);
	const [weekend, setWeekend] = useState<boolean>(false);
	useEffect(() => {
		if (
			new Date(Date.now()).getDay() === 6 ||
			new Date(Date.now()).getDay() === 1
		) {
			setWeekend(true);
			return;
		}
		try {
			fetchMenu()
				.then((res) => {
					const parser = new DOMParser;
					let menuObject = xmlToJson(parser.parseFromString(res, "application/xml"));
					let menus = menuObject?.Semaines.Semaine1.Jours[
						translateDay[new Date(Date.now()).getDay()]
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
	}, []);
	return (
		<Menu weekend={weekend} menu={menu} loading={loading} />
	);
}
