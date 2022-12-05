import { useRouteError } from "react-router-dom";

const Error = () => {
	const error = useRouteError();
	return (
		<div>
			<h1>Une erreur s'est produite!</h1>
			<p>{`${error}`}</p>
		</div>
	);
};

export default Error;
