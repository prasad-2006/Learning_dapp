interface DashboardProps {
  onContinueLearning: () => void;
}

export default function Dashboard({ onContinueLearning }: DashboardProps) {
  console.log('Dashboard component is rendering!');
  
  return (
    <div className="text-white text-center p-8 bg-green-500/20 rounded min-h-[200px]">
      <h1 className="text-3xl font-bold mb-4">🎉 DASHBOARD IS WORKING! 🎉</h1>
      <p className="text-lg mb-4">If you can see this green box, the Dashboard component is rendering correctly.</p>
      <button 
        onClick={onContinueLearning}
        className="mt-4 bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 transition-colors"
      >
        Continue Learning (Test Button)
      </button>
    </div>
  );
}
