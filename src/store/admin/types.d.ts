export interface IAdminState {
  applicationList: any[],
  exportedApplications: any[],
  applicationEmails: string[],
  pages: any[],
  applicationStats: {[x: string]: any},
  selectedForm: {
    id: string,
    name: string
  },
  bulkChange: {
    status: string,
    ids: string
  },
  bulkCreate: {
    group: string,
    emails: string
  }
}