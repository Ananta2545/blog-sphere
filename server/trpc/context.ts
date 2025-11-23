import { db } from "@/db/drizzle";

/**
 * Creates the tRPC context for each request
 * This context is available in all tRPC procedures
 * 
 * @returns Context object with database connection
 */
export const createContext = async () => {
  return {
    db,
    // You can add more context here like:
    // - User session/auth
    // - Request headers
    // - IP address
    // - etc.
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;