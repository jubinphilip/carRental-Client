'use client';
import { createContext, useContext, Dispatch, SetStateAction, useState, ReactNode, useEffect } from "react";
import { Dayjs } from 'dayjs';

type UserType = {
    userid: string;  
    email: string;
    token: string;
    username: string;
    fileurl: string;
};

type CarDataType = {
    carId: string;
    userId: string;
};

interface AppContextProps {
    user: UserType | null; 
    setUser: Dispatch<SetStateAction<UserType | null>>;
    carData: CarDataType | null; 
    setCarData: Dispatch<SetStateAction<CarDataType | null>>;
    dateRange: [Dayjs | null, Dayjs | null];
    setDateRange: Dispatch<SetStateAction<[Dayjs | null, Dayjs | null]>>; 
    clearContext: () => void; 
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserType | null>(() => {
        if (typeof window !== 'undefined') {
            const storedUser = localStorage.getItem('user');
            return storedUser ? JSON.parse(storedUser) : null;
        }
        return null;
    });
    
    const [carData, setCarData] = useState<CarDataType | null>(() => {
        if (typeof window !== 'undefined') {
            const storedCarData = localStorage.getItem('carData');
            return storedCarData ? JSON.parse(storedCarData) : null;
        }
        return null;
    });

    const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([null, null]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (user) {
                localStorage.setItem('user', JSON.stringify(user));
            } else {
                localStorage.removeItem('user');
            }
        }
    }, [user]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (carData) {
                localStorage.setItem('carData', JSON.stringify(carData));
            } else {
                localStorage.removeItem('carData');
            }
        }
    }, [carData]);

    const clearContext = () => {
        setUser(null);
        setCarData(null);
        setDateRange([null, null]);
        if (typeof window !== 'undefined') {
            localStorage.clear();
        }
    };

    return (
        <AppContext.Provider value={{ user, setUser, carData, setCarData, dateRange, setDateRange, clearContext }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error("useAppContext must be used within an AppContextProvider");
    }
    return context;
};
