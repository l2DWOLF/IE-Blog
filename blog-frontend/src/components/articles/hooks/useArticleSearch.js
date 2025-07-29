import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useDebounce } from "../../../hooks/useDebounce";

const articlePaths = ["/", "/articles", "/my-articles", "/liked-articles"];

export function useArticleSearch(handleSearch){
    const location = useLocation();
    const shouldEnableSearch = articlePaths.includes(location.pathname);

    const [inputValue, setInputValue] = useState("");
    const debouncedInput = useDebounce(inputValue, 400);

    useEffect(() => {
        handleSearch(debouncedInput.trim());
    },[debouncedInput]);

    const onSearchChange = (e) => {
        setInputValue(e.target.value);
    };

    const clearSearch = () => {
        setInputValue("");
        handleSearch("");
    };

    return {shouldEnableSearch, clearSearch, onSearchChange, inputValue};
};