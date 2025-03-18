import Addimg from "../assets/folder.png?url";
import nosearch from "../assets/NoSearch.png?url";
import noDate from "../assets/NoDate.png?url";

console.log(Addimg, nosearch, noDate);

export const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

export const getInitials = (name) => {
    if (!name) return "";

    const word = name.split(" ");
    let initials = "";

    for (let i = 0; i < Math.min(word.length, 2); i++) {
        initials += word[i][0];
    }
    return initials.toUpperCase();
};

export const getEmptyCardMessage = (filterType) => {
    switch (filterType) {
        case "search":
            return `Oops! No stories found matching your search.`;
        case "date":
            return `No stories found in the given date range`;
        default:
            return `Start Creating your first Travel Story! Click the 'Add' button to drop down your thoughts, ideas, and memories. Let's get started!`;
    }
};

export const getEmptyCardImg = (filterType) => {
    switch (filterType) {
        case "search":
            return nosearch || "";
        case "date":
            return noDate || "";
        default:
            return Addimg || "";
    }
};