import { renderToString } from "react-dom/server";
import { HomePage } from "@/components/layout/HomePage";

export const render = () => renderToString(<HomePage />);
