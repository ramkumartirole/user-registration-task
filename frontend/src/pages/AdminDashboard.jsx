import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Paper, useTheme, 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import AdminSidebar from '../components/AdminSidebar';
import {
  PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis,
  ResponsiveContainer
} from 'recharts';
import { motion } from 'framer-motion';
import { teal, purple, indigo, deepPurple, blue } from '@mui/material/colors';

const COLORS = [purple[500], indigo[500], deepPurple[500], indigo[300], purple[300]];
const drawerWidth = 240;

const StatCard = ({ label, value, color }) => (
  <motion.div initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }}>
    <Card sx={{
      borderRadius: 2, boxShadow: 3, background: `linear-gradient(135deg, ${color} 0%, ${purple[400]} 100%)`,
      color: 'white', '&:hover': { transform: 'translateY(-5px)' }, transition: '0.3s'
    }}>
      <CardContent>
        <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>{label}</Typography>
        <Typography variant="h3" sx={{ fontWeight: 700 }}>{value}</Typography>
        <Box sx={{ height: 4, background: 'rgba(255,255,255,0.3)', width: '40%', mt: 1, borderRadius: 2 }} />
      </CardContent>
    </Card>
  </motion.div>
);

const ChartBox = ({ title, children }) => (
  <Paper elevation={0} sx={{ p: 3, borderRadius: 3, background: 'white', boxShadow: 3 }}>
    <Typography variant="h6" sx={{ mb: 2, color: purple[800], fontWeight: 600 }}>{title}</Typography>
    {children}
  </Paper>
);

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [adminName, setAdminName] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const token = localStorage.getItem('token');
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const theme = useTheme();
 

  useEffect(() => {
    if (!token) return navigate('/admin-login');

    const fetchData = async () => {
      try {
        const [userRes, adminRes] = await Promise.all([
          axios.get('http://localhost:5000/api/users', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:5000/api/auth/admin/profile', { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setUsers(userRes.data);
        setAdminName(adminRes.data.name || 'Admin');
      } catch {
        enqueueSnackbar('Failed to fetch data', { variant: 'error' });
      }
    };
    fetchData();
  }, [token, navigate, enqueueSnackbar]);

  const totalUsers = users.length;
  const maleCount = users.filter(u => u.gender === 'Male').length;
  const femaleCount = users.filter(u => u.gender === 'Female').length;

  const groupData = (arr, key) =>
    [...new Set(arr.map(u => u[key]))].map(k => ({
      name: k, count: arr.filter(u => u[key] === k).length
    })).sort((a, b) => b.count - a.count).slice(0, 5);

  const interestData = Object.entries(
    users.reduce((acc, u) => {
      (u.areaOfInterest || []).forEach(i => acc[i] = (acc[i] || 0) + 1);
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 5);

  const monthlyData = Object.entries(
    users.reduce((acc, u) => {
      const date = new Date(u.createdAt);
      const month = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {})
  ).sort().map(([month, count]) => ({
    month: new Date(month).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    count
  }));

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <AdminSidebar
        mobileOpen={mobileOpen}
        handleDrawerToggle={() => setMobileOpen(!mobileOpen)}
        handleLogout={() => {
          localStorage.removeItem('token');
          navigate('/admin-login');
        }}
      />
     <Box
  component="main"
  sx={{
    flexGrow: 1,
    p: 3,
    ml: { sm: `${drawerWidth}px` },
    width: { sm: `calc(100% - ${drawerWidth}px)` }
  }}
>
  <Box sx={{ mb: 4 }}>
    <Typography
      variant="h4"
      sx={{
        fontWeight: 700,
        mb: 1,
        background: `linear-gradient(45deg, #024731 0%, ${purple[600]} 50%, ${blue[500]} 100%)`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}
    >
      Dashboard Overview
    </Typography>

    <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
      Welcome back, <span style={{ color: purple[600], fontWeight: 500 }}>{adminName}</span>!
    </Typography>
  </Box>



        <Grid container spacing={3} sx={{ mb: 4 }}>
  <Grid item xs={12} sm="auto">
    <Box sx={{ width: 300 }}>
      <StatCard label="Total Users" value={totalUsers} color={teal[900]} />
    </Box>
  </Grid>
  <Grid item xs={12} sm="auto">
    <Box sx={{ width: 300 }}>
      <StatCard label="Male Users" value={maleCount} color={indigo[600]} />
    </Box>
  </Grid>
  <Grid item xs={12} sm="auto">
    <Box sx={{ width: 300 }}>
      <StatCard label="Female Users" value={femaleCount} color={deepPurple[500]} />
    </Box>
  </Grid>
</Grid>


        <Grid container spacing={3}>

  {/* Users by City */}
  <Grid item xs={12} md={4}>
    <ChartBox title="Users by City">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={groupData(users, 'city')}>
          <XAxis dataKey="name" tick={{ fill: theme.palette.text.secondary }} />
          <YAxis allowDecimals={false} tick={{ fill: theme.palette.text.secondary }} />
          <Tooltip contentStyle={{
            borderRadius: 8,
            boxShadow: theme.shadows[3],
            backgroundColor: theme.palette.background.paper
          }} />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {users.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartBox>
  </Grid>

  {/* Area of Interest – wider (400px) */}
  <Grid item xs={12} md={4}>
    <ChartBox title="Area of Interest">
      <Box sx={{ width: 400, mx: 'auto' }}>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={interestData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={90}
              innerRadius={50}
              paddingAngle={4}
              label={({ name }) => name}
              labelLine={false}
            >
              {interestData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{
              borderRadius: 8,
              boxShadow: theme.shadows[3],
              backgroundColor: theme.palette.background.paper
            }} />
          </PieChart>
        </ResponsiveContainer>
      </Box>
    </ChartBox>
  </Grid>

  {/* Monthly Signups – slightly narrower */}
  <Grid item xs={12} md={4}>
    <ChartBox title="Monthly User Signups">
      <Box sx={{ width: '90%', mx: 'auto' }}>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyData}>
            <XAxis dataKey="month" tick={{ fill: theme.palette.text.secondary }} />
            <YAxis allowDecimals={false} tick={{ fill: theme.palette.text.secondary }} />
            <Tooltip contentStyle={{
              borderRadius: 8,
              boxShadow: theme.shadows[3],
              backgroundColor: theme.palette.background.paper
            }} />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {monthlyData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </ChartBox>
  </Grid>

</Grid>

         
      </Box>
    </Box>
  );
};

export default AdminDashboard;
