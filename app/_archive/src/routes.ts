import Home from "entries/home";
import NotFound from "entries/notFound";

const routes = [
    { path: "/", exact: true, component: Home },
    { path: "", exact: false, component: NotFound }
];

export default routes;
