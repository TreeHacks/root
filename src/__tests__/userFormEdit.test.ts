import { createRandomApplication, post_expect_json, get_expect_json } from "../testUtils";

describe('test', () => {
  
    test('test', () => {
    });
});

// describe('user form update', () => {
//   let userId: string;
//   beforeAll(() => {
//     userId = createRandomApplication();
//   })
//   test('set user application_info', () => {
//     return post_expect_json(`/users/${userId}/forms/application_info`, { "university": "berkeley" }, { "university": "berkeley" });
//   });
//   test('set user additional_info', () => {
//     return post_expect_json(`/users/${userId}/forms/additional_info`, { "bus_confirmed_spot": false }, { "bus_confirmed_spot": false })
//   });

//   test('set user status', () => {
//     return post_expect_json(`/users/${userId}/status`, { "status": "admitted" }, { "status": "admitted" })
//   });
// });

// describe('admin user edit', () => {
//   let userId: string;
//   beforeAll(() => {
//     userId = createRandomApplication();
//   })
//   test('set user admin_info', () => {
//     return post_expect_json(`/users/${userId}/admin_info`, { "reimbursement_amount": 500 }, { "reimbursement_amount": 500 });
//   });
// });

// describe('user review', () => {
//   let userId: string;
//   beforeAll(() => {
//     userId = createRandomApplication();
//   })
//   test('set user review_info item', () => {
//     // return post_expect_json(`/users/${userId}/review`, { "is_beginner": false }, { "is_beginner": false });
//   });
// });