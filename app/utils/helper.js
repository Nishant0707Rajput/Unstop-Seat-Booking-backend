// This is to reset all the seat status to available on server restart
exports.initializeSeats = async (Model) => {
    try {
        const seats = [];
        for (let row = 1; row <= 11; row++) {
            for (let seat = 1; seat <= 7; seat++) {
                seats.push({ row_number: row, seat_number: seat, status: 'available' });
            }
        }
        for (let seat = 1; seat <= 3; seat++) {
            seats.push({ row_number: 12, seat_number: seat, status: 'available' });
        }

        // Bulk insert new seat data
        await Model.bulkCreate(seats);

        console.log('Seats initialized successfully!');
    } catch (error) {
        console.error('Error initializing seats:', error.message);
        throw error;
    }
}