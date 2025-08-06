import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import LLMService from '@/lib/llm-service';
import { llmConfig } from '@/lib/llm-config';

export const LLMDebugPanel = () => {
  const [testStatus, setTestStatus] = useState<{
    status: 'idle' | 'testing' | 'success' | 'error';
    message: string;
    details?: any;
  }>({ status: 'idle', message: '' });

  const testLLMConnection = async () => {
    setTestStatus({ status: 'testing', message: 'Testing LLM connection...' });
    
    try {
      const llmService = new LLMService();
      
      // Test with a simple message
      const response = await llmService.generateResponse([
        {
          id: `test-${Date.now()}`,
          role: 'user',
          content: 'Hello, please respond with "API connection successful"',
          timestamp: new Date()
        }
      ], {
        temperature: 0.1,
        maxTokens: 50
      });

      setTestStatus({
        status: 'success',
        message: 'LLM connection successful!',
        details: {
          provider: response.provider,
          model: response.model,
          response: response.content,
          usage: response.usage
        }
      });
    } catch (error) {
      console.error('LLM Test Error:', error);
      setTestStatus({
        status: 'error',
        message: `LLM connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        details: error
      });
    }
  };

  const getConfigStatus = () => {
    const currentProvider = llmConfig.providers[llmConfig.defaultProvider];
    return {
      provider: llmConfig.defaultProvider,
      hasApiKey: Boolean(currentProvider.apiKey && currentProvider.apiKey.trim() !== ''),
      model: currentProvider.model,
      baseUrl: currentProvider.baseUrl
    };
  };

  const configStatus = getConfigStatus();

  const StatusBadge = ({ status, children }: { status: 'success' | 'error' | 'info'; children: React.ReactNode }) => (
    <span className={`px-2 py-1 text-xs rounded-full text-center min-w-0 flex-shrink-0 ${
      status === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' :
      status === 'error' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300' :
      'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
    }`}>
      {children}
    </span>
  );

  return (
    <Card className="p-4 sm:p-6 max-w-2xl mx-auto">
      <div className="space-y-4 sm:space-y-6">
        <div>
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">LLM Configuration Debug</h3>
          
          {/* Configuration Status */}
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs sm:text-sm font-medium">Provider:</span>
              <StatusBadge status="info">{configStatus.provider}</StatusBadge>
            </div>
            
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs sm:text-sm font-medium">API Key:</span>
              <StatusBadge status={configStatus.hasApiKey ? "success" : "error"}>
                {configStatus.hasApiKey ? "Configured" : "Missing"}
              </StatusBadge>
            </div>
            
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs sm:text-sm font-medium">Model:</span>
              <StatusBadge status="info">{configStatus.model}</StatusBadge>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
              <span className="text-xs sm:text-sm font-medium">Base URL:</span>
              <span className="text-xs text-gray-600 dark:text-gray-400 font-mono break-all sm:break-normal">{configStatus.baseUrl}</span>
            </div>
          </div>
        </div>

        {/* Test Connection */}
        <div>
          <Button 
            onClick={testLLMConnection}
            disabled={!configStatus.hasApiKey || testStatus.status === 'testing'}
            className="w-full mb-3 sm:mb-4 text-sm"
            size="sm"
          >
            {testStatus.status === 'testing' ? 'Testing...' : 'Test LLM Connection'}
          </Button>

          {/* Test Results */}
          {testStatus.status !== 'idle' && (
            <div className={`p-3 sm:p-4 rounded-lg border ${
              testStatus.status === 'success' ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' :
              testStatus.status === 'error' ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' :
              'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <StatusBadge status={
                  testStatus.status === 'success' ? "success" :
                  testStatus.status === 'error' ? "error" :
                  "info"
                }>
                  {testStatus.status}
                </StatusBadge>
              </div>
              
              <p className="text-xs sm:text-sm mb-2">{testStatus.message}</p>
              
              {testStatus.details && (
                <details className="text-xs">
                  <summary className="cursor-pointer font-medium">Details</summary>
                  <pre className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded overflow-auto text-xs">
                    {JSON.stringify(testStatus.details, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          )}
        </div>

        {/* Instructions */}
        {!configStatus.hasApiKey && (
          <div className="p-3 sm:p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2 text-sm">API Key Required</h4>
            <p className="text-xs sm:text-sm text-yellow-700 dark:text-yellow-300 mb-2">
              Add your Anthropic API key to the .env file:
            </p>
            <code className="text-xs bg-yellow-100 dark:bg-yellow-800/30 p-2 rounded block break-all">
              VITE_ANTHROPIC_API_KEY=sk-ant-your_actual_api_key_here
            </code>
            <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2">
              Restart the development server after adding the API key.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};
