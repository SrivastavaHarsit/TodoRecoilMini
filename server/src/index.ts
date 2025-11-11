// server/src/index.ts

import app from "./app";
import { env } from "./env";

app.listen(env.PORT, () => {
  console.log(`✅ Server running on http://localhost:${env.PORT}`);
});
