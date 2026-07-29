import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPinLikes1720760000005 implements MigrationInterface {
  name = "AddPinLikes1720760000005";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE \`user_liked_pins_pin\` (
        \`userId\` varchar(36) NOT NULL,
        \`pinId\` varchar(36) NOT NULL,
        INDEX \`IDX_pin_like_user\` (\`userId\`),
        INDEX \`IDX_pin_like_pin\` (\`pinId\`),
        PRIMARY KEY (\`userId\`, \`pinId\`)
      ) ENGINE=InnoDB
    `);
    await queryRunner.query(
      "ALTER TABLE `user_liked_pins_pin` ADD CONSTRAINT `FK_pin_like_user` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE",
    );
    await queryRunner.query(
      "ALTER TABLE `user_liked_pins_pin` ADD CONSTRAINT `FK_pin_like_pin` FOREIGN KEY (`pinId`) REFERENCES `pin`(`id`) ON DELETE CASCADE ON UPDATE CASCADE",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `user_liked_pins_pin` DROP FOREIGN KEY `FK_pin_like_pin`",
    );
    await queryRunner.query(
      "ALTER TABLE `user_liked_pins_pin` DROP FOREIGN KEY `FK_pin_like_user`",
    );
    await queryRunner.query("DROP TABLE `user_liked_pins_pin`");
  }
}
