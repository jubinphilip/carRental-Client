'use client';
import { createContext, useContext, Dispatch, SetStateAction, useState, ReactNode, useEffect } from "react";

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
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
    // Initialize state from localStorage or set to null
    const [user, setUser] = useState<UserType | null>(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });
    
    const [carData, setCarData] = useState<CarDataType | null>(() => {
        const storedCarData = localStorage.getItem('carData');
        return storedCarData ? JSON.parse(storedCarData) : null;
    });

    // Save user to localStorage when it changes
    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    }, [user]);

    // Save carData to localStorage when it changes
    useEffect(() => {
        if (carData) {
            localStorage.setItem('carData', JSON.stringify(carData));
        } else {
            localStorage.removeItem('carData');
        }
    }, [carData]);

    return (
        <AppContext.Provider value={{ user, setUser, carData, setCarData }}>
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
