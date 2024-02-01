import { type EventHandler, type EventHandlerRequest, H3Event } from "h3";
import { jwtVerify, createRemoteJWKSet } from "jose";
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
  };

export const defineAuthEventHandler = <T extends EventHandlerRequest, D> (
  handler: (event: H3Event, user: FullProfile) => Promise<D> | D
): EventHandler<T, D> =>
    defineEventHandler<T>(async (event) => {
      const JWKS = createRemoteJWKSet(new URL("https://api.line.me/oauth2/v2.1/certs"));

      try {
        // get header  authorization
        const idToken = getRequestHeaders(event).authorization;

        if (!idToken) {
          setResponseStatus(event, 401);
          return {
            status: "error",
            message: "No token"
          };
        }

        try {
          const { payload: verifyResponse } = await jwtVerify(idToken, JWKS, {
            algorithms: ["ES256"]
          }) as unknown as { payload: LineVerifyResponse };

          const userData = await getProfileData(event, verifyResponse.sub);
          const user = setUser(userData, verifyResponse);

          return handler(event, user);
        } catch (err) {
          console.error(err);
          setResponseStatus(event, 401);
          return {
            status: "error",
            message: "Invalid token"
          };
        }
      } catch (err) {
        setResponseStatus(event, 500);
        throw err;
      }
    });

async function getProfileData (event: H3Event, userId: string) {
  const { data: userData, error: userError } = await serverSupabaseServiceRole<Database>(event).from("user")
    .select(`
            id,
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

function setUser (userData: {
    id: string;
    event_speaker: {
        event_id: string;
    }[];
    booth_staff: {
        booth_id: string;
    }[];
} | null, data: LineVerifyResponse
): FullProfile {
  return {
    userId: data.sub,
    uuid: userData?.id ?? "",
    displayName: data.name,
    pictureUrl: data.picture,
    email: data.email ?? "",
    type: {
      staff: userData?.booth_staff ? userData?.booth_staff.length > 0 : false,
      speaker: userData?.event_speaker ? userData?.event_speaker.length > 0 : false
    }
  };
}
