import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef } from 'react';

interface Tab {
    id: string;
    label: string;
}

interface TabViewProps {
    tabs: Tab[];
    activeTab: string;
    onTabChange: (tabId: string) => void;
    onAddTab?: () => void;
    addTabLabel?: string;
    children: (tabId: string) => React.ReactNode;
}

const TabView = ({ tabs, activeTab, onTabChange, onAddTab, addTabLabel, children }: TabViewProps) => {
    const isClient = useRef(false);

    useEffect(() => {
        isClient.current = true;
    }, []);

    // Server-side render without animations
    if (!isClient.current) {
        return (
            <div className="space-y-6">
                <div className="border-b border-gray-200">
                    <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-hide">
                        <div className="flex space-x-1">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => onTabChange(tab.id)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all
                    ${activeTab === tab.id
                                            ? 'bg-indigo-100 text-indigo-700'
                                            : 'text-gray-600 hover:bg-gray-100'}`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                        {onAddTab && addTabLabel && (
                            <button
                                onClick={onAddTab}
                                className="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                            >
                                {addTabLabel}
                            </button>
                        )}
                    </div>
                </div>
                <div>
                    {children(activeTab)}
                </div>
            </div>
        );
    }

    // Client-side render with animations
    return (
        <div className="space-y-6">
            <div className="border-b border-gray-200">
                <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-hide">
                    <div className="flex space-x-1">
                        {tabs.map((tab) => (
                            <motion.button
                                key={tab.id}
                                onClick={() => onTabChange(tab.id)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all
                  ${activeTab === tab.id
                                        ? 'bg-indigo-100 text-indigo-700'
                                        : 'text-gray-600 hover:bg-gray-100'}`}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {tab.label}
                            </motion.button>
                        ))}
                    </div>
                    {onAddTab && addTabLabel && (
                        <motion.button
                            onClick={onAddTab}
                            className="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {addTabLabel}
                        </motion.button>
                    )}
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                    {children(activeTab)}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default TabView; 