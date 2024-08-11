'use client'
import React, { useState, useEffect, useCallback } from "react";
import { IoIosCloseCircle, IoIosCheckmarkCircleOutline, IoIosCheckmarkCircle } from "react-icons/io";

export default function Home() {
    const [shoppingList, setShoppingList] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    const debounce = (func, delay) => {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func(...args), delay);
        };
    };

    const fetchSuggestions = useCallback(
        debounce(async (input) => {
            if (input.length >= 2) {
                try {
                    const response = await fetch(`https://api.frontendeval.com/fake/food/${input}`);
                    const data = await response.json();
                    setSuggestions(data);
                } catch (error) {
                    console.error('Error fetching suggestions:', error);
                }
            } else {
                setSuggestions([]);
            }
        }, 500),
        []
    );

    useEffect(() => {
        fetchSuggestions(inputValue);
    }, [inputValue, fetchSuggestions]);

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const addItem = (item) => {
        const newItem = {
            id: Date.now().toString(),
            label: item,
            completed: false
        };
        setShoppingList(prev => [...prev, newItem]);
        setInputValue('');
        setSuggestions([]);
    };

    const handleDelete = (item) => {
        setShoppingList(prev => prev.filter(i => i.id !== item.id));
    };

    const handleCompletion = (item) => {
        setShoppingList(prev => prev.map(i => 
            i.id === item.id ? { ...i, completed: !i.completed } : i
        ));
    };

    return (
        <main className="flex min-h-screen flex-col items-center p-24 bg-gray-100">
            <h1 className="text-3xl font-bold mb-6 text-blue-600">Shopping List</h1>
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
                <div className="mb-4 relative">
                    <input 
                        type="text" 
                        value={inputValue} 
                        onChange={handleInputChange}
                        placeholder="Add an item..."
                        className="w-full p-2 border rounded"
                    />
                    {suggestions.length > 0 && (
                        <ul className="absolute z-10 w-full bg-white border rounded mt-1">
                            {suggestions.map((suggestion, index) => (
                                <li 
                                    key={index} 
                                    onClick={() => addItem(suggestion)}
                                    className="p-2 hover:bg-gray-100 cursor-pointer"
                                >
                                    {suggestion}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                {shoppingList.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-3 mb-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors">
                        <div className="flex items-center gap-3">
                            <button 
                                onClick={() => handleCompletion(item)}
                                className={`text-2xl ${item.completed ? 'text-green-500' : 'text-gray-400'}`}
                            >
                                {item.completed ? <IoIosCheckmarkCircle /> : <IoIosCheckmarkCircleOutline />}
                            </button>
                            <span className={`${item.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                                {item.label}
                            </span>
                        </div>
                        <button 
                            type="button" 
                            onClick={() => handleDelete(item)} 
                            className="text-red-500 hover:text-red-700 text-xl"
                        >
                            <IoIosCloseCircle />
                        </button>
                    </div>
                ))}
            </div>
        </main>
    );
}