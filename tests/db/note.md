# DB test principles
To ensure potential parallel execution of test cases,
- each test case must be isolated with own transactional session;
- each test case must rollback transaction when it finishes and no any data should be committed.
