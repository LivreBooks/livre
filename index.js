import "expo-dev-client";
import "expo-router/entry";

import * as Sentry from "sentry-expo";

Sentry.init({
    dsn: "https://a618675a21c40982b73484129bb15fa5@o4505693037395968.ingest.sentry.io/4505693040410624",
    enableInExpoDevelopment: true,
});
