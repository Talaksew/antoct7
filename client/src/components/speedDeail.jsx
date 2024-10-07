import React, { useState } from 'react';
import { SpeedDial } from '@mui/material';
import FeedbackIcon from '@mui/icons-material/Feedback';
//import EditIcon from '@mui/icons-material/Edit';
import FeedbackForm from './feedback'; // Import the FeedbackForm component
import { styled } from '@mui/material/styles';

const StyledSpeedDial = styled(SpeedDial)(({ theme }) => ({
    '& .MuiFab-primary': {
      width: 48, // Adjust the width
      height: 48, // Adjust the height
      '& .MuiSpeedDialIcon-root': {
        fontSize: 24, // Adjust the icon size
     lineHeight: 0, },
    },
  }));
  
function FeedbackSpeedDial() {
    const [openFeedback, setOpenFeedback] = useState(false);

    const handleOpenFeedback = () => setOpenFeedback(true);
    const handleCloseFeedback = () => setOpenFeedback(false);

    return (
        <>
            <StyledSpeedDial
                ariaLabel="Feedback speed dial"
                sx={{ 
                    position: 'fixed',
                    bottom: 12,
                    right: 12,
                    bgcolor: 'primary.non', // Background color
                    '& .MuiFab-primary': {
                        bgcolor: '#609dc1', // Button background color
                        color: 'white', // Icon color
                        '&:hover': {
                            bgcolor: '#609dc1', // Hover background color
                        }
                    }
                }} 
                icon={<FeedbackIcon openIcon={<FeedbackIcon />} />}
                onClick={handleOpenFeedback} // Open the feedback form on click
            >
                {/* No other actions needed */}
            </StyledSpeedDial>

            {/* Render the FeedbackForm and control its open state */}
            <FeedbackForm open={openFeedback} handleClose={handleCloseFeedback} />
        </>
    );
}

export default FeedbackSpeedDial;


// import React, { useState } from 'react';
// import { SpeedDial, SpeedDialAction, SpeedDialIcon } from '@mui/material';
// import FeedbackIcon from '@mui/icons-material/Feedback';
// import CopyIcon from '@mui/icons-material/FileCopyOutlined';
// import PrintIcon from '@mui/icons-material/Print';
// import ShareIcon from '@mui/icons-material/Share';
// import EditIcon from '@mui/icons-material/Edit';
// import FeedbackForm from './feedback'; // Import the FeedbackForm component

// function SpeedDialComponent() {
//     const [openFeedback, setOpenFeedback] = useState(false);

//     const handleOpenFeedback = () => setOpenFeedback(true);
//     const handleCloseFeedback = () => setOpenFeedback(false);

//     return (
//         <>
//             <SpeedDial
//                 ariaLabel="Navigation speed dial"
//                 sx={{ position: 'fixed', bottom: 16, right: 16 }}
//                 icon={<SpeedDialIcon openIcon={<EditIcon />} />}
//             >
//                 <SpeedDialAction 
//                     icon={<FeedbackIcon />} 
//                     tooltipTitle="Give Feedback" 
//                     onClick={handleOpenFeedback} 
//                 />
//                 <SpeedDialAction icon={<CopyIcon />} tooltipTitle="Copy" />
//                 <SpeedDialAction icon={<PrintIcon />} tooltipTitle="Print" />
//                 <SpeedDialAction icon={<ShareIcon />} tooltipTitle="Share" />
//             </SpeedDial>

//             {/* Render the FeedbackForm and control its open state */}
//             <FeedbackForm open={openFeedback} handleClose={handleCloseFeedback} />
//         </>
//     );
// }

// export default SpeedDialComponent;
