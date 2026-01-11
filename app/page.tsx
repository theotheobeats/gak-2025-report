'use client';

import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface Summary {
  total_congregations: string;
  congregations_with_attendance: string;
  congregations_without_attendance: string;
  total_attendance_records: string;
  unique_sessions: string;
  avg_attendance_per_session: string;
  participation_rate: string;
  growth_rate: string;
  churn_rate: string;
  whatsapp_coverage: string;
  address_completeness: string;
}

interface Lifecycle {
  category: string;
  count: number;
  [key: string]: any;
}

interface Engagement {
  tier: string;
  count: number;
}

interface Monthly {
  month: string;
  total_attendances: number;
}

interface Yearly {
  year: string;
  total_attendances: number;
}

interface MostActive {
  rank: number;
  name: string;
  total_attendances: number;
  avg_per_month: number;
  engagement_tier: string;
  status: string;
}

interface Followup {
  name: string;
  status: string;
  days_since_last_attendance: number;
  whatsapp: string;
  address: string;
}

interface NewMember {
  name: string;
  joined_date: string;
  days_since_join: number;
  total_attendances: number;
  status: string;
  whatsapp: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function Dashboard() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [lifecycle, setLifecycle] = useState<Lifecycle[]>([]);
  const [engagement, setEngagement] = useState<Engagement[]>([]);
  const [monthly, setMonthly] = useState<Monthly[]>([]);
  const [yearly, setYearly] = useState<Yearly[]>([]);
  const [mostActive, setMostActive] = useState<MostActive[]>([]);
  const [followup, setFollowup] = useState<Followup[]>([]);
  const [newMembers, setNewMembers] = useState<NewMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [summaryRes, lifecycleRes, engagementRes, monthlyRes, yearlyRes, mostActiveRes, followupRes, newMembersRes] = await Promise.all([
          fetch('/data/summary.json'),
          fetch('/data/lifecycle.json'),
          fetch('/data/engagement.json'),
          fetch('/data/monthly.json'),
          fetch('/data/yearly.json'),
          fetch('/data/most_active.json'),
          fetch('/data/followup.json'),
          fetch('/data/new_members.json'),
        ]);

        const [summaryData, lifecycleData, engagementData, monthlyData, yearlyData, mostActiveData, followupData, newMembersData] = await Promise.all([
          summaryRes.json(),
          lifecycleRes.json(),
          engagementRes.json(),
          monthlyRes.json(),
          yearlyRes.json(),
          mostActiveRes.json(),
          followupRes.json(),
          newMembersRes.json(),
        ]);

        setSummary(summaryData);
        setLifecycle(lifecycleData);
        setEngagement(engagementData);
        setMonthly(monthlyData);
        setYearly(yearlyData);
        setMostActive(mostActiveData);
        setFollowup(followupData);
        setNewMembers(newMembersData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-xl text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard Kehadiran Jemaat
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Analisis lengkap kehadiran dan keterlibatan jemaat
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Jemaat</h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">{summary.total_congregations}</p>
              <p className="text-sm text-gray-500 mt-1">Terdaftar dalam sistem</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Jemaat Aktif</h3>
              <p className="text-3xl font-bold text-green-600 mt-2">{summary.congregations_with_attendance}</p>
              <p className="text-sm text-gray-500 mt-1">Dengan catatan kehadiran</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Kehadiran</h3>
              <p className="text-3xl font-bold text-purple-600 mt-2">{summary.total_attendance_records}</p>
              <p className="text-sm text-gray-500 mt-1">Catatan kehadiran</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-500">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Rata-rata/Sesi</h3>
              <p className="text-3xl font-bold text-orange-600 mt-2">{summary.avg_attendance_per_session}</p>
              <p className="text-sm text-gray-500 mt-1">Jemaat per ibadah</p>
            </div>
          </div>
        )}

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Member Lifecycle */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Siklus Keanggotaan</h2>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={lifecycle}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry: any) => `${entry.category}: ${entry.count}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {lifecycle.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Engagement Tiers */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Tingkat Keterlibatan</h2>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={engagement}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="tier" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Monthly Attendance */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Tren Kehadiran Bulanan</h2>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={monthly} margin={{ top: 5, right: 30, left: 20, bottom: 80 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 10 }}
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  interval={0}
                />
                <YAxis />
                <Tooltip
                  formatter={(value: any) => [value, 'Kehadiran']}
                  labelFormatter={(label: string) => `Bulan: ${label}`}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="total_attendances"
                  stroke="#8884d8"
                  strokeWidth={2}
                  dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Yearly Attendance */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Kehadiran Tahunan</h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={yearly}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total_attendances" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tables Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Most Active */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Jemaat Paling Aktif</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Peringkat</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mostActive.slice(0, 5).map((member) => (
                    <tr key={member.rank} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#{member.rank}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{member.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{member.total_attendances}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          member.status === 'Active' ? 'bg-green-100 text-green-800' :
                          member.status === 'At-Risk' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {member.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Members Needing Follow-up */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Perlu Tindak Lanjut</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hari</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {followup.slice(0, 5).map((member, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{member.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          member.status === 'At-Risk' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {member.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{member.days_since_last_attendance}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* New Members */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Anggota Baru (90 Hari Terakhir)</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Bergabung</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hari Sejak Bergabung</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Kehadiran</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {newMembers.map((member, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{member.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{member.joined_date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{member.days_since_join}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{member.total_attendances}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        member.status === 'Active' ? 'bg-green-100 text-green-800' :
                        member.status === 'At-Risk' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {member.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Additional Stats */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Tingkat Partisipasi</h3>
              <p className="text-2xl font-bold text-green-600 mt-2">{summary.participation_rate}%</p>
              <p className="text-sm text-gray-500 mt-1">Jemaat dengan kehadiran</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Tingkat Pertumbuhan</h3>
              <p className="text-2xl font-bold text-blue-600 mt-2">{summary.growth_rate}%</p>
              <p className="text-sm text-gray-500 mt-1">Anggota baru 30 hari</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Tingkat Churn</h3>
              <p className="text-2xl font-bold text-red-600 mt-2">{summary.churn_rate}%</p>
              <p className="text-sm text-gray-500 mt-1">Jemaat tidak aktif</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Cakupan WhatsApp</h3>
              <p className="text-2xl font-bold text-purple-600 mt-2">{summary.whatsapp_coverage}%</p>
              <p className="text-sm text-gray-500 mt-1">Dengan nomor WhatsApp</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
