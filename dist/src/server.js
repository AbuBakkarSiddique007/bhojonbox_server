import app from "./app";
import { envVars } from "./app/config/env.js";
import { seedAdmin } from "./app/utils/seedAdmin.js";
const bootstrap = async () => {
    try {
        await seedAdmin();
        app.listen(Number(envVars.PORT), () => {
            console.log(`Server is running on http://localhost:${envVars.PORT}`);
        });
    }
    catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};
bootstrap();
//# sourceMappingURL=server.js.map