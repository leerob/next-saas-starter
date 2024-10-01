'use client'

import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

export const LOCAL_STORAGE_KEY = 'next-sass-starter-theme';

export default function DarkModeToggle() {
    const [isDarkMode, setIsDarkMode] = useState(false)

    useEffect(() => {
        const darkModePreference =
            localStorage.getItem(LOCAL_STORAGE_KEY) === 'dark'
        if (
            darkModePreference ||
            (!(LOCAL_STORAGE_KEY in localStorage) &&
                window.matchMedia('(prefers-color-scheme: dark)').matches)
        ) {
            document.documentElement.classList.add('dark')
            document.documentElement.style.setProperty('color-scheme', 'dark')
            setIsDarkMode(true)
        } else {
            document.documentElement.classList.remove('dark')
            document.documentElement.style.removeProperty('color-scheme')
        }
    }, [])

    const toggleDarkMode = () => {
        const isDark = document.documentElement.classList.toggle('dark')
        isDark
            ? document.documentElement.style.setProperty('color-scheme', 'dark')
            : document.documentElement.style.removeProperty('color-scheme')
        setIsDarkMode(isDark)
        localStorage.setItem(LOCAL_STORAGE_KEY, isDark ? 'dark' : 'light')
    }

    return (
        <button onClick={toggleDarkMode} className="">
            {isDarkMode ? <Sun /> : <Moon />}
        </button>
    )
}
