import fetchMenu from "../fetchMenu";

const Menu = (props: { weekend: boolean, title?: string, date: Date; }) => {
	const menu = fetchMenu(props.date);
	return (
		<div className={"menu"}>
			{
				props.weekend ?
					(
						<>
							<h1>Nous sommes le week-end!</h1>
						</>
					) :
					(
						<>
							{menu.data && (<>
								<h1>{props.title || "Au menu du jour:"}</h1>
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
