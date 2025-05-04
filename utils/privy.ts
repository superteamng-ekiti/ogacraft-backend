import { PrivyClient } from "@privy-io/server-auth";
import { PRIVY_APP_ID, PRIVY_APP_SECRET } from "./environment.ts";

console.log({ PRIVY_APP_ID, PRIVY_APP_SECRET });
const privy = new PrivyClient(PRIVY_APP_ID!, PRIVY_APP_SECRET!);

export { privy };
