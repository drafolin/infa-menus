import dateFormat from "dateformat";

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
		obj = xml.nodeValue ? { root: xml.nodeValue } : { root: "" };
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

async function fetchMenu(date?: Date, force?: boolean): Promise<String[]> {
	let fetchDate = new Date(date || new Date(Date.now()));
	while (fetchDate.getDay() !== 1) {
		fetchDate.setDate(fetchDate.getDate() - 1);
	}
	let key = fetchDate.toDateString().split(" ").join("-");
	let menu;
	if (!localStorage.hasOwnProperty(key) || force) {
		menu = await fetchAPI(fetchDate);
		if (menu && menu?.Semaines !== undefined) {
			localStorage.setItem(key, JSON.stringify(menu));
		}
	} else {
		menu = JSON.parse(localStorage.getItem(key) || "");
		if (menu.Semaines === undefined) {
			localStorage.removeItem(key);
		}
	}

	if (menu?.Semaines === undefined) {
		return [];
	}

	let menus = menu?.Semaines.Semaine1.Jours[translateDay[(date || new Date(Date.now())).getDay()]].Menus || {};

	return [
		menus.Menu1.CorpsFr["#text"].root as String,
		menus.Menu2.CorpsFr["#text"].root as String
	];

}

function fetchAPI(): Promise<{ [index: string]: any; }>;
function fetchAPI(date: Date | undefined): Promise<{ [index: string]: any; }>;
function fetchAPI(dateParam?: Date | undefined) {

	let date = dateParam || new Date(Date.now());
	const weekend = date.getDay() === 6 || date.getDay() === 0;

	return fetch(import.meta.env.VITE_API_URL + dateFormat(date, "dd.mm.yyyy"))
		.then(async (res) => {
			if (weekend) {
				return [] as String[];
			}

			const txt = await res.text();
			let path = res.url.split("/");
			let dateStr = path[path.length - 1];
			let americanDate = dateStr.split(".")[1] + "/" +
				dateStr.split(".")[0] + "/" +
				dateStr.split(".")[2];
			let date = new Date(americanDate);

			const parser = new DOMParser;
			return xmlToJson(parser.parseFromString(txt, "application/xml"));
		});
};

export default fetchMenu;
