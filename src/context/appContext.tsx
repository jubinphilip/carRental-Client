'use client';
import { createContext, useContext, Dispatch, SetStateAction, useState, ReactNode } from "react";

type UserType = {
    userid: string;  
    email: string;
    token:string;
    username:string;
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
    const [user, setUser] = useState<UserType | null>(null); 
    const [carData, setCarData] = useState<CarDataType | null>(null);

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
