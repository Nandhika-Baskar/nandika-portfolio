import { hydrateRoot } from "react-dom/client";
import { HomePage } from "@/components/layout/HomePage";

hydrateRoot(document.getElementById("root")!, <HomePage />);
