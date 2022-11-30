import { useEffect, useState } from "react";
import fetchMenu from "./fetchMenu";

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
	useEffect(() => {
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
		<>
			<h1>Au menu du jour:</h1>
			{
				loading ? <>Loading...</>
					: (
						<div className="flex-horizontal">
							<div>
								{
									(() => {
										let result = menu[0]?.split("\n");
										if (!result) {
											return <>Loading...</>;
										}
										let returnVal = result.map(v => {
											return <>{v}<br /></>;
										});
										console.dir(returnVal);
										return returnVal;
									})()
								}
							</div>
							<div>
								{
									(() => {
										let result = menu[1]?.split("\n");
										if (!result) {
											return <></>;
										}
										let returnVal = result.map(v => {
											return <>{v}<br /></>;
										});
										console.dir(returnVal);
										return returnVal;
									})()
								}
							</div>
						</div>
					)
			}
		</>
	);
}
