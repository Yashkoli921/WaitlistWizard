
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { exportToPDF } from '@/lib/exportUtils';
import type { CalculationHistory } from '@/lib/exportUtils';

const History = () => {
  const [history, setHistory] = useState<CalculationHistory[]>([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await fetch('/api/history');
      const data = await response.json();
      setHistory(data.data);
    } catch (error) {
      console.error('Failed to fetch history:', error);
    }
  };

  return (
    <section className="min-h-screen bg-dark text-light py-20 px-4">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-gold">Calculation History</h1>
            <button
              onClick={() => exportToPDF(history)}
              className="px-4 py-2 bg-gold text-dark rounded hover:bg-gold/90 transition"
            >
              Export to PDF
            </button>
          </div>

          <div className="grid gap-4">
            {history.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-navy p-4 rounded-lg border border-gold/30"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gold font-semibold">{item.type}</p>
                    <p className="text-gray-300">Input: {item.input}</p>
                    <p className="text-gray-300">Result: {item.result}</p>
                  </div>
                  <p className="text-sm text-gray-400">
                    {new Date(item.timestamp).toLocaleString()}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default History;
