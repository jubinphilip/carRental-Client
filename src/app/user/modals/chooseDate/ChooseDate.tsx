import React, { useEffect, useState } from 'react';
import { Modal, Button, DatePicker } from 'antd';
import { useAppContext } from '@/context/appContext';
import { Dayjs } from 'dayjs';

const { RangePicker } = DatePicker;

const ChooseDateModal: React.FC = () => {
    const { dateRange, setDateRange } = useAppContext();
    const [visible, setVisible] = useState(true); 
    const[error,setError]=useState('')
    const [dates, setDates] = useState<[Dayjs | null, Dayjs | null] | null>(dateRange || [null, null]);
//modal for selecting dates and the dates are stored in a context for later verification

    const handleSubmit = () => {
        if (dates && dates[0] && dates[1]) {

            setDateRange(dates); 
            const currentDate = new Date();

        // Convert both selected dates from Moment to JavaScript Date objects
        const startDate = dates[0].toDate();
        const endDate = dates[1].toDate();

        // Validate that the start date is not before the current date
        if (startDate < currentDate || endDate < currentDate) {
            setError("Date must be greater than or equal to current date❗")
        }
        else if(endDate < startDate)
        {
            setError("Are you going to end the trip before it starts😂😂")
        }
        // If both dates are valid, proceed
        else
        {
        setDateRange(dates);
        setVisible(false); 
        }
        }
       
    };

    const handleChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
        setDates(dates); 
    };

    const handleCancel = () => {
        setVisible(false); 
        // Resetting the dates state to avoid setting a default date
        setDates(dateRange || [null, null]); // Keep it as it was before the modal opened
    };

    useEffect(() => {
        setDates(dateRange || [null, null]);
    }, [dateRange]);

    return (
        <Modal
            title="Select Date "
            visible={visible}
            onCancel={handleCancel}
            footer={[
                <Button key="submit" type="primary" onClick={handleSubmit}>
                    Submit
                </Button>,
                <Button key="cancel" onClick={handleCancel}>
                    Cancel
                </Button>
            ]}
            centered 
        >
            {/* rangepicker is used to select a range */}
            <RangePicker
                value={dates}
                onChange={handleChange} 
                style={{ width: '100%' }}
            />
           {error && <p style={{color:'red'}}>{error}</p>}
        </Modal>
    );
};

export default ChooseDateModal; 
