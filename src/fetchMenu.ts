import dateFormat from "dateformat";

async function fetchMenu(): Promise<string>;
async function fetchMenu(date: Date): Promise<string>;
async function fetchMenu(dateParam?: Date) {
	let date = dateParam || Date.now();
	let menuData = await fetch(import.meta.env.VITE_API_URL + dateFormat(date, "dd.mm.yyyy")/*, { mode: "no-cors" }*/);
	return await menuData.text();
};

export default fetchMenu;
