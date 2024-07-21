import { getAll } from "@/lib/indexedDB";
import { notification } from "@/types/notification";
import { QueryFunctionContext } from "@tanstack/query-core";

export const fetchNotifications = async ({queryKey}: QueryFunctionContext): Promise<notification[]> => {
    const [_, type, filter]=queryKey;
    return await getAll(type == "critical"? "critical": "normal", typeof(filter) == "string"? filter: undefined);
  };
