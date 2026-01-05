import React, { useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import BPChart from '../components/charts/BPChart';
import BloodSugarChart from '../components/charts/BloodSugarChart';
import WeightChart from '../components/charts/WeightChart';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function Dashboard() {
  const [records] = useLocalStorage('medncare_records', []);

  // Parse records and extract data by type
  const { bpRecords, sugarRecords, weightRecords, anomalies } = useMemo(() => {
    const bp = [];
    const sugar = [];
    const weight = [];
    const anomaliesList = [];

    records.forEach(record => {
      const date = new Date(record.datetime);
      if (record.type === 'Blood Pressure') {
        const match = record.details.match(/(\d+)\/(\d+)\s+mmHg/);
        if (match) {
          bp.push({
            date,
            sys: parseInt(match[1]),
            dia: parseInt(match[2]),
            pulse: record.details.match(/(\d+)\s+bpm/)?.[1] || null
          });
        }
      } else if (record.type === 'Blood Sugar') {
        const match = record.details.match(/([\d.]+)/);
        if (match) {
          sugar.push({
            date,
            value: parseFloat(match[1])
          });
        }
      } else if (record.type === 'Weight') {
        const match = record.details.match(/([\d.]+)/);
        if (match) {
          weight.push({
            date,
            value: parseFloat(match[1])
          });
        }
      }
    });

    // Sort by date
    bp.sort((a, b) => a.date - b.date);
    sugar.sort((a, b) => a.date - b.date);
    weight.sort((a, b) => a.date - b.date);

    // Anomaly detection
    if (bp.length >= 2) {
      const recent = bp.slice(-1)[0];
      const previous = bp.slice(-7, -1);
      if (previous.length > 0) {
        const avgSys = previous.reduce((sum, r) => sum + r.sys, 0) / previous.length;
        const avgDia = previous.reduce((sum, r) => sum + r.dia, 0) / previous.length;
        const sysDiff = Math.abs(recent.sys - avgSys);
        const diaDiff = Math.abs(recent.dia - avgDia);
        if (sysDiff > 20 || diaDiff > 15) {
          anomaliesList.push({
            type: 'Blood Pressure',
            message: `BP spike detected: ${recent.sys}/${recent.dia} mmHg (avg was ${Math.round(avgSys)}/${Math.round(avgDia)} mmHg)`,
            severity: sysDiff > 30 || diaDiff > 20 ? 'high' : 'medium'
          });
        }
      }
    }

    if (sugar.length >= 2) {
      const recent = sugar.slice(-1)[0];
      const previous = sugar.slice(-7, -1);
      if (previous.length > 0) {
        const avg = previous.reduce((sum, r) => sum + r.value, 0) / previous.length;
        const diff = Math.abs(recent.value - avg);
        const percentChange = (diff / avg) * 100;
        if (percentChange > 20) {
          anomaliesList.push({
            type: 'Blood Sugar',
            message: `Blood sugar ${recent.value > avg ? 'spike' : 'drop'} detected: ${recent.value} (avg was ${avg.toFixed(1)})`,
            severity: percentChange > 30 ? 'high' : 'medium'
          });
        }
      }
    }

    if (weight.length >= 2) {
      const recent = weight.slice(-1)[0];
      const previous = weight.slice(-7, -1);
      if (previous.length > 0) {
        const avg = previous.reduce((sum, r) => sum + r.value, 0) / previous.length;
        const diff = Math.abs(recent.value - avg);
        const percentChange = (diff / avg) * 100;
        if (percentChange > 5) {
          anomaliesList.push({
            type: 'Weight',
            message: `Weight ${recent.value > avg ? 'increase' : 'decrease'} detected: ${recent.value} (avg was ${avg.toFixed(1)})`,
            severity: percentChange > 10 ? 'high' : 'medium'
          });
        }
      }
    }

    return { bpRecords: bp, sugarRecords: sugar, weightRecords: weight, anomalies: anomaliesList };
  }, [records]);

  return (
    <main className="dashboard-container">
      <h1 className="dashboard-title">Health Trends & Insights</h1>

      {anomalies.length > 0 && (
        <section className="anomalies-section">
          <h2>⚠️ Anomalies Detected</h2>
          <div className="anomalies-grid">
            {anomalies.map((anomaly, idx) => (
              <div key={idx} className={`anomaly-card anomaly-${anomaly.severity}`}>
                <div className="anomaly-type">{anomaly.type}</div>
                <div className="anomaly-message">{anomaly.message}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="charts-section">
        {bpRecords.length > 0 && (
          <div className="chart-card">
            <h2>Blood Pressure Trends</h2>
            <BPChart data={bpRecords} />
          </div>
        )}

        {sugarRecords.length > 0 && (
          <div className="chart-card">
            <h2>Blood Sugar Trends</h2>
            <BloodSugarChart data={sugarRecords} />
          </div>
        )}

        {weightRecords.length > 0 && (
          <div className="chart-card">
            <h2>Weight Change</h2>
            <WeightChart data={weightRecords} />
          </div>
        )}

        {bpRecords.length === 0 && sugarRecords.length === 0 && weightRecords.length === 0 && (
          <div className="tracker-empty">
            No health records yet. Add records to see trends and insights.
          </div>
        )}
      </section>
    </main>
  );
}

