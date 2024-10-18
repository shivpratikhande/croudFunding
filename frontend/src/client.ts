import { createThirdwebClient } from "thirdweb";

// Replace this with your client ID string
// refer to https://portal.thirdweb.com/typescript/v5/client on how to get a client ID
const clientId = "9bcf5d2f319d5a16711a992331b89f67"

export const client = createThirdwebClient({
  clientId: clientId,
});
