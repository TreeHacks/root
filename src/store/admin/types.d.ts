export interface IAdminState {
  applicationList: any[],
  applicationStats: {[x: string]: any},
  selectedForm: {
    id: string,
    name: string
  }
}