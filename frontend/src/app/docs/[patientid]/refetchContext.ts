import { QueryObserverResult, RefetchOptions } from "@tanstack/query-core";
import { createContext } from "react";

export const DocRefreshContext = createContext< ((options?: RefetchOptions) => Promise<QueryObserverResult<any, Error>>) |null >(null);