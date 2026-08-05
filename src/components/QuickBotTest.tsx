import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Loader2, Bot } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface TestStatus {
  api: 'pending' | 'running' | 'passed' | 'failed';
  ai: 'pending' | 'running' | 'passed' | 'failed';
}

const QuickBotTest = () => {
  const [status, setStatus] = useState<TestStatus>({ api: 'pending', ai: 'pending' });
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    runQuickTests();
  }, []);

  const runQuickTests = async () => {
    // Test API Connection
    setStatus(prev => ({ ...prev, api: 'running' }));
    try {
      const { error } = await supabase.auth.getSession();
      if (error) throw error;
      setStatus(prev => ({ ...prev, api: 'passed' }));
    } catch {
      setStatus(prev => ({ ...prev, api: 'failed' }));
    }

    // Test AI Response
    setStatus(prev => ({ ...prev, ai: 'running' }));
    try {
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: { message: 'test', history: [] }
      });
      if (error) throw error;
      if (!data?.response) throw new Error('No response');
      setStatus(prev => ({ ...prev, ai: 'passed' }));
    } catch {
      setStatus(prev => ({ ...prev, ai: 'failed' }));
    }

    setIsComplete(true);
  };

  const getIcon = (s: 'pending' | 'running' | 'passed' | 'failed') => {
    switch (s) {
      case 'running': return <Loader2 className="h-3 w-3 animate-spin text-primary" />;
      case 'passed': return <CheckCircle className="h-3 w-3 text-green-500" />;
      case 'failed': return <XCircle className="h-3 w-3 text-red-500" />;
      default: return <div className="h-3 w-3 rounded-full bg-muted" />;
    }
  };

  const allPassed = status.api === 'passed' && status.ai === 'passed';

  return (
    <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground py-2">
      <div className="flex items-center gap-1">
        <Bot className="h-3 w-3" />
        <span>النظام:</span>
      </div>
      <div className="flex items-center gap-1">
        {getIcon(status.api)}
        <span>الخادم</span>
      </div>
      <div className="flex items-center gap-1">
        {getIcon(status.ai)}
        <span>الذكاء</span>
      </div>
      {isComplete && (
        <span className={allPassed ? 'text-green-500' : 'text-red-500'}>
          {allPassed ? '✓ جاهز' : '⚠️ مشكلة'}
        </span>
      )}
    </div>
  );
};

export default QuickBotTest;
