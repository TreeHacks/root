# 1.0.6 (11/7/18)
- Fix scrolling of leaderboard in review page
- Add Dominican University of California

# 1.0.5 (11/4/18)
- Show error if no race selected
- Allow file uploads to work with S3.
- Show file preview after uploading the resume.

# 1.0.4 (11/3/18)
- Fix scrolling on review leaderboard
- Fix bug -- allow logging in with uppercase characters in email
- Fix bug -- allow signing up with uppercase characters in email (converted to lowercase email upon signup)
- Add Minerva schools to university dropdown

# 1.0.3 (11/1/18)
- Fix bug for email verification - doesn't work if you go to the site with a query string in the link.

# 1.0.2 (11/1/18)
- Fix Google analytics bug

# 1.0.1 (11/1/18)
- Add Google analytics
- Webpack production build

# 1.0.0 (11/1/18)
Version 1.0.0



Application.collection.insertMany(Array.apply(null, {length: 50}).map(e => (
    {"forms":{"application_info":{"first_name":Math.random() + "","last_name":Math.random() + "","phone":"1231232133","dob":"1900-01-01","gender":"M","race":["American Indian / Alaska Native"],"university":"Stanford University","graduation_year":"2018","level_of_study":"Undergraduate","major":"CS","accept_terms":true,"accept_share":true,"q1_goodfit":"asd","q2_experience":"sad","q3":"asdf","q4":"asdf"},"transportation":{}},"user":{"email":"aramaswamis@gmail.com"},"status":"submitted","_id": Math.random() + "abc", "admin_info":{"reimbursement_amount":null},"reviews":[],"type":"oos"}
)));
