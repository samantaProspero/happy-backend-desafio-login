import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class createUsers1609679744504 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.createTable(new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'integer',
            unsigned: true,
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'varchar'
          },
          {
            name: 'email',
            type: 'text'
          },
          {
            name: 'password',
            type: 'text'
          },
        ]
      }))
  
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropTable('users')
    }

}
