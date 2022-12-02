import fetchMenu from "../fetchMenu";

const Menu = (props: { date: Date; }) => {
	const title = props.date === undefined || (
		props.date?.getFullYear() === new Date(Date.now()).getFullYear() &&
		props.date?.getMonth() === new Date(Date.now()).getMonth() &&
		props.date?.getDate() === new Date(Date.now()).getDate()) ?
		"Au menu du jour:" :
		`Plat du ${props.date.getDate()}/${props.date.getMonth() + 1}/${props.date.getFullYear()}`;

	const weekend = props.date.getDay() === 6 || props.date.getDay() === 0;

	const menu = weekend ? null as any : fetchMenu(props.date);
	return (
		<div className={"menu"}>
			{
				weekend ?
					(
						<>
							<h1>Nous sommes le week-end!</h1>
						</>
					) :
					(
						<>
							{menu.data && (<>
								<h1>{title}</h1>
								<div className="flex-horizontal">
									<div>
										<h2>Menu fourchette verte</h2>
										{
											(() => {
												try {
													let result = menu.data[0]?.split("\n\n");
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
													let result = menu.data[1]?.split("\n\n");
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
							</>)}
						</>
					)
			}
		</div>
	);
};

export default Menu;
