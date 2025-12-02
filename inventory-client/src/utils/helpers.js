export const getDaysDiff = (date) => { 
    if (!date) return 9999; 
    return Math.ceil(Math.abs(new Date() - new Date(date)) / (1000 * 60 * 60 * 24)); 
};

export const getDaysLeft = (date) => {
    if (!date) return 9999; 
    return Math.ceil((new Date(date) - new Date()) / (1000 * 60 * 60 * 24)); 
};

export const getInactiveDays = (p) => { 
    const refDate = p.lastSaleDate || p.lastPurchaseDate; 
    if (!refDate) return 999; 
    return getDaysDiff(refDate); 
};

export const formatJavaDate = (dateData) => { 
    if (!dateData) return "-"; 
    if (Array.isArray(dateData)) { 
        const [year, month, day, hour, minute] = dateData; 
        return new Date(year, month - 1, day, hour, minute).toLocaleString(); 
    } 
    return new Date(dateData).toLocaleString(); 
};