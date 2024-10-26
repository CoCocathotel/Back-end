exports.formatEmail = async (booking) => {
    var textStatus = '';
    switch (booking.status) {
        case 'pending':
            color = 'orange';
            textStatus = 'Pending Approval in 3 days'; 
            break;
        case 'pass':
            color = 'green';
            textStatus = 'Booking Successful';
            break;
        case 'failed':
            color = 'red';
            textStatus = 'Booking Rejected';
            break;
        default:
            color = 'black';
            textStatus = 'Unknown Status';
    }


    return (`
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f8f9fa; max-width: 600px; margin: auto; border-radius: 8px; border: 1px solid #ddd;">
            <div style="background-color: #E9F8FF; color: black; padding: 10px; border-radius: 8px 8px 0 0; text-align: center;">
                <h2>Dear ${booking.user_name},</h2>
            </div>
            <div style="padding: 20px; background-color: white; border-radius: 0 0 8px 8px;">
                <p>We are pleased to inform you about the status of your booking for 
                    <br/> 
                    <strong style="color: ${color}; font-size: 20px; padding: 5px;">
                        ${textStatus}
                    </strong>
                    <br/> in our hotel.
                    <strong>${booking.room_name}</strong>. 
                    Your stay is scheduled from 
                    <strong>${booking.check_in_date}</strong> to 
                    <strong>${booking.check_out_date}</strong>.
                </p>
                <div style="border: 1px solid #ddd; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <p><strong>Room Name:</strong> ${booking.room_name}</p>
                    <p><strong>Check-in Date:</strong> ${booking.check_in_date}</p>
                    <p><strong>Check-out Date:</strong> ${booking.check_out_date}</p>
                    <p><strong>Total Price:</strong> ${booking.total_price}</p>
                </div>
                <p>Thank you for choosing our service! We are excited to welcome you soon.</p>
                <p>If you have any questions, feel free to contact us via:</p>
                <p><strong>Phone:</strong> +1 (234) 567-890</p>
            </div>
            <div style="font-size: 12px; color: #666; margin-top: 20px;">
                <p>Best regards,<br>Your Service Team</p>
            </div>
        </div>
    `);
};
