export interface IAdminState {
  applicationList: any[],
  pages: any[],
  applicationStats: {[x: string]: any},
  selectedForm: {
    id: string,
    name: string
  }
}