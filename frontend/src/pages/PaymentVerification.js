import { useState, useEffect } from 'react';
import { 
  Button, Card, Chip, Container, 
  Paper, Stack, Typography, CircularProgress,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField
} from '@mui/material';
import { Refresh, Search, Check, Close } from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';

const PaymentVerification = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [verifyDialogOpen, setVerifyDialogOpen] = useState(false);
  const [currentPayment, setCurrentPayment] = useState(null);
  const [verificationNotes, setVerificationNotes] = useState('');
  const [verificationAction, setVerificationAction] = useState('');

  const backendUrl = 'http://localhost:5000/api';

  const fetchPayments = async () => {
    try {
      setLoading(true);
      console.log('Fetching payments from:', `${backendUrl}/payments/getPayments`);
      
      const response = await axios.get(`${backendUrl}/payments/getPayments`);
      console.log('API Response:', response);
      
      // Check if response.data exists and has payments array
      const paymentsData = response.data?.payments || response.data || [];
      console.log('Parsed payments data:', paymentsData);
      
      setPayments(paymentsData);
    } catch (error) {
      console.error('Full error:', error);
      console.error('Error response:', error.response);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const filteredPayments = payments.filter(payment => {
    const search = searchTerm.toLowerCase();
    return (
      (payment.User_Name?.toLowerCase() || '').includes(search) ||
      (payment.Event_Name?.toLowerCase() || '').includes(search) ||
      (payment.Payment_Method?.toLowerCase() || '').includes(search) ||
      (payment.Payment_ID?.toString() || '').includes(search)
    );
  });

  const handleRefund = async (paymentId) => {
    try {
      setLoading(true);
      await axios.post(`${backendUrl}/payments/refundPayment/${paymentId}`);
      await fetchPayments();
    } catch (error) {
      console.error('Error refunding payment:', error);
    } finally {
      setLoading(false);
    }
  };

  const openVerifyDialog = (payment, action) => {
    setCurrentPayment(payment);
    setVerificationAction(action);
    setVerifyDialogOpen(true);
  };

  // Frontend API call example
  const handleVerify = async () => {
    try {
      setLoading(true);
      if (!currentPayment) return;

      const response = await axios.put(
        `${backendUrl}/payments/verifyPayment/${currentPayment.Payment_ID}`, 
        {
          status: verificationAction,
          adminId: 1, // Hardcoded for now - replace with actual admin ID
          notes: verificationNotes
        }
      );
      
      console.log(response.data);
      await fetchPayments(); // Refresh the payments list
      setVerifyDialogOpen(false); // Close the dialog
    } catch (error) {
      console.error('Verification error:', {
        message: error.message,
        response: error.response?.data
      });
    } finally {
      setLoading(false);
    }
  };
  
  const columns = [
    { field: 'Payment_ID', headerName: 'ID', width: 70 },
    { field: 'User_Name', headerName: 'User', width: 150 },
    { field: 'Event_Name', headerName: 'Event', width: 200 },
    { field: 'Payment_Method', headerName: 'Method', width: 120 },
    {
      field: 'Amount',
      headerName: 'Amount',
      width: 120,
      valueFormatter: (value) => {
        const amount = value || 0;
        return `Ksh ${Number(amount).toFixed(2)}`;
      }
    },
    { 
      field: 'Payment_Date', 
      headerName: 'Date', 
      width: 120,
      valueFormatter: (value, row, column, apiRef) => {
        if (!value) return 'N/A';
        try {
          const date = new Date(value);
          if (isNaN(date.getTime())) return 'Invalid date';
          return date.toLocaleDateString();
        } catch {
          return 'Invalid date';
        }
      }
    },
    {
      field: 'Payment_Status',
      headerName: 'Payment Status',
      width: 150,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value === 'Success' ? 'success' : 'error'}
        />
      )
    },
    {
      field: 'Verification_Status',
      headerName: 'Verification',
      width: 150,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value === 'Verified' ? 'success' : 
                params.value === 'Rejected' ? 'error' : 'warning'}
        />
      )
    },
    {
      field: 'verifyActions',
      headerName: 'Verify',
      width: 200,
      renderCell: (params) => (
        params.row.Verification_Status === 'Pending' ? (
          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              color="success"
              size="small"
              startIcon={<Check />}
              onClick={() => openVerifyDialog(params.row, 'Verified')}
            >
              Approve
            </Button>
            <Button
              variant="outlined"
              color="error"
              size="small"
              startIcon={<Close />}
              onClick={() => openVerifyDialog(params.row, 'Rejected')}
            >
              Reject
            </Button>
          </Stack>
        ) : (
          <Typography variant="body2" color="textSecondary">
            {params.row.Name || 'System'}
          </Typography>
        )
      )
    },
    {
      field: 'refundActions',
      headerName: 'Refund',
      width: 150,
      renderCell: (params) => (
        params.row.Payment_Status !== 'Refunded' && (
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={() => handleRefund(params.row.Payment_ID)}
            disabled={params.row.Verification_Status !== 'Verified'}
          >
            Refund
          </Button>
        )
      )
    }
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Card elevation={3} sx={{ p: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6" component="h2">
            Payment Verification
          </Typography>
          <Stack direction="row" spacing={2}>
            <Paper
              component="form"
              sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 300 }}
              elevation={1}
            >
              <Search sx={{ color: 'action.active', mr: 1 }} />
              <input
                placeholder="Search payments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  border: 'none',
                  outline: 'none',
                  flex: 1,
                  padding: '8px 0',
                }}
              />
            </Paper>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={fetchPayments}
              disabled={loading}
            >
              {loading ? <CircularProgress size={20} /> : 'Refresh'}
            </Button>
          </Stack>
        </Stack>

        <div style={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={filteredPayments}
            columns={columns}
            loading={loading}
            pageSize={10}
            rowsPerPageOptions={[10, 25, 50]}
            getRowId={(row) => row.Payment_ID}
            disableSelectionOnClick
          />
        </div>
      </Card>

      {/* Verification Dialog */}
      <Dialog open={verifyDialogOpen} onClose={() => setVerifyDialogOpen(false)}>
        <DialogTitle>
          {verificationAction === 'Verified' ? 'Approve' : 'Reject'} Payment #{currentPayment?.Payment_ID}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Verification Notes"
            fullWidth
            variant="outlined"
            multiline
            rows={4}
            value={verificationNotes}
            onChange={(e) => setVerificationNotes(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setVerifyDialogOpen(false)}>Cancel</Button>
        <Button 
          onClick={handleVerify} // Use the fixed handler
          color={verificationAction === 'Verified' ? 'success' : 'error'}
          variant="contained"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : verificationAction === 'Verified' ? 'Approve' : 'Reject'}
        </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PaymentVerification;