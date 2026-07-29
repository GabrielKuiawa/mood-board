import { AppDataSource } from "../../src/data-source";

export async function initializeTestDatabase(): Promise<void> {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  await AppDataSource.runMigrations();
}

export async function clearTestDatabase(): Promise<void> {
  if (!AppDataSource.isInitialized) {
    throw new Error("The test database must be initialized before cleanup.");
  }

  await AppDataSource.query("SET FOREIGN_KEY_CHECKS = 0");

  try {
    await AppDataSource.query("DELETE FROM `user_liked_pins_pin`");
    await AppDataSource.query("DELETE FROM `folder_pins_pin`");
    await AppDataSource.query("DELETE FROM `pin`");
    await AppDataSource.query("DELETE FROM `folder`");
    await AppDataSource.query("DELETE FROM `user`");
  } finally {
    await AppDataSource.query("SET FOREIGN_KEY_CHECKS = 1");
  }
}

export async function closeTestDatabase(): Promise<void> {
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }
}
