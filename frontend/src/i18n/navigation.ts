import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Links e navegação com prefixo de idioma automático. Usar estes em vez de
// next/link e next/navigation dentro das rotas localizadas.
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
