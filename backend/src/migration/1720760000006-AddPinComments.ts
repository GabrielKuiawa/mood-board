import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPinComments1720760000006 implements MigrationInterface {
  name = "AddPinComments1720760000006";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE \`comment\` (
        \`id\` varchar(36) NOT NULL,
        \`content\` varchar(500) NOT NULL,
        \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`userId\` varchar(36) NOT NULL,
        \`pinId\` varchar(36) NOT NULL,
        INDEX \`IDX_comment_user\` (\`userId\`),
        INDEX \`IDX_comment_pin\` (\`pinId\`),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB
    `);
    await queryRunner.query(`
      CREATE TABLE \`user_liked_comments_comment\` (
        \`userId\` varchar(36) NOT NULL,
        \`commentId\` varchar(36) NOT NULL,
        INDEX \`IDX_comment_like_user\` (\`userId\`),
        INDEX \`IDX_comment_like_comment\` (\`commentId\`),
        PRIMARY KEY (\`userId\`, \`commentId\`)
      ) ENGINE=InnoDB
    `);
    await queryRunner.query(
      "ALTER TABLE `comment` ADD CONSTRAINT `FK_comment_user` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE",
    );
    await queryRunner.query(
      "ALTER TABLE `comment` ADD CONSTRAINT `FK_comment_pin` FOREIGN KEY (`pinId`) REFERENCES `pin`(`id`) ON DELETE CASCADE ON UPDATE CASCADE",
    );
    await queryRunner.query(
      "ALTER TABLE `user_liked_comments_comment` ADD CONSTRAINT `FK_comment_like_user` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE",
    );
    await queryRunner.query(
      "ALTER TABLE `user_liked_comments_comment` ADD CONSTRAINT `FK_comment_like_comment` FOREIGN KEY (`commentId`) REFERENCES `comment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("DROP TABLE `user_liked_comments_comment`");
    await queryRunner.query("DROP TABLE `comment`");
  }
}
