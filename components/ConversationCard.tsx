type Props = {
  role: 'user' | 'ai';
  content: string;
  timestamp: string;
};
export default function ConversationCard({ role, content, timestamp }: { role: string; content: string; timestamp: string }) {
  return (
    <div className={`p-2 rounded-lg max-w-[80%] ${role === 'user' ? 'bg-blue-100 self-end text-right' : 'bg-gray-100 self-start text-left'}`}>
      <p className="text-sm text-gray-700">{content}</p>
      <p className="text-xs text-gray-400 mt-1">{new Date(timestamp).toLocaleTimeString()}</p>
    </div>
  );
}
