import { MigrationInterface, QueryRunner } from "typeorm"

export class AddConversionTrackingToJourneySettings1727057751380 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    `UPDATE journey
    SET "journeySettings" = jsonb_set(
      "journeySettings",
      '{conversionTracking}',
      '{"events": [],"enabled": true,"timeLimit":{"unit": "Days","value": 3}}')
    `
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
  }
}
