import { UserModel } from '../models/user.model.js';
import fetch from 'node-fetch';

interface UpdateUserInput {
  googleId: string;
  phoneNumber: string;
  city: string;
  pincode: string;
}

export async function updateUserAndNotifyCrudCrud({
  googleId,
  phoneNumber,
  city,
  pincode,
}: UpdateUserInput): Promise<void> {
  console.log('Updating user with data:', { googleId, phoneNumber, city, pincode });

  try {
    const updatedUser = await UserModel.findOneAndUpdate(
      { googleId },
      { phoneNumber, city, pincode },
      { new: true }
    );

    if (!updatedUser) {
      console.log(`No user found with googleId: ${googleId}`);
    } else {
      console.log('User updated in MongoDB successfully');
    }

    await new Promise((resolve) => setTimeout(resolve, 10000));

    const response = await fetch('http://localhost:8000/update-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ googleId, phoneNumber, city, pincode }),
    });

    if (!response.ok) {
      throw new Error(`Backend API failed: ${response.statusText}`);
    }

    console.log('User updated and notified backend successfully');
  } catch (err) {
    console.error('Activity failed:', err);
    throw err;
  }
}
