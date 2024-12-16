import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  CircularProgress,
  Box
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

const MasterGamesDialog = ({ open, onClose, games, loading, onGameSelect }) => {
  const hasGames = games?.topGames && games.topGames.length > 0;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Master Games with This Position</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        {loading ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        ) : !hasGames ? (
          <Typography align="center" py={2}>
            No master games found with this position
          </Typography>
        ) : (
          <List>
            {games.topGames.map((game, index) => (
              <ListItem 
                key={index} 
                divider 
                button
                onClick={() => onGameSelect(game.id)}
              >
                <ListItemText
                  primary={`${game.white.name} (${game.white.rating}) vs ${game.black.name} (${game.black.rating})`}
                  secondary={
                    <>
                      <Typography component="span" variant="body2">
                        {game.year} {game.month} • 
                        {game.winner ? 
                          ` ${game.winner === 'white' ? '1-0' : '0-1'}` : 
                          ' ½-½'}
                      </Typography>
                      <br />
                      <Typography component="span" variant="body2" color="textSecondary">
                        Move: {game.uci}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MasterGamesDialog; 