module.exports = (sequelize, DataTypes) => {
  const Seat = sequelize.define(
    'Seat',
    {
      row_number: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      seat_number: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('available', 'booked'),
        defaultValue: 'available',
      },
      booking_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'booking',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
    },
    {
      tableName: 'seat',
      timestamps: true,
      paranoid: true,
      underscored: true,
      freezeTableName: true
    }
  );
  Seat.associate = (models) => {
    Seat.belongsTo(models.Booking, {
      foreignKey: 'booking_id',
      as: 'booking',
    });
  };

  return Seat;
};
