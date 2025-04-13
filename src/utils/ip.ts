import { headers } from "next/headers";

export async function getUserIp() {
  const hearderList = await headers();

  const ip =
    hearderList.get("x-forwarded-for") ||
    hearderList.get("x-real-ip") ||
    "anonymous";

  return ip;
}
