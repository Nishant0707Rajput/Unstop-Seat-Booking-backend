module.exports = (sequelize, DataTypes) => {
    const Booking = sequelize.define(
        'Booking',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            user_name: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    len: [3, 50],
                },
            },
        },
        {
            tableName: 'booking',
            timestamps: true,
            paranoid: true,
            underscored: true,
            freezeTableName: true,
        }
    );

    Booking.associate = (models) => {
        Booking.hasMany(models.Seat, {
            foreignKey: 'booking_id',
            as: 'seats',
        });
    };

    return Booking;
};
