import { db } from "@/db/drizzle";
export const createContext = async () => {
  return {
    db,
  };
};
export type Context = Awaited<ReturnType<typeof createContext>>;
