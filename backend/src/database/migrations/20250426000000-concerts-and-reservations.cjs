/**
 * @param {import('sequelize').QueryInterface} queryInterface
 * @param {import('sequelize').Sequelize} Sequelize
 */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('concerts', {
            id: {
                type: Sequelize.UUID,
                allowNull: false,
                primaryKey: true,
                defaultValue: Sequelize.UUIDV4,
            },
            name: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            totalSeats: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            createdBy: {
                type: Sequelize.UUID,
                allowNull: false,
                references: { model: 'users', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT',
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
            },
        });

        await queryInterface.createTable('reservations', {
            id: {
                type: Sequelize.UUID,
                allowNull: false,
                primaryKey: true,
                defaultValue: Sequelize.UUIDV4,
            },
            userId: {
                type: Sequelize.UUID,
                allowNull: false,
                references: { model: 'users', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            concertId: {
                type: Sequelize.UUID,
                allowNull: false,
                references: { model: 'concerts', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            status: {
                type: Sequelize.STRING(20),
                allowNull: false,
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
            },
        });

        await queryInterface.addIndex('reservations', {
            name: 'reservations_concertId_status',
            fields: ['concertId', 'status'],
        });

        await queryInterface.sequelize.query(
            'CREATE UNIQUE INDEX "reservations_userId_concertId_active" ON "reservations" ("userId", "concertId") WHERE "status" = \'active\'',
        );
    },

    async down(queryInterface) {
        await queryInterface.sequelize.query(
            'DROP INDEX IF EXISTS "reservations_userId_concertId_active"',
        );
        await queryInterface.removeIndex('reservations', 'reservations_concertId_status');
        await queryInterface.dropTable('reservations');
        await queryInterface.dropTable('concerts');
    },
};
