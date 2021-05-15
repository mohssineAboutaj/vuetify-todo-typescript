export interface Task {
  id?: string
  done?: boolean
  text?: string
}

export interface Info {
  label: string
  value: number
}

export interface DialogActions {
  label?: string
  color?: string
  cb?: Function
  disabled?: boolean
}
