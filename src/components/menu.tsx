import { useEffect, useState } from "react";
import fetchMenu from "../fetchMenu";

export const Menu = (props: { date: Date; }): JSX.Element => {
	const title = props.date === undefined || (
		props.date?.getFullYear() === new Date(Date.now()).getFullYear() &&
		props.date?.getMonth() === new Date(Date.now()).getMonth() &&
		props.date?.getDate() === new Date(Date.now()).getDate()) ?
		"Au menu du jour:" :
		`Plat du ${props.date.getDate()}/${props.date.getMonth() + 1}/${props.date.getFullYear()}`;



	const [menu, setMenu] = useState([] as String[]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	const getMenu = async (force?: boolean) => {
		let res;
		try {
			res = await fetchMenu(props.date, force);
		} catch (e: any) {
			setError(e);
			return;
		}

		setMenu(res);
	};

	useEffect(() => {
		setLoading(true);
		getMenu();
		setLoading(false);
	}, [props.date]);

	if (loading)
		return <h1>Chargement en cours...</h1>;

	if (error)
		return <>
			<h1>Erreur lors du chargement du menu</h1>
			<p>{error.toString()}</p>
			<button onClick={() => getMenu(true)}>Réessayer</button>
		</>;

	if (menu.length === 0)
		return <h1>Menu non disponible</h1>;

	return <>
		<h1>{title}</h1>
		<div className="flex-horizontal">
			<div>
				<h2>Menu fourchette verte</h2>
				{
					(() => {
						try {
							let result = menu[0]?.split("\n\n");
							let returnVal = result.map((v, k) => {
								return <p key={k}>{v}</p>;
							});
							return returnVal;
						} catch (e: any) {
							console.log(e);
						}
					})()
				}
			</div>
			<hr />
			<div>
				<h2>Menu Hit</h2>
				{
					(() => {
						try {
							let result = menu[1]?.split("\n\n");
							if (!result) {
								return <></>;
							}
							let returnVal = result.map((v, k) => {
								return <p key={k}>{v}</p>;
							});
							return returnVal;
						} catch (e: any) {
							console.log(e);
						}
					})()
				}
			</div>
		</div>
		<button onClick={() => getMenu(true)}></button>
	</>;
};

export default Menu;
