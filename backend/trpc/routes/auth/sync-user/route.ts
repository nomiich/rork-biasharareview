import { z } from "zod";
import { publicProcedure } from "@/backend/trpc/create-context";

const syncUserInputSchema = z.object({
  uid: z.string(),
  displayName: z.string().optional(),
  email: z.string().email(),
  photoURL: z.string().optional(),
});

export default publicProcedure
  .input(syncUserInputSchema)
  .mutation(async ({ input }) => {
    const { uid } = input;

    console.log(`[SyncUser] Backend user sync called for: ${uid}`);
    console.log('[SyncUser] Backend sync is disabled - user creation handled by client');

    return {
      success: true,
      isNewUser: false,
      message: 'User sync acknowledged (client-side creation)',
    };
  });
