import { useEffect, useRef, useState } from "react";
import fetchMenu from "../fetchMenu";
import reactLogo from "../assets/reactjs_logo_icon.svg";
import refreshImage from "../assets/refresh.png";
import 'react-calendar/dist/Calendar.css';

export const Menu = (props: { date: Date; }): JSX.Element => {
    const title = "Menu du jour";


    const [menu, setMenu] = useState([] as String[]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [refreshAngle, setRefreshAngle] = useState(0);

    const getMenu = async (force?: boolean) => {
        let angle = refreshAngle;
        let spinId = setInterval(() => {
            angle = (angle - 10) % 360;
            setRefreshAngle(angle)
        }, 10)
        let res;
        try {
            res = await fetchMenu(props.date, force);
        } catch (e: any) {
            setError(e);
            return;
        }

        setMenu(res);
        clearInterval(spinId);
    };

    useEffect(() => {
        setLoading(true);
        getMenu().then(() => setLoading(false));
        getMenu(true);
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
        <div className="titleContent">
            <h1>{title}</h1>
            <div>{props.date.toLocaleDateString("fr", {
                weekday: 'long'
            })[0].toUpperCase() + props.date.toLocaleDateString("fr", {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            }).slice(1)}
            </div>
        </div>
        <div className="flex-horizontal">
            <div>
                <h2>Fourchette verte</h2>
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
            <div>
                <h2>Hit</h2>
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
        <button className="refresh" onClick={
            () => {
                getMenu(true)
            }
        }>
            <img
              src={refreshImage}
              alt="Refresh icon"
              height={"30px"}
              style = {{transform: `rotate(${refreshAngle}deg)`}}
            />
        </button>
    </>;
};

export default Menu;
