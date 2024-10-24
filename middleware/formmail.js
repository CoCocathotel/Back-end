exports.htmlContent = (booking) => {
    const { email, status, _id, room_name, check_in_date, check_out_date, total_price } = booking;

    return `
        <div style="font-family: Arial, sans-serif; background-color: #f8f8f8; padding: 20px; border-radius: 8px; max-width: 600px; margin: 0 auto; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
            <header style="text-align: center; padding: 10px; background-color: #4CAF50; color: white; border-radius: 8px 8px 0 0;">
                <h1 style="margin: 0;">Dear ${email},</h1>
                <p>
                    We are writing to inform you that the status of your booking has been updated to: 
                    <strong>${status}</strong>.
                </p>
            </header>
            <body style="padding: 20px; background-color: #ffffff; border-radius: 0 0 8px 8px;">
                <p>Please find your booking details below:</p>
                <ul style="list-style: none; padding: 0;">
                    <li style="padding: 8px 0; border-bottom: 1px solid #ddd;">
                        <strong>Room Name:</strong> ${room_name}
                    </li>
                    <li style="padding: 8px 0; border-bottom: 1px solid #ddd;">
                        <strong>Check-in Date:</strong> ${check_in_date}
                    </li>
                    <li style="padding: 8px 0; border-bottom: 1px solid #ddd;">
                        <strong>Check-out Date:</strong> ${check_out_date}
                    </li>
                    <li style="padding: 8px 0;">
                        <strong>Total Price:</strong> ${total_price}
                    </li>
                </ul>
                <p>
                    We appreciate your continued trust in our service, and we are always at your disposal 
                    should you have any questions or need further assistance.
                </p>
                <p>You can contact us through the following channels:</p>
                <ul style="list-style: none; padding: 0;">
                    <li><strong>Phone:</strong> +1 (234) 567-890</li>
                    <li><strong>Email:</strong> support@yourbookingapp.com</li>
                    <li><strong>Website:</strong> 
                        <a href="https://www.yourbookingapp.com" style="color: #4CAF50;">www.yourbookingapp.com</a>
                    </li>
                </ul>
            </body>
            <footer style="text-align: left; margin-top: 20px; padding: 10px; background-color: #f8f8f8;">
                <p style="margin: 5px 0;">Best regards,</p>
                <p style="margin: 5px 0;">Cococat Hotel</p>
                <p style="margin: 5px 0;">โรงแรมโคโค่แคท</p>
                <p style="margin: 5px 0;">Admin</p>
                <p style="margin: 5px 0;">Mobile: 065-384-5659</p>
                <p style="margin: 5px 0;">Line ID: cococathotel</p>
                <p style="margin: 5px 0;">Email: cococat872024@gmail.com</p>
                <img 
                    src="https://hiykwrlgoinmxgqczucv.supabase.co/storage/v1/object/public/logo/cococat-hotel.png" 
                    alt="Booking App Logo" 
                    style="height: 150px;" 
                />
                <p style="margin: 5px 0;">Co-Co Cat Hotel โรงแรมแมว โคโค่ แค็ท - สาขาหาดใหญ่</p>
                <p style="margin: 5px 0;">121/105 ซ.3 ถ.ทุ่งรี-โคกวัด ต.คอหงส์ อ.หาดใหญ่, Hat Yai, Thailand, Songkhla</p>
                <p style="margin: 5px 0;">โทร. 065-384-5659 </p>
                <p style="margin: 5px 0;">
                    <a href="https://cococatfrontend.vercel.app" style="color: #4CAF50;">cococatfrontend.vercel.app</a>
                </p>
                <p style="margin: 5px 0;">เลขประจำตัวผู้เสียภาษี -</p>
            </footer>
        </div>
    `;
};
