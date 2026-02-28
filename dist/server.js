import app from "./src/app.js";
import { prisma } from "./src/lib/prisma.js";
const port = process.env.PORT || 5000;
async function run() {
    try {
        await prisma.$connect();
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    }
    catch (error) {
        console.error("Failed to connect to the database:", error);
        await prisma.$disconnect();
        process.exit(1);
    }
}
run();
//# sourceMappingURL=server.js.map