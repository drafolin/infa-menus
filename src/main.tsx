import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Index from "./index";
import Error from "./error";
import "./style.scss";
import Root from "./root";

const router = createBrowserRouter([
	{
		path: "/",
		element: <Root />,
		children: [
			{
				path: "/",
				element: <Index />,
				errorElement: <Error />,
			},
			{
				path: "/:date",
				element: <Index />,
				errorElement: <Error />,
			}
		]
	}
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>
);
