import { useAtom } from "jotai";
import { ThemeAtom } from "../atoms/ThemeAtom.tsx";
import themes from "daisyui/src/theming/themes";
import { Theme } from "daisyui";

export default function ThemeSwitcher() {
    const [theme, setTheme] = useAtom(ThemeAtom);

    return (
        <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-sm m-1">
                Theme
                <svg
                    width="12px"
                    height="12px"
                    className="inline-block h-2 w-2 fill-current opacity-60 ml-1"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 2048 2048">
                    <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
                </svg>
            </div>
            <ul tabIndex={0} className="dropdown-content menu bg-base-300 rounded-box z-[1] shadow-2xl mb-10 mt-4 h-96 p-2 w-96 overflow-y-auto">
                {(Object.keys(themes) as Array<Theme>).map((themeName) => (
                    <li key={themeName}>
                        <label className="label cursor-pointer justify-start py-1">
                            <input
                                onChange={() => setTheme(themeName)}
                                type="radio"
                                name="theme-dropdown"
                                className="radio radio-sm theme-controller"
                                value={themeName}
                                checked={theme === themeName}
                            />
                            <span className="label-text ml-2 text-sm">
                                {themeName.charAt(0).toUpperCase() + themeName.slice(1)}
                            </span>
                        </label>
                    </li>
                ))}
            </ul>
        </div>
    );
}