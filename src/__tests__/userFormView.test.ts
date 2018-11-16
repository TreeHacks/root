import { createRandomApplication, post_expect_json, get_expect_json } from "../testUtils";

// describe('user form view', () => {
//   let userId: string;
//   beforeAll(() => {
//     userId = createRandomApplication("a@b.com");
//   })
//   test('get user application_info', () => {
//     return get_expect_json(`/users/${userId}/forms/application_info`, { });
//   });
//   test('get user additional_info', () => {
//     return get_expect_json(`/users/${userId}/forms/additional_info`, { })
//   });
//   test('get user status', () => {
//     return get_expect_json(`/users/${userId}/status`, { "status": "incomplete" })
//   });
//   // todo add authentication here:
//   test('get user full details', () => {
//     return get_expect_json(`/users/${userId}`, {
//       "_id": userId,
//       "forms": {
//         "application_info": { },
//         "additional_info": {}
//       },
//       "admin_info": {"reimbursement_amount": null},
//       "reviews": [],
//       "user": { "email": "a@b.com" },
//       "type": "oos",
//       "status": "incomplete"
//     });
//   });
// });
