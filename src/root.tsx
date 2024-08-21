import darkVercel from "./assets/Vercel/logotype/dark/vercel-logotype-dark.svg";
import lightVercel from "./assets/Vercel/logotype/light/vercel-logotype-light.svg";
import { useMediaPredicate } from "react-media-hook";
import reactLogo from "./assets/reactjs_logo_icon.svg";
import { Outlet } from "react-router-dom";

const Root = () => {
	return (
		<>
			<main>
				<Outlet />
			</main>

			<footer>
				<p>Merci à <a href="https://github.com/Tobias-Glauser">Tobias Glauser</a> pour la récupération du lien de l'api</p>
				<p>&copy; <a href="https://dindin.ch">Odin Beuchat</a> 2022-2022</p>
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
};

export default Root;
