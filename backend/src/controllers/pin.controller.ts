import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';
import { ApiResponse } from '../types';

export const getPinDetails = async (
  req: Request<{ pincode: string }>,
  res: Response<ApiResponse>,
  next: NextFunction
) => {
  try {
    const { pincode } = req.params;

    if (!/^[1-9][0-9]{5}$/.test(pincode)) {
      res.status(400).json({
        success: false,
        message: 'Invalid pincode format'
      });
      return;
    }

    const response = await fetch(`${env.POSTPIN_BASE_URL}/${pincode}`);
    
    if (!response.ok) {
      throw new Error(`API returned status: ${response.status}`);
    }

    const data = await response.json();

    if (!data || !Array.isArray(data) || data.length === 0 || data[0].Status !== 'Success') {
      res.status(404).json({
        success: false,
        message: 'Pincode not found'
      });
      return;
    }

    const postOffice = data[0].PostOffice?.[0];
    if (!postOffice) {
      res.status(404).json({
        success: false,
        message: 'Pincode not found'
      });
      return;
    }

    const city = postOffice.Name;
    const state = postOffice.State;
    const district = postOffice.District;

    res.status(200).json({
      success: true,
      message: 'Pincode details fetched successfully',
      data: { city, state, district }
    });
  } catch (error) {
    console.error('Error fetching PIN details:', error);
    res.status(502).json({
      success: false,
      message: 'Failed to fetch pincode details from upstream API'
    });
  }
};
