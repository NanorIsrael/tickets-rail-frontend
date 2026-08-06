import "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { f as lazyRouteComponent, p as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
require_react();
require_jsx_runtime();
var $$splitComponentImporter = () => import("./routes-rdPidb-l.mjs");
var Route = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
//#endregion
export { Route as t };
