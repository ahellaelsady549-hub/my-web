import { createContext, useContext, useState, ReactNode } from 'react';

interface BotContextType {
  isBotOpen: boolean;
  setIsBotOpen: (open: boolean) => void;
}

const BotContext = createContext<BotContextType | undefined>(undefined);

export const BotProvider = ({ children }: { children: ReactNode }) => {
  const [isBotOpen, setIsBotOpen] = useState(false);

  return (
    <BotContext.Provider value={{ isBotOpen, setIsBotOpen }}>
      {children}
    </BotContext.Provider>
  );
};

export const useBotContext = () => {
  const context = useContext(BotContext);
  if (context === undefined) {
    throw new Error('useBotContext must be used within a BotProvider');
  }
  return context;
};
