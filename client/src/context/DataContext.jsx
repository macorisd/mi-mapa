import { useContext, createContext, useState } from "react";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [marker, setMarker] = useState(undefined);

    const getActualMarker = () => marker;

    const setActualMarker = (marker) => setMarker(marker);

    const clearActualMarker = () => setMarker(undefined);

    return (
        <DataContext.Provider
            value={{
                getActualMarker,
                setActualMarker,
                clearActualMarker,
            }}
        >
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => useContext(DataContext);
