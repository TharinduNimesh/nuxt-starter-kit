import type { H3Event } from "h3";

import { createUploadthing } from "uploadthing/h3";
import type { FileRouter } from "uploadthing/h3";

const f = createUploadthing();

const auth = async (ev: H3Event) => {
  try {
    // Get refresh token from cookie
    const refreshToken = getCookie(ev, "refresh_token");
    if (!refreshToken) {
      throw new Error("No refresh token");
    }

    // Verify refresh token and get user data
    const payload = await verifyRefreshToken(refreshToken);
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user) throw new Error("User not found");
    return user;
  } catch (error) {
    return null;
  }
};

// FileRouter for your app, can contain multiple FileRoutes
export const uploadRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({
    image: {
      /**
       * For full list of options and defaults, see the File Route API reference
       * @see https://docs.uploadthing.com/file-routes#route-config
       */
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ event }) => {
      // This code runs on your server before upload
      const user = await auth(event);

      // If you throw, the user will not be able to upload
      if (!user) throw new Error("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);

      console.log("file url", file.url);
    }),
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;
