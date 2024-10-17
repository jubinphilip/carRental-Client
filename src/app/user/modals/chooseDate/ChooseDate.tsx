import React, { useEffect, useState } from 'react';
import { Modal, Button, DatePicker } from 'antd';
import { useAppContext } from '@/context/appContext';
import { Dayjs } from 'dayjs';

const { RangePicker } = DatePicker;

const ChooseDateModal: React.FC = () => {
    const { dateRange, setDateRange } = useAppContext();
    const [visible, setVisible] = useState(true); 
    const [dates, setDates] = useState<[Dayjs | null, Dayjs | null] | null>(dateRange);

    const handleSubmit = () => {
        if (dates) {
            setDateRange(dates); 
        }
        setVisible(false); 
    };

    const handleChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
        setDates(dates); 
    };

    useEffect(() => {
        setDates(dateRange);
    }, [dateRange]);

    return (
        <Modal
            title="Select Date Range"
            visible={visible}
            onCancel={() => setVisible(false)} 
            footer={[
                <Button key="submit" type="primary" onClick={handleSubmit}>
                    Submit
                </Button>,
                <Button key="cancel" onClick={() => setVisible(false)}>
                    Cancel
                </Button>
            ]}
            centered 
        >
            <RangePicker
                value={dates}
                onChange={handleChange} 
                style={{ width: '100%' }}
            />
        </Modal>
    );
};

export default ChooseDateModal;
