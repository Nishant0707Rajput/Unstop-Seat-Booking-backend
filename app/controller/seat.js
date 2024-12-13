const { Op } = require('sequelize');
const { Seat, Booking, sequelize } = require('../models');

// Fetch all seats, grouped by row
exports.getAllSeats = async (req, res) => {
    try {
        const seats = await Seat.findAll({
            order: [['row_number', 'ASC'], ['seat_number', 'ASC']],
            raw: true,
        });

        // Group seats by row for better visualization
        const groupedSeats = seats.reduce((acc, seat) => {
            acc[seat.row_number] = acc[seat.row_number] || [];
            acc[seat.row_number].push({
                seat_number: seat.seat_number,
                status: seat.status,
                booking_id: seat.booking_id,
            });
            return acc;
        }, {});

        return res.status(200).json({
            message: 'Seats retrieved successfully!',
            seats: groupedSeats,
        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error!' });
    }
};

// Book seats for a specific booking
exports.bookSeats = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { seatsRequired, userName } = req.body;

        // Fetch available seats, ordered by proximity
        const availableSeats = await Seat.findAll({
            where: { status: 'available' },
            order: [['row_number', 'ASC'], ['seat_number', 'ASC']],
            raw: true,
        });

        // Group seats by row
        const groupedSeats = availableSeats.reduce((acc, seat) => {
            acc[seat.row_number] = acc[seat.row_number] || [];
            acc[seat.row_number].push(seat);
            return acc;
        }, {});

        let seatsToBook = [];
        for (const [row, seats] of Object.entries(groupedSeats)) {
            if (seats.length >= seatsRequired) {
                seatsToBook = seats.slice(0, seatsRequired);
                break;
            }
        }

        // If no single row can accommodate, pick nearest available seats
        if (seatsToBook.length === 0) {
            seatsToBook = availableSeats.slice(0, seatsRequired);
        }

        if (seatsToBook.length < seatsRequired) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Not enough seats available!' });
        }

        // Create a new booking record
        const booking = await Booking.create({ user_name: userName }, { transaction });

        // Update seat statuses and associate them with the booking
        const seatIds = seatsToBook.map((seat) => seat.id);
        await Seat.update(
            { status: 'booked', booking_id: booking.id },
            { where: { id: { [Op.in]: seatIds } }, transaction }
        );

        await transaction.commit();
        return res.status(201).json({
            message: 'Seats booked successfully!',
            bookingId: booking.id,
            seats: seatsToBook,
        });
    } catch (error) {
        await transaction.rollback();
        return res.status(500).json({ message: 'Internal server error!', error: error.message });
    }
};

// Re-initialize all seats (admin functionality)
exports.reInitializeSeats = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        // Reset all seat statuses and remove their booking associations
        await Seat.update(
            { status: 'available', booking_id: null },
            { where: {}, transaction }
        );

        await transaction.commit();
        return res.status(200).json({ message: 'All seats have been reinitialized!' });
    } catch (error) {
        await transaction.rollback();
        return res.status(500).json({ message: 'Internal server error!', error: error.message });
    }
};



