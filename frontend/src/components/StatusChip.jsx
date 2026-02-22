import { Chip, useTheme, alpha } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import ErrorIcon from '@mui/icons-material/Error';

export default function StatusChip({ status }) {
  const theme = useTheme();
  
  let color, icon, label;
  
  switch(status.toLowerCase()) {
    case 'completed':
      color = theme.palette.success.main;
      icon = <CheckCircleIcon fontSize="small" />;
      label = 'Completed';
      break;
    case 'in progress':
      color = theme.palette.info.main;
      icon = <PendingIcon fontSize="small" />;
      label = 'In Progress';
      break;
    case 'pending':
      color = theme.palette.warning.main;
      icon = <PendingIcon fontSize="small" />;
      label = 'Pending';
      break;
    case 'cancelled':
      color = theme.palette.error.main;
      icon = <ErrorIcon fontSize="small" />;
      label = 'Cancelled';
      break;
    default:
      color = theme.palette.grey[500];
      icon = <PendingIcon fontSize="small" />;
      label = status;
  }
  
  return (
    <Chip 
      icon={icon}
      label={label}
      size="small"
      sx={{ 
        bgcolor: alpha(color, 0.1),
        color: color,
        fontWeight: 500,
        fontSize: '0.75rem',
        '& .MuiChip-icon': {
          color: 'inherit'
        }
      }}
    />
  );
}