import { useState, useEffect, useRef } from 'react';
import '../App.css';

interface EventData {
  type: string;
  data: Record<string, unknown>;
}

interface CustomEvent extends Event {
  data: string;
}

const SseDemo = () => {
  const [task, setTask] = useState('find the weather in NYC and tell me what to wear');
  const [apiKey, setApiKey] = useState('your-api-key-here');
  const [events, setEvents] = useState<EventData[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  const connectToSSE = () => {
    // Close any existing connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    setEvents([]);
    setError(null);
    
    try {
      // Create URL with parameters
      const url = new URL('http://localhost:4000/api/agent/stream');
      url.searchParams.append('task', task);
      url.searchParams.append('apiKey', apiKey);
      
      console.log(`Connecting to SSE endpoint: ${url.toString()}`);
      
      // Create EventSource with the URL
      // EventSource only supports GET requests, which is fine for our endpoint
      const eventSource = new EventSource(url.toString());
      eventSourceRef.current = eventSource;
      setIsConnected(true);
      
      // Listen for specific event types
      eventSource.addEventListener('start', (event: CustomEvent) => {
        const data = JSON.parse(event.data);
        console.log('Orchestration started:', data);
        setEvents(prev => [...prev, { type: 'start', data }]);
      });
      
      eventSource.addEventListener('status', (event: CustomEvent) => {
        const data = JSON.parse(event.data);
        console.log('Status update:', data);
        setEvents(prev => [...prev, { type: 'status', data }]);
      });
      
      eventSource.addEventListener('result', (event: CustomEvent) => {
        const data = JSON.parse(event.data);
        console.log('Result received:', data);
        setEvents(prev => [...prev, { type: 'result', data }]);
      });
      
      eventSource.addEventListener('error', (event: CustomEvent) => {
        try {
          const data = JSON.parse(event.data);
          console.log('Error occurred:', data);
          setEvents(prev => [...prev, { type: 'error', data }]);
        } catch (e) {
          console.error('Error parsing error event:', e);
        }
      });
      
      eventSource.addEventListener('complete', (event: CustomEvent) => {
        const data = JSON.parse(event.data);
        console.log('Orchestration completed:', data);
        setEvents(prev => [...prev, { type: 'complete', data }]);
        eventSource.close();
        setIsConnected(false);
      });
      
      // Handle connection errors
      eventSource.onerror = (error) => {
        console.error('EventSource failed:', error);
        setError('Connection to server failed');
        eventSource.close();
        setIsConnected(false);
      };
    } catch (err) {
      console.error('Error setting up connection:', err);
      setError(`Error setting up connection: ${err instanceof Error ? err.message : String(err)}`);
      setIsConnected(false);
    }
  };

  const disconnectSSE = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
      setIsConnected(false);
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  // Helper function to get appropriate color for event type
  const getEventColor = (type: string) => {
    switch (type) {
      case 'start': return 'text-blue-400';
      case 'status': return 'text-yellow-400';
      case 'result': return 'text-green-400';
      case 'error': return 'text-red-400';
      case 'complete': return 'text-purple-400';
      default: return 'text-white';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="glass-panel p-6 rounded-lg shadow-neon border border-secondary-main/30 mb-6">
        <h2 className="text-xl font-bold mb-4">SSE Demo Configuration</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Task</label>
          <input 
            type="text" 
            value={task} 
            onChange={(e) => setTask(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-main"
            disabled={isConnected}
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">API Key</label>
          <input 
            type="text" 
            value={apiKey} 
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-main"
            disabled={isConnected}
          />
        </div>
        
        <div className="flex space-x-4">
          <button
            onClick={connectToSSE}
            disabled={isConnected}
            className={`px-4 py-2 rounded-md font-medium ${isConnected ? 'bg-gray-700 cursor-not-allowed' : 'bg-accent-main hover:bg-accent-dark'}`}
          >
            Connect
          </button>
          
          <button
            onClick={disconnectSSE}
            disabled={!isConnected}
            className={`px-4 py-2 rounded-md font-medium ${!isConnected ? 'bg-gray-700 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}
          >
            Disconnect
          </button>
        </div>
        
        {error && (
          <div className="mt-4 p-3 bg-red-900/50 border border-red-700 rounded text-red-300">
            {error}
          </div>
        )}
      </div>
      
      <div className="glass-panel p-6 rounded-lg shadow-neon border border-secondary-main/30">
        <h2 className="text-xl font-bold mb-4">Event Stream</h2>
        
        <div className="connection-status mb-4">
          <span className="text-sm font-medium mr-2">Status:</span>
          <span className={isConnected ? 'text-green-400' : 'text-red-400'}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
        
        <div className="h-96 overflow-y-auto bg-gray-900/50 rounded border border-gray-800 p-4 font-mono text-sm">
          {events.length === 0 ? (
            <div className="text-gray-500 italic">No events received yet...</div>
          ) : (
            events.map((event, index) => (
              <div key={index} className="mb-3 pb-3 border-b border-gray-800">
                <div className={`font-bold ${getEventColor(event.type)} mb-1`}>
                  {event.type.toUpperCase()}
                </div>
                <pre className="whitespace-pre-wrap break-words">
                  {JSON.stringify(event.data, null, 2)}
                </pre>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SseDemo;
