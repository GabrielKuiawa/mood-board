import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameImagesAndCategories1720760000004 implements MigrationInterface {
  name = "RenameImagesAndCategories1720760000004";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("RENAME TABLE `image` TO `pin`");
    await queryRunner.query("RENAME TABLE `category` TO `folder`");
    await queryRunner.query(
      "RENAME TABLE `image_categories_category` TO `folder_pins_pin`",
    );
    await queryRunner.query(
      "ALTER TABLE `folder_pins_pin` CHANGE `imageId` `pinId` varchar(36) NOT NULL",
    );
    await queryRunner.query(
      "ALTER TABLE `folder_pins_pin` CHANGE `categoryId` `folderId` varchar(36) NOT NULL",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `folder_pins_pin` CHANGE `folderId` `categoryId` varchar(36) NOT NULL",
    );
    await queryRunner.query(
      "ALTER TABLE `folder_pins_pin` CHANGE `pinId` `imageId` varchar(36) NOT NULL",
    );
    await queryRunner.query(
      "RENAME TABLE `folder_pins_pin` TO `image_categories_category`",
    );
    await queryRunner.query("RENAME TABLE `folder` TO `category`");
    await queryRunner.query("RENAME TABLE `pin` TO `image`");
  }
}
