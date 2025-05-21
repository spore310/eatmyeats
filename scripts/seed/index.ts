import "dotenv/config"; //
import db from "@/utils/server/db/singleton";
import data from "./seed.json";

async function main() {
  try {
    console.log("clearing dev db....");

    const { count } = await db.user.deleteMany();
    console.log("db deleted ", count);
    const { count: newCount } = await db.user.createMany({ data });
    console.log("success new db count: ", newCount);

    await db.$disconnect();
    process.exit(0);
  } catch (e: unknown) {
    console.error("❌ Seed error:", e);
    await db.$disconnect();
    process.exit(1); // ❌ Fail
  }
}
main();
