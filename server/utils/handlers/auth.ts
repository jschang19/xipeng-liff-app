import { type EventHandler, type EventHandlerRequest, H3Event } from "h3";
import { serverSupabaseServiceRole } from "#supabase/server";
import type { Profile } from "~/types";
import type { Database } from "~/types/database";

interface FullProfile extends Profile {
        uuid: string;
      }

  interface LineVerifyResponse {
        sub: string;
        name: string;
        picture: string;
        email: string;
        error?: string;
      };

export const defineAuthEventHandler = <T extends EventHandlerRequest, D> (
  handler: (event: H3Event, user: FullProfile) => Promise<D>
): EventHandler<T, D> =>
    defineEventHandler<T>(async (event) => {
      try {
        // get header  authorization
        const idToken = getRequestHeaders(event).authorization;
        const config = useRuntimeConfig();
        const cachedResponse = await useStorage<LineVerifyResponse>("redis").getItem(`auth:${idToken}`);

        if (cachedResponse) {
          const userData = await getProfileData(event, cachedResponse.sub);

          const user: FullProfile = {
            userId: cachedResponse.sub,
            uuid: userData.id,
            displayName: userData?.display_name ?? cachedResponse.name,
            pictureUrl: userData?.picture_url ?? cachedResponse.picture,
            email: userData?.email ?? cachedResponse.email,
            access: userData?.access ?? "user",
            type: {
              staff: userData?.booth_staff.length > 0,
              speaker: userData?.event_speaker.length > 0
            }
          };

          return handler(event, user);
        }

        // If not cached, verify token

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
        await useStorage<LineVerifyResponse>("redis").setItem(`auth:${idToken}`, data, { ttl: 60 * 10 });

        // check if error is in the response
        if (data.error) {
          // console.error("error", data.error);

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

        const userData = await getProfileData(event, data.sub);

        const user: FullProfile = {
          userId: data.sub,
          uuid: userData.id,
          displayName: userData?.display_name ?? data.name,
          pictureUrl: userData?.picture_url ?? data.picture,
          email: userData?.email ?? data.email,
          access: userData?.access ?? "user",
          type: {
            staff: userData?.booth_staff.length > 0,
            speaker: userData?.event_speaker.length > 0
          }
        };

        return handler(event, user);
      } catch (err) {
        setResponseStatus(event, 500);
        console.error("error", err);
        throw err;
      }
    });

async function getProfileData (event: H3Event, userId: string): Promise<{
  id: string;
  line_id: string;
  display_name: string;
  picture_url: string;
  email: string;
  access: "user" | "admin";
  event_speaker: {
    event_id: number;
  }[];
  booth_staff: {
    booth_id: number;
  }[];
}> {
  const { data: userData, error: userError } = await serverSupabaseServiceRole<Database>(event).from("user")
    .select(`
            *,
            event_speaker(
              event_id
            ),
            booth_staff(
              booth_id
            )
            `)
    .eq("line_id", userId).maybeSingle();

  if (userError) {
    throw userError;
  }

  return userData;
}
