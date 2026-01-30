// import { Webhook } from "svix";
// import { headers } from "next/headers";
// import { WebhookEvent } from "@clerk/nextjs/server";
// import { users } from "@/db/schema";
// import { db } from "@/db";
// import { eq } from "drizzle-orm";

// export async function POST(req: Request) {
//   const SIGNING_SECRET = process.env.CLERK_SIGNING_SECRET;

//   if (!SIGNING_SECRET) {
//     throw new Error(
//       "Error: Please add CLERK_SIGNING_SECRET from Clerk Dashboard to .env or .env.local",
//     );
//   }

//   // Create new Svix instance with secret
//   const wh = new Webhook(SIGNING_SECRET);

//   // Get headers
//   const headerPayload = await headers();
//   const svix_id = headerPayload.get("svix-id");
//   const svix_timestamp = headerPayload.get("svix-timestamp");
//   const svix_signature = headerPayload.get("svix-signature");

//   if (!svix_id || !svix_timestamp || !svix_signature) {
//     return new Response("Error: Missing Svix headers", {
//       status: 400,
//     });
//   }

//   const payload = await req.json();
//   const body = JSON.stringify(payload);

//   let evt: WebhookEvent;

//   try {
//     evt = wh.verify(body, {
//       "svix-id": svix_id,
//       "svix-timestamp": svix_timestamp,
//       "svix-signature": svix_signature,
//     }) as WebhookEvent;
//   } catch (err) {
//     console.error("Error: Could not verify webhook:", err);
//     return new Response("Error: Verification error", {
//       status: 400,
//     });
//   }

//   const eventType = evt.type;

//   if (eventType === "user.created") {
//     const { data } = evt;
//     await db.insert(users).values({
//       clerkId: data.id,
//       name: `${data.first_name} ${data.last_name}`,
//       imageUrl: data.image_url,
//     });
//   }

//   if (eventType === "user.deleted") {
//     const { data } = evt;

//     if (!data.id) {
//       return new Response("Missing user id", { status: 400 });
//     }

//     await db.delete(users).where(eq(users.clerkId, data.id));
//   }
//   if (eventType === "user.updated") {
//     const { data } = evt;
//     await db
//       .update(users)
//       .set({
//         name: `${data.first_name} ${data.last_name}`,
//         imageUrl: data.image_url,
//       })
//       .where(eq(users.clerkId, data.id));

//   }

//   return new Response("Webhook received", { status: 200 });
// }

import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { users } from "@/db/schema";
import { db } from "@/db";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  console.log("🔔 Webhook received!");

  const SIGNING_SECRET = process.env.CLERK_SIGNING_SECRET;

  if (!SIGNING_SECRET) {
    console.error("❌ Missing CLERK_SIGNING_SECRET");
    throw new Error(
      "Error: Please add CLERK_SIGNING_SECRET from Clerk Dashboard to .env or .env.local",
    );
  }

  // Create new Svix instance with secret
  const wh = new Webhook(SIGNING_SECRET);

  // Get headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  console.log("📋 Headers:", { svix_id, svix_timestamp, svix_signature });

  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error("❌ Missing Svix headers");
    return new Response("Error: Missing Svix headers", {
      status: 400,
    });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
    console.log("✅ Webhook verified successfully");
  } catch (err) {
    console.error("❌ Webhook verification failed:", err);
    return new Response("Error: Verification error", {
      status: 400,
    });
  }

  const eventType = evt.type;
  console.log("📌 Event type:", eventType);
  console.log("👤 Event data:", JSON.stringify(evt.data, null, 2));

  try {
    if (eventType === "user.created") {
      const { data } = evt;
      console.log("➕ Creating user:", data.id);

      const userName =
        `${data.first_name || ""} ${data.last_name || ""}`.trim() ||
        data.email_addresses?.[0]?.email_address ||
        "User";

      await db.insert(users).values({
        clerkId: data.id,
        name: userName,
        imageUrl: data.image_url,
      });

      console.log("✅ User created successfully");
    }

    if (eventType === "user.deleted") {
      const { data } = evt;
      console.log("🗑️ Deleting user:", data.id);

      if (!data.id) {
        console.error("❌ Missing user id for deletion");
        return new Response("Missing user id", { status: 400 });
      }

      await db.delete(users).where(eq(users.clerkId, data.id));
      console.log("✅ User deleted successfully");
    }

    if (eventType === "user.updated") {
      const { data } = evt;
      console.log("✏️ Updating user:", data.id);

      const userName =
        `${data.first_name || ""} ${data.last_name || ""}`.trim() ||
        data.email_addresses?.[0]?.email_address ||
        "User";

      await db
        .update(users)
        .set({
          name: userName,
          imageUrl: data.image_url,
        })
        .where(eq(users.clerkId, data.id));

      console.log("✅ User updated successfully");
    }
  } catch (error) {
    console.error("❌ Database operation failed:", error);
    return new Response("Database error", { status: 500 });
  }

  console.log("✅ Webhook processed successfully");
  return new Response("Webhook received", { status: 200 });
}
