import "dotenv/config";
import { AppDataSource } from "../data-source";
import { SpacesStorageService } from "../service/SpacesStorageService";
import { logger } from "../utils/Logger";
import { seedDatabase } from "./seedDatabase";

function getSeedUserPassword(): string {
  const password = process.env.SEED_USER_PASSWORD?.trim();

  if (!password || password.length < 8) {
    throw new Error(
      "A variável SEED_USER_PASSWORD é obrigatória e deve ter pelo menos 8 caracteres.",
    );
  }

  return password;
}

async function runSeed(): Promise<void> {
  try {
    await AppDataSource.initialize();
    await AppDataSource.runMigrations();

    const result = await seedDatabase(AppDataSource, getSeedUserPassword(), {
      storage: new SpacesStorageService(),
    });

    logger.info("Database seed completed", result);
  } catch (error) {
    logger.error("Database seed failed", {
      errorName: error instanceof Error ? error.name : typeof error,
      errorMessage: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    process.exitCode = 1;
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
}

void runSeed();
