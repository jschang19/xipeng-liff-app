import { type EventHandler, type EventHandlerRequest, H3Event } from "h3";
import { serverSupabaseServiceRole } from "#supabase/server";
import type { Profile } from "~/types";
import type { Database } from "~/types/database";
export const defineAuthEventHandler = <T extends EventHandlerRequest, D> (
  handler: (event: H3Event, user: Profile) => Promise<D>
): EventHandler<T, D> =>
    defineEventHandler<T>(async (event) => {
      try {
        // get header  authorization
        const idToken = getRequestHeaders(event).authorization;
        const config = useRuntimeConfig();

        const response = await fetch("https://api.line.me/oauth2/v2.1/verify", {
          method: "POST",
          headers: {
            content_type: "application/x-www-form-urlencoded"
          },
          body: new URLSearchParams({
            id_token: idToken as string,
            client_id: config.CLIENT_ID
          }),
          cache: "no-cache"
        });

        const data = await response.json();

        // check if error is in the response
        if (data.error) {
          console.error("error", data.error);

          if (data.error === "invalid_request") {
            setResponseStatus(event, 401);
            return {
              status: "error",
              message: "Invalid token"
            };
          } else {
            setResponseStatus(event, 500);
            return {
              status: "error",
              message: data.error.error_description
            };
          }
        }

        const user: Profile = {
          userId: data.sub,
          displayName: data.name,
          pictureUrl: data.picture,
          email: data.email,
          access: "user"
        };
        return handler(event, user);
      } catch (err) {
        setResponseStatus(event, 500);
        console.error("error", err);
        throw err;
      }
    });
