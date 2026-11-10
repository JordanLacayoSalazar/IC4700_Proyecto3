import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'

function ModalBase({
  abierto,
  titulo,
  textoBotonAfirmativo,
  aceptarDeshabilitado = false,
  onCancelar,
  onAceptar,
  children,
}) {
  return (
    <Dialog
      open={abierto}
      onClose={onCancelar}
      fullWidth
      maxWidth={false}
      sx={{
        '& .MuiDialog-paper': {
          width: 'min(420px, calc((100vh - 48px) * 0.7), calc(100vw - 32px))',
          height: 'min(620px, calc(100vh - 48px))',
          maxWidth: 'none',
          maxHeight: 'none',
          border: '1px solid #ffffff36',
          borderRadius: '8px',
          backgroundColor: '#11161d',
          color: '#f4f4f5',
          fontFamily: "'VCR OSD Mono', monospace",
        },
        '& .MuiTypography-root, & .MuiButton-root, & .MuiFormLabel-root, & .MuiAutocomplete-option':
          { fontFamily: "'VCR OSD Mono', monospace" },
        '& .MuiDialogContent-root': {
          display: 'grid',
          gap: '16px',
        },
        '& .MuiDialogActions-root': {
          justifyContent: 'center',
          gap: '12px',
          padding: '12px 24px 20px',
        },
        '& .MuiButton-root': {
          minWidth: 'auto',
          minHeight: '32px',
          padding: '4px 14px',
          border: '2px solid #ffffff70',
          borderRadius: '6px',
          backgroundColor: '#30343b',
          color: '#f4f4f5',
          fontSize: '14px',
        },
        '& .MuiButton-root:hover': {
          backgroundColor: '#424751',
        },
        '& .MuiButton-contained': {
          backgroundColor: '#20394c',
        },
        '& .MuiButton-contained:hover': {
          backgroundColor: '#2d506b',
        },
        '& .MuiInputBase-input': {
          fontFamily: "'Barlow', sans-serif",
          color: '#f4f4f5',
          WebkitTextFillColor: '#f4f4f5',
        },
        '& .MuiInputLabel-root': {
          color: '#c4c7cc',
          fontFamily: "'VCR OSD Mono', monospace",
        },
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: '#ffffff70',
        },
        '& .MuiAutocomplete-popper, & .MuiAutocomplete-paper': {
          backgroundColor: '#11161d',
          color: '#f4f4f5',
          fontFamily: "'VCR OSD Mono', monospace",
        },
        '& .MuiAutocomplete-option[aria-selected="true"], & .MuiAutocomplete-option.Mui-focused':
          {
            backgroundColor: '#30343b',
        },
      }}
    >
      <DialogTitle>{titulo}</DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        <Button onClick={onCancelar}>Cancelar</Button>
        <Button onClick={onAceptar} variant="contained" disabled={aceptarDeshabilitado}>
          {textoBotonAfirmativo}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ModalBase
