import dateFormat from "dateformat";

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
    let displayDate = new Date(fetchDate)

    while (fetchDate.getDay() !== 1) {
        fetchDate.setDate(fetchDate.getDate() - 1);
    }

    let key = fetchDate.toDateString().split(" ").join("-");
    let menu: apiData|null;
    if (!localStorage.hasOwnProperty(key) || force) {
        menu = await fetchAPI(fetchDate);
        if (menu) {
            localStorage.setItem(key, JSON.stringify(menu));
        }
    } else {
        menu = JSON.parse(localStorage.getItem(key) || "");
    }

    let menus = menu?.days[translateDay[displayDate.getDay()]].menus;

    if (!menus) {
        throw new Error("Menu non disponible");
    }

    return [
        menus[0].body,
        menus[1].body
    ];

}

type apiData = {
    days: Record<string, {
        menus: {
            title: string,
            body: string
        }[]
    }>
}

async function fetchAPI(dateParam?: Date | undefined): Promise<apiData | null> {
    let date = dateParam || new Date(Date.now());
    const weekend = date.getDay() === 6 || date.getDay() === 0;

    const res = await fetch(import.meta.env.VITE_API_URL + dateFormat(date, "dd.mm.yyyy"));
    if (weekend) {
        return null;
    }
    return await res.json();
}

export default fetchMenu;
