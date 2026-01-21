import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";

const summary = [
  { label: "Today", value: 18500 },
  { label: "This Month", value: 452000 },
  { label: "This Year", value: 5280000 },
];

const pieData = [
  { name: "Services", value: 65 },
  { name: "Products", value: 25 },
  { name: "Memberships", value: 10 },
];

const barData = [
  { month: "Jan", revenue: 320000 },
  { month: "Feb", revenue: 280000 },
  { month: "Mar", revenue: 350000 },
  { month: "Apr", revenue: 410000 },
  { month: "May", revenue: 390000 },
];

const COLORS = ["#6366f1", "#22c55e", "#f59e0b"];

const Revenue = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      <h1 className="text-3xl font-bold">Revenue Overview</h1>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {summary.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.15 }}
            className="bg-white p-6 rounded-2xl shadow-md"
          >
            <p className="text-gray-500">{item.label}</p>
            <h2 className="text-2xl font-bold">
              ₹{item.value.toLocaleString("en-IN")}
            </h2>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-md h-80">
          <h2 className="text-lg font-semibold mb-4">Revenue Split</h2>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieData} dataKey="value" outerRadius={90} label>
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="bg-white px-6 py-8 rounded-2xl shadow-md h-80">
          <h2 className="text-lg font-semibold mb-4">Monthly Revenue</h2>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <XAxis dataKey="month"  />
              <YAxis  />
              <Tooltip />
              <Bar dataKey="revenue" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
};

export default Revenue;
