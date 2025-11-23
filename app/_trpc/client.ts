/**
 * tRPC Client Setup
 * This file configures the tRPC client for use in React components
 */
import { createTRPCReact } from "@trpc/react-query";
import { type AppRouter } from "@/server/trpc/router";

/**
 * Type-safe tRPC React hooks
 * Use this in your components to call API endpoints
 * 
 * @example
 * const { data, isLoading } = trpc.post.getAll.useQuery();
 * const createPost = trpc.post.create.useMutation();
 */
export const trpc = createTRPCReact<AppRouter>();
