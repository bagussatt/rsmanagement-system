import Swal from 'sweetalert2'

export const showSuccessAlert = (title: string, text?: string) => {
  return Swal.fire({
    title,
    text,
    icon: 'success',
    confirmButtonColor: '#10b981',
    confirmButtonText: 'OK',
    timer: 2000,
    timerProgressBar: true,
  })
}

export const showErrorAlert = (title: string, text?: string) => {
  return Swal.fire({
    title,
    text,
    icon: 'error',
    confirmButtonColor: '#ef4444',
    confirmButtonText: 'OK',
  })
}

export const showWarningAlert = (title: string, text?: string) => {
  return Swal.fire({
    title,
    text,
    icon: 'warning',
    confirmButtonColor: '#f59e0b',
    confirmButtonText: 'OK',
  })
}

export const showConfirmAlert = async (title: string, text?: string, confirmButtonText: string = 'Ya', cancelButtonText: string = 'Batal') => {
  return Swal.fire({
    title,
    text,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#10b981',
    cancelButtonColor: '#ef4444',
    confirmButtonText,
    cancelButtonText,
    reverseButtons: true,
  })
}

export const showLoadingAlert = (title: string = 'Memuat...') => {
  Swal.fire({
    title,
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading()
    }
  })
}

export const closeAlert = () => {
  Swal.close()
}
