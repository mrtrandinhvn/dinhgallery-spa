import { useState, useCallback, useEffect, type KeyboardEvent } from 'react';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';

interface RenameFolderDialogProps {
    open: boolean;
    title: string;
    message?: string;
    label: string;
    initialValue: string;
    placeholder?: string;
    maxLength?: number;
    confirmText?: string;
    cancelText?: string;
    onConfirm: (value: string) => void | Promise<void>;
    onCancel: () => void;
    confirmColor?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
    validateInput?: (value: string) => string | null;
}

const RenameFolderDialog = ({
    open,
    title,
    message,
    label,
    initialValue,
    placeholder,
    maxLength,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm,
    onCancel,
    confirmColor = 'primary',
    validateInput,
}: RenameFolderDialogProps) => {
    const [value, setValue] = useState(initialValue);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Reset state when dialog opens
    useEffect(() => {
        if (open) {
            setValue(initialValue);
            setError(null);
            setIsSubmitting(false);
        }
    }, [open, initialValue]);

    const handleValueChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        setValue(newValue);

        // Validate on change
        if (validateInput) {
            const validationError = validateInput(newValue);
            setError(validationError);
        }
    }, [validateInput]);

    const handleConfirm = useCallback(async () => {
        // Final validation before submit
        const trimmedValue = value.trim();

        if (validateInput) {
            const validationError = validateInput(value);
            if (validationError) {
                setError(validationError);
                return;
            }
        }

        setIsSubmitting(true);
        try {
            await onConfirm(trimmedValue);
        } finally {
            setIsSubmitting(false);
        }
    }, [value, validateInput, onConfirm]);

    const handleKeyDown = useCallback((event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && !error && !isSubmitting) {
            event.preventDefault();
            handleConfirm();
        } else if (event.key === 'Escape' && !isSubmitting) {
            event.preventDefault();
            onCancel();
        }
    }, [error, isSubmitting, handleConfirm, onCancel]);

    const handleCancel = useCallback(() => {
        if (!isSubmitting) {
            onCancel();
        }
    }, [isSubmitting, onCancel]);

    return (
        <Dialog
            open={open}
            onClose={handleCancel}
            aria-labelledby="input-dialog-title"
            aria-describedby="input-dialog-description"
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle id="input-dialog-title">{title}</DialogTitle>
            <DialogContent>
                {message && (
                    <DialogContentText id="input-dialog-description" sx={{ mb: 2 }}>
                        {message}
                    </DialogContentText>
                )}
                <TextField
                    autoFocus
                    label={label}
                    placeholder={placeholder}
                    value={value}
                    onChange={handleValueChange}
                    onKeyDown={handleKeyDown}
                    fullWidth
                    disabled={isSubmitting}
                    error={!!error}
                    helperText={error}
                    inputProps={{
                        maxLength: maxLength,
                    }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCancel} color="inherit" disabled={isSubmitting}>
                    {cancelText}
                </Button>
                <Button
                    onClick={handleConfirm}
                    color={confirmColor}
                    variant="contained"
                    disabled={!!error || isSubmitting}
                    startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
                >
                    {confirmText}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default RenameFolderDialog;
